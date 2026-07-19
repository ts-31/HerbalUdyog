from django.db import models
from django.utils.text import slugify
from cloudinary.models import CloudinaryField

class BlogPost(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    excerpt = models.TextField()
    content = models.TextField()
    image = CloudinaryField('image', blank=True, null=True)
    author_name = models.CharField(max_length=255, default='HerbalUdyog Team')
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class ContactInquiry(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.subject} by {self.name}"

class Testimonial(models.Model):
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField()
    image = CloudinaryField('image', blank=True, null=True)
    rating = models.PositiveIntegerField(default=5)
    is_approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Testimonial by {self.name}"
