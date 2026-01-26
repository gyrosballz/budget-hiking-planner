const bcrypt = require('bcrypt');
const { connectDB } = require('../lib/mongodb-seed');
const { User, Plan, Product, Order } = require('../lib/models-seed');

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Plan.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    // Seed users
    const testUsers = [
      { username: 'testuser', password: 'pass123', role: 'user' },
      { username: 'testseller', password: 'pass123', role: 'seller' },
      { username: 'testadmin', password: 'pass123', role: 'admin' },
    ];

    for (const user of testUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await User.create({
        username: user.username,
        password: hashedPassword,
        role: user.role,
      });
    }
    console.log('✅ Users seeded');

    // Seed plans
    const plans = [
      {
        name: 'Easy Mountain Trail',
        distance: 5,
        duration: 2,
        difficulty: 'Easy',
        budget: 50,
        createdBy: 'testseller',
      },
      {
        name: 'Forest Loop',
        distance: 12,
        duration: 4,
        difficulty: 'Medium',
        budget: 80,
        createdBy: 'testseller',
      },
      {
        name: 'Peak Challenge',
        distance: 20,
        duration: 8,
        difficulty: 'Hard',
        budget: 150,
        createdBy: 'testseller',
      },
    ];
    await Plan.insertMany(plans);
    console.log('✅ Plans seeded');

    // Seed products
    const products = [
      {
        name: 'Hiking Boots',
        price: 89.99,
        stock: 20,
        category: 'Footwear',
        createdBy: 'testseller',
      },
      {
        name: 'Backpack',
        price: 49.99,
        stock: 15,
        category: 'Gear',
        createdBy: 'testseller',
      },
      {
        name: 'Water Bottle',
        price: 19.99,
        stock: 50,
        category: 'Accessories',
        createdBy: 'testseller',
      },
      {
        name: 'Trail Map',
        price: 9.99,
        stock: 100,
        category: 'Maps',
        createdBy: 'testseller',
      },
    ];
    await Product.insertMany(products);
    console.log('✅ Products seeded');

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();

