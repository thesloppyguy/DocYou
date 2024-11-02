from rest_framework.response import Response
import traceback
import logging

from docyou.libs.exception import BaseHTTPException

logger = logging.getLogger(__name__)


class ErrorLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            response = self.get_response(request)
            if isinstance(response, BaseHTTPException):
                logger.error(
                    f"========|CODE: {response.data['status']} ({response.data['code']}) - Message: {response.data['message']}.")
            return response
        except Exception as e:
            error_message = f"Error processing request: {str(e)}"
            stack_trace = traceback.format_exc()
            logger.error(f"{error_message}\n{stack_trace}")

            # Optionally, return a custom error response
            return Response(
                {'error': 'An internal server error occurred.'},
                status=500
            )
