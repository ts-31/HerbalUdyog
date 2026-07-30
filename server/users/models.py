from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _
from cloudinary.models import CloudinaryField

class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """
    def create_user(self, email, password, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'admin', _('Admin')
        CUSTOMER = 'customer', _('Customer')

    username = None
    email = models.EmailField(_('email address'), unique=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CUSTOMER
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=15, blank=True)
    address_line1 = models.CharField(max_length=255, blank=True)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True, default='India')
    profile_image = CloudinaryField('image', folder='profile_images', blank=True, null=True)

    def __str__(self):
        return f"{self.user.email}'s Profile"


class Address(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='addresses')
    label = models.CharField(max_length=50, blank=True)
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15, blank=True)
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default='India')
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_default', '-updated_at']
        verbose_name_plural = 'Addresses'

    def __str__(self):
        return f"{self.full_name} — {self.address_line1} ({self.user.email})"

    def format_snapshot(self):
        """Build a multi-line text snapshot for order shipping/billing fields."""
        parts = [self.full_name]
        if self.phone_number:
            parts.append(f"Phone: {self.phone_number}")
        parts.append(self.address_line1)
        if self.address_line2:
            parts.append(self.address_line2)
        parts.append(f"{self.city}, {self.state} {self.postal_code}")
        parts.append(self.country)
        return '\n'.join(parts)

    def sync_to_profile(self):
        profile, _ = UserProfile.objects.get_or_create(user=self.user)
        profile.phone_number = self.phone_number or profile.phone_number
        profile.address_line1 = self.address_line1
        profile.address_line2 = self.address_line2
        profile.city = self.city
        profile.state = self.state
        profile.postal_code = self.postal_code
        profile.country = self.country
        profile.save()

    def save(self, *args, **kwargs):
        # First address for a user becomes default
        if not self.pk and not self.user.addresses.exists():
            self.is_default = True

        super().save(*args, **kwargs)

        if self.is_default:
            Address.objects.filter(user=self.user, is_default=True).exclude(pk=self.pk).update(is_default=False)
            self.sync_to_profile()

    def delete(self, *args, **kwargs):
        was_default = self.is_default
        user = self.user
        super().delete(*args, **kwargs)
        if was_default:
            next_addr = Address.objects.filter(user=user).first()
            if next_addr:
                next_addr.is_default = True
                next_addr.save()


class Wishlist(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='wishlist')
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE, related_name='wishlisted_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} → {self.product.name}"
