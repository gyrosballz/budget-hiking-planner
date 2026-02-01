
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
     coordinates: { lat: 40.3428, lng: -105.6836 },
     waterLiters: 3,
     caloriesNeeded: 800,
     nutritionNotes: 'Bring high-energy snacks and electrolyte drinks. Plan for 2 meal breaks.'
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
     coordinates: { lat: 39.0968, lng: -120.0324 },
     waterLiters: 1.5,
     caloriesNeeded: 300,
     nutritionNotes: 'Light snacks recommended. Water refill available at visitor center.'
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
     coordinates: { lat: 48.7718, lng: -121.2985 },
     waterLiters: 4,
     caloriesNeeded: 1200,
     nutritionNotes: 'High-protein meals essential. Bring emergency food supplies.'
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
     coordinates: { lat: 37.8964, lng: -122.5783 },
     waterLiters: 1,
     caloriesNeeded: 250,
     nutritionNotes: 'Light refreshments sufficient. Picnic area available.'
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
     coordinates: { lat: 37.7489, lng: -119.5872 },
     waterLiters: 2.5,
     caloriesNeeded: 600,
     nutritionNotes: 'Bring waterproof snack bags due to mist. Energy bars recommended.'
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
     coordinates: { lat: 33.8734, lng: -115.9010 },
     waterLiters: 5,
     caloriesNeeded: 1000,
     nutritionNotes: 'Double water supply in summer. Salty snacks help with electrolytes.'
   },
   {
     name: 'Coastal Cliff Walk',
     difficulty: 'easy',
     distance: 4.1,
     elevation: 300,
     duration: 2,
     location: 'Big Sur, California',
     trailType: 'out-and-back',
     features: ['views', 'wildlife', 'kid-friendly'],
     surface: 'paved',
     season: ['spring', 'summer', 'fall', 'winter'],
     description: 'Breathtaking ocean views along dramatic coastal cliffs. Perfect for sunset hikes.',
     rating: 4.8,
     reviews: 324,
     coordinates: { lat: 36.2704, lng: -121.8081 },
     waterLiters: 1.5,
     caloriesNeeded: 350,
     nutritionNotes: 'Pack light snacks and enjoy ocean breeze. Cafe nearby.'
   },
   {
     name: 'Alpine Meadow Trail',
     difficulty: 'moderate',
     distance: 7.2,
     elevation: 1800,
     duration: 3.5,
     location: 'Grand Teton National Park, Wyoming',
     trailType: 'loop',
     features: ['wildflowers', 'views', 'wildlife', 'camping'],
     surface: 'dirt',
     season: ['summer', 'fall'],
     description: 'Wildflower meadows with mountain backdrop. Best in July for peak blooms.',
     rating: 4.7,
     reviews: 198,
     coordinates: { lat: 43.7904, lng: -110.6818 },
     waterLiters: 2.5,
     caloriesNeeded: 700,
     nutritionNotes: 'Lunch break recommended at meadow overlook. Trail mix essential.'
   },
   {
     name: 'Canyon Narrows',
     difficulty: 'hard',
     distance: 9.8,
     elevation: 2500,
     duration: 5.5,
     location: 'Zion National Park, Utah',
     trailType: 'out-and-back',
     features: ['river', 'views', 'camping'],
     surface: 'rocky',
     season: ['spring', 'summer', 'fall'],
     description: 'Slot canyon adventure with river crossings. Check weather for flash flood risk.',
     rating: 4.9,
     reviews: 431,
     coordinates: { lat: 37.2982, lng: -112.9891 },
     waterLiters: 3.5,
     caloriesNeeded: 950,
     nutritionNotes: 'Waterproof food containers required. Energy gels for quick fuel.'
   },
   {
     name: 'Forest Canopy Trail',
     difficulty: 'easy',
     distance: 3.5,
     elevation: 250,
     duration: 1.5,
     location: 'Olympic National Park, Washington',
     trailType: 'loop',
     features: ['wildflowers', 'kid-friendly', 'dogs-allowed'],
     surface: 'dirt',
     season: ['spring', 'summer', 'fall'],
     description: 'Lush rainforest walk through moss-covered trees and ferns.',
     rating: 4.6,
     reviews: 156,
     coordinates: { lat: 47.9609, lng: -123.4986 },
     waterLiters: 1,
     caloriesNeeded: 300,
     nutritionNotes: 'Simple snacks adequate. Watch for berry picking season.'
   }
 ]);
 console.log('✓ Created 10 hiking routes');

 // Seed Products (REI-inspired hiking gear with images)
 const products = await Product.create([
   { 
     name: 'Hiking Backpack (30-40L)', 
     description: 'Ergonomic daypack with hydration sleeve and rain cover',
     price: 74.99, 
     stock: 28, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop'
   },
   { 
     name: 'Waterproof Hiking Boots', 
     description: 'Durable boots with ankle support and aggressive tread for rocky terrain',
     price: 129.99, 
     stock: 22, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop'
   },
   { 
     name: 'Moisture-Wicking Shirt', 
     description: 'Quick-dry breathable fabric keeps you cool on the trail',
     price: 34.99, 
     stock: 45, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop'
   },
   { 
     name: 'Hiking Pants/Shorts', 
     description: 'Convertible zip-off pants with multiple pockets',
     price: 54.99, 
     stock: 35, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&h=300&fit=crop'
   },
   { 
     name: 'Lightweight Rain Jacket', 
     description: 'Breathable Gore-Tex shell with adjustable hood and vents',
     price: 119.99, 
     stock: 20, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1544923246-77307d654f01?w=400&h=300&fit=crop'
   },
   { 
     name: 'Insulated Fleece/Down Jacket', 
     description: 'Lightweight packable insulation for cold weather hiking',
     price: 89.99, 
     stock: 18, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop'
   },
   { 
     name: 'Reusable Water Bottle / Hydration Bladder', 
     description: 'BPA-free 3L water reservoir with insulated tube and bite valve',
     price: 27.99, 
     stock: 40, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=300&fit=crop'
   },
   { 
     name: 'Water Filter/Purifier', 
     description: 'Removes 99.99% of bacteria and protozoa from any water source',
     price: 49.99, 
     stock: 25, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1492633892236-c69f14ac4f15?w=400&h=300&fit=crop'
   },
   { 
     name: 'First Aid Kit', 
     description: 'Comprehensive medical supplies for wilderness emergencies',
     price: 36.99, 
     stock: 50, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&h=300&fit=crop'
   },
   { 
     name: 'Headlamp', 
     description: 'Bright 350-lumen LED with red light mode and 25-hour battery',
     price: 22.99, 
     stock: 55, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop'
   },
   { 
     name: 'Multi-tool/Knife', 
     description: '15-function camping tool with pliers, knife, saw, and screwdrivers',
     price: 42.99, 
     stock: 38, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1599751449318-4f39eb6dec43?w=400&h=300&fit=crop'
   },
   { 
     name: 'Trekking Poles', 
     description: 'Adjustable aluminum poles with cork grips reduce knee strain',
     price: 44.99, 
     stock: 30, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
   },
   { 
     name: 'Sun Hat/Cap', 
     description: 'Wide-brim sun protection hat with chin strap and UPF 50+',
     price: 24.99, 
     stock: 42, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=300&fit=crop'
   },
   { 
     name: 'Sunglasses', 
     description: 'Polarized UV protection with anti-glare coating',
     price: 32.99, 
     stock: 48, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=300&fit=crop'
   },
   { 
     name: 'Sunscreen & Insect Repellent', 
     description: 'SPF 50 sunscreen and DEET-free bug spray combo pack',
     price: 18.99, 
     stock: 60, 
     createdBy: seller._id,
     imageUrl: ''
   },
   { 
     name: 'Energy Bars/Trail Snacks', 
     description: 'High-calorie protein bars and trail mix variety pack (12 count)',
     price: 21.99, 
     stock: 70, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400&h=300&fit=crop'
   },
   { 
     name: 'Compact Power Bank', 
     description: '20000mAh battery pack with solar charging and dual USB ports',
     price: 38.99, 
     stock: 32, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=300&fit=crop'
   },
   { 
     name: 'Emergency Blanket', 
     description: 'Thermal mylar blanket retains 90% body heat in emergencies',
     price: 12.99, 
     stock: 65, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=400&h=300&fit=crop'
   },
   { 
     name: 'Map & Compass', 
     description: 'Professional orienteering compass with topographic map case',
     price: 29.99, 
     stock: 28, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=400&h=300&fit=crop'
   },
   { 
     name: 'Budget Backpacking Tent (2-Person)', 
     description: 'Lightweight waterproof dome tent perfect for backcountry camping',
     price: 79.99, 
     stock: 20, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=300&fit=crop'
   },
   { 
     name: 'Lightweight Sleeping Bag (15°F)', 
     description: 'Compact mummy-style insulated bag rated for cold weather',
     price: 64.99, 
     stock: 25, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop'
   },
   { 
     name: 'Portable Hiking Stove', 
     description: 'Ultralight canister stove with windscreen and pot support',
     price: 31.99, 
     stock: 15, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1531223651270-b8efb1a45ebc?w=400&h=300&fit=crop'
   },
   { 
     name: 'GPS Watch', 
     description: 'Rugged outdoor watch with altimeter, barometer, and compass',
     price: 249.99, 
     stock: 10, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'
   },
   { 
     name: 'Camping Hammock', 
     description: 'Portable parachute hammock with tree straps and carabiners',
     price: 33.99, 
     stock: 30, 
     createdBy: seller._id,
     imageUrl: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400&h=300&fit=crop'
   }
 ]);
 console.log('✓ Created 25 hiking products');

 // Update routes with recommended gear linked to products
 await Route.findByIdAndUpdate(routes[0]._id, {
   recommendedGear: [
     { name: 'Hiking Backpack', productId: products[0]._id, priority: 'essential' },
     { name: 'Hydration Bladder', productId: products[6]._id, priority: 'essential' },
     { name: 'Waterproof Hiking Boots', productId: products[1]._id, priority: 'essential' },
     { name: 'Trekking Poles', productId: products[11]._id, priority: 'recommended' },
     { name: 'Energy Bars/Trail Snacks', productId: products[15]._id, priority: 'recommended' },
     { name: 'First Aid Kit', productId: products[8]._id, priority: 'recommended' },
   ]
 });

 await Route.findByIdAndUpdate(routes[1]._id, {
   recommendedGear: [
     { name: 'Hydration Bladder', productId: products[6]._id, priority: 'essential' },
     { name: 'Waterproof Hiking Boots', productId: products[1]._id, priority: 'recommended' },
     { name: 'Energy Bars/Trail Snacks', productId: products[15]._id, priority: 'optional' },
     { name: 'Sun Hat/Cap', productId: products[12]._id, priority: 'recommended' },
   ]
 });

 await Route.findByIdAndUpdate(routes[2]._id, {
   recommendedGear: [
     { name: 'Hiking Backpack', productId: products[0]._id, priority: 'essential' },
     { name: 'Trekking Poles', productId: products[11]._id, priority: 'essential' },
     { name: 'Waterproof Hiking Boots', productId: products[1]._id, priority: 'essential' },
     { name: 'GPS Watch', productId: products[22]._id, priority: 'essential' },
     { name: 'Hydration Bladder', productId: products[6]._id, priority: 'essential' },
     { name: 'Insulated Jacket', productId: products[5]._id, priority: 'recommended' },
     { name: 'First Aid Kit', productId: products[8]._id, priority: 'recommended' },
     { name: 'Emergency Blanket', productId: products[17]._id, priority: 'recommended' },
   ]
 });

 await Route.findByIdAndUpdate(routes[3]._id, {
   recommendedGear: [
     { name: 'Waterproof Hiking Boots', productId: products[1]._id, priority: 'recommended' },
     { name: 'Hydration Bladder', productId: products[6]._id, priority: 'recommended' },
     { name: 'Energy Bars/Trail Snacks', productId: products[15]._id, priority: 'optional' },
     { name: 'Sunscreen & Insect Repellent', productId: products[14]._id, priority: 'recommended' },
   ]
 });

 await Route.findByIdAndUpdate(routes[4]._id, {
   recommendedGear: [
     { name: 'Hiking Backpack', productId: products[0]._id, priority: 'essential' },
     { name: 'Waterproof Rain Jacket', productId: products[4]._id, priority: 'essential' },
     { name: 'Waterproof Hiking Boots', productId: products[1]._id, priority: 'essential' },
     { name: 'Hydration Bladder', productId: products[6]._id, priority: 'recommended' },
     { name: 'Energy Bars/Trail Snacks', productId: products[15]._id, priority: 'recommended' },
   ]
 });

 await Route.findByIdAndUpdate(routes[5]._id, {
   recommendedGear: [
     { name: 'Hiking Backpack', productId: products[0]._id, priority: 'essential' },
     { name: 'Hydration Bladder', productId: products[6]._id, priority: 'essential' },
     { name: 'Waterproof Hiking Boots', productId: products[1]._id, priority: 'essential' },
     { name: 'Water Filter/Purifier', productId: products[7]._id, priority: 'essential' },
     { name: 'Compact Power Bank', productId: products[16]._id, priority: 'recommended' },
     { name: 'Energy Bars/Trail Snacks', productId: products[15]._id, priority: 'recommended' },
     { name: 'First Aid Kit', productId: products[8]._id, priority: 'recommended' },
   ]
 });

 await Route.findByIdAndUpdate(routes[6]._id, {
   recommendedGear: [
     { name: 'Waterproof Hiking Boots', productId: products[1]._id, priority: 'recommended' },
     { name: 'Hydration Bladder', productId: products[6]._id, priority: 'recommended' },
     { name: 'Energy Bars/Trail Snacks', productId: products[15]._id, priority: 'optional' },
     { name: 'Sunglasses', productId: products[13]._id, priority: 'recommended' },
   ]
 });

 await Route.findByIdAndUpdate(routes[7]._id, {
   recommendedGear: [
     { name: 'Hiking Backpack', productId: products[0]._id, priority: 'essential' },
     { name: 'Waterproof Hiking Boots', productId: products[1]._id, priority: 'essential' },
     { name: 'Hydration Bladder', productId: products[6]._id, priority: 'recommended' },
     { name: 'Trekking Poles', productId: products[11]._id, priority: 'recommended' },
     { name: 'Energy Bars/Trail Snacks', productId: products[15]._id, priority: 'recommended' },
   ]
 });

 await Route.findByIdAndUpdate(routes[8]._id, {
   recommendedGear: [
     { name: 'Hiking Backpack', productId: products[0]._id, priority: 'essential' },
     { name: 'Waterproof Hiking Boots', productId: products[1]._id, priority: 'essential' },
     { name: 'Hydration Bladder', productId: products[6]._id, priority: 'essential' },
     { name: 'Waterproof Rain Jacket', productId: products[4]._id, priority: 'essential' },
     { name: 'GPS Watch', productId: products[22]._id, priority: 'recommended' },
     { name: 'First Aid Kit', productId: products[8]._id, priority: 'recommended' },
     { name: 'Water Filter/Purifier', productId: products[7]._id, priority: 'recommended' },
     { name: 'Map & Compass', productId: products[18]._id, priority: 'recommended' },
   ]
 });

 await Route.findByIdAndUpdate(routes[9]._id, {
   recommendedGear: [
     { name: 'Waterproof Hiking Boots', productId: products[1]._id, priority: 'recommended' },
     { name: 'Hydration Bladder', productId: products[6]._id, priority: 'recommended' },
     { name: 'Waterproof Rain Jacket', productId: products[4]._id, priority: 'optional' },
     { name: 'Energy Bars/Trail Snacks', productId: products[15]._id, priority: 'optional' },
   ]
 });

 console.log('✓ Added recommended gear to all routes');

 // Seed Plans (with enhanced trip planning features)
 await Plan.create([
   {
     name: 'Weekend Mountain Escape',
     route: routes[0]._id, // Pine Ridge Trail (moderate)
     budget: 250,
     duration: 2,
     startDate: new Date('2026-06-15'),
     endDate: new Date('2026-06-17'),
     status: 'confirmed',
     companions: 2,
     gearList: [
       { item: 'Tent', purchased: true, productId: products[19]._id },
       { item: 'Sleeping Bag', purchased: true, productId: products[20]._id },
       { item: 'Hiking Stove', purchased: false, productId: products[21]._id },
       { item: 'First Aid Kit', purchased: true, productId: products[8]._id }
     ],
     notes: 'Remember to bring sunscreen and bug spray. Check weather forecast before departure.',
     user: user._id
   },
   {
     name: 'Family Lake Day Hike',
     route: routes[1]._id, // Lake Loop (easy)
     budget: 80,
     duration: 1,
     startDate: new Date('2026-05-20'),
     endDate: new Date('2026-05-20'),
     status: 'planning',
     companions: 4,
     gearList: [
       { item: 'Water Bottles', purchased: true, productId: products[6]._id },
       { item: 'Trail Snacks', purchased: false, productId: products[15]._id },
       { item: 'Sunscreen & Insect Repellent', purchased: true, productId: products[14]._id },
       { item: 'Sun Hats', purchased: true, productId: products[12]._id }
     ],
     notes: 'Kid-friendly trail. Bring camera for photos.',
     user: user._id
   },
   {
     name: 'Eagle Peak Challenge',
     route: routes[2]._id, // Eagle Peak Summit (hard)
     budget: 400,
     duration: 3,
     startDate: new Date('2026-07-10'),
     endDate: new Date('2026-07-13'),
     status: 'planning',
     companions: 1,
     gearList: [
       { item: 'Tent', purchased: false, productId: products[19]._id },
       { item: 'Sleeping Bag', purchased: false, productId: products[20]._id },
       { item: 'Trekking Poles', purchased: true, productId: products[11]._id },
       { item: 'Emergency Blanket', purchased: false, productId: products[17]._id },
       { item: 'GPS Watch', purchased: true, productId: products[22]._id }
     ],
     notes: 'Experienced hike only. Check alpine conditions. Permits required.',
     user: user._id
   },
   {
     name: 'Redwood Forest Exploration',
     route: routes[3]._id, // Redwood Grove (easy)
     budget: 60,
     duration: 1,
     startDate: new Date('2026-06-05'),
     endDate: new Date('2026-06-05'),
     status: 'confirmed',
     companions: 3,
     gearList: [
       { item: 'Hiking Boots', purchased: true, productId: products[1]._id },
       { item: 'Hydration Bladder', purchased: true, productId: products[6]._id },
       { item: 'Trail Snacks', purchased: true, productId: products[15]._id }
     ],
     notes: 'Perfect for nature photography. Arrive early to avoid crowds.',
     user: user._id
   },
   {
     name: 'Waterfall Adventure',
     route: routes[4]._id, // Waterfall Canyon (moderate)
     budget: 150,
     duration: 1,
     startDate: new Date('2026-08-12'),
     endDate: new Date('2026-08-12'),
     status: 'planning',
     companions: 2,
     gearList: [
       { item: 'Waterproof Jacket', purchased: true, productId: products[4]._id },
       { item: 'Hiking Boots', purchased: true, productId: products[1]._id },
       { item: 'Backpack', purchased: false, productId: products[0]._id },
       { item: 'Energy Bars', purchased: true, productId: products[15]._id }
     ],
     notes: 'Bring waterproof camera bag. Trail gets misty near falls.',
     user: user._id
   },
   {
     name: 'Desert Trek Experience',
     route: routes[5]._id, // Desert Ridge Trail (hard)
     budget: 320,
     duration: 2,
     startDate: new Date('2026-10-15'),
     endDate: new Date('2026-10-17'),
     status: 'confirmed',
     companions: 2,
     gearList: [
       { item: 'Tent', purchased: true, productId: products[19]._id },
       { item: 'Water Filter', purchased: true, productId: products[7]._id },
       { item: 'Hydration Bladder', purchased: true, productId: products[6]._id },
       { item: 'First Aid Kit', purchased: true, productId: products[8]._id },
       { item: 'Headlamp', purchased: false, productId: products[9]._id }
     ],
     notes: 'Carry extra water! Temperature drops significantly at night. Pack layers.',
     user: user._id
   },
   {
     name: 'Coastal Sunset Hike',
     route: routes[6]._id, // Coastal Cliff Walk (easy)
     budget: 50,
     duration: 1,
     startDate: new Date('2026-09-01'),
     endDate: new Date('2026-09-01'),
     status: 'planning',
     companions: 1,
     gearList: [
       { item: 'Sunglasses', purchased: true, productId: products[13]._id },
       { item: 'Water Bottle', purchased: true, productId: products[6]._id },
       { item: 'Sun Hat', purchased: false, productId: products[12]._id }
     ],
     notes: 'Plan for sunset arrival around 7 PM. Bring wind jacket.',
     user: user._id
   },
   {
     name: 'Alpine Meadow Camping',
     route: routes[7]._id, // Alpine Meadow Trail (moderate)
     budget: 280,
     duration: 2,
     startDate: new Date('2026-07-20'),
     endDate: new Date('2026-07-22'),
     status: 'planning',
     companions: 3,
     gearList: [
       { item: 'Tent', purchased: true, productId: products[19]._id },
       { item: 'Sleeping Bags', purchased: true, productId: products[20]._id },
       { item: 'Camping Stove', purchased: true, productId: products[21]._id },
       { item: 'Trekking Poles', purchased: false, productId: products[11]._id },
       { item: 'Insulated Jacket', purchased: true, productId: products[5]._id }
     ],
     notes: 'Wildflower season! Bring field guide. Reserve camping permit.',
     user: user._id
   },
   {
     name: 'Canyon Narrows Expedition',
     route: routes[8]._id, // Canyon Narrows (hard)
     budget: 450,
     duration: 3,
     startDate: new Date('2026-09-15'),
     endDate: new Date('2026-09-18'),
     status: 'confirmed',
     companions: 2,
     gearList: [
       { item: 'Tent', purchased: true, productId: products[19]._id },
       { item: 'GPS Watch', purchased: true, productId: products[22]._id },
       { item: 'Water Filter', purchased: true, productId: products[7]._id },
       { item: 'Waterproof Jacket', purchased: true, productId: products[4]._id },
       { item: 'Map & Compass', purchased: true, productId: products[18]._id },
       { item: 'Emergency Blanket', purchased: false, productId: products[17]._id }
     ],
     notes: 'Flash flood risk - check weather 48hrs before. No cell service.',
     user: user._id
   },
   {
     name: 'Forest Canopy Nature Walk',
     route: routes[9]._id, // Forest Canopy Trail (easy)
     budget: 45,
     duration: 1,
     startDate: new Date('2026-06-28'),
     endDate: new Date('2026-06-28'),
     status: 'confirmed',
     companions: 5,
     gearList: [
       { item: 'Hiking Boots', purchased: true, productId: products[1]._id },
       { item: 'Rain Jacket', purchased: false, productId: products[4]._id },
       { item: 'Trail Snacks', purchased: true, productId: products[15]._id }
     ],
     notes: 'Great for kids and beginners. Moss-covered trails can be slippery.',
     user: user._id
   }
 ]);
 console.log('✓ Created 10 hiking plans');

 console.log('\n🎉 Seed completed successfully!');
 console.log('\nTest accounts:');
 console.log('  Admin: admin@test.com / admin123');
 console.log('  Seller: seller@test.com / seller123');
 console.log('  User: user@test.com / user123');
 
 process.exit();
})();
