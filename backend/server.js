const express = require("express");
const cors = require("cors");
const path = require("path");

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

app.use("/api/plans", plansRoute);
app.use("/api/products", productsRoute);
app.use("/api/orders", ordersRoute);

// health
app.get("/api/ping", (req, res) => res.json({ message: "Backend OK" }));

// serve frontend build if present
const dist = path.join(__dirname, "../frontend/dist");
app.use(express.static(dist));
app.get("*", (req, res) => {
  res.sendFile(path.join(dist, "index.html"), err => {
    if (err) res.status(404).send("Not Found");
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
