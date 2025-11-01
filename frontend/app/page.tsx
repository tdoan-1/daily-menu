"use client";

import { useState, useEffect } from "react";
import {
  getDishes,
  addDish,
  updateDish,
  deleteDish,
  searchDishes,
  getRandomDish,
  Dish,
} from "../utils/api";

export default function HomePage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [form, setForm] = useState<Dish>({
    name: "",
    cuisine: "",
    cookTime: 0,
    mealTime: "",
    description: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    cuisine: "",
    cookTime: "",
    mealTime: "",
  });
  const [randomDish, setRandomDish] = useState<Dish | null>(null);

  // Load all dishes on page load
  useEffect(() => {
    getDishes()
      .then(setDishes)
      .catch((err) => console.error("Failed to fetch dishes:", err));
  }, []);

  // Handle add or update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updated = await updateDish(editingId, form);
        setDishes((prev) =>
          prev.map((dish) => (dish._id === editingId ? updated : dish))
        );
        setEditingId(null);
      } else {
        const newDish = await addDish(form);
        setDishes((prev) => [...prev, newDish]);
      }

      setForm({
        name: "",
        cuisine: "",
        cookTime: 0,
        mealTime: "",
        description: "",
      });
    } catch (err) {
      console.error("Error submitting dish:", err);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await deleteDish(id);
      setDishes((prev) => prev.filter((dish) => dish._id !== id));
    } catch (err) {
      console.error("Error deleting dish:", err);
    }
  };

  // Handle edit
  const handleEdit = (dish: Dish) => {
    setForm({
      name: dish.name,
      cuisine: dish.cuisine,
      cookTime: dish.cookTime,
      mealTime: dish.mealTime,
      description: dish.description || "",
    });
    setEditingId(dish._id || null);
  };

  // Handle search filters
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const filtered = await searchDishes({
        cuisine: filters.cuisine,
        cookTime: filters.cookTime ? Number(filters.cookTime) : undefined,
        mealTime: filters.mealTime,
      });
      setDishes(filtered);
    } catch (err) {
      console.error("Error filtering dishes:", err);
    }
  };

  // Handle random dish
  const handleRandom = async () => {
    try {
      const random = await getRandomDish({
        cuisine: filters.cuisine,
        cookTime: filters.cookTime ? Number(filters.cookTime) : undefined,
        mealTime: filters.mealTime,
      });
      setRandomDish(random);
    } catch (err) {
      console.error("Error fetching random dish:", err);
    }
  };



  // ======= RENDER PAGE =======
  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-pink-600 text-center">
         Daily Menu
      </h1>
    {dishes.length === 0 ? (
        <p className="text-gray-500 italic">Loading Dishes...</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 w-full max-w-5xl">
          {dishes.map((dish) => (
            <li
              key={dish._id}
              className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-5 border border-pink-100 hover:scale-110 transition-transform duration-300"
            >
              <h2 className="text-xl font-semibold text-pink-600">
                {dish.name}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {dish.cuisine} • {dish.mealTime} • {dish.cookTime} min
              </p>
              {dish.description && (
                <p className="mt-3 text-gray-700 leading-snug">
                  {dish.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}