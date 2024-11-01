

from enum import Enum


class SubsciptionPlans(Enum):
    BASIC = 'basic'
    FLEX = 'flex'
    FLEXPLUS = 'flexplus'
    ENTERPRISE = 'enterprise'
    UNLIMITED = 'unlimited'


class OragnizationAccountRole(Enum):
    ADMIN = 'admin'
    USER = 'user'


class AccountStatus(Enum):
    ACTIVE = 'active'
    INVITED = 'invited'
    CLOSED = 'closed'


class OrganizationStatus(Enum):
    ACTIVE = 'active'
    ARCHIVE = 'archive'


class ProjectStatus(Enum):
    ACTIVE = 'active'
    ARCHIVE = 'archive'


class OrganizationAccountProjectRole(Enum):
    MANAGER = 'manager'
    TESTER = 'tester'


class AccessLevel(Enum):
    REGULAR = 'regular'
    MAINTAINER = 'maintainer'
