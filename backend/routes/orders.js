const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const filePath = path.join(__dirname, "..", "data", "orders.json");

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
    throw new Error("Failed to read orders data");
  }
}

function writeJsonFile(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    throw new Error("Failed to save orders data");
  }
}

function readData() {
  return readJsonFile(filePath);
}

function writeData(d) {
  writeJsonFile(filePath, d);
}

// Status workflow: Pending -> Processing -> Shipped -> Delivered
const VALID_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_WORKFLOW = {
  "Pending": ["Processing", "Cancelled"],
  "Processing": ["Shipped", "Cancelled"],
  "Shipped": ["Delivered"],
  "Delivered": [],
  "Cancelled": [],
};

function validateOrderInput(order) {
  const { items, status } = order;
  
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Order must contain at least one item");
  }
  
  items.forEach((item, index) => {
    if (!item.name || typeof item.name !== "string") {
      throw new Error(`Item ${index} must have a valid name`);
    }
    if (typeof item.price !== "number" || item.price < 0) {
      throw new Error(`Item ${index} must have a valid price`);
    }
  });
  
  if (!VALID_STATUSES.includes(status)) {
    throw new Error(`Status must be one of: ${VALID_STATUSES.join(", ")}`);
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

// GET all orders (admin/seller can see all, users see only their own)
router.get("/", (req, res) => {
  try {
    const orders = readData();
    
    if (req.user.role === "admin") {
      return res.json(orders);
    }
    
    if (req.user.role === "seller") {
      // Sellers see orders created by them
      const sellerOrders = orders.filter((o) => o.createdBy === req.user.username);
      return res.json(sellerOrders);
    }
    
    // Regular users see their own orders
    const userOrders = orders.filter((o) => o.username === req.user.username);
    res.json(userOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single order by ID
router.get("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const orders = readData();
    const order = orders.find((o) => o.id === id);
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    // Check permissions
    if (
      req.user.role !== "admin" &&
      order.username !== req.user.username &&
      order.createdBy !== req.user.username
    ) {
      return res.status(403).json({ error: "Forbidden: cannot access this order" });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create order
router.post("/", (req, res) => {
  try {
    const { items } = req.body;
    
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order must contain at least one item" });
    }
    
    const data = readData();
    const order = {
      id: Date.now(),
      username: req.user.username || "guest",
      items,
      totalPrice: items.reduce((sum, item) => sum + (item.price || 0), 0),
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    data.push(order);
    writeData(data);
    
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update order status (admin/seller only)
router.put("/:id/status", requireRole(["admin", "seller"]), (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status: newStatus } = req.body;
    
    if (!VALID_STATUSES.includes(newStatus)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }
    
    const data = readData();
    const orderIndex = data.findIndex((o) => o.id === id);
    
    if (orderIndex === -1) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    const currentStatus = data[orderIndex].status;
    const allowedTransitions = STATUS_WORKFLOW[currentStatus] || [];
    
    if (!allowedTransitions.includes(newStatus)) {
      return res.status(400).json({
        error: `Cannot transition from ${currentStatus} to ${newStatus}. Allowed: ${allowedTransitions.join(", ")}`,
      });
    }
    
    data[orderIndex].status = newStatus;
    data[orderIndex].updatedAt = new Date().toISOString();
    
    writeData(data);
    res.json(data[orderIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update full order (admin only)
router.put("/:id", requireRole(["admin"]), (req, res) => {
  try {
    const id = Number(req.params.id);
    
    if (Object.keys(req.body).length > 0) {
      const existing = readData().find((o) => o.id === id);
      if (!existing) {
        return res.status(404).json({ error: "Order not found" });
      }
      validateOrderInput({ ...existing, ...req.body });
    }
    
    const data = readData();
    const orderIndex = data.findIndex((o) => o.id === id);
    
    if (orderIndex === -1) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    data[orderIndex] = {
      ...data[orderIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    
    writeData(data);
    res.json(data[orderIndex]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE order (admin only)
router.delete("/:id", requireRole(["admin"]), (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = readData();
    const initialLength = data.length;
    
    const filtered = data.filter((o) => o.id !== id);
    
    if (filtered.length === initialLength) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    writeData(filtered);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
