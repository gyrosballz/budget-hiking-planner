
const router = require('express').Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

router.get('/', async (_,res)=> res.json(await Product.find()));

router.post('/', auth(['seller','admin']), async (req,res)=>{
  res.json(await Product.create({...req.body, createdBy:req.user.id}));
});

router.put('/:id', auth(['seller','admin']), async (req,res)=>{
  res.json(await Product.findByIdAndUpdate(req.params.id, req.body,{new:true}));
});

router.delete('/:id', auth(['admin']), async (req,res)=>{
  await Product.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
