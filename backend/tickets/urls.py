from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TicketViewSet,
    UserProfileViewSet,
    CustomTokenObtainPairView,
    RegisterView  # ✅ use class-based RegisterView (APIView)
)

router = DefaultRouter()
router.register(r'tickets', TicketViewSet)
router.register(r'profiles', UserProfileViewSet)

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterView.as_view(), name='register'),  # ✅ APIView-based registration
    path('', include(router.urls)),
]
