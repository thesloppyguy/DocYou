from django.db import models
from docyou.model.accounts import Project, Account, Organization
from docyou.model.base import BaseModel
import json


class ParserConfig(BaseModel):
    name = models.CharField(max_length=256, null=False)
    project = models.ForeignKey(Project, on_delete=models.DO_NOTHING)
    account = models.ForeignKey(Account, on_delete=models.DO_NOTHING)
    organization = models.ForeignKey(Organization, on_delete=models.DO_NOTHING)
    config = models.JSONField(null=True, default='')

    @property
    def config_dict(self):
        if self.config != '':
            return json.loads(self.config)
