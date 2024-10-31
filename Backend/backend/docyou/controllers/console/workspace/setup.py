from docyou.controllers.console.errors import AlreadySetupError, NotInitValidateError
from docyou.model.utils import Setup
from rest_framework.views import APIView
from rest_framework.response import Response
import os


def get_setup_status():
    return Setup.objects.get()


def get_init_validate_status(request):
    session = request.session
    if os.environ.get("INIT_PASSWORD"):
        return session.get("is_init_validated") or Setup.query.first()

    return True


class SetupAPI(APIView):
    def get(self, request):
        setup = get_setup_status()
        if not setup:
            return Response({"status": "No Setup"})
        return Response({"status": "Finished"})

    def post(self, request):
        if get_setup_status():
            raise AlreadySetupError()

        if not get_init_validate_status(request):
            raise NotInitValidateError()

        pass
