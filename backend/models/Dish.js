const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cuisine: { type: String, required: true },
    cookTime: { type: Number, required: true }, // example: 30, 90 (in minutes)
    mealTime: { type: String, required: true }, // example: breakfast, lunch
    ingredients: { type: String }, // optional
}, { timestamps: true });

module.exports = mongoose.model('Dish', dishSchema);