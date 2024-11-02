from docyou.utils.init import get_init_validate_status
from docyou.controllers.console.workspace.errors import AccountNotInitializedError
from docyou.model.accounts import Account, OrganizationAccountProjectJoin
from docyou.services.account_service import SetupService
from docyou.controllers.console.errors import NotInitValidateError, NotSetupError
from django.contrib.auth import authenticate, login
from django.conf import settings
from rest_framework.response import Response
from functools import wraps
import jwt
import os


def setup_required(view_func):
    @wraps(view_func)
    def decorated(view, request, *args, **kwargs):
        if not get_init_validate_status(request):
            return NotInitValidateError()

        elif not SetupService.is_setup():
            return NotSetupError()

        return view_func(view, request, *args, **kwargs)

    return decorated


def login_required(view_func):
    @wraps(view_func)
    def decorated_view(view, request, *args, **kwargs):
        auth_header = request.headers.get('Authorization')
        admin_api_key_enable = os.getenv(
            'ADMIN_API_KEY_ENABLE', default='False')
        if admin_api_key_enable.lower() == 'true':
            if auth_header:
                if ' ' not in auth_header:
                    return Response(
                        'Invalid Authorization header format. Expected \'Bearer <api-key>\' format.')
                auth_scheme, auth_token = auth_header.split(None, 1)
                auth_scheme = auth_scheme.lower()
                if auth_scheme != 'bearer':
                    return Response(
                        'Invalid Authorization header format. Expected \'Bearer <api-key>\' format.')
                admin_api_key = os.getenv('ADMIN_API_KEY')

                if admin_api_key:
                    if os.getenv('ADMIN_API_KEY') == auth_token:
                        workspace_id = request.headers.get('X-WORKSPACE-ID')
                        if workspace_id:
                            try:
                                oapj = OrganizationAccountProjectJoin.objects.select_related('organization') \
                                    .get(organization__id=workspace_id, current=True)
                                account = Account.objects.get(
                                    id=oapj.account.id)
                                if account:
                                    account.current_organization = oapj.organization
                                    account.current_project = oapj.project
                                    login(request, account)
                            except OrganizationAccountProjectJoin.DoesNotExist:
                                return Response({'detail': 'Invalid workspace ID or role'}, status=401)
                            except Account.DoesNotExist:
                                return Response({'detail': 'Account not found'}, status=401)

        return view_func(view, request, *args, **kwargs)

    return decorated_view


def account_initialization_required(view_func):
    @wraps(view_func)
    def decorated(view, request, *args, **kwargs):

        query_token = request.query_params.get('_token', None)
        header_token = str(request.headers.get('authorization')).split(' ')
        if query_token:
            token = query_token
        elif len(header_token) > 1:
            token = header_token[1]
        else:
            return AccountNotInitializedError()
        sk = settings.SECRET_KEY
        playload = jwt.decode(token, sk, 'HS256')
        account = Account.objects.get(id=playload['user_id'])
        if account.status == 'uninitialized':
            return AccountNotInitializedError()
        oaj = OrganizationAccountProjectJoin.objects.filter(
            account=account, current=True).first()
        if not oaj:
            oaj = OrganizationAccountProjectJoin.objects.filter(
                account=account).first()
            if not oaj:
                return AccountNotInitializedError()
            oaj.current = True
            oaj.save()
        account.current_tenant_id = (oaj.tenant.id)
        account.current_tenant = (oaj.tenant)
        request.user = account
        return view_func(view, request, *args, **kwargs)

    return decorated
