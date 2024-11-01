from docyou.controllers.console.wraps import login_required, setup_required
from rest_framework.views import APIView


class GetProjectsAPI(APIView):
    @setup_required
    def get(self, request):
        pass

    @setup_required
    def post(self, request):
        pass


class GetProjectAPI(APIView):
    @setup_required
    def get(self, request):
        pass

    @setup_required
    def post(self, request):
        pass


class CreateProjectAPI(APIView):
    def get(self, request):
        pass

    def post(self, request):
        pass


class UpdateProjectAPI(APIView):
    def get(self, request):
        pass

    def post(self, request):
        pass
