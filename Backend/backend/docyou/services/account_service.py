import base64
import secrets
from django.db import transaction
from django.core.paginator import Paginator
from datetime import datetime, timedelta, timezone
from typing import List, Optional
from django.core.cache import cache
from docyou.utils.init import get_login_cache_key
from docyou.libs.passport import PassportService
from docyou.libs.password import compare_password, hash_password, valid_password
from docyou.model.accounts import Account, Organization, Project, OrganizationAccountProjectJoin, OrganizationAccountJoin
from docyou.model.utils import Setup
from docyou.model.defaults import AccessLevel, AccountStatus, OragnizationAccountRole, ProjectStatus, SubsciptionPlans, OrganizationAccountProjectRole, OrganizationStatus
from docyou.services.errors.account import CurrentPasswordIncorrectError, NoPermissionError, SetupFailedError
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
    def login(account: Account):
        exp = timedelta(days=30)
        token = AccountService.get_account_jwt_token(account, exp=exp)
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
            "user_id": account.id,
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

        current_tenant = OrganizationAccountProjectJoin.query.filter_by(
            account_id=account.id, current=True).first()
        if current_tenant:
            account.current_tenant_id = current_tenant.tenant_id
        else:
            available_ta = (
                OrganizationAccountProjectJoin.query.filter_by(
                    account_id=account.id).first()
            )
            if not available_ta:
                return None

            account.current_tenant_id = available_ta.tenant_id
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


class OrganizationService:
    @staticmethod
    def get_organzations(id: str, page: int, search: str):
        pass

    @staticmethod
    def create_organization(name: Optional[str], plan: str):
        organization = Organization()
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
