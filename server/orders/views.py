from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction
from django.shortcuts import get_object_or_404
from decimal import Decimal

from .models import Order, OrderItem
from products.models import Product
from .serializers import OrderSerializer, CreateOrderSerializer
from users.permissions import IsCustomer

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(user=user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        # Only customers can create orders directly
        if request.user.role != 'customer':
            return Response({"detail": "Only customers can place orders."}, status=status.HTTP_403_FORBIDDEN)
            
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        items_data = data.pop('items')
        
        if not items_data:
            return Response({"detail": "Order must contain at least one item."}, status=status.HTTP_400_BAD_REQUEST)
            
        subtotal = Decimal('0.00')
        order_items_to_create = []
        
        try:
            with transaction.atomic():
                # 1. Create the Order shell
                order = Order.objects.create(
                    user=request.user,
                    shipping_address=data['shipping_address'],
                    billing_address=data.get('billing_address', ''),
                    subtotal=0,
                    shipping_cost=0,
                    tax=0,
                    total=0
                )
                
                # 2. Process items
                for item_data in items_data:
                    product = get_object_or_404(Product, id=item_data['product_id'])
                    
                    # Assuming basic price calculation based on effective_price
                    price = product.effective_price
                    quantity = item_data['quantity']
                    
                    item_total = price * quantity
                    subtotal += item_total
                    
                    order_items_to_create.append(
                        OrderItem(
                            order=order,
                            product=product,
                            product_name=product.name,
                            quantity=quantity,
                            size=item_data.get('size', ''),
                            price=price
                        )
                    )
                
                # Bulk create items
                OrderItem.objects.bulk_create(order_items_to_create)
                
                # 3. Calculate final totals (e.g., flat $50 shipping, 5% tax)
                shipping_cost = Decimal('50.00')
                tax = subtotal * Decimal('0.05')
                total = subtotal + shipping_cost + tax
                
                order.subtotal = subtotal
                order.shipping_cost = shipping_cost
                order.tax = tax
                order.total = total
                order.save()
                
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Return the fully serialized order
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAdminUser])
    def update_status(self, request, pk=None):
        """Allow admins to update order status"""
        order = self.get_object()
        new_status = request.data.get('status')
        if not new_status or new_status not in dict(Order.STATUS_CHOICES):
            return Response({"detail": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
            
        order.status = new_status
        order.save()
        return Response(OrderSerializer(order).data)
