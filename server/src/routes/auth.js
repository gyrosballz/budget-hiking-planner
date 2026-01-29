
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req,res)=>{
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    const hash = await bcrypt.hash(password, 10);
    const u = await User.create({
      name,
      email,
      password: hash,
      role: 'user'
    });
    
    // Auto-login after registration
    const token = jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET);
    res.json({ token, user: u });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req,res)=>{
  try {
    const u = await User.findOne({email:req.body.email});
    if(!u || !await bcrypt.compare(req.body.password,u.password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({id:u._id,role:u.role},process.env.JWT_SECRET);
    res.json({token});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
