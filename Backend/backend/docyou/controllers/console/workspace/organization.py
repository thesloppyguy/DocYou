from docyou.controllers.console.wraps import login_required, setup_required
from rest_framework.views import APIView


class GetOrganizationsAPI(APIView):
    @setup_required
    @login_required
    def get(self, request):
        pass

    @setup_required
    @login_required
    def post(self, request):
        pass


class GetOrganizationAPI(APIView):
    @setup_required
    @login_required
    def get(self, request):
        pass

    @setup_required
    @login_required
    def post(self, request):
        pass


class CreateOrganizationAPI(APIView):
    @login_required
    def get(self, request):
        pass

    @login_required
    def post(self, request):
        pass


class UpdateOrganizationAPI(APIView):
    @login_required
    def get(self, request):
        pass

    @login_required
    def post(self, request):
        pass
