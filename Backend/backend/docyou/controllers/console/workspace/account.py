from docyou.libs.password import hash_password
from docyou.model.defaults import AccountStatus
from docyou.controllers.console.errors import AlreadyActivateError
from docyou.services.errors.account import AccountLoginError
from docyou.services.account_service import AccountService, RegisterService
from docyou.controllers.console.wraps import login_required, setup_required
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime
import secrets
import base64


class GetAccountsAPI(APIView):
    @setup_required
    @login_required
    def get(self, request):
        pass

    @setup_required
    @login_required
    def post(self, request):
        pass


class GetAccountAPI(APIView):
    @setup_required
    @login_required
    def get(self, request):
        pass

    @setup_required
    @login_required
    def post(self, request):
        pass


class CreateAccountAPI(APIView):
    @setup_required
    @login_required
    def get(self, request):
        pass

    @setup_required
    @login_required
    def post(self, request):
        pass


class ActivateCheckAPI(APIView):
    @setup_required
    @login_required
    def get(self, request):
        # https://stage.lokibots.ai/activate?token=b66bcf54-0e24-45d5-af1e-d3a2aed5cee2&email=sahil+root@lokibots.com
        args = request.query_params

        workspaceId = args.get('workspace_id') if args.get(
            'workspace_id') else None
        reg_email = args.get('email')
        token = args.get('token')

        invitation = RegisterService.get_invitation_if_token_valid(
            workspaceId, reg_email, token)

        return Response({'is_valid': invitation is not None, 'workspace_name': invitation['tenant'].name if invitation else None})


class ActivateAPI(APIView):
    @setup_required
    def post(self, request):
        args = request.data
        invitation = RegisterService.get_invitation_if_token_valid(
            args['workspace_id'], args['email'], args['token'])
        if invitation is None:
            raise AlreadyActivateError()

        RegisterService.revoke_token(
            args['workspace_id'], args['email'], args['token'])

        account = invitation['account']
        account.name = args['name']

        # generate password salt
        salt = secrets.token_bytes(16)
        base64_salt = base64.b64encode(salt).decode()

        # encrypt password with salt
        password_hashed = hash_password(args['password'], salt)
        base64_password_hashed = base64.b64encode(password_hashed).decode()
        account.password = base64_password_hashed
        account.password_salt = base64_salt
        account.interface_language = args['interface_language']
        account.timezone = args['timezone']
        account.interface_theme = 'light'
        account.status = AccountStatus.ACTIVE.value
        account.initialized_at = datetime.datetime.now(
            datetime.timezone.utc).replace(tzinfo=None)
        account.save()

        return Response({'result': 'success'})


class InviteAccountAPI(APIView):
    @login_required
    @setup_required
    def get(self, request):
        pass

    @login_required
    @setup_required
    def post(self, request):
        pass


class UpdateAccountAPI(APIView):
    @login_required
    @setup_required
    def get(self, request):
        pass

    @login_required
    @setup_required
    def post(self, request):
        pass


class UpdatePasswordAPI(APIView):
    def get(self, request):
        pass

    @login_required
    @setup_required
    def post(self, request):
        pass


class UpdateOrganzationRoleAPI(APIView):
    def get(self, request):
        pass

    @login_required
    @setup_required
    def post(self, request):
        pass


class UpdateProjectRoleAPI(APIView):
    def get(self, request):
        pass

    @login_required
    @setup_required
    def post(self, request):
        pass


class LoginAPI(APIView):
    @setup_required
    def post(self, request):
        args = request.data
        try:
            account = AccountService.authenticate(
                args['email'], args['password'])
        except AccountLoginError as e:
            return Response({'result': 'unauthorized', 'data': str(e)})
        token = AccountService.login(
            account)
        request.user = account
        return Response({'result': 'success', 'data': str(token)})


class LogoutAPI(APIView):
    @login_required
    @setup_required
    def get(self, request):
        pass

    @login_required
    @setup_required
    def post(self, request):
        pass


class ForgotPasswordAPI(APIView):
    @login_required
    @setup_required
    def get(self, request):
        pass

    @login_required
    @setup_required
    def post(self, request):
        pass


class ActivateAccountAPI(APIView):
    @login_required
    @setup_required
    def get(self, request):
        pass

    @login_required
    @setup_required
    def post(self, request):
        pass


class RegisterAccountAPI(APIView):
    @login_required
    @setup_required
    def get(self, request):
        pass

    @login_required
    @setup_required
    def post(self, request):
        args = request.data
        try:
            AccountService.setup_workspace(
                args['email'], args['name'], args['password'])
            return Response({'result': 'success'})
        except Exception as e:
            print(e)
            return Response({'result': 'failed'}, status=500)


class RefreshTokenAPI(APIView):
    @login_required
    @setup_required
    def post(self, request):
        args = request.data
        try:
            AccountService.setup_workspace(
                args['email'], args['name'], args['password'])
            return Response({'result': 'success'})
        except Exception as e:
            print(e)
            return Response({'result': 'failed'}, status=500)
