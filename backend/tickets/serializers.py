from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Ticket, UserProfile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# ✅ Serialize User model (used in nested serializers)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


# ✅ Serialize UserProfile with nested User info (read-only)
class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ['user', 'role']


# ✅ Ticket Serializer — Supports creation + readable nested fields
class TicketSerializer(serializers.ModelSerializer):
    customer = UserSerializer(read_only=True)       # Automatically set from request.user
    assigned_to = UserSerializer(read_only=True)    # For agents/admins

    class Meta:
        model = Ticket
        fields = [
            'id',
            'title',
            'description',
            'status',
            'created_at',
            'updated_at',
            'customer',
            'assigned_to'
        ]
        read_only_fields = ['customer', 'assigned_to', 'created_at', 'updated_at']


# ✅ Custom JWT Login Serializer to include role, email, etc.
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get("username")  # Frontend sends email as username
        password = attrs.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("No account with this email")

        # Set username to actual username (required by JWT)
        attrs['username'] = user.username

        data = super().validate(attrs)

        try:
            profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            raise serializers.ValidationError("User profile not found.")

        # Append custom fields
        data['is_agent'] = profile.role == 'agent'
        data['user_id'] = user.id
        data['email'] = user.email
        data['username'] = user.username
        return data


# ✅ Register Serializer — For creating users + user profiles
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.CharField()

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        UserProfile.objects.create(user=user, role=validated_data['role'])
        return user
