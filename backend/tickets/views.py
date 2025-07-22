from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings

from .models import Ticket, UserProfile
from .serializers import (
    TicketSerializer,
    UserProfileSerializer,
    CustomTokenObtainPairSerializer,
    RegisterSerializer,
)

# -------------------------------
# TICKET VIEWSET
# -------------------------------
class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        try:
            profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            return Ticket.objects.none()

        if profile.role == 'customer':
            return Ticket.objects.filter(customer=user)
        return Ticket.objects.all()  # Agent sees all

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

    def perform_update(self, serializer):
        serializer.save()

    # ✅ Manual email trigger
    @action(detail=True, methods=['post'], url_path='send-email')
    def send_email(self, request, pk=None):
        ticket = self.get_object()
        customer_email = ticket.customer.email
        subject = f'Ticket "{ticket.title}" Status Update'
        message = f"""
Dear {customer_email},

Your ticket "{ticket.title}" status is currently: {ticket.status}.

Thank you,
Support Team
"""

        try:
            send_mail(
                subject,
                message,
                settings.EMAIL_HOST_USER,
                [customer_email],
                fail_silently=False,
            )
            return Response({'success': 'Email sent successfully.'}, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

# -------------------------------
# USER PROFILE VIEWSET
# -------------------------------
class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

# -------------------------------
# USER REGISTRATION APIView
# -------------------------------
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            profile = UserProfile.objects.get(user=user)

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'is_agent': profile.role == 'agent',
                'email': user.email,
                'username': user.username,
                'user_id': user.id
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# -------------------------------
# CUSTOM TOKEN LOGIN VIEW
# -------------------------------
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
