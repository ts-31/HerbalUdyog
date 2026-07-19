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

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'description', 'price', 'discount_price', 'effective_price',
            'stock_quantity', 'sku', 'is_active', 'is_featured', 'rating',
            'review_count', 'tags', 'category', 'category_id',
            'images', 'uploaded_images', 'reviews', 'created_at', 'updated_at',
        )
        read_only_fields = ('slug', 'sku', 'rating', 'review_count', 'created_at', 'updated_at')

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
