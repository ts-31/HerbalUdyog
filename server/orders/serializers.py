from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductListSerializer
from users.models import Address


class OrderItemSerializer(serializers.ModelSerializer):
    product_image = serializers.SerializerMethodField()
    product_slug = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_slug', 'product_name', 'quantity', 'size', 'price', 'product_image']
        read_only_fields = ['id', 'product_slug', 'product_name', 'price', 'product_image']

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

    def get_product_slug(self, obj):
        return obj.product.slug if obj.product else None


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


class ShippingAddressInputSerializer(serializers.Serializer):
    label = serializers.CharField(max_length=50, required=False, allow_blank=True)
    full_name = serializers.CharField(max_length=255)
    phone_number = serializers.CharField(max_length=15, required=False, allow_blank=True)
    address_line1 = serializers.CharField(max_length=255)
    address_line2 = serializers.CharField(max_length=255, required=False, allow_blank=True)
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100)
    postal_code = serializers.CharField(max_length=20)
    country = serializers.CharField(max_length=100, required=False, default='India')
    is_default = serializers.BooleanField(required=False, default=False)


class CreateOrderSerializer(serializers.Serializer):
    address_id = serializers.IntegerField(required=False)
    shipping_address = ShippingAddressInputSerializer(required=False)
    save_address = serializers.BooleanField(required=False, default=True)
    items = CreateOrderItemSerializer(many=True)

    def validate(self, attrs):
        address_id = attrs.get('address_id')
        shipping_address = attrs.get('shipping_address')
        if not address_id and not shipping_address:
            raise serializers.ValidationError(
                'Provide either address_id or shipping_address.'
            )
        if address_id and shipping_address:
            raise serializers.ValidationError(
                'Provide either address_id or shipping_address, not both.'
            )
        return attrs

    def resolve_address_snapshot(self, user):
        """Return (snapshot_text, optional Address instance used/created)."""
        data = self.validated_data
        address_id = data.get('address_id')

        if address_id:
            try:
                address = Address.objects.get(pk=address_id, user=user)
            except Address.DoesNotExist:
                raise serializers.ValidationError({'address_id': 'Address not found.'})
            return address.format_snapshot(), address

        addr_data = data['shipping_address']
        save_address = data.get('save_address', True)

        if save_address:
            address = Address.objects.create(user=user, **addr_data)
            return address.format_snapshot(), address

        # One-off snapshot without saving to address book
        parts = [addr_data['full_name']]
        if addr_data.get('phone_number'):
            parts.append(f"Phone: {addr_data['phone_number']}")
        parts.append(addr_data['address_line1'])
        if addr_data.get('address_line2'):
            parts.append(addr_data['address_line2'])
        parts.append(f"{addr_data['city']}, {addr_data['state']} {addr_data['postal_code']}")
        parts.append(addr_data.get('country') or 'India')
        return '\n'.join(parts), None
