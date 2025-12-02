const express = require("express");
const fs = require("fs");
const router = express.Router();
const filePath = __dirname + "/../data/plans.json";

function readData(){ return JSON.parse(fs.readFileSync(filePath)); }
function writeData(d){ fs.writeFileSync(filePath, JSON.stringify(d,null,2)); }

router.get("/", (req,res)=> res.json(readData()));

router.post("/", (req,res)=>{
  const data = readData();
  const plan = { id: Date.now(), ...req.body };
  data.push(plan);
  writeData(data);
  res.json(plan);
});

router.put("/:id", (req,res)=>{
  const id = Number(req.params.id);
  const data = readData().map(p=> p.id===id ? {...p,...req.body} : p);
  writeData(data);
  res.json({message:"updated"});
});

router.delete("/:id", (req,res)=>{
  const id=Number(req.params.id);
  writeData(readData().filter(p=>p.id!==id));
  res.json({message:"deleted"});
});

module.exports = router;
