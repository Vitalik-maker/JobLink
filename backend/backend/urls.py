# project urls.py
from django.urls import path, include

urlpatterns = [
    path('JobLink/', include('JobLink.urls')),
]
