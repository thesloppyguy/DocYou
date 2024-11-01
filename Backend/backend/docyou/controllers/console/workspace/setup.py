from docyou.utils.init import get_init_validate_status
from docyou.services.account_service import SetupService
from docyou.controllers.console.errors import AlreadySetupError, NotInitValidateError
from docyou.model.utils import Setup
from rest_framework.views import APIView
from rest_framework.response import Response
import os


class SetupAPI(APIView):
    def get(self, request):
        setup = SetupService.get_setup_status()
        if not setup:
            return Response({"status": "No Setup"})
        return Response({"status": "Finished"})

    def post(self, request):
        if SetupService.get_setup_status():
            raise AlreadySetupError()

        if not get_init_validate_status(request):
            raise NotInitValidateError()
        args = request.body()
        try:
            SetupService.setup_master_workspace(
                args['email'], args['name'], args['password'])
        except Exception as e:
            return e
