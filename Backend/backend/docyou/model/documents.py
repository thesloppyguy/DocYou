from django.db import models
from docyou.model.accounts import Project, Account, Organization
from docyou.model.base import BaseModel


class UploadFile(BaseModel):
    name = models.CharField(max_length=256, null=False)
    project = models.ForeignKey(Project, on_delete=models.DO_NOTHING)
    account = models.ForeignKey(Account, on_delete=models.DO_NOTHING)
    organization = models.ForeignKey(Organization, on_delete=models.DO_NOTHING)
