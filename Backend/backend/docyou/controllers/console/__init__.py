from django.urls import path
from docyou.controllers.console.workspace.account import *
from docyou.controllers.console.workspace.setup import *
from docyou.controllers.console.workspace.organization import *
from docyou.controllers.console.workspace.project import *
from docyou.controllers.console.workspace.init import *

console_urls = [
    path('console/api/init', InitValidateAPI.as_view()),
    path('console/api/setup', SetupAPI.as_view()),
    path('console/api/account', GetAccountsAPI.as_view()),
    path('console/api/account/<uuid:accout_id>', GetAccountAPI.as_view()),
    path('console/api/account/create', CreateAccountAPI.as_view()),
    path('console/api/account/invite', InviteAccountAPI.as_view()),
    path('console/api/account/update', UpdateAccountAPI.as_view()),
    path('console/api/account/update_password', UpdatePasswordAPI.as_view()),
    path('console/api/account/organization_role', UpdateOrganzationRoleAPI.as_view()),
    path('console/api/account/project_role', UpdateProjectRoleAPI.as_view()),
    path('console/api/login', LoginAPI.as_view()),
    path('console/api/logout', LogoutAPI.as_view()),
    path('console/api/forgot_password', ForgotPasswordAPI.as_view()),
    path('console/api/organization', GetOrganizationsAPI.as_view()),
    path('console/api/organization/<uuid:org_id>', GetOrganizationAPI.as_view()),
    path('console/api/organization/create', CreateOrganizationAPI.as_view()),
    path('console/api/organization/update', UpdateOrganizationAPI.as_view()),
    path('console/api/project', GetProjectsAPI.as_view()),
    path('console/api/project/<uuid:project_id>', GetProjectAPI.as_view()),
    path('console/api/project/create', CreateProjectAPI.as_view()),
    path('console/api/project/update', UpdateProjectAPI.as_view()),
]
