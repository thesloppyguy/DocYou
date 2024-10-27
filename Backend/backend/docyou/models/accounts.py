from django.db import models
from docyou.models.base import BaseModel


class Organization(BaseModel):
    name = models.CharField(null=True, max_length=256)
    limit = models.IntegerField(null=False, default=100)


class Account(BaseModel):
    name = models.CharField(max_length=256, null=False)
    email = models.EmailField(max_length=256, null=False)
    last_active = models.DateField(null=True)


class Project(BaseModel):
    name = models.CharField(null=False, default='default_project')
    limit = models.IntegerField(null=False, default=100)


class OrganizationAccountProjectJoin(BaseModel):
    account = models.ForeignKey(Account, on_delete=models.DO_NOTHING)
    project = models.ForeignKey(Project, on_delete=models.DO_NOTHING)


class OrganizationAccountJoin(BaseModel):
    account = models.ForeignKey(Account, on_delete=models.DO_NOTHING)
    organization = models.ForeignKey(Organization, on_delete=models.DO_NOTHING)
    role = models.CharField()
