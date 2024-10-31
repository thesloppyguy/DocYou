import base64
import logging
import secrets
import uuid
import traceback
from django.db.models import Prefetch
from django.core.paginator import Paginator
from datetime import datetime, timedelta, timezone
from hashlib import sha256
from typing import Any, Optional
from django.core.cache import cache
from docyou.events.tenant_event import tenant_was_created
import os
from django.db.models import F, Count
from docyou.libs.passport import PassportService
from docyou.libs.password import compare_password, hash_password, valid_password
from docyou.libs.rsa import generate_key_pair
from docyou.model.accounts import Account, Organization, Project, OrganizationAccountProjectJoin, OrganizationAccountJoin
from docyou.model.utils import Setup
from docyou.services.errors.account import (
    AccountAlreadyInTenantError,
    AccountLoginError,
    AccountNotLinkTenantError,
    AccountRegisterError,
    CannotOperateSelfError,
    CurrentPasswordIncorrectError,
    InvalidActionError,
    MemberNotInTenantError,
    NoPermissionError,
    RoleAlreadyAssignedError,
    TenantNotFound,
)
from docyou.tasks.mail_invite_member_task import send_invite_member_mail_task
from docyou.model.defaults import AccountStatus, TenantAccountJoinRole, TenantStatus, AccountRole
from django.db import transaction
from django.db.models import Q
import json


class AccountService:

    @staticmethod
    def get_account_jwt_token(account, *, exp: timedelta = timedelta(days=30)):
        payload = {
            "user_id": str(account.id),
            "exp": datetime.now(timezone.utc).replace(tzinfo=None) + exp,
        }

        token = PassportService().issue(payload)
        return token

    @staticmethod
    def authenticate(email: str, password: str) -> Account:
        """authenticate account with email and password"""

        account = Account.objects.filter(email=email).first()
        if not account:
            raise AccountLoginError('Invalid email or password.')

        if account.status == AccountStatus.BANNED.value or account.status == AccountStatus.CLOSED.value:
            raise AccountLoginError('Account is banned or closed.')

        if account.status == AccountStatus.PENDING.value:
            account.status = AccountStatus.ACTIVE.value
            account.initialized_at = datetime.now(
                timezone.utc).replace(tzinfo=None)
            account.save()

        if account.password is None or not compare_password(password, account.password, account.password_salt):
            raise AccountLoginError('Invalid email or password.')
        return account

    @staticmethod
    def update_account_password(account, password, new_password):
        """update account password"""
        if account.password and not compare_password(password, account.password, account.password_salt):
            raise CurrentPasswordIncorrectError(
                "Current password is incorrect.")

        # may be raised
        valid_password(new_password)

        # generate password salt
        salt = secrets.token_bytes(16)
        base64_salt = base64.b64encode(salt).decode()

        # encrypt password with salt
        password_hashed = hash_password(new_password, salt)
        base64_password_hashed = base64.b64encode(password_hashed).decode()
        account.password = base64_password_hashed
        account.password_salt = base64_salt
        account.save()
        return account

    @staticmethod
    def create_account(email: str,
                       name: str,
                       interface_language: str,
                       password: Optional[str] = None,
                       role: str = 'admin',
                       interface_theme: str = 'light') -> Account:
        """create account"""
        account = Account()
        account.email = email
        account.name = name
        account.role = role
        if password:
            # generate password salt
            salt = secrets.token_bytes(16)
            base64_salt = base64.b64encode(salt).decode()

            # encrypt password with salt
            password_hashed = hash_password(password, salt)
            base64_password_hashed = base64.b64encode(password_hashed).decode()

            account.password = base64_password_hashed
            account.password_salt = base64_salt

        account.interface_language = interface_language
        account.interface_theme = interface_theme

        # Set timezone based on language
        account.timezone = language_timezone_mapping.get(
            interface_language, 'UTC')

        account.save()
        return account

    @staticmethod
    def close_account(account: Account) -> None:
        """Close account"""
        account.status = AccountStatus.CLOSED.value
        account.save()

    @staticmethod
    def update_account(account: Account, **kwargs):
        """Update account fields"""
        for field, value in kwargs.items():
            if hasattr(account, field):
                setattr(account, field, value)
            else:
                raise AttributeError(f"Invalid field: {field}")

        account.save()
        return account

    @staticmethod
    def update_last_login(account: Account, *, ip_address: str) -> None:
        """Update last login time and ip"""
        account.last_login_at = datetime.now()
        account.last_login_ip = ip_address
        account.save()

    @staticmethod
    def login(account: Account, *, ip_address: Optional[str] = None):
        if ip_address:
            AccountService.update_last_login(account, ip_address=ip_address)
        exp = timedelta(days=30)
        token = AccountService.get_account_jwt_token(account, exp=exp)
        cache.set(_get_login_cache_key(account_id=account.id,
                  token=token), '1', int(exp.total_seconds()))
        return token

    @staticmethod
    def logout(*, account: Account, token: str):
        cache.delete(_get_login_cache_key(
            account_id=account.id, token=token))


def _get_login_cache_key(*, account_id: str, token: str):
    return f"account_login:{account_id}:{token}"


class TenantService:

    @staticmethod
    def create_tenant(name: str, plan='BRONZE', creator: str | None = None) -> Organization:
        """Create tenant"""

        if creator == None:
            tenant = Organization(name=name, plan=plan)
        else:
            tenant = Organization(name=name, plan=plan, created_by=creator)
        tenant.encrypt_public_key = generate_key_pair(tenant.id)
        tenant.save()
        return tenant

    @staticmethod
    def create_owner_tenant_if_not_exist(account: Account):
        """Create owner tenant if not exist"""
        available_ta = OrganizationAccountJoin.objects.filter(
            account=account
        ).first()

        if available_ta:
            return

        tenant = TenantService.create_tenant(f"{account.name} Workspace")
        TenantService.create_tenant_member(tenant, account)
        account.save()
        tenant_was_created.send(tenant)

    @staticmethod
    def create_super_owner_tenant(account: Account):
        available_ta = OrganizationAccountJoin.objects.filter(
            account=account).first()

        if available_ta:
            return
        if account.role != 'ROOT':
            return

        tenant = TenantService.create_tenant(f"Master Workspace", 'UNLIMITED')
        TenantService.create_tenant_member(tenant, account)
        TenantService.switch_tenant(account, str(tenant.id))
        tenant_was_created.send(tenant)

    @staticmethod
    def create_tenant_member(tenant: Organization, account: Account) -> OrganizationAccountJoin:
        """Create tenant member"""
        # if account.role == AccountRole.ROOT:
        #     raise ValueError("Root can only have one organiation.")
        ta = OrganizationAccountJoin(
            tenant=tenant,
            account=account,
        )
        ta.save()
        return ta

    @staticmethod
    def get_join_tenants(account: Account, page: int, limit: int, search) -> list[Organization]:
        """Get account join tenants"""
        if account.role == 'ROOT' or account.role == 'SUPERADMIN':
            if search:
                orgs = Organization.objects.filter(
                    name__icontains=search).order_by('-created_at')
                paginator = Paginator(orgs, per_page=limit)
                return paginator.page(page).object_list, orgs.count()
            else:
                orgs = Organization.objects.all().order_by('-created_at')
                paginator = Paginator(orgs, per_page=limit)
                return paginator.page(page).object_list, orgs.count()
        if search:
            tenantaccountjoin = OrganizationAccountJoin.objects.filter(
                account=account, tenant_id__status=TenantStatus.NORMAL, tenant__name__icontains=search).order_by('-created_at')
        else:
            tenantaccountjoin = OrganizationAccountJoin.objects.filter(
                account=account, tenant_id__status=TenantStatus.NORMAL).order_by('-created_at')

        orgs = [ten.tenant for ten in tenantaccountjoin]
        paginator = Paginator(orgs, per_page=limit)
        return paginator.page(page).object_list, len(orgs)

    @ staticmethod
    def switch_tenant(account: Account, tenant_id: str | None = None) -> None:
        """Switch the current workspace for the account"""
        # Ensure tenant_id is provided
        if tenant_id is None:
            raise ValueError("Organization ID must be provided.")

        tenant = Organization.objects.get(id=tenant_id)
        tenant_account_join = OrganizationAccountJoin.objects.filter(
            account=account,
            tenant=tenant,
            tenant__status='normal'
        ).first()
        if (account.role in ['ROOT', 'SUPERADMIN']) and not tenant_account_join:
            tenant_account_join = OrganizationAccountJoin(
                account=account,
                tenant=tenant,
                current=True
            )
            tenant_account_join.save()
        if not tenant_account_join:
            raise AccountNotLinkTenantError(
                "Organization not found or account is not a member of the tenant.")
        else:
            OrganizationAccountJoin.objects.filter(account=account).exclude(
                tenant=tenant).update(**{'current': False})
            tenant_account_join.current = True
            tenant_account_join.save()
            account.current_tenant_id = tenant_account_join.tenant.id
            account.save()

    @ staticmethod
    def get_tenant_members(tenant: Organization) -> list[Account]:
        """Get tenant members"""
        query = OrganizationAccountJoin.objects.filter(
            tenant=tenant
        ).all()

        # Fetch the accounts and roles
        accounts = [item.account for item in query]

        return accounts

    @staticmethod
    def get_tenant_count() -> int:
        """Get tenant count"""
        return Organization.objects.aggregate(organization_count=Count('id'))['organization_count']

    @staticmethod
    def check_member_permission(operator: Account, member: Account, action: str) -> None:
        """Check member permission"""
        if action not in ['add', 'remove', 'update']:
            raise InvalidActionError("Invalid action.")

        if member:
            if operator.id == member.id:
                raise CannotOperateSelfError("Cannot operate self.")

    @staticmethod
    def remove_member_from_tenant(tenant: Organization, account: Account, operator: Account) -> None:
        """Remove member from tenant"""
        if operator.id == account.id and TenantService.check_member_permission(operator, account, 'remove'):
            raise CannotOperateSelfError("Cannot operate self.")

        ta = OrganizationAccountJoin.objects.filter(
            tenant=tenant, account=account).first()
        if not ta:
            raise MemberNotInTenantError("Member not in tenant.")

        ta.delete()

    @staticmethod
    def update_member_role(tenant: Organization, member: Account, new_role: str, operator: Account) -> None:
        """Update member role"""
        TenantService.check_member_permission(
            operator, member, 'update')

        target_member_join = OrganizationAccountJoin.objects.filter(
            tenant=tenant,
            account=member
        ).first()

        if target_member_join and member.role == new_role:
            raise RoleAlreadyAssignedError(
                "The provided role is already assigned to the member.")

        # Update the role of the target member
        member.role = new_role
        member.save()

    @staticmethod
    def dissolve_tenant(tenant: Organization, operator: Account) -> None:
        """Dissolve tenant"""
        if not TenantService.check_member_permission(operator, operator, 'remove'):
            raise NoPermissionError('No permission to dissolve tenant.')
        OrganizationAccountJoin.objects.filter(
            tenant=tenant).delete()
        tenant.delete()

    @staticmethod
    def get_custom_config(tenant_id: str) -> None:
        tenant = Organization.objects.filter(
            id=tenant_id).first()
        if tenant:
            return tenant.custom_config_dict
        return None

    @staticmethod
    def update_status(tenant_id: str) -> Organization:
        tenant = Organization.objects.filter(id=tenant_id).first()
        tenant.status = 'archive'
        tenant.save()
        return tenant

    @staticmethod
    def update_plan(tenant_id: str, plan: str) -> Organization:
        tenant = Organization.objects.filter(id=tenant_id).first()
        tenant.plan = plan
        tenant.save()
        return tenant

    @staticmethod
    def update_billing(tenant_id: str, billing: bool) -> Organization:
        tenant = Organization.objects.filter(id=tenant_id).first()
        tenant.billing = billing
        tenant.save()
        return tenant


class RegisterService:
