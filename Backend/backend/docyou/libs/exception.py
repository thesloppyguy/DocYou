from typing import Optional
from django.http import HttpResponse


class BaseHTTPException(HttpResponse):
    error_code: str = 'unknown'
    data: Optional[dict] = None

    def __init__(self, description=None, response=None):
        super().__init__(description, response)

        self.data = {
            "code": self.error_code,
            "message": self.description,
            "status": self.code,
        }
