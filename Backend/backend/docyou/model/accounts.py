from django.db import models
from django.utils import timezone
import uuid


class Organization(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    name = models.CharField(null=True, max_length=256)
    status = models.CharField(null=False, default='active')
    plan = models.CharField(null=False, default='unlimited')


class Account(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=256, null=False)
    email = models.EmailField(max_length=256, null=False)
    password = models.CharField(max_length=255, null=True)
    password_salt = models.CharField(max_length=255, null=True)
    last_active = models.DateTimeField(auto_now=True)
    interface_theme = models.CharField(null=False, default='light')
    status = models.CharField(null=False, default='invited')
    access_level = models.CharField(null=False, default='regular')


class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    name = models.CharField(null=False, default='default_project')
    limit = models.IntegerField(null=False, default=0)
    status = models.CharField(null=False, default='active')


class OrganizationAccountJoin(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    account = models.ForeignKey(Account, on_delete=models.DO_NOTHING)
    organization = models.ForeignKey(Organization, on_delete=models.DO_NOTHING)
    organization_role = models.CharField(null=False, default='user')
    current = models.BooleanField(null=False, default=False)


class OrganizationAccountProjectJoin(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    account = models.ForeignKey(
        Account, null=True, on_delete=models.DO_NOTHING)
    organization = models.ForeignKey(Organization, on_delete=models.DO_NOTHING)
    project_role = models.CharField(null=False, default='tester')
    organization_role = models.CharField(null=False, default='user')
    current = models.BooleanField(null=False, default=False)
