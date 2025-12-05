const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Plant = require("./plant");

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/plantDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 📞 CONTACT PAGE ROUTE
app.get("/contact", (req, res) => {
  res.render("contact");
});

// ADMIN CREDENTIALS
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "1234";
let isAdminLoggedIn = false;

// HOME PAGE
app.get("/", async (req, res) => {
  const plants = await Plant.find();
  res.render("index", { plants, isAdmin: isAdminLoggedIn });
});

// LOGIN
app.get("/login", (req, res) => res.render("login", { error: null }));

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    isAdminLoggedIn = true;
    return res.redirect("/");
  }
  res.render("login", { error: "Invalid username or password" });
});

// LOGOUT
app.get("/logout", (req, res) => {
  isAdminLoggedIn = false;
  res.redirect("/");
});

// ADD PLANT
app.post("/add", async (req, res) => {
  if (!isAdminLoggedIn) return res.send("Unauthorized");

  const { name, image, type, description, price, smell, devotional, size } = req.body;
  const newPlant = new Plant({
    name, image, type, description, price,
    smell, devotional: devotional === "true", size
  });

  await newPlant.save();
  res.redirect("/");
});

// DELETE
app.post("/delete/:id", async (req, res) => {
  if (!isAdminLoggedIn) return res.send("Unauthorized");
  await Plant.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// EDIT
app.get("/edit/:id", async (req, res) => {
  if (!isAdminLoggedIn) return res.send("Unauthorized");
  const plant = await Plant.findById(req.params.id);
  res.render("edit", { plant });
});

app.post("/edit/:id", async (req, res) => {
  if (!isAdminLoggedIn) return res.send("Unauthorized");
  const { name, image, type, description, price, smell, devotional, size } = req.body;
  await Plant.findByIdAndUpdate(req.params.id, {
    name, image, type, description, price,
    smell, devotional: devotional === "true", size
  });
  res.redirect("/");
});

// START SERVER
app.listen(3000, () => console.log("Server running at http://localhost:3000"));
