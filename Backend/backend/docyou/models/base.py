from django.db import models


class BaseModel(models.Model):
    id = models.UUIDField()
    created_at = models.DateField()
    updated_at = models.DateField()
