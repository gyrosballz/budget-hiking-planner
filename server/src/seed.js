
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Plan = require('./models/Plan');
const Route = require('./models/Route');

(async()=>{
 await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
 
 // Clear existing data
 await User.deleteMany();
 await Product.deleteMany();
 await Plan.deleteMany();
 await Route.deleteMany();
 
 // Create users
 const [admin, seller, user] = await User.create([
   { name: 'Admin', email: 'admin@test.com', password: await bcrypt.hash('admin123', 10), role: 'admin' },
   { name: 'Seller', email: 'seller@test.com', password: await bcrypt.hash('seller123', 10), role: 'seller' },
   { name: 'User', email: 'user@test.com', password: await bcrypt.hash('user123', 10), role: 'user' }
 ]);
 console.log('✓ Created users');

 // Seed Routes (AllTrails-inspired with enhanced features)
 const routes = await Route.create([
   {
     name: 'Pine Ridge Trail',
     difficulty: 'moderate',
     distance: 8.5,
     elevation: 2100,
     duration: 4,
     location: 'Rocky Mountain National Park, Colorado',
     trailType: 'out-and-back',
     features: ['views', 'wildflowers', 'dogs-allowed', 'camping'],
     surface: 'dirt',
     season: ['spring', 'summer', 'fall'],
     description: 'Beautiful mountain trail with scenic vistas and alpine meadows. Best hiked June through October.',
     rating: 4.8,
     reviews: 142,
     coordinates: { lat: 40.3428, lng: -105.6836 }
   },
   {
     name: 'Lake Loop',
     difficulty: 'easy',
     distance: 3.2,
     elevation: 400,
     duration: 1.5,
     location: 'Lake Tahoe, California',
     trailType: 'loop',
     features: ['lake', 'kid-friendly', 'dogs-allowed', 'views'],
     surface: 'paved',
     season: ['spring', 'summer', 'fall', 'winter'],
     description: 'Peaceful lakeside hike perfect for families and beginners. Wheelchair accessible.',
     rating: 4.5,
     reviews: 89,
     coordinates: { lat: 39.0968, lng: -120.0324 }
   },
   {
     name: 'Eagle Peak Summit',
     difficulty: 'hard',
     distance: 12,
     elevation: 3500,
     duration: 6,
     location: 'North Cascades, Washington',
     trailType: 'out-and-back',
     features: ['views', 'wildlife', 'camping'],
     surface: 'rocky',
     season: ['summer', 'fall'],
     description: 'Challenging alpine trek with stunning 360-degree panoramas. Experienced hikers only.',
     rating: 4.9,
     reviews: 256,
     coordinates: { lat: 48.7718, lng: -121.2985 }
   },
   {
     name: 'Redwood Grove',
     difficulty: 'easy',
     distance: 2.8,
     elevation: 200,
     duration: 1,
     location: 'Muir Woods, California',
     trailType: 'loop',
     features: ['wildflowers', 'kid-friendly', 'dogs-allowed'],
     surface: 'dirt',
     season: ['spring', 'summer', 'fall', 'winter'],
     description: 'Walk among ancient towering redwood trees in this peaceful forest sanctuary.',
     rating: 4.7,
     reviews: 203,
     coordinates: { lat: 37.8964, lng: -122.5783 }
   },
   {
     name: 'Waterfall Canyon',
     difficulty: 'moderate',
     distance: 5.4,
     elevation: 1200,
     duration: 3,
     location: 'Yosemite National Park, California',
     trailType: 'out-and-back',
     features: ['waterfall', 'river', 'views', 'wildflowers'],
     surface: 'rocky',
     season: ['spring', 'summer'],
     description: 'Stunning waterfall views with mist spray in spring. Moderate elevation gain.',
     rating: 4.9,
     reviews: 512,
     coordinates: { lat: 37.7489, lng: -119.5872 }
   },
   {
     name: 'Desert Ridge Trail',
     difficulty: 'hard',
     distance: 10.2,
     elevation: 2800,
     duration: 5,
     location: 'Joshua Tree National Park, California',
     trailType: 'loop',
     features: ['views', 'wildlife', 'camping'],
     surface: 'rocky',
     season: ['fall', 'winter', 'spring'],
     description: 'Desert landscape with unique rock formations and Joshua trees. Bring plenty of water.',
     rating: 4.6,
     reviews: 178,
     coordinates: { lat: 33.8734, lng: -115.9010 }
   }
 ]);
 console.log('✓ Created 6 hiking routes');

 // Seed Products (REI-inspired hiking gear with images)
 const products = await Product.create([
   { 
     name: 'Budget Backpacking Tent (2-Person)', 
     description: 'Lightweight, waterproof dome tent perfect for backcountry trips',
     price: 79.99, 
     stock: 20, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=300&fit=crop'
   },
   { 
     name: 'Lightweight Sleeping Bag (15°F)', 
     description: 'Compact insulated bag rated for cold weather hiking',
     price: 59.99, 
     stock: 25, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop'
   },
   { 
     name: 'Portable Hiking Stove', 
     description: 'Ultralight canister stove with windscreen and pot support',
     price: 29.99, 
     stock: 15, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1531223651270-b8efb1a45ebc?w=400&h=300&fit=crop'
   },
   { 
     name: 'Trekking Poles (Pair)', 
     description: 'Adjustable aluminum poles reduce knee strain on descents',
     price: 39.99, 
     stock: 30, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
   },
   { 
     name: 'Hydration Bladder (3L)', 
     description: 'BPA-free water reservoir with insulated tube and valve',
     price: 24.99, 
     stock: 40, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=300&fit=crop'
   },
   { 
     name: 'Trail Running Shoes', 
     description: 'Waterproof hiking shoes with aggressive tread for rocky terrain',
     price: 89.99, 
     stock: 18, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop'
   },
   { 
     name: 'LED Headlamp', 
     description: 'Bright 300-lumen headlamp with red light mode and 20-hour battery',
     price: 19.99, 
     stock: 50, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop'
   },
   { 
     name: 'Camping Cookware Set', 
     description: 'Nesting pots, pans, and utensils with carrying bag',
     price: 44.99, 
     stock: 12, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1542519227-7622c3c64d57?w=400&h=300&fit=crop'
   },
   { 
     name: 'Emergency Bivy Sack', 
     description: 'Lightweight emergency shelter rated to -20°F',
     price: 14.99, 
     stock: 35, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=300&fit=crop'
   },
   { 
     name: 'Portable Water Filter', 
     description: 'Removes 99.99% of bacteria and protozoa from any water source',
     price: 54.99, 
     stock: 22, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1492633892236-c69f14ac4f15?w=400&h=300&fit=crop'
   }
 ]);
 console.log('✓ Created 10 hiking products');

 // Seed Plans (with enhanced trip planning features)
 await Plan.create([
   {
     name: 'Weekend Mountain Escape',
     route: routes[0]._id, // Pine Ridge Trail
     budget: 250,
     duration: 2,
     startDate: new Date('2026-06-15'),
     endDate: new Date('2026-06-17'),
     status: 'confirmed',
     companions: 2,
     gearList: [
       { item: 'Tent', purchased: true, productId: products[0]._id },
       { item: 'Sleeping Bag', purchased: true, productId: products[1]._id },
       { item: 'Stove', purchased: false, productId: products[2]._id },
       { item: 'First Aid Kit', purchased: true }
     ],
     notes: 'Remember to bring sunscreen and bug spray. Check weather forecast before departure.',
     user: user._id
   },
   {
     name: 'Family Lake Day Hike',
     route: routes[1]._id, // Lake Loop
     budget: 80,
     duration: 1,
     startDate: new Date('2026-05-20'),
     endDate: new Date('2026-05-20'),
     status: 'planning',
     companions: 4,
     gearList: [
       { item: 'Water bottles', purchased: true },
       { item: 'Snacks', purchased: false },
       { item: 'Sunscreen', purchased: true }
     ],
     notes: 'Kid-friendly trail. Bring camera for photos.',
     user: user._id
   },
   {
     name: 'Eagle Peak Challenge',
     route: routes[2]._id, // Eagle Peak Summit
     budget: 400,
     duration: 3,
     startDate: new Date('2026-07-10'),
     endDate: new Date('2026-07-13'),
     status: 'planning',
     companions: 1,
     gearList: [
       { item: 'Tent', purchased: false, productId: products[0]._id },
       { item: 'Sleeping Bag', purchased: false, productId: products[1]._id },
       { item: 'Trekking Poles', purchased: true, productId: products[3]._id },
       { item: 'Emergency Shelter', purchased: false, productId: products[8]._id }
     ],
     notes: 'Experienced hike only. Check alpine conditions. Permits required.',
     user: user._id
   }
 ]);
 console.log('✓ Created 3 hiking plans');

 console.log('\n🎉 Seed completed successfully!');
 console.log('\nTest accounts:');
 console.log('  Admin: admin@test.com / admin123');
 console.log('  Seller: seller@test.com / seller123');
 console.log('  User: user@test.com / user123');
 
 process.exit();
})();
