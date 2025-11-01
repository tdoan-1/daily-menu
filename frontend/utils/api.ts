const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/dishes`;

export interface Dish {
  _id?: string;
  name: string;
  cuisine: string;
  cookTime: number;
  mealTime: string;
  description?: string;
}

// GET all dishes
export async function getDishes(): Promise<Dish[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch dishes");
  return res.json();
}

// POST a new dish
export async function addDish(dishData: Dish): Promise<Dish> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dishData),
  });
  if (!res.ok) throw new Error("Failed to add dish");
  return res.json();
}

// PUT update existing dish
export async function updateDish(id: string, dishData: Dish): Promise<Dish> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dishData),
  });
  if (!res.ok) throw new Error("Failed to update dish");
  return res.json();
}

// DELETE a dish
export async function deleteDish(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete dish");
}

// GET dishes with filters
export async function searchDishes(filters: {
  cuisine?: string;
  cookTime?: number;
  mealTime?: string;
}): Promise<Dish[]> {
  const query = new URLSearchParams(
    Object.entries(filters)
      .filter(([_, value]) => value !== "" && value !== undefined)
      .map(([key, value]) => [key, String(value)])
  ).toString();

  const res = await fetch(`${BASE_URL}/search/filters?${query}`);
  if (!res.ok) throw new Error("Failed to search dishes");
  return res.json();
}

// GET random dish (with optional filters)
export async function getRandomDish(filters?: {
  cuisine?: string;
  cookTime?: number;
  mealTime?: string;
}): Promise<Dish | null> {
  const query = filters
    ? new URLSearchParams(
        Object.entries(filters)
          .filter(([_, value]) => value !== "" && value !== undefined)
          .map(([key, value]) => [key, String(value)])
      ).toString()
    : "";

  const res = await fetch(`${BASE_URL}/random?${query}`);
  if (!res.ok) throw new Error("Failed to fetch random dish");

  const data = await res.json();
  // Backend returns an array with 1 random item
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}