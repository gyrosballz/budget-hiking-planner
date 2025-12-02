const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const plansRoute = require("./routes/plans");
const productsRoute = require("./routes/products");
const ordersRoute = require("./routes/orders");

const app = express();
app.use(cors());
app.use(express.json());

// simple mock auth middleware: set role by header "x-user-role": user, seller, admin
app.use((req, res, next) => {
  req.user = { role: req.header("x-user-role") || "user" };
  next();
});

// --- Simple file-based user store for demo auth ---
const usersFile = path.join(__dirname, "data", "users.json");
const JWT_SECRET = "demo-secret-key";

function readUsers() {
  if (!fs.existsSync(usersFile)) return {};
  const data = fs.readFileSync(usersFile, "utf-8");
  return JSON.parse(data || "{}");
}

function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Register endpoint
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const users = readUsers();

  if (users[username]) {
    return res.status(409).json({ message: "User already exists" });
  }

  // NOTE: plaintext password for demo only – do NOT use in production.
  users[username] = { password };
  writeUsers(users);

  return res.status(201).json({ message: "User registered successfully" });
});

// Login endpoint
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const users = readUsers();
  const user = users[username];

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "24h" });

  return res.json({ message: "Login successful", token, username });
});

app.use("/api/plans", plansRoute);
app.use("/api/products", productsRoute);
app.use("/api/orders", ordersRoute);

// health
app.get("/api/ping", (req, res) => res.json({ message: "Backend OK" }));

// serve frontend build if present
const dist = path.join(__dirname, "../frontend/dist");
app.use(express.static(dist));
app.get("*", (req, res) => {
  res.sendFile(path.join(dist, "index.html"), (err) => {
    if (err) res.status(404).send("Not Found");
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
