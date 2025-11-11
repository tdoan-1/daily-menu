"use client";

import { useState, useEffect } from "react";
import {
  getDishes,
  addDish,
  updateDish,
  deleteDish,
  Dish,
} from "../utils/api";

// Reusable component for editable text fields
function EditableField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string | number | undefined;
  onChange: (val: string) => void;
  placeholder: string;
  type?: string;
}) {
  const isEmpty = !value || value === 0;

  return (
    <div className="mb-2">
      {isEmpty ? (
        <button
          onClick={() => onChange("")}
          className="text-pink-500 hover:underline text-sm"
        >
          + {placeholder}
        </button>
      ) : (
        <input
          type={type}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="border border-pink-200 bg-white rounded-md px-2 py-1 w-full text-gray-700 focus:border-pink-400 focus:outline-none"
        />
      )}
    </div>
  );
}

export default function HomePage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [editingDishId, setEditingDishId] = useState<string | null>(null);

  // Load dishes on mount
  useEffect(() => {
    getDishes()
      .then(setDishes)
      .catch((err) => console.error("Failed to fetch dishes:", err));
  }, []);

  // Update a field in local state
  const handleFieldChange = (
    id: string,
    field: keyof Dish,
    value: string | number
  ) => {
    setDishes((prev) =>
      prev.map((dish) =>
        dish._id === id ? { ...dish, [field]: value } : dish
      )
    );
  };

  // Save dish changes
  const handleSave = async (dish: Dish) => {
    if (!dish.name.trim()) {
      alert("Dish name is required!");
      return;
    }

    try {
      const updated = await updateDish(dish._id!, dish);
      setDishes((prev) =>
        prev.map((d) => (d._id === dish._id ? updated : d))
      );
      setEditingDishId(null);
    } catch (err) {
      console.error("Error saving dish:", err);
    }
  };

  // Delete a dish
  const handleDelete = async (id: string) => {
    try {
      await deleteDish(id);
      setDishes((prev) => prev.filter((dish) => dish._id !== id));
    } catch (err) {
      console.error("Error deleting dish:", err);
    }
  };

  // Add new dish card
  const handleAddDish = async () => {
    try {
      const newDish = await addDish({
        name: "",
        cuisine: "",
        cookTime: 0,
        mealTime: "",
        description: "",
      });
      setDishes((prev) => [...prev, newDish]);
      setEditingDishId(newDish._id!);
    } catch (err) {
      console.error("Error adding dish:", err);
    }
  };

  return (
    <>
      {/* Sticky Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md p-4 flex justify-between items-center">
        <h2 className="text-2xl font-cute text-pink-600">Daily Menu</h2>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search (coming soon)"
            disabled
            className="px-3 py-2 rounded-lg border border-pink-200 bg-softPink text-gray-500 cursor-not-allowed"
          />
          <button
            disabled
            className="bg-pink-400 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-500 cursor-not-allowed"
          >
            Random Dish
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-pink-600 text-center font-cute">
          Daily Menu
        </h1>

        {dishes.length === 0 ? (
          <p className="text-gray-500 italic text-center">Loading Dishes...</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 w-full">
            {dishes.map((dish) => {
              const isEditing = editingDishId === dish._id;

              return (
                <li
                  key={dish._id}
                  className="bg-softPink rounded-2xl shadow-lg p-5 border border-pink-100 hover:shadow-pink-200 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Name */}
                    {isEditing ? (
                      <EditableField
                        label="Name"
                        value={dish.name}
                        placeholder="Add name"
                        onChange={(val) =>
                          handleFieldChange(dish._id!, "name", val)
                        }
                      />
                    ) : (
                      <h2
                        className="text-xl font-semibold text-pink-600 mb-2 cursor-pointer"
                        onClick={() => setEditingDishId(dish._id!)}
                      >
                        {dish.name || (
                          <span className="text-pink-400">+ Add name</span>
                        )}
                      </h2>
                    )}

                    {/* Cuisine */}
                    <EditableField
                      label="Cuisine"
                      value={dish.cuisine}
                      placeholder="Add cuisine"
                      onChange={(val) =>
                        handleFieldChange(dish._id!, "cuisine", val)
                      }
                    />

                    {/* Meal Time */}
                    <EditableField
                      label="Meal Time"
                      value={dish.mealTime}
                      placeholder="Add mealtime"
                      onChange={(val) =>
                        handleFieldChange(dish._id!, "mealTime", val)
                      }
                    />

                    {/* Cook Time */}
                    <EditableField
                      label="Cook Time"
                      value={dish.cookTime}
                      placeholder="Add cook time"
                      type="number"
                      onChange={(val) =>
                        handleFieldChange(
                          dish._id!,
                          "cookTime",
                          Number(val) || 0
                        )
                      }
                    />

                    {/* Description */}
                    <EditableField
                      label="Description"
                      value={dish.description}
                      placeholder="Add description"
                      onChange={(val) =>
                        handleFieldChange(dish._id!, "description", val)
                      }
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-between mt-4">
                    {isEditing ? (
                      <button
                        onClick={() => handleSave(dish)}
                        className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditingDishId(dish._id!)}
                        className="text-pink-500 hover:underline"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(dish._id!)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}

            {/* Add Dish Card */}
            <li
              onClick={handleAddDish}
              className="flex items-center justify-center bg-peach text-brown font-semibold rounded-2xl shadow-inner border-2 border-dashed border-pink-300 cursor-pointer hover:bg-peach/80 transition-transform hover:scale-105"
            >
              + Add Dish
            </li>
          </ul>
        )}
      </main>
    </>
  );
}
