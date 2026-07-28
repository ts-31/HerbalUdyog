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
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Testimonial
        fields = ('id', 'name', 'role', 'content', 'image', 'image_url', 'rating', 'is_approved', 'created_at')
        extra_kwargs = {
            'image': {'write_only': True}
        }

    def get_image_url(self, obj):
        return resolve_image_url(
            obj.image,
            self.context.get('request'),
            cloudinary_kwargs={'width': 150, 'crop': 'fill', 'gravity': 'face'},
        )
