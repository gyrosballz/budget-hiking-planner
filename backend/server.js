const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const plansRoute = require("./routes/plans");
const productsRoute = require("./routes/products");
const ordersRoute = require("./routes/orders");

const app = express();

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

// JWT Secret and expiry from env
const JWT_SECRET = process.env.JWT_SECRET || "demo-secret-key";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "24h";

// Role-based middleware
app.use((req, res, next) => {
  req.user = { role: req.header("x-user-role") || "user" };
  next();
});

// Utility function to safely read/write JSON files
function readJsonFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    throw new Error(`Failed to read data: ${error.message}`);
  }
}

function writeJsonFile(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error.message);
    throw new Error(`Failed to save data: ${error.message}`);
  }
}

// User store
const usersFile = path.join(__dirname, "data", "users.json");

function readUsers() {
  return readJsonFile(usersFile);
}

function writeUsers(users) {
  writeJsonFile(usersFile, users);
}

// Input validation utilities
function validateUsername(username) {
  if (!username || typeof username !== "string") return false;
  return username.length >= 3 && username.length <= 50;
}

function validatePassword(password) {
  if (!password || typeof password !== "string") return false;
  return password.length >= 6;
}

// Register endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!validateUsername(username)) {
      return res.status(400).json({
        message: "Username must be 3-50 characters",
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const users = readUsers();

    if (users[username]) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    users[username] = { password: hashedPassword, role: "user", createdAt: new Date().toISOString() };
    writeUsers(users);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Registration failed" });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!validateUsername(username) || !validatePassword(password)) {
      return res.status(400).json({
        message: "Invalid username or password format",
      });
    }

    const users = readUsers();
    const user = users[username];

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare password with bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ username, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRE,
    });

    return res.json({
      message: "Login successful",
      token,
      username,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
});

// Routes
app.use("/api/plans", plansRoute);
app.use("/api/products", productsRoute);
app.use("/api/orders", ordersRoute);

// Health check
app.get("/api/ping", (req, res) =>
  res.json({ message: "Backend OK", timestamp: new Date().toISOString() })
);

// Serve frontend build if present
const dist = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (req, res) => {
    res.sendFile(path.join(dist, "index.html"), (err) => {
      if (err) res.status(404).json({ message: "Not Found" });
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`)
);
