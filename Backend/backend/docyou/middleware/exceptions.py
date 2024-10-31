from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
import logging

logger = logging.getLogger(__name__)


class ErrorHandlingMiddleware(MiddlewareMixin):
    def process_exception(self, request, exception):
        # Log the error (optional)
        logger.error("An error occurred: %s", exception)

        # Customize the response as needed (e.g., JSON response)
        response_data = {
            "error": "An unexpected error occurred.",
            "details": str(exception)
        }
        return JsonResponse(response_data, status=500)
