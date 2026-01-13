from django.contrib import admin

# Register your models here.

from django.contrib import admin
from .models import Challenge, UserProfile, Completion

admin.site.register(Challenge)
admin.site.register(UserProfile)
admin.site.register(Completion)
