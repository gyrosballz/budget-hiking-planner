# Quick Start Guide

Get the Budget-Friendly Hiking Planner running in 5 minutes!

## 🚀 Quick Setup

### 1. Install & Seed (2 minutes)
```bash
# Backend setup
cd backend
npm install
npm run seed

# Frontend setup  
cd ../frontend
npm install
```

### 2. Start Services (1 minute)
```bash
# Terminal 1 - Backend
cd backend
npm start
# Backend running on http://localhost:5000

# Terminal 2 - Frontend
cd frontend
npm run dev
# Frontend running on http://localhost:5173
```

### 3. Login & Explore (2 minutes)
Open http://localhost:5173 and login with:

- **Regular User**: `testuser` / `pass123`
- **Seller**: `testseller` / `pass123`
- **Admin**: `testadmin` / `pass123`

## 🎯 What to Try

### As a Regular User
1. Click "Plans" → Create a hiking plan
2. Click "Planner" → Customize your hike
3. Click "Store" → See gear recommendations
4. Add items to cart → Checkout
5. Click "Orders" → Track your order

### As a Seller
1. Click "Seller Dashboard"
2. Add products with inventory
3. View orders from customers
4. Update order status (Pending → Processing → Shipped → Delivered)

### As an Admin
1. Click "Admin Dashboard"
2. View sales stats and revenue
3. Manage all products
4. Manage all orders
5. Update order statuses

## 📋 Features Overview

| Component | Location | Purpose |
|-----------|----------|---------|
| Hiking Plans | `/plans` | Browse and create hiking plans |
| Hiking Planner | `/planner` | Calculate hike requirements |
| Store | `/store` | Browse hiking gear |
| Shopping Cart | `/cart` | Checkout and order history |
| Order Tracking | `/orders` | Track order status |
| Seller Dashboard | `/seller` | Manage products & orders |
| Admin Dashboard | `/admin-dashboard` | System management |
| User Profile | `/profile` | View user info |

## 🔍 Sample Data

### Test Users (Created via `npm run seed`)
- testuser (Regular user)
- testseller (Can sell products)
- testadmin (Full admin access)

### Sample Products
Already in database:
- Hiking Boots ($89.99)
- Backpack 40L ($129.99)
- Water Bottle ($24.99)
- Trekking Poles ($49.99)
- First Aid Kit ($34.99)
- Energy Snack Pack ($12.99)

### Sample Hiking Plans
- Mountain Trail (12km, 4h, Medium)
- Forest Loop (8km, 3h, Easy)
- River Path (16km, 5h, Hard)

## ⚙️ Configuration

### Backend Environment (.env)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRE=24h
ALLOWED_ORIGINS=http://localhost:5173
```

### API Base URL (Frontend)
```javascript
// frontend/src/utils/api.js
const API_BASE = 'http://localhost:5000/api'
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in .env
PORT=5001
```

### CORS Issues
Update `ALLOWED_ORIGINS` in `.env` to match your frontend URL

### Database Locked
```bash
# Delete data files and re-seed
rm -rf backend/data/
npm run seed
```

### Frontend Can't Reach Backend
- Ensure backend is running on port 5000
- Check `API_BASE` URL in `frontend/src/utils/api.js`
- Verify CORS settings in `backend/.env`

## 📚 Documentation

- **SETUP.md** - Complete setup and API documentation
- **IMPROVEMENTS.md** - Detailed list of all improvements
- **README.md** - Project overview

## 🔐 Security Note

This is a **demo application**. For production:
1. Change `JWT_SECRET` to a strong value
2. Use a real database
3. Enable HTTPS
4. Add rate limiting
5. Implement proper auth/verification

## 📞 Support

For issues or questions:
1. Check SETUP.md for detailed API docs
2. Review IMPROVEMENTS.md for feature details
3. Check browser console for errors
4. Check server logs for API errors

---

**Ready to go! Happy hiking! 🥾⛰️**
