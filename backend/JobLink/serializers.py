# api/serializers.py (complete)
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import User, JobApplication, Skill

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'bio'] #'profile_picture','skills', 'accomplishments', 'age']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    #def create(self, validated_data):
    #    user = User.objects.create_user(
    #        username=validated_data['username'],
    #        email=validated_data.get('email', ''),
    #        password=validated_data['password'],
    #        first_name=validated_data.get('first_name', ''),
    #        last_name=validated_data.get('last_name', ''),
    #        age=validated_data.get('age'),
    #        skills=validated_data.get('skills', []),
    #        accomplishments=validated_data.get('accomplishments', [])
    #    )
    #    return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = '__all__'
        read_only_fields = ['user']

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'
        read_only_fields = ['user']

class DashboardSerializer(serializers.Serializer):
    applications = JobApplicationSerializer(many=True)
    skills = SkillSerializer(many=True)
    user = UserSerializer()
    ai_suggestions = serializers.ListField(child=serializers.CharField())

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'age', 'bio', 'profile_picture', ]#'skills', 'accomplishments']
        extra_kwargs = {
            'profile_picture': {'required': False},
            'username': {'read_only': True},
            'email': {'required': False},
        }


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField()
    confirm_password = serializers.CharField()
    
    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        return data

