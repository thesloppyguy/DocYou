from docyou.utils.init import get_init_validate_status
from docyou.services.account_service import SetupService
from docyou.controllers.console.errors import AlreadySetupError, NotInitValidateError
from docyou.model.utils import Setup
from rest_framework.views import APIView
from rest_framework.response import Response
import os


class SetupAPI(APIView):
    def get(self, request):
        setup = SetupService.is_setup()
        if not setup:
            return Response({"status": "No Setup"})
        return Response({"status": "Finished"})

    def post(self, request):
        if SetupService.is_setup():
            return AlreadySetupError()

        if not get_init_validate_status(request):
            return NotInitValidateError()
        args = request.data
        try:
            SetupService.setup_master_workspace(
                args['email'], args['name'], args['password'])
            return Response({'result': 'success'})
        except Exception as e:
            print(e)
            return Response({'result': 'failed'}, status=500)
