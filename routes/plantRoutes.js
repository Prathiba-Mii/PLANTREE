import express from "express";
import Plant from "../models/plant.js";

const router = express.Router();

// Show all plants
router.get("/", async(req,res) => {
   const plants = await Plant.find();
   res.render("index", { plants });
});

// Add new plant
router.post("/add", async(req,res) => {
  const { name, type, description, price } = req.body;
  await Plant.create({ name, type,description, price });
  res.redirect("/");
});

export default router;