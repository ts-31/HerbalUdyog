from rest_framework import viewsets, permissions, mixins
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import BlogPost, ContactInquiry, Testimonial
from .serializers import BlogPostSerializer, ContactInquirySerializer, TestimonialSerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.filter(is_published=True)
    serializer_class = BlogPostSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == 'admin':
            return BlogPost.objects.all()
        return BlogPost.objects.filter(is_published=True)

class ContactInquiryViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    queryset = ContactInquiry.objects.all()
    serializer_class = ContactInquirySerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.filter(is_approved=True)
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == 'admin':
            return Testimonial.objects.all()
        return Testimonial.objects.filter(is_approved=True)
