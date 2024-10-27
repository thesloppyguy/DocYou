

from enum import Enum


class AccountRole(Enum):
    ROOT = 'ROOT'
    OWNER = 'OWNER'
    ADMIN = 'ADMIN'
    USER = 'USER'
