# api/urls.py
from django.urls import path
from .views import (
    RegisterAPIView, LoginAPIView, DashboardAPIView,
    JobApplicationsViewSet, #JobApplicationDetailView,
    SkillViewSet, UserProfileViewSet, #SkillDetailView,  AISuggestionsView,
)

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'applications', JobApplicationsViewSet)
router.register(r'skills', SkillViewSet) 
router.register(r'profile', UserProfileViewSet)

urlpatterns = [
    # Custom endpoints
    path('auth/login/', LoginAPIView.as_view()),
    path('auth/register/', RegisterAPIView.as_view()),
    path('dashboard/', DashboardAPIView.as_view()),
    #path('ai/suggestions/', AISuggestionsAPIView.as_view()),
    
] + router.urls

