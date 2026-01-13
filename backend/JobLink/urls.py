# api/urls.py
from django.urls import path
from .views import (
    RegisterView, LoginView, DashboardView,
    JobApplicationsView, JobApplicationDetailView,
    SkillsView, SkillDetailView, ProfileView, AISuggestionsView,
)

urlpatterns = [
    path('auth/register/', RegisterView.as_view()),
    path('auth/login/',    LoginView.as_view()),
    path('dashboard/',     DashboardView.as_view()),
    path('profile/',       ProfileView.as_view()),
    path('applications/',  JobApplicationsView.as_view()),
    path('applications/<int:pk>/', JobApplicationDetailView.as_view()),
    path('skills/',        SkillsView.as_view()),
    path('skills/<int:pk>/', SkillDetailView.as_view()),
    path('ai/suggestions/', AISuggestionsView.as_view()),
]
