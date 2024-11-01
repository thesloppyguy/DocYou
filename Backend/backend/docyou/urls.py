from django.contrib import admin
from django.urls import path
from docyou.controllers.console import console_urls
urlpatterns = [
    path('admin/', admin.site.urls),
] + console_urls
