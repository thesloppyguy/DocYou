import base64
from hashlib import sha256
import json
import logging
import secrets
import traceback
import uuid
from django.db.models import Prefetch
from django.db import transaction
from django.core.paginator import Paginator
from datetime import datetime, timedelta, timezone
from typing import List, Optional, Any
from django.core.cache import cache
from docyou.utils.init import get_login_cache_key
from docyou.libs.passport import PassportService
from docyou.libs.password import compare_password, hash_password, valid_password
from docyou.model.accounts import Account, Organization, Project, OrganizationAccountProjectJoin, OrganizationAccountJoin
from docyou.model.utils import Setup
from docyou.model.defaults import AccessLevel, AccountStatus, OragnizationAccountRole, ProjectStatus, SubsciptionPlans, OrganizationAccountProjectRole, OrganizationStatus
from docyou.services.errors.account import AccountLoginError, AccountRegisterError, CurrentPasswordIncorrectError, NoPermissionError, SetupFailedError
from docyou.tasks.mail_invite_member_task import send_invite_member_mail_task
from pydantic import BaseModel
from django.conf import settings


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str


REFRESH_TOKEN_PREFIX = "refresh_token:"
ACCOUNT_REFRESH_TOKEN_PREFIX = "account_refresh_token:"
REFRESH_TOKEN_EXPIRY = timedelta(days=30)


class AccountService:

    @staticmethod
    def get_accounts(id: str, page: int, search: str) -> List[Account] | Account:
        pass

    @staticmethod
    def create_account(email: str, name: Optional[str], password: Optional[str]) -> Account:
        account = Account()
        account.email = email
        if name:
            account.name = name
        if password:
            salt = secrets.token_bytes(16)
            base64_salt = base64.b64encode(salt).decode()

            password_hashed = hash_password(password, salt)
            base64_password_hashed = base64.b64encode(password_hashed).decode()

            account.password = base64_password_hashed
            account.password_salt = base64_salt

        account.save()
        return account

    @staticmethod
    def update_account_name(account: Account, name: str) -> Account:
        account.name = name
        account.updated_at = datetime.now()
        account.save()
        return account

    @staticmethod
    def update_password(account: Account, password: str, new_password: str) -> Account:
        if account.password and not compare_password(password, account.password, account.password_salt):
            raise CurrentPasswordIncorrectError(
                "Current password is incorrect.")
        valid_password(new_password)
        salt = secrets.token_bytes(16)
        base64_salt = base64.b64encode(salt).decode()
        password_hashed = hash_password(new_password, salt)
        base64_password_hashed = base64.b64encode(password_hashed).decode()
        account.password = base64_password_hashed
        account.password_salt = base64_salt
        account.updated_at = datetime.now()
        account.save()
        return account

    @staticmethod
    def update_last_login(account: Account) -> Account:
        account.last_active = datetime.now()
        account.save()
        return account

    @staticmethod
    def update_organization_role(account: Account, organization: Organization, role: str):
        oapj = OrganizationAccountProjectJoin.objects.filter(
            account=account, organization=organization).first()
        if oapj:
            oapj.organization_role = role
            oapj.save()
        return oapj

    @staticmethod
    def update_project_role(account: Account, project: Project, role: str):
        oapj = OrganizationAccountProjectJoin.objects.filter(
            account=account, project=project).first()
        if oapj:
            oapj.project_role = role
            oapj.save()
        return oapj

    @staticmethod
    def close_account(account: Account) -> Account:
        account.status = AccountStatus.CLOSED.value
        account.updated_at = datetime.now()
        account.save()
        return account

    @staticmethod
    def authenticate(email: str, password: str):
        account = Account.objects.filter(email=email).first()
        if not account:
            raise AccountLoginError('Invalid email or password.')

        if account.status == AccountStatus.CLOSED.value:
            raise AccountLoginError('Account is banned or closed.')

        if account.status == AccountStatus.INVITED.value:
            account.status = AccountStatus.ACTIVE.value
            account.initialized_at = datetime.now(
                timezone.utc).replace(tzinfo=None)
            account.save()

        if account.password is None or not compare_password(password, account.password, account.password_salt):
            raise AccountLoginError('Invalid email or password.')
        return account

    @staticmethod
    def login(account: Account):
        exp = timedelta(days=30)
        token = AccountService.get_account_jwt_token(account)
        cache.set(get_login_cache_key(account_id=account.id,
                  token=token), '1', int(exp.total_seconds()))
        return token

    @staticmethod
    def logout(*, account: Account, token: str):
        cache.delete(get_login_cache_key(
            account_id=account.id, token=token))

    @staticmethod
    def _delete_refresh_token(refresh_token: str, account_id: str) -> None:
        cache.delete(
            AccountService._get_refresh_token_key(refresh_token))
        cache.delete(
            AccountService._get_account_refresh_token_key(account_id))

    @staticmethod
    def _get_refresh_token_key(refresh_token: str) -> str:
        return f"{REFRESH_TOKEN_PREFIX}{refresh_token}"

    @staticmethod
    def _get_account_refresh_token_key(account_id: str) -> str:
        return f"{ACCOUNT_REFRESH_TOKEN_PREFIX}{account_id}"

    @staticmethod
    def _store_refresh_token(refresh_token: str, account_id: str) -> None:
        cache.set(AccountService._get_refresh_token_key(
            refresh_token), REFRESH_TOKEN_EXPIRY, account_id)
        cache.set(
            AccountService._get_account_refresh_token_key(
                account_id), REFRESH_TOKEN_EXPIRY, refresh_token
        )

    @staticmethod
    def get_account_jwt_token(account: Account):
        exp_dt = datetime.now(
            timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        exp = int(exp_dt.timestamp())
        payload = {
            "user_id": str(account.id),
            "exp": exp,
        }
        token = PassportService().issue(payload)
        return token

    @staticmethod
    def load_user(user_id: str) -> None | Account:
        account = Account.query.filter_by(id=user_id).first()
        if not account:
            return None

        if account.status == AccountStatus.CLOSED.value:
            raise NoPermissionError()

        current_organization = OrganizationAccountProjectJoin.query.filter_by(
            account_id=account.id, current=True).first()
        if current_organization:
            account.current_organization_id = current_organization.id
        else:
            available_ta = (
                OrganizationAccountProjectJoin.query.filter_by(
                    account_id=account.id).first()
            )
            if not available_ta:
                return None

            account.current_organization_id = available_ta.organization_id
            available_ta.current = True
            account.save()

        if datetime.now(timezone.utc).replace(tzinfo=None) - account.last_active > timedelta(minutes=10):
            account.last_active = datetime.now(
                timezone.utc).replace(tzinfo=None)
            account.save()

        return account

    @staticmethod
    def invite_user(email: str, organization: Organization, project: Project, project_role: str, organization_role: str):
        account = AccountService.create_account(email)
        oapj = OrganizationAccountProjectJoin()
        oapj.account = account
        oapj.organization = organization
        oapj.project = project
        oapj.organization_role = organization_role
        oapj.project_role = project_role
        oapj.save()
        return account

    @staticmethod
    def setup_workspace(email: str, name: str, password: str):
        try:
            with transaction.atomic():
                organization, project = OrganizationService.create_organization(
                    None, SubsciptionPlans.UNLIMITED.value)
                account = AccountService.create_account(
                    email=email, name=name, password=password)
                account.access_level = AccessLevel.REGULAR.value
                account.save()
                OrganizationService.add_account_to_organization(
                    organization, account, OragnizationAccountRole.ADMIN.value, project)
                ProjectService.add_account_to_project(
                    organization, account, project, project_role=OrganizationAccountProjectRole.MANAGER.value)
                setup = Setup(version=settings.CURRENT_VERSION)
                setup.save()
        except Exception as e:
            print(e)
            raise SetupFailedError()


class OrganizationService:
    @staticmethod
    def get_organzations(id: str, page: int, search: str):
        pass

    @staticmethod
    def create_organization(name: Optional[str], plan: str):
        organization = Organization()
        if name:
            organization.name = name
        organization.plan = plan
        organization.save()
        project = ProjectService.create_project(organization)
        return organization, project

    @staticmethod
    def update_plan(organization: Organization, plan: str):
        organization.plan = plan
        organization.save()
        return organization

    @staticmethod
    def update_name(organization: Organization, name: str):
        organization.name = name
        organization.save()
        return organization

    @staticmethod
    def delete_organization(organization: Organization):
        organization.status = OrganizationStatus.ARCHIVE.value
        organization.save()
        return organization

    @staticmethod
    def add_account_to_organization(organization: Organization, account: Account, role: str, project: Project):
        oapj = OrganizationAccountProjectJoin()
        oapj.account = account
        oapj.organization = organization
        oapj.project = project
        oapj.role = role
        oapj.save()


class ProjectService:
    @staticmethod
    def get_projects(id: str, page: int, search: str):
        pass

    @staticmethod
    def create_project(organization: Organization, account: Optional[Account] = None, name: Optional[str] = None, limit: Optional[int] = None):
        project = Project()
        if name:
            project.name = name
        if limit:
            project.limit = limit
        project.save()
        oapj = OrganizationAccountProjectJoin()
        oapj.organization = organization
        if account:
            oapj.account = account
        oapj.project = project
        oapj.project_role = OrganizationAccountProjectRole.MANAGER.value
        oapj.organization_role = OragnizationAccountRole.ADMIN.value
        oapj.save()
        return project

    @staticmethod
    def update_project_name(project: Project, name: str):
        project.name = name
        project.save()
        return project

    @staticmethod
    def update_project_limit(project: Project, limit: int):
        project.limit = limit
        project.save()
        return project

    @staticmethod
    def delete_project(project: Project):
        project.status = ProjectStatus.ARCHIVE.value
        project.save()
        return project

    @staticmethod
    def add_account_to_project(organization: Organization, account: Account, project: Project, project_role: str):
        oapj = OrganizationAccountProjectJoin()
        oapj.account = account
        oapj.organization = organization
        oapj.project = project
        oapj.project_role = project_role
        oapj.save()


class SetupService:

    @staticmethod
    def is_setup():
        return True if Setup.objects.all().count() else False

    @staticmethod
    def setup_master_workspace(email: str, name: str, password: str):
        try:
            with transaction.atomic():
                organization, project = OrganizationService.create_organization(
                    'Master', SubsciptionPlans.UNLIMITED.value)
                account = AccountService.create_account(
                    email=email, name=name, password=password)
                account.access_level = AccessLevel.MAINTAINER.value
                account.save()
                OrganizationService.add_account_to_organization(
                    organization, account, OragnizationAccountRole.ADMIN.value, project)
                ProjectService.add_account_to_project(
                    organization, account, project, project_role=OrganizationAccountProjectRole.MANAGER.value)
                setup = Setup(version=settings.CURRENT_VERSION)
                setup.save()
        except Exception as e:
            print(e)
            raise SetupFailedError()


class RegisterService:
    @classmethod
    def invite_new_member(cls, organization: Organization, email: str, language: str, role: str = 'USER', inviter: Account = None) -> str:
        """Invite new member"""
        try:
            account = Account.objects.filter(email=email).first()

            if not account:
                name = email.split('@')[0]
                account = cls.register(
                    email=email, name=name, language=language, status=AccountStatus.PENDING, role=role)
                # Create new organization member for invited organization
                AccountService.create_account(organization, account)
                OrganizationService.switch_organization(
                    account, str(organization.id))
                token = cls.generate_invite_token(organization, account)

                # send email
                send_invite_member_mail_task(
                    language=account.interface_language,
                    to=email,
                    token=token,
                    inviter_name=inviter.name if inviter else 'Loki',
                    workspace_name=organization.name,
                    workspace_id=str(organization.id),
                )
                return token
            else:
                OrganizationService.check_member_permission(
                    inviter, account, 'add')
                ta = OrganizationAccountProjectJoin.objects.filter(
                    organization=organization,
                    account=account
                ).first()

                if not ta:
                    OrganizationService.create_organization_member(
                        organization, account)

                return None
        except Exception as e:
            print('the error =============', traceback.print_exc())
            logging.error(f'Invite new member failed: {e}')
            raise AccountRegisterError(f'Invite new member failed: {e}') from e

    @classmethod
    def generate_invite_token(cls, organization: Organization, account: Account) -> str:
        token = str(uuid.uuid4())
        invitation_data = {
            'account_id': str(account.id),
            'email': account.email,
            'workspace_id': str(organization.id),
        }
        try:
            expiryHours = int(settings.INVITE_EXPIRY_HOURS)
        except (ValueError, KeyError):
            expiryHours = 24

        if expiryHours > 24 * 365:
            raise ValueError(
                "Expiry hours too large, please set a reasonable value.")

        cache.set(
            cls._get_invitation_token_key(token),
            json.dumps(invitation_data),
            expiryHours * 60 * 60
        )
        return token

    @classmethod
    def revoke_token(cls, workspace_id: str, email: str, token: str):
        if workspace_id and email:
            email_hash = sha256(email.encode()).hexdigest()
            cache_key = 'member_invite_token:{}, {}:{}'.format(
                workspace_id, email_hash, token)
            cache.delete(cache_key)
        else:
            cache.delete(cls._get_invitation_token_key(token))

    @classmethod
    def get_invitation_if_token_valid(cls, workspace_id: str, email: str, token: str) -> Optional[dict[str, Any]]:
        try:
            invitation_data = cls._get_invitation_by_token(
                token, workspace_id, email)

            if not invitation_data:
                return None

            organization = Organization.objects.filter(
                id=invitation_data['workspace_id'],
                status='normal'
            ).first()

            if not organization:
                return None
            organization_account = Account.objects.prefetch_related(Prefetch(
                'organizationaccountjoin_set', queryset=OrganizationAccountJoin.objects.filter(organization_id=organization.id))).get(email=invitation_data['email'])

            if not organization_account:
                return None

            account = organization_account
            if not account:
                return None

            if invitation_data['account_id'] != str(account.id):
                return None

            return {
                'account': account,
                'data': invitation_data,
                'organization': organization,
            }
        except Exception as e:
            print('the error =============', traceback.print_exc())
            logging.error(f'Get invitation failed: {e}')
            raise AccountRegisterError(f'Get invitation failed: {e}') from e

    @classmethod
    def _get_invitation_by_token(cls, token: str, workspace_id: str, email: str) -> Optional[dict[str, str]]:
        if workspace_id is not None and email is not None:
            email_hash = sha256(email.encode()).hexdigest()
            cache_key = f'member_invite_token:{workspace_id}, {email_hash}:{token}'
            account_id = cache.get(cache_key)

            if not account_id:
                return None

            return {
                'account_id': account_id.decode('utf-8'),
                'email': email,
                'workspace_id': workspace_id,
            }
        else:
            data = cache.get(cls._get_invitation_token_key(token))
            if not data:
                return None

            invitation = json.loads(data)
            return invitation
