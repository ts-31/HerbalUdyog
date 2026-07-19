from rest_framework import viewsets, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response

from .models import Category, Product
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ReviewSerializer
)
from .filters import ProductFilter
from .permissions import IsAdminOrReadOnly
from rest_framework.decorators import action
from rest_framework import permissions


class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Category CRUD.
    - GET (list/retrieve): open to all
    - POST/PUT/PATCH/DELETE: Admin only
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Product CRUD with filtering, searching, ordering, and pagination.
    - GET (list/retrieve): open to all, only active products
    - POST/PUT/PATCH/DELETE: Admin only
    """
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'tags', 'category__name']
    ordering_fields = ['price', 'created_at', 'rating', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        # Admins can see all products; others only see active ones
        user = self.request.user
        if user.is_authenticated and user.role == 'admin':
            return Product.objects.select_related('category').prefetch_related('images').all()
        return Product.objects.select_related('category').prefetch_related('images').filter(is_active=True)

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        return ProductDetailSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def add_review(self, request, slug=None):
        product = self.get_object()
        user = request.user
        
        # Only customers should review products
        if user.role != 'customer':
            return Response({"detail": "Only customers can leave reviews."}, status=status.HTTP_403_FORBIDDEN)
            
        if product.reviews.filter(user=user).exists():
            return Response({"detail": "You have already reviewed this product."}, status=status.HTTP_400_BAD_REQUEST)
            
        serializer = ReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Save review
        serializer.save(product=product, user=user)
        
        # Update product rating
        reviews = product.reviews.all()
        new_rating = sum(r.rating for r in reviews) / reviews.count()
        product.rating = new_rating
        product.review_count = reviews.count()
        product.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
