const express = require("express");
const fs = require("fs");
const router = express.Router();
const filePath = __dirname + "/../data/orders.json";

function readData(){ return JSON.parse(fs.readFileSync(filePath)); }
function writeData(d){ fs.writeFileSync(filePath, JSON.stringify(d,null,2)); }

// get orders - seller/admin only
router.get("/", (req,res)=>{
  if(!['seller','admin'].includes(req.user.role)) return res.status(403).json({error:'forbidden'});
  res.json(readData());
});

router.post("/", (req,res)=>{
  const data = readData();
  const order = { id: Date.now(), date: new Date().toISOString(), ...req.body };
  data.push(order);
  writeData(data);
  res.json(order);
});

module.exports = router;
