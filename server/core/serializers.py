from rest_framework import serializers
from cloudinary.utils import cloudinary_url
from .models import BlogPost, ContactInquiry, Testimonial


def resolve_image_url(image_value, request=None, cloudinary_kwargs=None):
    """Resolve CharField image values: http URL, /media path, or Cloudinary public ID."""
    if not image_value:
        return None
    img_str = str(image_value)
    if img_str.startswith('http'):
        return img_str
    if img_str.startswith('/'):
        if request:
            return request.build_absolute_uri(img_str)
        return f"http://127.0.0.1:8000{img_str}"
    try:
        kwargs = cloudinary_kwargs or {}
        url, _ = cloudinary_url(img_str, secure=True, **kwargs)
        return url
    except Exception:
        return None


class BlogPostSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = ('id', 'title', 'slug', 'excerpt', 'content', 'image', 'image_url', 'author_name', 'is_published', 'created_at')
        extra_kwargs = {
            'image': {'write_only': True}
        }

    def get_image_url(self, obj):
        return resolve_image_url(obj.image, self.context.get('request'))


class ContactInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInquiry
        fields = ('id', 'name', 'email', 'subject', 'message', 'is_resolved', 'created_at')
        read_only_fields = ('id', 'is_resolved', 'created_at')


class TestimonialSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField()
    user_profile_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Testimonial
        fields = ('id', 'user', 'user_email', 'user_profile_image_url', 'name', 'content', 'rating', 'is_approved', 'created_at')
        extra_kwargs = {
            'user': {'read_only': True}
        }

    def get_user_email(self, obj):
        return obj.user.email if obj.user else None

    def get_user_profile_image_url(self, obj):
        if hasattr(obj.user, 'profile') and obj.user.profile.profile_image:
            return resolve_image_url(
                obj.user.profile.profile_image,
                self.context.get('request'),
                cloudinary_kwargs={'width': 150, 'crop': 'fill', 'gravity': 'face'},
            )
        return None

    def validate_content(self, value):
        if len(value) < 50:
            raise serializers.ValidationError("Testimonial must be at least 50 characters.")
        if len(value) > 500:
            raise serializers.ValidationError("Testimonial must not exceed 500 characters.")
        return value

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value
