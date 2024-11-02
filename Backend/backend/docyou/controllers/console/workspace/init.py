

from docyou.controllers.console.errors import AlreadySetupError, InitValidateFailedError
from docyou.model.accounts import Organization
from docyou.utils.init import get_init_validate_status
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
import os


class InitValidateAPI(APIView):
    def get(self, request):
        init_status = get_init_validate_status(request)
        if init_status:
            return Response({"status": "Finished"})
        return Response({"status": "No Setup"})

    def post(self, request):
        tenant_count = Organization.objects.count()
        if tenant_count > 0:
            raise AlreadySetupError()

        parser = request.data
        input_password = parser.get("password")
        session = request.session
        if input_password != settings.INIT_PASSWORD:
            session["is_init_validated"] = False
            raise InitValidateFailedError()

        session["is_init_validated"] = True
        return Response({"result": "success"}, status=201)
