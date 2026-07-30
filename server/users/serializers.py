from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from core.serializers import resolve_image_url
from .models import UserProfile, Wishlist, Address

User = get_user_model()


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = (
            'id', 'label', 'full_name', 'phone_number',
            'address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country',
            'is_default', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)



class WishlistSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(write_only=True)
    # Read-only product summary
    id = serializers.IntegerField(source='product.id', read_only=True)
    name = serializers.CharField(source='product.name', read_only=True)
    slug = serializers.CharField(source='product.slug', read_only=True)
    price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    effective_price = serializers.DecimalField(source='product.effective_price', max_digits=10, decimal_places=2, read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Wishlist
        fields = ('id', 'product_id', 'name', 'slug', 'price', 'effective_price', 'image', 'created_at')
        read_only_fields = ('id', 'name', 'slug', 'price', 'effective_price', 'image', 'created_at')

    def get_image(self, obj):
        primary = obj.product.images.filter(is_primary=True).first() or obj.product.images.first()
        if primary and primary.image:
            return resolve_image_url(primary.image, self.context.get('request'))
        return None

    def create(self, validated_data):
        product_id = validated_data.pop('product_id')
        user = self.context['request'].user
        try:
            from products.models import Product
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            raise serializers.ValidationError({'product_id': 'Product not found.'})
        wishlist_item, created = Wishlist.objects.get_or_create(user=user, product=product)
        return wishlist_item



class UserProfileSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.SerializerMethodField()
    profile_image = serializers.ImageField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = UserProfile
        fields = ('phone_number', 'address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country', 'profile_image', 'profile_image_url')

    def get_profile_image_url(self, obj):
        return resolve_image_url(obj.profile_image, self.context.get('request'))

    def update(self, instance, validated_data):
        profile_image = validated_data.pop('profile_image', None)

        # CloudinaryField uploads the file to Cloudinary on save
        if profile_image:
            instance.profile_image = profile_image

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class UserSerializer(serializers.ModelSerializer):
    # Flatten profile fields directly onto the user object for ease of use on the frontend
    phone_number = serializers.CharField(source='profile.phone_number', read_only=True, default='')
    address_line1 = serializers.CharField(source='profile.address_line1', read_only=True, default='')
    address_line2 = serializers.CharField(source='profile.address_line2', read_only=True, default='')
    city = serializers.CharField(source='profile.city', read_only=True, default='')
    state = serializers.CharField(source='profile.state', read_only=True, default='')
    postal_code = serializers.CharField(source='profile.postal_code', read_only=True, default='')
    country = serializers.CharField(source='profile.country', read_only=True, default='India')
    profile_image_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'email', 'role', 'first_name', 'last_name',
            'phone_number', 'address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country', 'profile_image_url',
        )
        read_only_fields = ('id', 'email', 'role')

    def get_profile_image_url(self, obj):
        if hasattr(obj, 'profile') and obj.profile.profile_image:
            return resolve_image_url(obj.profile.profile_image, self.context.get('request'))
        return None


class RegisterSerializer(serializers.ModelSerializer):
    """Customer-only registration serializer. Role is hardcoded to 'customer'."""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    phone_number = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        # 'role' is intentionally excluded — it is hardcoded to 'customer' in create()
        fields = ('email', 'password', 'first_name', 'last_name', 'phone_number')

    def create(self, validated_data):
        phone_number = validated_data.pop('phone_number', '')

        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            role=User.Role.CUSTOMER,  # Always customer — no client override possible
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )

        UserProfile.objects.create(
            user=user,
            phone_number=phone_number,
        )
        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['role'] = user.role
        token['email'] = user.email
        return token


class AdminTokenObtainPairSerializer(CustomTokenObtainPairSerializer):
    """Enforces that only admin-role users can obtain a token via this serializer."""

    def validate(self, attrs):
        data = super().validate(attrs)
        if self.user.role != 'admin':
            raise serializers.ValidationError(
                {'detail': 'Admin access required. Please use the customer login.'}
            )
        return data


class CustomerTokenObtainPairSerializer(CustomTokenObtainPairSerializer):
    """Enforces that only customer-role users can obtain a token via this serializer."""

    def validate(self, attrs):
        data = super().validate(attrs)
        if self.user.role != 'customer':
            raise serializers.ValidationError(
                {'detail': 'Please use the Admin Login page to access your account.'}
            )
        return data
