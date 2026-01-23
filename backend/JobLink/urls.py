# api/urls.py
from django.urls import path
from .views import (
    RegisterAPIView, LoginAPIView, DashboardAPIView,
    JobApplicationsViewSet, TokenRefreshView, #JobApplicationDetailView,
    SkillViewSet, UserProfileViewSet, PasswordChangeAPIView, #SkillDetailView,  AISuggestionsView,
)

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'applications', JobApplicationsViewSet)
router.register(r'skills', SkillViewSet) 
router.register(r'profile', UserProfileViewSet, basename='profile')


urlpatterns = [
    # Custom endpoints
    path('auth/login/', LoginAPIView.as_view()),
    path('auth/register/', RegisterAPIView.as_view()),
    path('dashboard/', DashboardAPIView.as_view()),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/password-change/', PasswordChangeAPIView.as_view(), name='password_change'),
    #path('ai/suggestions/', AISuggestionsAPIView.as_view()),
    
] + router.urls

