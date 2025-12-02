const express = require("express");
const fs = require("fs");
const router = express.Router();
const filePath = __dirname + "/../data/products.json";

function readData(){ return JSON.parse(fs.readFileSync(filePath)); }
function writeData(d){ fs.writeFileSync(filePath, JSON.stringify(d,null,2)); }

router.get("/", (req,res)=> res.json(readData()));

// create product - only seller/admin
router.post("/", (req,res)=>{
  if(!['seller','admin'].includes(req.user.role)) return res.status(403).json({error:'forbidden'});
  const data = readData();
  const prod = { id: Date.now(), ...req.body };
  data.push(prod);
  writeData(data);
  res.json(prod);
});

// update product
router.put("/:id",(req,res)=>{
  if(!['seller','admin'].includes(req.user.role)) return res.status(403).json({error:'forbidden'});
  const id=Number(req.params.id);
  const data = readData().map(p=> p.id===id? {...p,...req.body}:p);
  writeData(data);
  res.json({message:'updated'});
});

// delete product
router.delete("/:id",(req,res)=>{
  if(!['seller','admin'].includes(req.user.role)) return res.status(403).json({error:'forbidden'});
  const id=Number(req.params.id);
  writeData(readData().filter(p=>p.id!==id));
  res.json({message:'deleted'});
});

module.exports = router;
