from typing import Optional
from django.http import JsonResponse


class BaseHTTPException(JsonResponse):
    error_code: str = 'unknown'
    description: str = 'unknown'
    data: Optional[dict] = None
    code: int = 200

    def __init__(self, description=None, error_code=None, code=None):
        self.error_code = error_code or self.error_code
        self.code = code or self.code
        self.description = description or self.description
        self.data = {
            "code": self.error_code,
            "message": self.description,
            "status": self.code,
        }
        super().__init__(self.data, status=self.code)
