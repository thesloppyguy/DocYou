from docyou.controllers.console.wraps import login_required, setup_required
from rest_framework.views import APIView


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
    def get(self, request):
        pass

    @setup_required
    def post(self, request):
        pass


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
        pass
