const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const filePath = path.join(__dirname, "..", "data", "plans.json");

// Utility functions with error handling
function readJsonFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    throw new Error("Failed to read plans data");
  }
}

function writeJsonFile(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    throw new Error("Failed to save plans data");
  }
}

function readData() {
  return readJsonFile(filePath);
}

function writeData(d) {
  writeJsonFile(filePath, d);
}

// Validation functions
function validatePlanInput(plan) {
  const { name, distance, duration, difficulty, budget } = plan;
  
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw new Error("Plan name is required and must be a string");
  }
  
  if (typeof distance !== "number" || distance <= 0) {
    throw new Error("Distance must be a positive number");
  }
  
  if (typeof duration !== "number" || duration <= 0) {
    throw new Error("Duration must be a positive number");
  }
  
  if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
    throw new Error("Difficulty must be Easy, Medium, or Hard");
  }
  
  if (typeof budget !== "number" || budget < 0) {
    throw new Error("Budget must be a non-negative number");
  }
  
  return true;
}

// Require admin/seller role for creating/editing/deleting
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient permissions" });
    }
    next();
  };
}

// GET all plans (anyone can view)
router.get("/", (req, res) => {
  try {
    const plans = readData();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single plan by ID
router.get("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const plans = readData();
    const plan = plans.find((p) => p.id === id);
    
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }
    
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create plan (admin/seller only)
router.post("/", requireRole(["admin", "seller"]), (req, res) => {
  try {
    validatePlanInput(req.body);
    
    const data = readData();
    const plan = {
      id: Date.now(),
      createdBy: req.user.username || "system",
      createdAt: new Date().toISOString(),
      ...req.body,
    };
    
    data.push(plan);
    writeData(data);
    
    res.status(201).json(plan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update plan (admin/seller only)
router.put("/:id", requireRole(["admin", "seller"]), (req, res) => {
  try {
    const id = Number(req.params.id);
    
    if (Object.keys(req.body).length > 0) {
      validatePlanInput({ ...readData().find((p) => p.id === id), ...req.body });
    }
    
    const data = readData();
    const planIndex = data.findIndex((p) => p.id === id);
    
    if (planIndex === -1) {
      return res.status(404).json({ error: "Plan not found" });
    }
    
    data[planIndex] = {
      ...data[planIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    
    writeData(data);
    res.json(data[planIndex]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE plan (admin/seller only)
router.delete("/:id", requireRole(["admin", "seller"]), (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = readData();
    const initialLength = data.length;
    
    const filtered = data.filter((p) => p.id !== id);
    
    if (filtered.length === initialLength) {
      return res.status(404).json({ error: "Plan not found" });
    }
    
    writeData(filtered);
    res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
