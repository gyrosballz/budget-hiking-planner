# Budget Hiking Planner - Next.js + MongoDB

A full-stack hiking planning and e-commerce application built entirely with **Next.js 14** and **MongoDB**. The app combines hiking plan management, an outdoor gear store, order tracking, and user role-based dashboards.

## Features

✅ **Full-Stack Next.js Application** - No separate frontend/backend
✅ **MongoDB Database** - Scalable data persistence with Mongoose ODM
✅ **User Authentication** - Login/Register with JWT tokens
✅ **Role-Based Access** - User, Seller, and Admin roles
✅ **Hiking Plans** - Browse and create hiking plans
✅ **E-Commerce Store** - Shop for hiking gear
✅ **Shopping Cart** - Add items and checkout
✅ **Order Management** - Track orders with status workflow
✅ **Seller Dashboard** - Manage products and plans
✅ **Admin Dashboard** - Manage all orders and users
✅ **Smooth Navigation** - Navbar with smooth scroll navigation
✅ **Responsive Design** - Mobile-friendly UI

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Frontend**: React 18 with Context API
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt
- **Styling**: Tailwind CSS (responsive design)

## Project Structure

```
app/
├── app/
│   ├── api/              # API routes (backend)
│   │   ├── login/
│   │   ├── register/
│   │   ├── plans/
│   │   ├── products/
│   │   └── orders/
│   ├── (pages)/         # Frontend pages
│   │   ├── page.js
│   │   ├── login/
│   │   ├── register/
│   │   ├── plans/
│   │   ├── store/
│   │   ├── cart/
│   │   ├── orders/
│   │   ├── planner/
│   │   ├── seller/
│   │   └── admin-dashboard/
│   ├── components/      # Reusable React components
│   │   └── Navbar.jsx
│   ├── layout.js        # Root layout with providers
│   └── globals.css      # Global styles
├── components/          # Legacy components
├── context/            # React Context (Auth, Cart, Hike)
├── lib/
│   ├── api.js          # API client
│   ├── mongodb.js      # MongoDB connection (ES6)
│   ├── mongodb-seed.js # MongoDB connection for seed script
│   ├── models.js       # Mongoose schemas (ES6)
│   └── models-seed.js  # Mongoose schemas for seed (CommonJS)
├── scripts/
│   └── seed.js         # Database seeding script
├── .env.local          # Environment variables (create from .env.local.example)
├── .env.local.example  # Environment template
└── package.json
```

## Prerequisites

- **Node.js** v18+ 
- **MongoDB** (local or MongoDB Atlas cloud)
- **npm** or **yarn**

## Quick Start

### 1. Install Dependencies

```bash
cd app
npm install
```

### 2. Configure Environment

Copy the environment template:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your MongoDB connection string:

**For Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/budget-hiking-planner
```

**For MongoDB Atlas (Cloud):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/budget-hiking-planner?retryWrites=true&w=majority
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas** - No local setup needed, just update `.env.local`

### 4. Seed the Database

Creates test users and sample data:

```bash
npm run seed
```

**Test Credentials:**
| Username | Password | Role |
|----------|----------|------|
| testuser | pass123 | User |
| testseller | pass123 | Seller |
| testadmin | pass123 | Admin |

### 5. Run the Development Server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser

## Running the App

### Development Mode

```bash
npm run dev
```

Starts Next.js with hot reload on port 3000.

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/login` - Login with username/password
- `POST /api/register` - Register a new user

### Hiking Plans
- `GET /api/plans` - Get all plans
- `POST /api/plans` - Create plan (seller/admin only)
- `GET /api/plans/[id]` - Get single plan
- `PUT /api/plans/[id]` - Update plan (seller/admin only)
- `DELETE /api/plans/[id]` - Delete plan (admin only)

### Products (Store)
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (seller/admin only)
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product (seller/admin only)
- `DELETE /api/products/[id]` - Delete product (admin only)

### Orders
- `GET /api/orders` - Get orders (filtered by role)
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get single order
- `PUT /api/orders/[id]` - Update order (admin only)
- `PUT /api/orders/[id]/status` - Update order status (admin only)
- `DELETE /api/orders/[id]` - Delete order (admin only)

## Page Routes

### Public Pages
- `/login` - User login
- `/register` - User registration

### Protected Pages (Login Required)
- `/` - Home/Dashboard with Features & Pricing sections
- `/plans` - Hiking plans list
- `/store` - Product store
- `/cart` - Shopping cart
- `/planner` - Hike planner tool
- `/orders` - Order tracking
- `/profile` - User profile

### Role-Specific Pages
- `/seller` - Seller dashboard (sellers only)
- `/admin-dashboard` - Admin dashboard (admins only)

## Database Schema

### User
```javascript
{
  username: String (unique),
  password: String (hashed),
  role: 'user' | 'seller' | 'admin',
  createdAt: Date,
  updatedAt: Date
}
```

### Plan
```javascript
{
  name: String,
  distance: Number,
  duration: Number,
  difficulty: String,
  budget: Number,
  createdBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  name: String,
  price: Number,
  stock: Number,
  category: String,
  createdBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  username: String,
  items: Array,
  total: Number,
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled',
  createdBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Viewing Database Data

### Option 1: MongoDB Compass (GUI)
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect with your MongoDB URI from `.env.local`
3. Browse `budget-hiking-planner` database and collections

### Option 2: MongoDB Atlas UI (Cloud)
1. Log into [MongoDB Atlas](https://cloud.mongodb.com)
2. Go to your cluster → Collections
3. View all data in the `budget-hiking-planner` database

### Option 3: MongoDB Shell (CLI)
```bash
mongosh mongodb://localhost:27017/budget-hiking-planner

# View collections
show collections

# View users
db.users.find()

# View orders
db.orders.find()

# View products
db.products.find()

# View plans
db.plans.find()
```

## Key Features Explained

### Authentication
- Password hashing with **bcrypt**
- JWT tokens for session management
- Role-based access control (user/seller/admin)
- Secure token storage

### Shopping Cart
- Client-side cart management with React Context
- LocalStorage persistence
- Checkout creates MongoDB orders

### Order Management
- Status workflow: Pending → Processing → Shipped → Delivered → Cancelled
- Admins can manage all orders
- Sellers can view owned orders
- Users see only their own orders

### Navigation
- Sticky navbar with smooth scroll
- Desktop and mobile responsive menus
- Quick links to all sections
- User info and logout buttons

### Role Hierarchy
1. **User** - View plans/products, create orders, see own orders
2. **Seller** - Create plans/products, view own orders
3. **Admin** - Full access to all resources

## Environment Variables

`.env.local` (create from `.env.local.example`):

```
MONGODB_URI=mongodb://localhost:27017/budget-hiking-planner
JWT_SECRET=your-secret-key
JWT_EXPIRE=24h
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check `.env.local` has correct `MONGODB_URI`
- For Atlas, verify IP whitelist in cluster settings

### "Cannot find module" errors
```bash
npm install
```

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Seed fails
```bash
# Clear database and reseed
npm run seed
```

### Authentication not working
- Run `npm run seed` to create test users
- Clear browser cookies/localStorage
- Check MongoDB connection

## Future Enhancements

- [ ] Add image uploads for products
- [ ] Implement payment processing (Stripe)
- [ ] Add reviews and ratings
- [ ] Email notifications
- [ ] Advanced search and filtering
- [ ] Real-time notifications (WebSocket)
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard

## License

MIT

## Support

For issues or questions, please create an issue in the repository or contact the maintainers.

---

**Happy Hiking! 🥾**
