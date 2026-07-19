from rest_framework import generics, status, views, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from .serializers import (
    RegisterSerializer,
    UserSerializer,
    ChangePasswordSerializer,
    CustomTokenObtainPairSerializer,
    AdminTokenObtainPairSerializer,
    CustomerTokenObtainPairSerializer,
    UserProfileSerializer,
    WishlistSerializer
)
from .models import UserProfile, Wishlist

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    """Generic login — kept for backwards compatibility (e.g. token refresh flow)."""
    serializer_class = CustomTokenObtainPairSerializer


class AdminTokenObtainPairView(TokenObtainPairView):
    """Login endpoint restricted to admin-role users only."""
    serializer_class = AdminTokenObtainPairSerializer


class CustomerTokenObtainPairView(TokenObtainPairView):
    """Login endpoint restricted to customer-role users only."""
    serializer_class = CustomerTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class LogoutView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)
                
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"success": "User logged out successfully"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class WishlistViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = WishlistSerializer
    lookup_field = 'product_id'

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        # Allow deletion by product_id
        product_id = self.kwargs.get('product_id')
        wishlist_item = get_object_or_404(Wishlist, user=request.user, product_id=product_id)
        wishlist_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


    def update(self, request, *args, **kwargs):
        user = self.get_object()
        profile_fields = ('phone_number', 'address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country')

        # Split data: user fields vs profile fields
        user_data = {k: v for k, v in request.data.items() if k not in profile_fields}
        profile_data = {k: v for k, v in request.data.items() if k in profile_fields}

        # Update user model fields (first_name, last_name)
        if user_data:
            serializer = self.get_serializer(user, data=user_data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

        # Update profile fields
        if profile_data:
            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile_serializer = UserProfileSerializer(profile, data=profile_data, partial=True)
            profile_serializer.is_valid(raise_exception=True)
            profile_serializer.save()

        # Return fresh user data
        return Response(self.get_serializer(user).data)


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminStatsView(views.APIView):
    """Returns aggregated stats for the Admin Dashboard overview."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

        from orders.models import Order
        from products.models import Product
        from django.db.models import Sum
        from decimal import Decimal

        total_customers = User.objects.filter(role='customer').count()
        total_orders = Order.objects.count()
        total_products = Product.objects.filter(is_active=True).count()
        revenue_agg = Order.objects.aggregate(total=Sum('total'))
        total_revenue = revenue_agg['total'] or Decimal('0.00')

        return Response({
            'total_customers': total_customers,
            'total_orders': total_orders,
            'total_products': total_products,
            'total_revenue': str(total_revenue),
        })


class AdminCustomersView(generics.ListAPIView):
    """Returns a paginated list of all customer accounts for admin management."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

        customers = User.objects.filter(role='customer').order_by('-date_joined').values(
            'id', 'email', 'first_name', 'last_name', 'is_active', 'date_joined'
        )
        return Response(list(customers))
