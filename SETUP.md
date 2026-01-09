# Budget-Friendly Hiking Planner

A full-stack web application for planning budget-friendly hiking trips with integrated shopping, role-based user management, and order tracking.

## Features

### 🏔️ Core Modules
- **Hiking Planner** - Create and customize hiking plans with distance, duration, and budget
- **Store** - Browse and purchase hiking gear with smart recommendations
- **Cart & Orders** - Shopping cart with checkout and order tracking
- **Authentication** - Secure user registration and login with JWT tokens
- **Role-Based Access Control** - User, Seller, and Admin roles with dedicated dashboards

### 👥 User Roles

#### Regular User
- Browse hiking plans
- Create custom hiking plans
- View gear recommendations based on hike difficulty
- Add items to cart and checkout
- Track order status (Pending → Processing → Shipped → Delivered)

#### Seller
- Add and manage products with inventory tracking
- View and process orders from customers
- Update order status
- Monitor sales and stock levels

#### Admin
- Dashboard with sales statistics and analytics
- Manage all orders (view, update, delete)
- Manage all products (view, delete)
- Full system control and moderation

## Setup

### Prerequisites
- Node.js 14+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gyrosballz/budget-hiking-planner.git
   cd budget-hiking-planner
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Setup environment variables**
   ```bash
   cd ../backend
   cp .env.example .env
   # Edit .env and set your JWT_SECRET
   ```

5. **Seed test data**
   ```bash
   npm run seed
   ```
   
   This creates:
   - **Test Users:**
     - User: `testuser` / `pass123`
     - Seller: `testseller` / `pass123`
     - Admin: `testadmin` / `pass123`
   - **Sample products** with inventory
   - **Sample hiking plans**

6. **Start the backend server**
   ```bash
   npm start
   # Server runs on http://localhost:5000
   ```

7. **Start the frontend (in a new terminal)**
   ```bash
   cd frontend
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

## API Documentation

### Authentication

#### Register
```
POST /api/register
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123"
}
```

#### Login
```
POST /api/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "pass123"
}

Response:
{
  "token": "jwt_token_here",
  "username": "testuser",
  "role": "user"
}
```

### Plans

#### Get All Plans
```
GET /api/plans
```

#### Create Plan (Seller/Admin only)
```
POST /api/plans
x-user-role: seller
Authorization: Bearer token

{
  "name": "Valley Trek",
  "distance": 10,
  "duration": 3,
  "difficulty": "Easy",
  "budget": 50
}
```

#### Update Plan
```
PUT /api/plans/:id
x-user-role: seller
Authorization: Bearer token
```

#### Delete Plan
```
DELETE /api/plans/:id
x-user-role: seller
Authorization: Bearer token
```

### Products

#### Get All Products
```
GET /api/products
```

#### Create Product (Seller/Admin)
```
POST /api/products
x-user-role: seller
Authorization: Bearer token

{
  "name": "Hiking Boots",
  "price": 89.99,
  "stock": 10,
  "category": "Footwear"
}
```

#### Update Product
```
PUT /api/products/:id
x-user-role: seller
Authorization: Bearer token
```

#### Reduce Stock (Purchase)
```
PUT /api/products/:id/reduce-stock
Content-Type: application/json

{
  "quantity": 1
}
```

#### Delete Product (Admin only)
```
DELETE /api/products/:id
x-user-role: admin
Authorization: Bearer token
```

### Orders

#### Get Orders
```
GET /api/orders
x-user-role: user
Authorization: Bearer token
# Returns user's own orders
```

#### Create Order
```
POST /api/orders
x-user-role: user
Authorization: Bearer token

{
  "items": [
    { "name": "Hiking Boots", "price": 89.99 },
    { "name": "Water Bottle", "price": 24.99 }
  ]
}
```

#### Update Order Status
```
PUT /api/orders/:id/status
x-user-role: seller
Authorization: Bearer token

{
  "status": "Processing"
}
```

**Valid Status Transitions:**
- Pending → Processing, Cancelled
- Processing → Shipped, Cancelled
- Shipped → Delivered
- Delivered → (no further changes)

## Project Structure

```
budget-hiking-planner/
├── backend/
│   ├── routes/
│   │   ├── plans.js
│   │   ├── products.js
│   │   └── orders.js
│   ├── data/
│   │   ├── users.json
│   │   ├── plans.json
│   │   ├── products.json
│   │   └── orders.json
│   ├── scripts/
│   │   └── seed.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Plans.jsx
│   │   │   ├── Store.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── HikePlanner.jsx
│   │   │   ├── OrderTracking.jsx
│   │   │   ├── SellerDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── HikeContext.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Key Features Implemented

### ✅ Security
- Bcrypt password hashing
- JWT token authentication
- Input validation on all endpoints
- Environment variables for sensitive config
- Role-based access control (RBAC)

### ✅ Inventory Management
- Track product stock levels
- Reduce stock on purchase
- Admin can delete products
- Seller can manage their products

### ✅ Order Workflow
- Clear status progression (Pending → Processing → Shipped → Delivered)
- Sellers can process orders
- Users can track their orders in real-time
- Admin can view all orders and modify status

### ✅ User Roles
- **User**: Browse and purchase products
- **Seller**: Manage inventory and process orders
- **Admin**: Full system control
- Role-based navigation and dashboard access

### ✅ Error Handling
- Try-catch blocks on all file operations
- Validation of all inputs
- Proper HTTP status codes
- Meaningful error messages
- Frontend error display

## Development

### Available Scripts

**Backend:**
```bash
npm start              # Start server
npm run seed          # Initialize test data
```

**Frontend:**
```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build
```

## Testing

### Test the Full Flow

1. **Register a new user**
   - Go to `/register`
   - Create account (e.g., `myuser` / `password123`)

2. **Login**
   - Go to `/login`
   - Use your credentials

3. **Browse Plans & Create Hike**
   - Click "Plans" or "Planner"
   - Create a custom hiking plan

4. **Shop for Gear**
   - Click "Store"
   - View recommendations based on your hike
   - Add items to cart

5. **Checkout**
   - Go to "Cart"
   - Review items and checkout
   - See order confirmation

6. **Track Order**
   - Go to "Orders" tab
   - View order status progress

### Test as Seller

1. Login with `testseller` / `pass123`
2. Click "Seller Dashboard"
3. Add products with inventory
4. View and process customer orders

### Test as Admin

1. Login with `testadmin` / `pass123`
2. Click "Admin Dashboard"
3. View analytics and sales metrics
4. Manage all products and orders
5. Update order statuses

## Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=24h

# Database (file-based for now)
DATA_DIR=./data

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Future Enhancements

- [ ] Real database (PostgreSQL/MongoDB)
- [ ] Email notifications for orders
- [ ] Payment gateway integration
- [ ] User profiles and history
- [ ] Product reviews and ratings
- [ ] Advanced search and filtering
- [ ] Map integration for hiking trails
- [ ] Weather API integration
- [ ] Mobile app
- [ ] Analytics dashboard
- [ ] Wishlist feature
- [ ] Multi-currency support

## Security Notes

⚠️ **This is a demo application. For production use:**

1. Change the `JWT_SECRET` to a strong, unique value
2. Use a real database (not JSON files)
3. Enable HTTPS
4. Implement rate limiting
5. Add CSRF protection
6. Use secure cookie settings
7. Implement proper password reset flow
8. Add email verification
9. Set up audit logging
10. Regular security updates

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

---

**Happy Hiking! 🥾⛰️**
