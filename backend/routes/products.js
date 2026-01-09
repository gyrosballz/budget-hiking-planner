const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const filePath = path.join(__dirname, "..", "data", "products.json");

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
    throw new Error("Failed to read products data");
  }
}

function writeJsonFile(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    throw new Error("Failed to save products data");
  }
}

function readData() {
  return readJsonFile(filePath);
}

function writeData(d) {
  writeJsonFile(filePath, d);
}

// Validation functions
function validateProductInput(product) {
  const { name, price, stock, category } = product;
  
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw new Error("Product name is required and must be a string");
  }
  
  if (typeof price !== "number" || price < 0) {
    throw new Error("Price must be a non-negative number");
  }
  
  if (typeof stock !== "number" || stock < 0) {
    throw new Error("Stock must be a non-negative number");
  }
  
  if (category && (typeof category !== "string" || category.trim().length === 0)) {
    throw new Error("Category must be a non-empty string if provided");
  }
  
  return true;
}

// Role check middleware
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient permissions" });
    }
    next();
  };
}

// GET all products (anyone can view)
router.get("/", (req, res) => {
  try {
    const products = readData();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single product by ID
router.get("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const products = readData();
    const product = products.find((p) => p.id === id);
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create product (seller/admin only)
router.post("/", requireRole(["seller", "admin"]), (req, res) => {
  try {
    validateProductInput(req.body);
    
    const data = readData();
    const product = {
      id: Date.now(),
      createdBy: req.user.username || "system",
      createdAt: new Date().toISOString(),
      stock: req.body.stock || 0,
      ...req.body,
    };
    
    data.push(product);
    writeData(data);
    
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update product (seller/admin only)
router.put("/:id", requireRole(["seller", "admin"]), (req, res) => {
  try {
    const id = Number(req.params.id);
    
    if (Object.keys(req.body).length > 0) {
      const existing = readData().find((p) => p.id === id);
      if (!existing) {
        return res.status(404).json({ error: "Product not found" });
      }
      validateProductInput({ ...existing, ...req.body });
    }
    
    const data = readData();
    const productIndex = data.findIndex((p) => p.id === id);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    data[productIndex] = {
      ...data[productIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    
    writeData(data);
    res.json(data[productIndex]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT reduce stock (when item is purchased)
router.put("/:id/reduce-stock", (req, res) => {
  try {
    const id = Number(req.params.id);
    const { quantity } = req.body;
    
    if (typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({ error: "Quantity must be a positive number" });
    }
    
    const data = readData();
    const productIndex = data.findIndex((p) => p.id === id);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    if (data[productIndex].stock < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }
    
    data[productIndex].stock -= quantity;
    writeData(data);
    
    res.json({
      message: "Stock reduced successfully",
      product: data[productIndex],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE product (admin only)
router.delete("/:id", requireRole(["admin"]), (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = readData();
    const initialLength = data.length;
    
    const filtered = data.filter((p) => p.id !== id);
    
    if (filtered.length === initialLength) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    writeData(filtered);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
