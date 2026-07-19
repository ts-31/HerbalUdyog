import os
import requests
import tempfile
from decimal import Decimal
import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.files import File
from products.models import Category, Product, ProductImage
import cloudinary
import cloudinary.uploader

User = get_user_model()

cloudinary.config(
    cloud_name=settings.CLOUDINARY_STORAGE.get('CLOUD_NAME'),
    api_key=settings.CLOUDINARY_STORAGE.get('API_KEY'),
    api_secret=settings.CLOUDINARY_STORAGE.get('API_SECRET')
)

PRODUCTS = [
  { "name": "Ashwagandha Root Powder", "category": "Ayurvedic Supplements", "brand": "Pure Herbals", "price": 14.99, "img": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=600" },
  { "name": "Organic Turmeric Capsules", "category": "Ayurvedic Supplements", "brand": "Earth's Root", "price": 18.50, "img": "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80&w=600" },
  { "name": "Triphala Digestive Support", "category": "Ayurvedic Supplements", "brand": "AyurCare", "price": 12.99, "img": "https://images.unsplash.com/photo-1576092762791-dd9e2220abd1?auto=format&fit=crop&q=80&w=600" },
  { "name": "Brahmi Mind Wellness", "category": "Ayurvedic Supplements", "brand": "Mindful Herbs", "price": 16.00, "img": "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?auto=format&fit=crop&q=80&w=600" },
  { "name": "Shatavari Extract", "category": "Ayurvedic Supplements", "brand": "Women's Wellness", "price": 21.00, "img": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=600" },
  { "name": "Neem & Tulsi Face Wash", "category": "Personal Care", "brand": "Naturals", "price": 9.99, "img": "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=600" },
  { "name": "Sandalwood Herbal Soap", "category": "Personal Care", "brand": "Heritage Naturals", "price": 5.49, "img": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600" },
  { "name": "Bhringraj Hair Oil", "category": "Personal Care", "brand": "Vedic Roots", "price": 11.99, "img": "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600" },
  { "name": "Rose Water Toner", "category": "Personal Care", "brand": "Floral Essence", "price": 8.50, "img": "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=600" },
  { "name": "Aloe Vera Soothing Gel", "category": "Personal Care", "brand": "Plant Pure", "price": 7.99, "img": "https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&q=80&w=600" },
  { "name": "Mahanarayan Massage Oil", "category": "Massage Oils & Balms", "brand": "Ancient Oils", "price": 24.50, "img": "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600" },
  { "name": "Pain Relief Herbal Balm", "category": "Massage Oils & Balms", "brand": "Soothify", "price": 14.00, "img": "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=600" },
  { "name": "Cold & Congestion Rub", "category": "Massage Oils & Balms", "brand": "Breathe Easy", "price": 9.50, "img": "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?auto=format&fit=crop&q=80&w=600" },
  { "name": "Relaxing Lavender Body Oil", "category": "Massage Oils & Balms", "brand": "Zen Botanicals", "price": 18.00, "img": "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=600" },
  { "name": "Joint Soothe Muscle Rub", "category": "Massage Oils & Balms", "brand": "Active Care", "price": 15.99, "img": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=600" },
  { "name": "Chyawanprash Immunity Booster", "category": "Daily Wellness", "brand": "Vedic Essentials", "price": 22.00, "img": "https://images.unsplash.com/photo-1576092762791-dd9e2220abd1?auto=format&fit=crop&q=80&w=600" },
  { "name": "Tulsi Green Tea", "category": "Daily Wellness", "brand": "Sacred Leaves", "price": 6.99, "img": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600" },
  { "name": "Amla Vitamin C Drops", "category": "Daily Wellness", "brand": "Nature's C", "price": 13.50, "img": "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80&w=600" },
  { "name": "Digestive Herbal Infusion", "category": "Daily Wellness", "brand": "Gut Health", "price": 8.99, "img": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600" },
  { "name": "Sleep Well Night Tea", "category": "Daily Wellness", "brand": "Restful Herbals", "price": 7.50, "img": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600" },
  { "name": "Liver Care Herbal Syrup", "category": "Herbal Formulations", "brand": "Detoxify", "price": 19.99, "img": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=600" },
  { "name": "Blood Purifier Elixir", "category": "Herbal Formulations", "brand": "Pure Blood", "price": 17.50, "img": "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600" },
  { "name": "Respiratory Support Blend", "category": "Herbal Formulations", "brand": "Clear Lungs", "price": 23.00, "img": "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?auto=format&fit=crop&q=80&w=600" },
  { "name": "Women's Health Tonic", "category": "Herbal Formulations", "brand": "Femina Flora", "price": 20.00, "img": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=600" },
  { "name": "Vitality Men's Extract", "category": "Herbal Formulations", "brand": "Vigor Roots", "price": 21.50, "img": "https://images.unsplash.com/photo-1512485800893-b08ec1ea59b1?auto=format&fit=crop&q=80&w=600" },
]

class Command(BaseCommand):
    help = 'Seeds the database with categories and products.'

    def handle(self, *args, **options):
        self.stdout.write('Seeding data...')
        
        # 1. Create Admin User
        admin_email = os.environ.get('SEED_ADMIN_EMAIL', 'admin@herbaludyog.com')
        admin_pass = os.environ.get('SEED_ADMIN_PASSWORD', 'Admin@123')
        if not User.objects.filter(email=admin_email).exists():
            admin = User.objects.create_superuser(
                email=admin_email,
                password=admin_pass,
                first_name='Admin',
                last_name='User'
            )
            self.stdout.write(self.style.SUCCESS(f'Created admin user: {admin_email}'))
        else:
            admin = User.objects.get(email=admin_email)
            self.stdout.write(self.style.SUCCESS(f'Admin user already exists: {admin_email}'))

        # 2. Create Categories
        category_names = list(set([p['category'] for p in PRODUCTS]))
        categories = {}
        for name in category_names:
            cat, created = Category.objects.get_or_create(
                name=name,
                defaults={'description': f'Explore our premium {name}.'}
            )
            categories[name] = cat
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created category: {name}'))

        # 3. Create Products and Upload Images
        for p_data in PRODUCTS:
            product, created = Product.objects.get_or_create(
                name=p_data['name'],
                defaults={
                    'category': categories[p_data['category']],
                    'created_by': admin,
                    'description': f"Premium {p_data['name']} brought to you by {p_data['brand']}. 100% natural and organic.",
                    'price': Decimal(str(round(p_data['price'] * 80, 2))),  # Convert USD to INR
                    'stock_quantity': random.randint(10, 100),
                    'is_active': True,
                    'rating': Decimal(str(round(random.uniform(4.0, 5.0), 1))),
                    'review_count': random.randint(10, 300),
                    'tags': f"{p_data['category']}, {p_data['brand']}, organic"
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created product: {product.name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Product already exists: {product.name}'))
                
            # Upload image to Cloudinary if no images exist
            if not product.images.exists():
                self.stdout.write(f"Uploading image for {product.name}...")
                try:
                    # Download image to a temporary file
                    response = requests.get(p_data['img'], stream=True)
                    response.raise_for_status()
                    
                    fd, temp_path = tempfile.mkstemp(suffix='.jpg')
                    with os.fdopen(fd, 'wb') as f:
                        for chunk in response.iter_content(chunk_size=8192):
                            f.write(chunk)
                            
                    with open(temp_path, 'rb') as f:
                        # Use CloudinaryField to save. ProductImage model expects a File.
                        # We can also use cloudinary uploader and save the string path.
                        upload_result = cloudinary.uploader.upload(f, folder="herbaludyog/products")
                        
                        ProductImage.objects.create(
                            product=product,
                            image=upload_result['public_id'],
                            is_primary=True,
                            alt_text=product.name
                        )
                    os.remove(temp_path)
                    self.stdout.write(self.style.SUCCESS(f'Successfully uploaded image for {product.name}'))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Failed to upload image for {product.name}: {str(e)}'))

        self.stdout.write(self.style.SUCCESS('Successfully seeded data!'))
