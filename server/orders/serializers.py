from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductListSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'size', 'price', 'product_image']
        read_only_fields = ['id', 'product_name', 'price', 'product_image']

    def get_product_image(self, obj):
        if obj.product:
            primary = obj.product.images.filter(is_primary=True).first() or obj.product.images.first()
            if primary and primary.image:
                img_str = str(primary.image)
                if img_str.startswith('http'):
                    return img_str
                if img_str.startswith('/'):
                    request = self.context.get('request')
                    if request:
                        return request.build_absolute_uri(img_str)
                    return f"http://127.0.0.1:8000{img_str}"
                from cloudinary.utils import cloudinary_url
                url, _ = cloudinary_url(img_str, secure=True)
                return url
        return None

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'user_email', 'status', 'shipping_address', 'billing_address',
            'subtotal', 'shipping_cost', 'tax', 'total',
            'items', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'user_email', 'status', 'subtotal', 'shipping_cost', 'tax', 'total',
            'created_at', 'updated_at'
        ]

    def get_user_email(self, obj):
        return obj.user.email if obj.user else None

class CreateOrderItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    size = serializers.CharField(max_length=50, required=False, allow_blank=True)

class CreateOrderSerializer(serializers.Serializer):
    shipping_address = serializers.CharField()
    billing_address = serializers.CharField(required=False, allow_blank=True)
    items = CreateOrderItemSerializer(many=True)
