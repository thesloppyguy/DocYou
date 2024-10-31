from django.db import models
from docyou.model.accounts import Account, Organization
from docyou.model.base import BaseModel
from django.utils import timezone
import uuid


class Setup(models.Model):
    version = models.CharField(primary_key=True, max_length=255)
    setup_at = models.DateTimeField(default=timezone.now)


class OperationLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    organization = models.ForeignKey(Organization, on_delete=models.DO_NOTHING)
    account = models.ForeignKey(Account, on_delete=models.DO_NOTHING)
    action = models.CharField(max_length=255)
    content = models.JSONField(blank=True, null=True)
