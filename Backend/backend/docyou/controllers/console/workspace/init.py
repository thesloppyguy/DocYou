

from docyou.controllers.console.errors import AlreadySetupError, InitValidateFailedError
from docyou.model.accounts import Organization
from docyou.utils.init import get_init_validate_status
from rest_framework.views import APIView
import os


class InitValidateAPI(APIView):
    def get(self, request):
        init_status = get_init_validate_status()
        if init_status:
            return {"status": "finished"}
        return {"status": "not_started"}

    def post(self, request):
        tenant_count = Organization.objects.count()
        if tenant_count > 0:
            raise AlreadySetupError()

        parser = request.body()
        input_password = parser.get("password")
        session = request.session
        if input_password != os.environ.get("INIT_PASSWORD"):
            session["is_init_validated"] = False
            raise InitValidateFailedError()

        session["is_init_validated"] = True
        return {"result": "success"}, 201
