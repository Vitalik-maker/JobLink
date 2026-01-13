# api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, get_user_model
from .models import JobApplication, Skill
from .serializers import (
    UserSerializer,
    LoginSerializer,
    JobApplicationSerializer,
    SkillSerializer,
    DashboardSerializer,
)
import random

User = get_user_model()

class JobApplicationsViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = JobApplicationSerializer
    queryset = JobApplication.objects.all()  # ← THIS LINE IS REQUIRED
    
    def get_queryset(self):
        return JobApplication.objects.filter(user=self.request.user)

    
class SkillViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SkillSerializer
    queryset = Skill.objects.all()

    def get_queryset(self):
        return Skill.objects.filter(user = self.request.user)
    
class UserProfileViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer
    queryset = User.objects.all()
    
    def get_queryset(self):
        return User.objects.filter(id = self.request.user.id)

#class AccomplishmentsViewSet(viewsets.ModelViewSet):
#    permission_classes = [IsAuthenticated]
#    serializer_class = AccomplishmentsSerializer
#
#    def get_queryset(self):
#        return Acomplishments.objects.filter(user = self.request.user)

class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Register a new user.
        Expected JSON:
        {
          "username": "...",
          "email": "...",
          "password": "...",
          "first_name": "...",
          "last_name": "...",
          "age": 25
        }
        """
        data = request.data.copy()
        if "password" not in data or not data["password"]:
            return Response({"detail": "Password is required."}, status=400)
        
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            user = User.objects.create_user(
                username=serializer.validated_data["username"],
                email=serializer.validated_data.get("email", ""),
                password=data["password"],
                first_name=serializer.validated_data.get("first_name", ""),
                last_name=serializer.validated_data.get("last_name", ""),
                age=serializer.validated_data.get("age"),
            )
            token, _ = Token.objects.get_or_create(user=user)
            return Response(
                {"user": UserSerializer(user).data, "token": token.key},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Log in and return token.
        JSON: { "username": "...", "password": "..." }
        """
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        user = authenticate(
            username=serializer.validated_data["username"],
            password=serializer.validated_data["password"],
        )
        if not user:
            return Response(
                {"detail": "Invalid credentials."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user": UserSerializer(user).data})


class DashboardAPIView(APIView):
    """
    Returns all data for the React JobLink dashboard:
    - job applications (left big column)
    - skills & accomplishments
    - user info
    - AI suggestions (dummy for now)
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        applications = JobApplication.objects.filter(user=user).order_by("-applied_date")
        apps_ser = JobApplicationSerializer(applications, many=True)

        skills = Skill.objects.filter(user=user).order_by("id")
        skills_ser = SkillSerializer(skills, many=True)

        user_ser = UserSerializer(user)

        suggestions = [
            "Add 2–3 measurable accomplishments to your last job.",
            "Highlight tools like Python, Figma, or Excel in your skills.",
            "Connect your portfolio link to each application.",
            "Tailor your resume summary for each company.",
        ]
        random.shuffle(suggestions)

        payload = {
            "applications": apps_ser.data,
            "skills": skills_ser.data,
            "user": user_ser.data,
            "ai_suggestions": suggestions[:3],
        }
        dash = DashboardSerializer(payload)
        return Response(dash.data)


#class JobApplicationsView(APIView):
#    """
#    CRUD for JobApplication list.
#    Used to fill the left blue 'Job Applications' card.
#    """
#
#    permission_classes = [IsAuthenticated]
#
#    def get(self, request):
#        apps = JobApplication.objects.filter(user=request.user).order_by("-applied_date")
#        ser = JobApplicationSerializer(apps, many=True)
#        return Response(ser.data)
#
#    def post(self, request):
#        data = request.data.copy()
#        data["user"] = request.user.id
#        ser = JobApplicationSerializer(data=data)
#        if ser.is_valid():
#            ser.save()
#            return Response(ser.data, status=201)
#        return Response(ser.errors, status=400)
#
#
#class JobApplicationDetailView(APIView):
#    """
#    Update / delete a single job application.
#    """
#
#    permission_classes = [IsAuthenticated]
#
#    def get_object(self, user, pk):
#        try:
#            return JobApplication.objects.get(pk=pk, user=user)
#        except JobApplication.DoesNotExist:
#            return None
#
#    def put(self, request, pk):
#        app = self.get_object(request.user, pk)
#        if not app:
#            return Response({"detail": "Not found."}, status=404)
#        ser = JobApplicationSerializer(app, data=request.data, partial=True)
#        if ser.is_valid():
#            ser.save()
#            return Response(ser.data)
#        return Response(ser.errors, status=400)
#
#    def delete(self, request, pk):
#        app = self.get_object(request.user, pk)
#        if not app:
#            return Response({"detail": "Not found."}, status=404)
#        app.delete()
#        return Response(status=204)
#
#
#class SkillsView(APIView):
#    """
#    CRUD for Skill items.
#    Populates the 'List of skills' blue card.
#    """
#
#    permission_classes = [IsAuthenticated]
#
#    def get(self, request):
#        skills = Skill.objects.filter(user=request.user).order_by("id")
#        ser = SkillSerializer(skills, many=True)
#        return Response(ser.data)
#
#    def post(self, request):
#        data = request.data.copy()
#        data["user"] = request.user.id
#        ser = SkillSerializer(data=data)
#        if ser.is_valid():
#            ser.save()
#            return Response(ser.data, status=201)
#        return Response(ser.errors, status=400)
#
#
#class SkillDetailView(APIView):
#    """
#    Update / delete a single skill.
#    """
#
#    permission_classes = [IsAuthenticated]
#
#    def get_object(self, user, pk):
#        try:
#            return Skill.objects.get(pk=pk, user=user)
#        except Skill.DoesNotExist:
#            return None
#
#    def put(self, request, pk):
#        skill = self.get_object(request.user, pk)
#        if not skill:
#            return Response({"detail": "Not found."}, status=404)
#        ser = SkillSerializer(skill, data=request.data, partial=True)
#        if ser.is_valid():
#            ser.save()
#            return Response(ser.data)
#        return Response(ser.errors, status=400)
#
#    def delete(self, request, pk):
#        skill = self.get_object(request.user, pk)
#        if not skill:
#            return Response({"detail": "Not found."}, status=404)
#        skill.delete()
#        return Response(status=204)
#
#
#class ProfileView(APIView):
#    """
#    Used on the profile-style dashboard (picture, name, age, skills).
#    """
#
#    permission_classes = [IsAuthenticated]
#
#    def get(self, request):
#        return Response(UserSerializer(request.user).data)
#
#    def put(self, request):
#        user = request.user
#        ser = UserSerializer(user, data=request.data, partial=True)
#        if ser.is_valid():
#            ser.save()
#            return Response(ser.data)
#        return Response(ser.errors, status=400)
#
#
#class AISuggestionsView(APIView):
#    """
#    Placeholder endpoint for future AI.
#    Right now it just returns canned suggestions.
#    """
#
#    permission_classes = [IsAuthenticated]
#
#    def get(self, request):
#        base_suggestions = [
#            "Try adding a short 2–3 line summary at the top of your resume.",
#            "List 3–5 key skills that match your target roles.",
#            "Add metrics (%, $, time saved) to at least two accomplishments.",
#            "Link to a portfolio or GitHub if you have projects.",
#            "Ask JobLink AI to generate tailored bullet points per job.",
#        ]
#        random.shuffle(base_suggestions)
#        return Response({"suggestions": base_suggestions[:4]})
#