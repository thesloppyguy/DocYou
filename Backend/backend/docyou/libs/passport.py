from django.http import HttpResponseForbidden
from django.conf import settings
import jwt


class PassportService:
    def __init__(self):
        self.sk = settings.SECRET_KEY

    def issue(self, payload):

        return jwt.encode(payload, self.sk, algorithm='HS256')

    def verify(self, token):
        try:
            return jwt.decode(token, self.sk, algorithms=['HS256'])
        except jwt.exceptions.InvalidSignatureError:
            raise HttpResponseForbidden('Invalid token signature.')
        except jwt.exceptions.DecodeError:
            raise HttpResponseForbidden('Invalid token.')
        except jwt.exceptions.ExpiredSignatureError:
            raise HttpResponseForbidden('Token has expired.')
