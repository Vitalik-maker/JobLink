from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    skills = models.JSONField(default=list)
    accomplishments = models.JSONField(default=list)
    age = models.IntegerField(null=True, blank=True)
    bio = models.TextField(blank=True)
    
    # ← ADD THESE TWO LINES
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='joblink_user_set',
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='joblink_user_permissions',
        blank=True,
    )


class JobApplication(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    status = models.CharField(max_length=50, default='Applied')
    applied_date = models.DateTimeField(auto_now_add=True)

class Skill(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    level = models.IntegerField(default=1)  # 1-5
