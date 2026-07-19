from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogPostViewSet, ContactInquiryViewSet, TestimonialViewSet

router = DefaultRouter()
router.register(r'blog', BlogPostViewSet, basename='blog')
router.register(r'contact', ContactInquiryViewSet, basename='contact')
router.register(r'testimonials', TestimonialViewSet, basename='testimonial')

urlpatterns = [
    path('', include(router.urls)),
]
