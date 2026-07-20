<div align="center">
  <img src="./client/public/favicon.png" alt="HerbalUdyog Logo" width="120" />
  <h1>HerbalUdyog — Organic Wellness Marketplace</h1>
  <p>A full-stack, premium e-commerce platform dedicated to sustainable, organic, and locally-sourced wellness products.</p>
  
  [![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
  [![Django](https://img.shields.io/badge/Django-6.0-green.svg)](https://www.djangoproject.com/)
  [![Neon](https://img.shields.io/badge/Neon-PostgreSQL-0CC4E8.svg)](https://neon.tech/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  
  **[🚀 Live Demo](https://herbal-udyog.vercel.app/)**
  
</div>

---

## 📖 Overview

**HerbalUdyog** is a production-ready, full-stack e-commerce application built to bridge the gap between independent organic farmers and health-conscious consumers. The platform features a complete shopping experience with dynamic product browsing, secure authentication, order management, and a comprehensive administrative dashboard.

Built with modern technologies and best practices, this project demonstrates expertise in building scalable, maintainable, and user-centric web applications with advanced features like role-based access control, real-time cart management, and cloud-native architecture.

---

## ✨ Key Features

### 🛍️ Customer Experience
- **Immersive Marketplace**: Advanced product filtering, categorization, and search with smooth micro-animations
- **Secure Authentication**: JWT-based authentication with custom user model (email-based)
- **Smart Cart System**: Persistent cart drawer with real-time total calculation and quantity management
- **User Dashboard**: Profile management, order history tracking, and wishlist functionality
- **Product Reviews**: Customer rating and review system with automatic rating aggregation
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Blog & Content**: Wellness articles and customer testimonials

### ⚙️ Admin Dashboard
- **Role-Based Access Control**: Secure admin panel with dedicated authentication
- **Product Management**: Full CRUD operations with multi-image support (up to 4 images per product)
- **Category Management**: Organize products with hierarchical categories
- **Order Management**: View, process, and track orders with status updates
- **Customer Management**: View customer profiles and order history
- **Content Management**: Manage blog posts and approve testimonials
- **Contact Inquiries**: Handle customer support requests

### 🔒 Security & Performance
- **JWT Authentication**: Secure token-based authentication with refresh token rotation
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **SQL Injection Protection**: Django ORM with parameterized queries
- **XSS Protection**: Built-in Django security middleware
- **Optimized Queries**: Database query optimization with select_related and prefetch_related
- **Cloud Storage**: Cloudinary integration for scalable image delivery

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: React 19 with Vite 6 for lightning-fast builds
- **Language**: TypeScript 5.8 for type safety and enhanced developer experience
- **Styling**: Tailwind CSS 4 with custom nature-inspired color palette
- **Routing**: React Router DOM v7 for client-side routing
- **State Management**: React Context API for authentication and cart state
- **Animations**: Framer Motion for smooth micro-interactions
- **Icons**: Lucide React for modern iconography
- **HTTP Client**: Custom API wrapper with error handling

### Backend (Server)
- **Framework**: Django 6.0 & Django REST Framework 3.15
- **Language**: Python 3.13
- **Database**: PostgreSQL hosted on Neon (serverless PostgreSQL)
- **Authentication**: JWT via `djangorestframework-simplejwt` with token blacklisting
- **Media Storage**: Cloudinary for cloud-hosted image delivery
- **API Documentation**: OpenAPI 3.0 / Swagger UI via `drf-spectacular`
- **Data Validation**: Django serializers with custom validation logic
- **Filtering**: Django-filter for advanced query filtering
- **CORS**: django-cors-headers for cross-origin requests

### DevOps & Deployment
- **Containerization**: Docker Compose for local development
- **Environment Management**: python-decouple for secure configuration
- **WSGI Server**: Gunicorn for production deployment
- **Static Files**: WhiteNoise for efficient static file serving
- **Process Management**: Production-ready configuration

---

## 📁 Project Structure

```
HerbalUdyog/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── api/                     # API integration layer
│   │   ├── components/              # Reusable components
│   │   │   ├── cart/               # Cart-related components
│   │   │   ├── layout/             # Layout components (Navbar, Footer)
│   │   │   ├── home/               # Home page components
│   │   │   └── products/           # Product-related components
│   │   ├── context/                # React Context providers
│   │   │   ├── AuthContext.tsx     # Authentication state
│   │   │   └── CartContext.tsx     # Shopping cart state
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── pages/                  # Page components
│   │   │   ├── admin/              # Admin dashboard tabs
│   │   │   ├── Auth.tsx            # Authentication page
│   │   │   ├── Dashboard.tsx       # Customer dashboard
│   │   │   ├── Marketplace.tsx     # Product listing
│   │   │   └── ProductDetail.tsx   # Product details
│   │   ├── App.tsx                 # Main app component
│   │   └── main.tsx                # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── server/                          # Django Backend
│   ├── config/                      # Django project configuration
│   │   ├── settings.py              # Main settings with DATABASE_URL parsing
│   │   ├── urls.py                  # Root URL configuration
│   │   └── wsgi.py                  # WSGI configuration
│   ├── users/                       # User management app
│   │   ├── models.py                # CustomUser, UserProfile, Wishlist
│   │   ├── serializers.py           # User serializers
│   │   ├── views.py                 # Authentication endpoints
│   │   └── permissions.py           # Custom permissions
│   ├── products/                    # Product management app
│   │   ├── models.py                # Product, Category, ProductImage, Review
│   │   ├── serializers.py           # Product serializers
│   │   ├── views.py                 # Product ViewSets with filtering
│   │   ├── filters.py               # Product filters
│   │   ├── permissions.py           # Admin-only permissions
│   │   └── management/commands/     # Custom management commands
│   │       └── seed_data.py         # Database seeding
│   ├── orders/                      # Order management app
│   │   ├── models.py                # Order, OrderItem
│   │   ├── serializers.py           # Order serializers
│   │   └── views.py                 # Order endpoints
│   ├── core/                        # Core functionality app
│   │   ├── models.py                # BlogPost, Testimonial, ContactInquiry
│   │   ├── serializers.py           # Core serializers
│   │   └── views.py                 # Core endpoints
│   ├── manage.py                    # Django management script
│   ├── requirements.txt             # Python dependencies
│   └── .env.example                 # Environment variables template
│
├── docker-compose.yml               # Docker configuration
├── .gitignore                       # Git ignore rules
└── README.md                        # This file
```

---

## 🗄️ Database Schema

### Core Models
- **CustomUser**: Email-based authentication with role system (admin/customer)
- **UserProfile**: Extended user information with shipping addresses
- **Wishlist**: User's saved products

### Product Models
- **Category**: Product categories with slugs and images
- **Product**: Products with pricing, inventory, ratings, and metadata
- **ProductImage**: Multi-image support with primary image designation
- **Review**: Customer product reviews with ratings

### Order Models
- **Order**: Order management with status tracking and pricing
- **OrderItem**: Individual order items with captured pricing

### Content Models
- **BlogPost**: CMS for wellness articles
- **Testimonial**: Customer testimonials with approval workflow
- **ContactInquiry**: Customer support requests

---

## 🔌 API Endpoints

### Authentication
- `POST /api/users/register/` - User registration
- `POST /api/users/login/` - User login (returns JWT tokens)
- `POST /api/users/token/refresh/` - Refresh access token
- `POST /api/users/logout/` - Logout (blacklist token)
- `GET /api/users/me/` - Get current user profile
- `PUT /api/users/me/` - Update user profile

### Products
- `GET /api/products/` - List products (with filtering, search, pagination)
- `POST /api/products/` - Create product (admin only)
- `GET /api/products/{slug}/` - Get product details
- `PUT /api/products/{slug}/` - Update product (admin only)
- `DELETE /api/products/{slug}/` - Delete product (admin only)
- `POST /api/products/{slug}/add_review/` - Add product review (customer only)

### Categories
- `GET /api/products/categories/` - List categories
- `POST /api/products/categories/` - Create category (admin only)
- `GET /api/products/categories/{slug}/` - Get category details
- `PUT /api/products/categories/{slug}/` - Update category (admin only)
- `DELETE /api/products/categories/{slug}/` - Delete category (admin only)

### Orders
- `GET /api/orders/` - List user orders
- `POST /api/orders/` - Create new order
- `GET /api/orders/{id}/` - Get order details
- `PUT /api/orders/{id}/` - Update order status (admin only)

### Wishlist
- `GET /api/users/wishlist/` - Get user wishlist
- `POST /api/users/wishlist/` - Add product to wishlist
- `DELETE /api/users/wishlist/{id}/` - Remove from wishlist

### Core Content
- `GET /api/core/blog/` - List blog posts
- `GET /api/core/blog/{slug}/` - Get blog post details
- `GET /api/core/testimonials/` - List approved testimonials
- `POST /api/core/contact/` - Submit contact inquiry

### Admin Panel
- `GET /admin/` - Django admin interface
- `POST /api/admin/login/` - Admin authentication

### API Documentation
- `GET /api/schema/` - OpenAPI schema
- `GET /api/docs/` - Swagger UI documentation

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **Python** (3.10+)
- **Neon** account (PostgreSQL database)
- **Cloudinary** account (image storage)

### 1. Clone the Repository
```bash
git clone https://github.com/ts-31/HerbalUdyog.git
cd HerbalUdyog
```

### 2. Backend Setup
Navigate to the `server` directory and set up the Python environment:
```bash
cd server
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `server` directory using `.env.example` as a template:
```env
DATABASE_URL=postgresql://neondb_owner:password@ep-xxx.aws.neon.tech/neondb?sslmode=require&channel_binding=require
SECRET_KEY=your_django_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run migrations and seed the database with initial products:
```bash
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

The Django API will be available at `http://localhost:8000`

### 3. Frontend Setup
Open a new terminal, navigate to the `client` directory:
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:8000
```

Start the Vite development server:
```bash
npm run dev
```

The React application will be available at `http://localhost:3000`

### 4. Access the Application
- **Customer Portal**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login
- **API Documentation**: http://localhost:8000/api/docs/
- **Django Admin**: http://localhost:8000/admin/

---

## 🧪 Testing

The project includes comprehensive testing setup. Run tests with:

```bash
# Backend tests
cd server
python manage.py test

# Frontend linting
cd client
npm run lint
```

---

## � Deployment

### Backend Deployment
1. Set environment variables in production
2. Run migrations: `python manage.py migrate`
3. Collect static files: `python manage.py collectstatic`
4. Use Gunicorn as WSGI server: `gunicorn config.wsgi:application`
5. Configure Nginx as reverse proxy

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Vercel, Netlify, or any static hosting service
3. Update `VITE_API_URL` to production API endpoint

### Docker Deployment
```bash
docker-compose up -d
```

---

## 🎯 Key Technical Highlights

- **Custom User Model**: Email-based authentication with role-based access control
- **JWT Token Management**: Secure token handling with refresh token rotation and blacklisting
- **Advanced Filtering**: Product filtering by category, price range, and search
- **Optimized Database Queries**: Using select_related and prefetch_related for performance
- **Cloud-Native Architecture**: Serverless database (Neon) and cloud storage (Cloudinary)
- **Type Safety**: Full TypeScript coverage in frontend with strict mode
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **API Documentation**: Auto-generated OpenAPI/Swagger documentation
- **Seed Data**: Custom management command for database seeding
- **Role-Based Permissions**: Custom permission classes for admin-only operations

---

## 🔮 Future Enhancements

- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Real-time order tracking
- [ ] Email notifications for order updates
- [ ] Advanced analytics dashboard
- [ ] Product recommendation engine
- [ ] Multi-language support (i18n)
- [ ] Mobile app (React Native)
- [ ] AI-powered product search
- [ ] Social media integration
- [ ] Advanced inventory management

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/ts-31/HerbalUdyog/issues).

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**ts-31**

- GitHub: [@ts-31](https://github.com/ts-31)
- Project Link: [https://github.com/ts-31/HerbalUdyog](https://github.com/ts-31/HerbalUdyog)

---

## 🙏 Acknowledgments

- Django REST Framework for the excellent API framework
- React team for the amazing UI library
- Tailwind CSS for the utility-first CSS framework
- Neon for the serverless PostgreSQL database
- Cloudinary for the cloud image storage solution
