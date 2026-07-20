<div align="center">
  <img src="./client/public/favicon.png" alt="HerbalUdyog Logo" width="120" />
  <h1>HerbalUdyog — Organic Wellness Marketplace</h1>
  <p>A full-stack, premium e-commerce platform dedicated to sustainable, organic, and locally-sourced wellness products.</p>
  
  [![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
  [![Django](https://img.shields.io/badge/Django-6.0-green.svg)](https://www.djangoproject.com/)
  [![Neon](https://img.shields.io/badge/Neon-PostgreSQL-0CC4E8.svg)](https://neon.tech/)
  
</div>

---

## 📖 Overview

**HerbalUdyog** is a modern, responsive, and robust e-commerce application built to bridge the gap between independent organic farmers and health-conscious consumers. The platform offers a seamless shopping experience featuring dynamic product browsing, user authentication, order tracking, and a comprehensive administrative dashboard for managing the entire business lifecycle.

Built with a focus on **Performance**, **Scalability**, and **Premium UI/UX Design**, this project demonstrates a complete end-to-end full-stack architecture.

---

## ✨ Key Features

### For Customers 🌿
* **Immersive Marketplace**: Browse products with advanced filtering, categorization, and fluid micro-animations.
* **Authentication**: Secure JWT-based login and registration.
* **Cart & Checkout**: Persistent cart drawer, real-time total calculation, and seamless mock checkout flow.
* **User Dashboard**: Manage personal profile, track historical order statuses, and view wishlist items.
* **Responsive Design**: Flawlessly optimized for mobile, tablet, and desktop devices.

### For Administrators ⚙️
* **Role-Based Access Control**: Dedicated secure admin panel isolated from regular user routes.
* **Inventory Management**: Full CRUD capabilities for products and categories with Cloudinary image integration (supports up to 4 images per product).
* **Order Fulfillment**: View incoming orders, manage statuses (Pending, Processing, Shipped, Delivered), and track revenue.
* **Content Management**: Built-in blogging system to publish wellness articles and manage customer testimonials.

---

## 🛠️ Tech Stack

### Frontend (Client)
* **Framework**: React 18 with Vite for blazing-fast builds.
* **Language**: TypeScript for type safety and maintainability.
* **Styling**: Tailwind CSS tailored with a custom nature-inspired color palette and micro-animations.
* **Routing**: React Router DOM v6.
* **Icons**: Lucide React.

### Backend (Server)
* **Framework**: Django & Django REST Framework (DRF).
* **Language**: Python 3.
* **Database**: PostgreSQL hosted on **Neon**.
* **Authentication**: JWT (JSON Web Tokens) via `djangorestframework-simplejwt`.
* **Media Storage**: Cloudinary for scalable, cloud-hosted image delivery.
* **API Documentation**: OpenAPI / Swagger integrated via `drf-spectacular`.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* Python (3.10+)
* A Neon project (PostgreSQL)
* A Cloudinary account

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/HerbalUdyog.git
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
SECRET_KEY=your_django_secret
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

### 3. Frontend Setup
Open a new terminal, navigate to the `client` directory:
```bash
cd client
npm install
```

Start the Vite development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000` and the API at `http://localhost:8000`.

---

## 📸 Screenshots

*(Replace with actual URLs once hosted)*
- **Marketplace**: Clean, product-focused grid with category filters.
- **Product Details**: Immersive gallery with related products.
- **Admin Dashboard**: Comprehensive analytics and management tools.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome. Feel free to check the issues page if you want to contribute.

## 📄 License
This project is licensed under the MIT License.
