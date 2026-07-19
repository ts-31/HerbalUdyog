from rest_framework import serializers
from cloudinary.utils import cloudinary_url
from .models import BlogPost, ContactInquiry, Testimonial

class BlogPostSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = ('id', 'title', 'slug', 'excerpt', 'content', 'image', 'image_url', 'author_name', 'is_published', 'created_at')
        extra_kwargs = {
            'image': {'write_only': True}
        }

    def get_image_url(self, obj):
        if obj.image:
            url, _ = cloudinary_url(str(obj.image), secure=True)
            return url
        return None

class ContactInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInquiry
        fields = ('id', 'name', 'email', 'subject', 'message', 'is_resolved', 'created_at')
        read_only_fields = ('id', 'is_resolved', 'created_at')

class TestimonialSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Testimonial
        fields = ('id', 'name', 'role', 'content', 'image', 'image_url', 'rating', 'is_approved', 'created_at')
        extra_kwargs = {
            'image': {'write_only': True}
        }

    def get_image_url(self, obj):
        if obj.image:
            url, _ = cloudinary_url(str(obj.image), secure=True, width=150, crop='fill', gravity='face')
            return url
        return None
