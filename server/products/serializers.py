from rest_framework import serializers
from cloudinary.utils import cloudinary_url
from .models import Category, Product, ProductImage, Review


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ('id', 'user', 'user_name', 'rating', 'comment', 'created_at')
        read_only_fields = ('id', 'user', 'user_name', 'created_at')

    def get_user_name(self, obj):
        if obj.user.first_name:
            return f"{obj.user.first_name} {obj.user.last_name}".strip()
        return obj.user.email.split('@')[0]

    def validate_comment(self, value):
        text = (value or '').strip()
        if len(text) < 10:
            raise serializers.ValidationError('Review comment must be at least 10 characters.')
        return text

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value


class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ('id', 'image', 'image_url', 'alt_text', 'is_primary', 'order')
        extra_kwargs = {'image': {'write_only': True}}

    def get_image_url(self, obj):
        if obj.image:
            img_str = str(obj.image)
            if img_str.startswith('http'):
                return img_str
            if img_str.startswith('/'):
                import os
                from django.conf import settings
                # Extract relative path from media URL
                media_url_clean = settings.MEDIA_URL.lstrip('/')
                relative_path = img_str
                if relative_path.startswith('/'):
                    relative_path = relative_path[1:]
                if relative_path.startswith(media_url_clean):
                    relative_path = relative_path[len(media_url_clean):].lstrip('/')
                
                full_path = os.path.join(settings.MEDIA_ROOT, relative_path)
                if os.path.exists(full_path):
                    request = self.context.get('request')
                    if request:
                        return request.build_absolute_uri(img_str)
                    return f"http://127.0.0.1:8000{img_str}"
            url, _ = cloudinary_url(img_str, secure=True)
            return url
        return None


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'description', 'image', 'image_url', 'product_count')
        extra_kwargs = {
            'slug': {'required': False},
            'image': {'write_only': True},
        }

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()

    def get_image_url(self, obj):
        if obj.image:
            img_str = str(obj.image)
            if img_str.startswith('http'):
                return img_str
            if img_str.startswith('/'):
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(img_str)
                return f"http://127.0.0.1:8000{img_str}"
            url, _ = cloudinary_url(img_str, secure=True)
            return url
        return None


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for product listings — optimized for React catalog pages."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    primary_image = serializers.SerializerMethodField()
    effective_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'price', 'discount_price', 'effective_price',
            'is_featured', 'rating', 'review_count', 'stock_quantity',
            'category_name', 'category_slug', 'primary_image',
        )

    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if not primary:
            primary = obj.images.first()
        if primary and primary.image:
            img_str = str(primary.image)
            if img_str.startswith('http'):
                return img_str
            if img_str.startswith('/'):
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(img_str)
                return f"http://127.0.0.1:8000{img_str}"
            url, _ = cloudinary_url(img_str, secure=True, width=600, crop='fill')
            return url
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full serializer for a single product detail page."""
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )
    effective_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    user_has_reviewed = serializers.SerializerMethodField()
    user_can_review = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'description', 'price', 'discount_price', 'effective_price',
            'stock_quantity', 'sku', 'is_active', 'is_featured', 'rating',
            'review_count', 'tags', 'category', 'category_id',
            'images', 'uploaded_images', 'reviews', 'user_has_reviewed', 'user_can_review',
            'created_at', 'updated_at',
        )
        read_only_fields = ('slug', 'sku', 'rating', 'review_count', 'created_at', 'updated_at')

    def get_user_has_reviewed(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        if getattr(request.user, 'role', None) != 'customer':
            return False
        # Use prefetched reviews when available
        reviews = getattr(obj, '_prefetched_objects_cache', {}).get('reviews')
        if reviews is not None:
            return any(r.user_id == request.user.id for r in reviews)
        return obj.reviews.filter(user=request.user).exists()

    def get_user_can_review(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        if getattr(request.user, 'role', None) != 'customer':
            return False
        from orders.models import OrderItem
        return OrderItem.objects.filter(
            order__user=request.user,
            order__status='delivered',
            product=obj,
        ).exists()

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        request = self.context.get('request')
        validated_data['created_by'] = request.user
        product = Product.objects.create(**validated_data)

        for i, image_file in enumerate(uploaded_images):
            ProductImage.objects.create(
                product=product,
                image=image_file,
                is_primary=(i == 0),
                order=i,
            )
        return product

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        product = super().update(instance, validated_data)

        for i, image_file in enumerate(uploaded_images):
            ProductImage.objects.create(
                product=product,
                image=image_file,
                is_primary=False,
                order=product.images.count() + i,
            )
        return product
