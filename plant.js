const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  type: { type: String, required: true },          // Indoor, Outdoor, Pot, Devotional
  description: { type: String, required: true },
  price: { type: Number, required: true },
  smell: { type: String },                        // e.g., "Fragrant"
  devotional: { type: Boolean, default: false },  // true/false
  size: { type: String }                          // e.g., "Small", "Medium", "Large"
});

const Plant = mongoose.model("Plant", plantSchema);

module.exports = Plant;
