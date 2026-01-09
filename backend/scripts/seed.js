#!/usr/bin/env node

/**
 * Seed script to initialize test data for the Budget Hiking Planner
 * Run: node scripts/seed.js
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const dataDir = path.join(__dirname, '..', 'data');

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✓ Created data directory');
}

// Initialize test users with bcrypt hashed passwords
async function seedUsers() {
  const usersFile = path.join(dataDir, 'users.json');
  
  const testUsers = {
    testuser: {
      password: await bcrypt.hash('pass123', 10),
      role: 'user',
      createdAt: new Date().toISOString(),
    },
    testseller: {
      password: await bcrypt.hash('pass123', 10),
      role: 'seller',
      createdAt: new Date().toISOString(),
    },
    testadmin: {
      password: await bcrypt.hash('pass123', 10),
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
  };

  fs.writeFileSync(usersFile, JSON.stringify(testUsers, null, 2));
  console.log('✓ Initialized test users');
  console.log('  - testuser / pass123 (User)');
  console.log('  - testseller / pass123 (Seller)');
  console.log('  - testadmin / pass123 (Admin)');
}

// Initialize sample hiking plans
function seedPlans() {
  const plansFile = path.join(dataDir, 'plans.json');
  
  const plans = [
    {
      id: 1,
      name: 'Mountain Trail',
      distance: 12,
      duration: 4,
      difficulty: 'Medium',
      budget: 50,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Forest Loop',
      distance: 8,
      duration: 3,
      difficulty: 'Easy',
      budget: 30,
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      name: 'River Path',
      distance: 16,
      duration: 5,
      difficulty: 'Hard',
      budget: 80,
      createdAt: new Date().toISOString(),
    },
  ];

  fs.writeFileSync(plansFile, JSON.stringify(plans, null, 2));
  console.log('✓ Initialized hiking plans');
}

// Initialize sample products
function seedProducts() {
  const productsFile = path.join(dataDir, 'products.json');
  
  const products = [
    {
      id: 1001,
      name: 'Hiking Boots',
      price: 89.99,
      stock: 15,
      category: 'Footwear',
      createdBy: 'testseller',
      createdAt: new Date().toISOString(),
    },
    {
      id: 1002,
      name: 'Backpack (40L)',
      price: 129.99,
      stock: 8,
      category: 'Bags',
      createdBy: 'testseller',
      createdAt: new Date().toISOString(),
    },
    {
      id: 1003,
      name: 'Water Bottle (1L)',
      price: 24.99,
      stock: 30,
      category: 'Hydration',
      createdBy: 'testseller',
      createdAt: new Date().toISOString(),
    },
    {
      id: 1004,
      name: 'Trekking Poles',
      price: 49.99,
      stock: 12,
      category: 'Accessories',
      createdBy: 'testseller',
      createdAt: new Date().toISOString(),
    },
    {
      id: 1005,
      name: 'First Aid Kit',
      price: 34.99,
      stock: 20,
      category: 'Safety',
      createdBy: 'testseller',
      createdAt: new Date().toISOString(),
    },
    {
      id: 1006,
      name: 'Energy Snack Pack',
      price: 12.99,
      stock: 50,
      category: 'Food',
      createdBy: 'testseller',
      createdAt: new Date().toISOString(),
    },
  ];

  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
  console.log('✓ Initialized sample products');
}

// Initialize empty orders
function seedOrders() {
  const ordersFile = path.join(dataDir, 'orders.json');
  fs.writeFileSync(ordersFile, JSON.stringify([], null, 2));
  console.log('✓ Initialized orders');
}

// Run seed
async function seed() {
  try {
    console.log('\n🌱 Seeding Budget Hiking Planner...\n');
    
    await seedUsers();
    seedPlans();
    seedProducts();
    seedOrders();
    
    console.log('\n✅ Database seeded successfully!\n');
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
