# Budget-Friendly Hiking Planner with Store

Full-stack demo app (React + Express + MongoDB). Features: Auth, role-based access, Plans, Products, Cart, Orders.

Quick start

Server

1. cd server
2. copy .env.example .env (Windows: `copy .env.example .env`) and set `MONGO_URI` and `JWT_SECRET`
3. npm install
4. npm run seed
5. npm start

Client

1. cd client
2. npm install
3. npm start

Test accounts (created by `server/src/seed.js`)
- Admin: admin@test.com / role123
- Seller: seller@test.com / role123
- User: user@test.com / role123

APIs
- `POST /api/auth/login` → {email,password} returns `{token}`
- `GET /api/products` → list products
- `POST /api/cart/items` → add to cart (auth)
- `POST /api/cart/checkout` → create order (auth)

# 🥾 Budget-Friendly Hiking Planner

A comprehensive full-stack web application for planning budget-friendly hiking trips with integrated shopping, seller management, and admin controls.

> **Status**: ✅ Complete Implementation | Ready for Testing & Deployment

## 🎯 Quick Links

- **Quick Start**: [QUICKSTART.md](QUICKSTART.md) - Get running in 5 minutes
- **Setup Guide**: [SETUP.md](SETUP.md) - Complete installation & API docs
- **Implementation**: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - What was built
- **Improvements**: [IMPROVEMENTS.md](IMPROVEMENTS.md) - All improvements made
- **Checklist**: [CHECKLIST.md](CHECKLIST.md) - Verification of all tasks

## 🚀 Get Started Now

```bash
# Backend
cd backend
npm install
npm run seed
npm start

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Visit: **http://localhost:5173**

### Demo Accounts (Password: role123)
```
Admin: admin@test.com
Seller: seller@test.com
User: user@test.com
```

## ✨ Features

### 🏔️ For Hikers
- Browse curated hiking plans
- Create custom hiking plans with budget
- Get smart gear recommendations
- Shop hiking equipment
- Track orders in real-time

### 💼 For Sellers
- Add and manage products
- Track inventory levels
- Process customer orders
- Update order status
- Monitor sales

### 🛡️ For Admins
- Full system dashboard
- View sales analytics
- Manage all products & orders
- User moderation
- Complete system control

## 📋 Core Modules

| Module | Features | Routes |
|--------|----------|--------|
| **Plans** | Browse, Create, Update, Delete | 5 endpoints |
| **Store** | Products, Inventory, Categories | 7 endpoints |
| **Cart** | Shopping, Checkout, History | Integrated |
| **Orders** | Create, Track, Manage | 6 endpoints |
| **Auth** | Register, Login, JWT | 2 endpoints |

## 🔐 Security Features

✅ **Bcrypt Password Hashing** - 10 salt rounds  
✅ **JWT Authentication** - 24h token expiration  
✅ **Input Validation** - All endpoints validated  
✅ **RBAC** - Role-based access control  
✅ **Error Handling** - Comprehensive error management  
✅ **CORS** - Configurable allowed origins  

## 👥 User Roles

### Regular User
```
✓ Browse hiking plans
✓ Create custom hikes
✓ Browse & buy gear
✓ Track orders
✓ View profile
```

### Seller
```
✓ Add/Edit/Manage products
✓ Track inventory
✓ View customer orders
✓ Process orders (status updates)
✓ Monitor sales
```

### Admin
```
✓ Manage all users & data
✓ Full product control
✓ Full order management
✓ View analytics
✓ System moderation
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Auth**: JWT + Bcrypt
- **Database**: JSON files (easily replaceable)
- **Config**: dotenv

### Frontend
- **Framework**: React 18
- **Router**: React Router v6
- **Build**: Vite
- **State**: Context API
- **CSS**: Tailwind + Inline Styles

## 📊 API Overview

### Authentication
```
POST   /api/register      - Register new user
POST   /api/login         - Login user
```

### Plans
```
GET    /api/plans         - List all plans
GET    /api/plans/:id     - Get plan details
POST   /api/plans         - Create plan (seller/admin)
PUT    /api/plans/:id     - Update plan
DELETE /api/plans/:id     - Delete plan
```

### Products
```
GET    /api/products      - List all products
GET    /api/products/:id  - Get product details
POST   /api/products      - Create product (seller/admin)
PUT    /api/products/:id  - Update product
PUT    /api/products/:id/reduce-stock - Buy item
DELETE /api/products/:id  - Delete product (admin)
```

### Orders
```
GET    /api/orders        - List user's orders
GET    /api/orders/:id    - Get order details
POST   /api/orders        - Create order
PUT    /api/orders/:id/status - Update order status (seller/admin)
PUT    /api/orders/:id    - Update order (admin)
DELETE /api/orders/:id    - Delete order (admin)
```

## 📄 Getting Started

1. **Install & Setup**: See [QUICKSTART.md](QUICKSTART.md) for 5-minute setup
2. **Full Guide**: See [SETUP.md](SETUP.md) for complete documentation
3. **What's New**: See [IMPROVEMENTS.md](IMPROVEMENTS.md) for all changes
4. **Verification**: See [CHECKLIST.md](CHECKLIST.md) for implementation status

## 📈 Key Improvements

✅ **Security**: Bcrypt hashing, JWT, input validation, RBAC  
✅ **Error Handling**: Comprehensive try-catch, validation, user feedback  
✅ **Inventory**: Complete stock tracking and management  
✅ **Workflow**: Multi-step order status progression  
✅ **Dashboards**: Seller and Admin panels with full features  
✅ **Order Tracking**: Real-time status updates for users  
✅ **Documentation**: Complete guides and API reference  
✅ **Testing**: Sample data with seed script  

---

**Status**: ✅ Complete | Ready for Testing & Deployment  
**Last Updated**: January 2026  
**License**: MIT
