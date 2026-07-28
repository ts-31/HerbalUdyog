import os
import shutil
from decimal import Decimal
import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.conf import settings
from products.models import Category, Product, ProductImage, Review
from core.models import BlogPost, ContactInquiry, Testimonial
from users.models import UserProfile, Wishlist
from orders.models import Order, OrderItem

User = get_user_model()

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

SEED_ASSETS = settings.BASE_DIR / 'seed_assets'

SUPPLEMENT_IMAGES = [
    'ayurvedic_supplement_texture_1784450920726.png',
    'ayurvedic_supplement_lifestyle_1784450933663.png',
    'ayurvedic_supplement_angle_1784450944729.png',
]
CARE_IMAGES = [
    'personal_care_texture_1784450962734.png',
    'personal_care_lifestyle_1784450973672.png',
    'personal_care_angle_1784450984689.png',
]
CATEGORY_TO_SUPP = {
    'Ayurvedic Supplements': SUPPLEMENT_IMAGES,
    'Daily Wellness': SUPPLEMENT_IMAGES,
    'Herbal Formulations': SUPPLEMENT_IMAGES,
    'Personal Care': CARE_IMAGES,
    'Massage Oils & Balms': CARE_IMAGES,
}


class Command(BaseCommand):
    help = 'Seeds categories, products, customer profiles, reviews, blogs, testimonials, inquiries, wishlists, and orders.'

    def _copy_seed_assets(self):
        for folder in ('products', 'blogs', 'testimonials'):
            src = SEED_ASSETS / folder
            dest = settings.MEDIA_ROOT / folder
            if not src.exists():
                self.stdout.write(self.style.WARNING(f'Seed assets missing: {src}'))
                continue
            dest.mkdir(parents=True, exist_ok=True)
            for filename in os.listdir(src):
                shutil.copy2(src / filename, dest / filename)
            self.stdout.write(self.style.SUCCESS(f'Copied seed assets: {folder}/'))

    def handle(self, *args, **options):
        self.stdout.write('Seeding data...')
        self._copy_seed_assets()

        # 1. Create or verify Admin User
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
            admin.role = 'admin'
            admin.is_staff = True
            admin.is_superuser = True
            admin.save()
            self.stdout.write(self.style.SUCCESS(f'Admin user verified: {admin_email}'))

        # 2. Create customer users
        customers_data = [
            {"email": "alice@example.com", "first_name": "Alice", "last_name": "Smith", "phone": "9876543211", "city": "Delhi"},
            {"email": "bob@example.com", "first_name": "Bob", "last_name": "Johnson", "phone": "9876543212", "city": "Mumbai"},
            {"email": "charlie@example.com", "first_name": "Charlie", "last_name": "Davis", "phone": "9876543213", "city": "Bangalore"}
        ]

        seeded_customers = []
        for c_info in customers_data:
            c_user, created = User.objects.get_or_create(
                email=c_info['email'],
                defaults={
                    'first_name': c_info['first_name'],
                    'last_name': c_info['last_name'],
                    'role': 'customer',
                    'is_active': True
                }
            )
            if created:
                c_user.set_password('Customer@123')
                c_user.save()
                self.stdout.write(self.style.SUCCESS(f"Created customer user: {c_info['email']}"))

            profile, _ = UserProfile.objects.get_or_create(user=c_user)
            profile.phone_number = c_info['phone']
            profile.address_line1 = f"123 Street, {c_info['city']}"
            profile.city = c_info['city']
            profile.state = "Karnataka" if c_info['city'] == "Bangalore" else "Maharashtra" if c_info['city'] == "Mumbai" else "Delhi"
            profile.postal_code = "560001" if c_info['city'] == "Bangalore" else "400001" if c_info['city'] == "Mumbai" else "110001"
            profile.country = "India"
            profile.save()

            seeded_customers.append(c_user)

        # 3. Create Categories
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

        # 4. Create Products and Attach Images
        seeded_products = []
        for p_data in PRODUCTS:
            product, created = Product.objects.get_or_create(
                name=p_data['name'],
                defaults={
                    'category': categories[p_data['category']],
                    'created_by': admin,
                    'description': f"Premium {p_data['name']} brought to you by {p_data['brand']}. 100% natural and organic. Formulated with authentic herbal extracts gathered sustainably.",
                    'price': Decimal(str(round(p_data['price'] * 80, 2))),
                    'stock_quantity': random.randint(30, 150),
                    'is_active': True,
                    'rating': Decimal('5.0'),
                    'review_count': 0,
                    'tags': f"{p_data['category']}, {p_data['brand']}, organic"
                }
            )
            seeded_products.append(product)

            if created:
                self.stdout.write(self.style.SUCCESS(f'Created product: {product.name}'))

            if not product.images.exists():
                images_to_upload = [(p_data['img'], True)]
                supp_imgs = CATEGORY_TO_SUPP.get(p_data['category'], SUPPLEMENT_IMAGES)
                for filename in supp_imgs:
                    images_to_upload.append((f"/media/products/{filename}", False))

                for idx, (img_src, is_primary) in enumerate(images_to_upload):
                    try:
                        ProductImage.objects.create(
                            product=product,
                            image=img_src,
                            is_primary=is_primary,
                            order=idx,
                            alt_text=f"{product.name} image {idx + 1}"
                        )
                    except Exception as e:
                        self.stdout.write(self.style.ERROR(f'  -> Failed to attach image {idx+1}: {str(e)}'))

        # 5. Seed Product Reviews & Recalculate Product Ratings
        review_comments = [
            "Excellent quality, noticed a difference within a few days of using it!",
            "Really authentic herbal formulation. Worth the price.",
            "Fully organic product. Will definitely buy again.",
            "Fast shipping and nice packaging. Satisfied with the results.",
            "Good product but taste is slightly bitter. Works effectively though."
        ]

        for prod in seeded_products:
            reviewers = random.sample(seeded_customers, 2)
            ratings = []
            for reviewer in reviewers:
                rating_val = random.choice([4, 5])
                ratings.append(rating_val)
                Review.objects.get_or_create(
                    product=prod,
                    user=reviewer,
                    defaults={
                        'rating': rating_val,
                        'comment': random.choice(review_comments)
                    }
                )

            prod.review_count = prod.reviews.count()
            prod.rating = Decimal(str(round(sum(ratings) / len(ratings), 1)))
            prod.save()

        # 6. Seed Blog Posts
        blogs_data = [
            {
                "title": "The Power of Ashwagandha Root",
                "excerpt": "Discover how Ashwagandha (Withania somnifera) works as an adaptogen to regulate cortisol levels and restore vital mental clarity.",
                "content": "Ashwagandha has been a cornerstone of Ayurvedic medicine for over 3,000 years. Classified as a Rasayana (rejuvenator), it supports overall vitality. In today's fast-paced environment, chronic stress elevates cortisol levels, triggering anxiety, brain fog, and fatigue. Modern scientific research confirms that Ashwagandha root extract aids in lowering blood pressure, regulating body stress responses, and improving restful sleep cycles. Read on for a complete guide on how to integrate Ashwagandha root powder safely into your morning smoothies or warm milk routines.",
                "image": "/media/blogs/ashwagandha_root.jpg"
            },
            {
                "title": "5 Ways to Boost Immunity",
                "excerpt": "Monsoons bring refreshing rains but also seasonal bugs. Stay healthy naturally with these simple Ayurvedic guidelines.",
                "content": "As seasons shift, our body's digestive fire (Agni) fluctuates, making us susceptible to viruses and infections. Ayurveda emphasizes preventive health care. Start by sipping warm Tulsi and ginger tea throughout the day to boost metabolism and clear respiratory pathways. Introduce organic Turmeric capsules rich in Curcumin to lower inflammatory markers. Incorporate daily breathing exercises (Pranayama) to expand lung capacity and detoxify blood naturally. Explore our organic wellness catalog for pure extracts prepared with traditional copper-pot methods.",
                "image": "/media/blogs/immunity_boost.jpg"
            },
            {
                "title": "Understanding Curcumin",
                "excerpt": "Turmeric is more than a kitchen spice. Learn how Curcumin acts as a powerful anti-inflammatory and cellular antioxidant.",
                "content": "Curcumin is the yellow pigment found in turmeric roots that gives this wonder spice its potent medicinal properties. While raw turmeric contains 3% curcumin by weight, concentrated organic capsules provide direct cellular bio-availability. To enhance curcumin absorption, Ayurveda recommends consuming it alongside black pepper (piperine) and healthy fats like pure A2 Ghee. Regular intake helps lubricate joint tissues, promotes clear skin, and supports heart health by property protecting arterial lining from oxidative stress.",
                "image": "/media/blogs/curcumin_turmeric.jpg"
            },
            {
                "title": "Neem for Clear Skin",
                "excerpt": "Neem (Azadirachta indica) has been used for centuries in Ayurveda to purify blood and calm inflammatory skin conditions.",
                "content": "Neem is often called the village pharmacy of India for good reason. Its bitter leaves and oil are rich in nimbin and azadirachtin compounds that help cleanse the blood and support clear, balanced skin. Traditional Ayurvedic routines recommend neem leaf paste for occasional breakouts, while diluted neem face washes gently remove excess oil without stripping the skin barrier. Pair topical care with internal support — warm neem tea in moderation or certified herbal formulations — and keep meals light when Kapha is elevated. Consistency, not harsh scrubbing, is what brings lasting glow.",
                "image": "/media/blogs/neem_clear_skin.jpg"
            },
            {
                "title": "Why Triphala Still Matters",
                "excerpt": "The classic three-fruit formula remains one of Ayurveda's most trusted daily digestive tonics.",
                "content": "Triphala combines Amalaki, Haritaki, and Bibhitaki — three fruits that together balance Vata, Pitta, and Kapha while gently supporting elimination and gut resilience. Unlike harsh laxatives, Triphala works as a Rasayana: it nourishes while it cleanses. Modern herbalists often recommend taking Triphala powder with warm water at night, or capsules after meals, depending on constitution. Look for organically grown, traditionally processed blends without fillers. Over weeks of steady use, many people notice more comfortable digestion, clearer skin, and steadier energy — reminders that gut health sits at the center of Ayurvedic wellbeing.",
                "image": "/media/blogs/triphala_matters.jpg"
            },
            {
                "title": "Morning Rituals with Tulsi Tea",
                "excerpt": "Start the day with holy basil — a simple cup that steadies the mind and opens the breath.",
                "content": "Tulsi, or holy basil, is revered in Ayurveda as an adaptogenic herb that supports calm focus and respiratory ease. A morning cup of Tulsi green tea is an easy ritual: steep fresh or dried leaves in hot (not boiling) water for 5–7 minutes, optionally with a slice of ginger. Sip slowly before checking your phone. This small pause signals the nervous system to settle while antioxidants and aromatic oils begin their work. For deeper support through cold seasons, rotate Tulsi with turmeric-ginger infusions and keep the habit daily. Ritual is medicine — the herb works best when the mind arrives with it.",
                "image": "/media/blogs/tulsi_morning_ritual.jpg"
            }
        ]

        for b_info in blogs_data:
            post, created = BlogPost.objects.get_or_create(
                title=b_info['title'],
                defaults={
                    'excerpt': b_info['excerpt'],
                    'content': b_info['content'],
                    'author_name': 'Dr. Rohan Sharma, AyurVeda Expert',
                    'is_published': True,
                    'image': b_info['image']
                }
            )
            if not created:
                post.image = b_info['image']
                post.excerpt = b_info['excerpt']
                post.content = b_info['content']
                post.is_published = True
                post.save()
            self.stdout.write(self.style.SUCCESS(f"{'Created' if created else 'Updated'} blog: {b_info['title']}"))

        # 7. Seed Testimonials
        testimonials_data = [
            {
                "name": "Meera Iyer",
                "role": "Ayurveda Practitioner",
                "content": "HerbalUdyog's Ashwagandha root powder is the most authentic I have ever used. Highly recommend their organic extracts!",
                "rating": 5,
                "is_approved": True,
                "image": "/media/testimonials/meera_iyer.jpg",
            },
            {
                "name": "David Miller",
                "role": "Daily Wellness Enthusiast",
                "content": "The Triphala digestive support capsules completely resolved my bloating issue. Pure quality ingredients.",
                "rating": 5,
                "is_approved": True,
                "image": "/media/testimonials/david_miller.jpg",
            },
            {
                "name": "Sonia Gupta",
                "role": "Organic Lifestyle Blogger",
                "content": "I love their commitment to clean packaging and sustainable sourcing directly from local farmers.",
                "rating": 4,
                "is_approved": True,
                "image": "/media/testimonials/sonia_gupta.jpg",
            },
            {
                "name": "Rajesh Nair",
                "role": "Software Engineer",
                "content": "Decent products, but shipment took two extra days. The turmeric capsules are excellent though.",
                "rating": 4,
                "is_approved": False,
                "image": "/media/testimonials/rajesh_nair.jpg",
            },
        ]

        for t_info in testimonials_data:
            testimonial, created = Testimonial.objects.get_or_create(
                name=t_info['name'],
                content=t_info['content'],
                defaults={
                    'role': t_info['role'],
                    'rating': t_info['rating'],
                    'is_approved': t_info['is_approved'],
                    'image': t_info['image'],
                }
            )
            if not created and not testimonial.image:
                testimonial.image = t_info['image']
                testimonial.save()
            self.stdout.write(self.style.SUCCESS(f"{'Created' if created else 'Updated'} testimonial: {t_info['name']}"))

        # 8. Seed Contact Inquiries
        inquiries_data = [
            {"name": "Suresh Patel", "email": "suresh@inquiry.com", "subject": "Bulk Sourcing for Organic Herbs", "message": "Hello, I run a wellness retreat in Kerala and would like to source Ashwagandha and Turmeric powder in bulk quantities. Please send your catalog and price sheets.", "is_resolved": False},
            {"name": "Vikram Rathore", "email": "vikram@gmail.com", "subject": "Shipping Delay Order #1004", "message": "My order has been processing for 4 days. Could you please update me on the delivery status?", "is_resolved": False},
            {"name": "Ananya Sen", "email": "ananya@live.com", "subject": "Product Shelf Life Query", "message": "Are your massage oils cold-pressed? What is the expected shelf life after opening?", "is_resolved": True}
        ]

        for i_info in inquiries_data:
            ContactInquiry.objects.get_or_create(
                name=i_info['name'],
                email=i_info['email'],
                subject=i_info['subject'],
                defaults={
                    'message': i_info['message'],
                    'is_resolved': i_info['is_resolved']
                }
            )

        # 9. Seed Wishlist
        for cust in seeded_customers:
            products_to_wishlist = random.sample(seeded_products, 2)
            for p in products_to_wishlist:
                Wishlist.objects.get_or_create(user=cust, product=p)

        # 10. Seed Orders & OrderItems (skip if customer already has orders)
        statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
        addresses = [
            "Flat 402, Lotus Greens, Noida Sector 150, Uttar Pradesh - 201301",
            "12/A Park Street, Ground Floor, Kolkata, West Bengal - 700016",
            "Plot No. 45, Jubilee Hills Rd 3, Hyderabad, Telangana - 500033"
        ]

        for cust in seeded_customers:
            if Order.objects.filter(user=cust).exists():
                self.stdout.write(self.style.WARNING(f'Skipping orders for {cust.email} (already has orders)'))
                continue

            for _ in range(2):
                order_status = random.choice(statuses)
                ordered_products = random.sample(seeded_products, random.randint(1, 3))

                subtotal = sum(p.price for p in ordered_products)
                shipping_cost = Decimal('50.00') if subtotal < 1000 else Decimal('0.00')
                tax = Decimal(str(round(float(subtotal) * 0.05, 2)))
                total = subtotal + shipping_cost + tax

                order = Order.objects.create(
                    user=cust,
                    status=order_status,
                    shipping_address=random.choice(addresses),
                    billing_address="",
                    subtotal=subtotal,
                    shipping_cost=shipping_cost,
                    tax=tax,
                    total=total
                )

                for prod in ordered_products:
                    OrderItem.objects.create(
                        order=order,
                        product=prod,
                        product_name=prod.name,
                        quantity=random.choice([1, 2]),
                        size=random.choice(["100g", "250g", "500g"]),
                        price=prod.price
                    )

        self.stdout.write(self.style.SUCCESS('Successfully seeded complete dataset!'))
