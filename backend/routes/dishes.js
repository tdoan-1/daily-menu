const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');

// GET /api/dishes (GET all)
router.get('/', async (req, res) => {
    try {
        const dishes = await Dish.find();
        res.json(dishes);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch dishes' });
    }
});

// GET /api/dishes/:id (GET one)
router.get('/:id', async (req, res) => {
    try {
        const dish = await Dish.findById(req.params.id);
        if (!dish) {
            return res.status(404).json({ error: 'Dish not found' });
        }
        res.json(dish);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch dish' });
    }
});

// POST /api/dishes
router.post('/', async (req, res) => {
  const { name, cuisine, cookTime, mealTime, description } = req.body;

  // Check required fields
  if (!name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newDish = new Dish({
      name,
      cuisine,
      cookTime,
      mealTime,       
      description
    });

    const savedDish = await newDish.save();
    res.status(201).json(savedDish);  // 201 Created
  } catch (err) {
    console.error('Error saving dish:', err);
    res.status(500).json({ error: 'Failed to save dish' });
  }
});

// PUT /api/dishes/:id
router.put('/:id', async (req, res) => {
    const { name, cuisine, cookTime, mealTime, description } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Dish name is required' });
    }

    const updateData = { name };
    if (cuisine !== undefined) updateData.cuisine = cuisine;
    if (cookTime !== undefined) updateData.cookTime = cookTime;
    if (mealTime !== undefined) updateData.mealTime = mealTime;
    if (description !== undefined) updateData.description = description;

    try {
        const updatedDish = await Dish.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedDish) {
            return res.status(404).json({ error: 'Dish not found' });
        }

        res.json(updatedDish);
    } catch (err) {
        console.error('Error updating dish:', err);
        res.status(500).json({ error: 'Failed to update dish' });
    }
});

// DELETE /api/dishes/:id
router.delete('/:id', async (req, res) => {
    try {
        const deletedDish = await Dish.findByIdAndDelete(req.params.id);
        if (!deletedDish) {
            return res.status(404).json({ error: 'Dish not found' });
        }
        res.json({ message: 'Dish deleted successfully' });
    } catch (err) {
        console.error('Error deleting dish:', err);
        res.status(500).json({ error: 'Failed to delete dish' });
    }
});

// GET /api/dishes/search
router.get('/search/filters', async (req, res) => {
    const { cuisine, cookTime, mealTime } = req.query;
    const filter = {};
    if (cuisine) filter.cuisine = cuisine;
    if (cookTime) filter.cookTime = { $lte: parseInt(cookTime) };
    if (mealTime) filter.mealTime = mealTime;

    try {
        const dishes = await Dish.find(filter);
        res.json(dishes);
    } catch (err) {
        console.error('Error searching dishes:', err);
        res.status(500).json({ error: 'Failed to search dishes' });
    }
});

// GET /api/dishes/random
router.get('/random', async (req, res) => {
    const {cuisine, cookTime, mealTime} = req.query;

    const match = {};
    if (cuisine) match.cuisine = cuisine;
    if (cookTime) match.cookTime = { $lte: parseInt(cookTime) };
    if (mealTime) match.mealTime = mealTime;

    try {
        const randomDish = await Dish.aggregate([
            { $match: match },
            { $sample: { size: 1 } }
        ]);
        if (!randomDish) {
            return res.status(404).json({ error: 'No matching dish found' });
        }

        res.json(randomDish);
    } catch (err) {
        console.error('Error fetching random dish:', err);
        res.status(500).json({ error: 'Failed to fetch random dish' });
    }
});

module.exports = router;