# Budget Hiking Planner - Next.js Version

A full-stack hiking planning and e-commerce application built entirely with **Next.js 14**. The app combines hiking plan management, an outdoor gear store, order tracking, and user role-based dashboards.

## Features

✅ **Full-Stack Next.js Application** - No separate frontend/backend
✅ **User Authentication** - Login/Register with JWT tokens
✅ **Role-Based Access** - User, Seller, and Admin roles
✅ **Hiking Plans** - Browse and create hiking plans
✅ **E-Commerce Store** - Shop for hiking gear
✅ **Shopping Cart** - Add items and checkout
✅ **Order Management** - Track orders with status workflow
✅ **Seller Dashboard** - Manage products and plans
✅ **Admin Dashboard** - Manage all orders and users
✅ **File-Based Storage** - JSON files for data persistence

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Frontend**: React 18
- **Backend API Routes**: Next.js API Routes
- **Authentication**: JWT + bcrypt
- **Data Storage**: JSON files
- **Styling**: CSS (responsive design)

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
│   ├── layout.js        # Root layout with providers
│   └── globals.css      # Global styles
├── components/          # Reusable React components
│   └── Header.jsx
├── context/            # React Context (Auth, Cart, Hike)
├── lib/
│   ├── api.js          # API client
│   └── fileUtils.js    # File utilities
├── data/               # JSON data files
│   ├── users.json
│   ├── plans.json
│   ├── products.json
│   └── orders.json
├── scripts/
│   └── seed.js         # Database seeding script
└── package.json
```

## Quick Start

### 1. Install Dependencies

```bash
cd app
npm install
```

### 2. Seed the Database (Optional)

This creates test users and sample data:

```bash
npm run seed
```

**Test Credentials:**
- User: `testuser` / `pass123`
- Seller: `testseller` / `pass123`
- Admin: `testadmin` / `pass123`

### 3. Run the Development Server

```bash
npm run dev
```

The app will start at **http://localhost:3000**

## Running the App

### Development Mode

```bash
npm run dev
```

Starts Next.js in development mode with hot reload. The server runs on port 3000.

### Production Build & Run

```bash
npm run build
npm start
```

Builds the optimized production version and starts the server.

## API Endpoints

The app includes the following API routes:

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
- `PUT /api/orders/[id]/status` - Update order status (admin/seller)
- `DELETE /api/orders/[id]` - Delete order (admin only)

## Page Routes

### Public Pages
- `/login` - User login
- `/register` - User registration

### Protected Pages (Login Required)
- `/` - Home/Dashboard
- `/plans` - Hiking plans list
- `/store` - Product store
- `/cart` - Shopping cart
- `/planner` - Hike planner tool
- `/orders` - Order tracking
- `/profile` - User profile

### Role-Specific Pages
- `/seller` - Seller dashboard (sellers only)
- `/admin-dashboard` - Admin dashboard (admins only)

## Data Storage

All data is stored in JSON files in the `data/` directory:

- `users.json` - User accounts and roles
- `plans.json` - Hiking plans
- `products.json` - Store products
- `orders.json` - Customer orders

These files are automatically created on first run. For persistent storage in production, consider migrating to a database like MongoDB or PostgreSQL.

## Key Features Explained

### Authentication
- Password hashing with **bcrypt**
- JWT tokens for session management
- Role-based access control (user/seller/admin)
- LocalStorage for client-side token persistence

### Shopping Cart
- Client-side cart management with React Context
- LocalStorage persistence
- Checkout creates orders

### Order Management
- Status workflow: Pending → Processing → Shipped → Delivered → Cancelled
- Admins can manage all orders
- Sellers can update order status
- Users see only their own orders

### Role Hierarchy
1. **User** - Can view plans and products, create orders, see own orders
2. **Seller** - Can create plans/products, update order status
3. **Admin** - Full access to all resources

## Environment Variables

Currently, the app uses default settings. You can customize:

Create `.env.local`:

```
NEXT_PUBLIC_API_BASE=http://localhost:3000
JWT_SECRET=your-secret-key
JWT_EXPIRE=24h
```

## Troubleshooting

### "Cannot find module" errors
```bash
npm install
```

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Data not persisting
- Check that `data/` directory exists and has write permissions
- Verify JSON files are not corrupted

### Authentication issues
- Clear browser localStorage: `localStorage.clear()`
- Reseed the database: `npm run seed`

## Future Enhancements

- [ ] Migrate to database (MongoDB/PostgreSQL)
- [ ] Add image uploads for products
- [ ] Implement payment processing
- [ ] Add reviews and ratings
- [ ] Email notifications
- [ ] Advanced search and filtering
- [ ] Mobile app (React Native)

## License

MIT

## Support

For issues or questions, please refer to the project documentation or create an issue in the repository.

---

**Happy Hiking! 🥾**
