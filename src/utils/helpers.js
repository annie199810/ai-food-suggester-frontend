export const getMealTime = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return { label: "Breakfast", emoji: "🌅" };
  if (hour >= 11 && hour < 16) return { label: "Lunch", emoji: "☀️" };
  if (hour >= 16 && hour < 19) return { label: "Snacks", emoji: "🍎" };
  return { label: "Dinner", emoji: "🌙" };
};

export const getBMIStatus = (bmi) => {
  if (bmi < 18.5) return { label: "Underweight", color: "#4cc9f0", emoji: "🔵" };
  if (bmi < 25) return { label: "Normal Weight", color: "#06d6a0", emoji: "🟢" };
  if (bmi < 30) return { label: "Overweight", color: "#ffd60a", emoji: "🟡" };
  return { label: "Obese", color: "#ff3b30", emoji: "🔴" };
};

export const CUISINES = ["Any", "South Indian", "North Indian", "Chinese", "Italian", "Continental"];

export const MOODS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😤", label: "Stressed" },
  { emoji: "😴", label: "Tired" },
  { emoji: "🤒", label: "Sick" },
  { emoji: "💪", label: "Energetic" },
];

export const DIET_TYPES = [
  { emoji: "🌿", label: "Any" },
  { emoji: "🥗", label: "Veg" },
  { emoji: "🍖", label: "Non-Veg" },
  { emoji: "🌱", label: "Vegan" },
];

export const QUICK_PROMPTS = [
  { emoji: "🍅", text: "I have tomato, onion and rice" },
  { emoji: "🌶️", text: "Something spicy for dinner" },
  { emoji: "🌅", text: "Light breakfast ideas" },
  { emoji: "🥘", text: "I want comfort food" },
  { emoji: "⚡", text: "Quick 15 min recipe" },
  { emoji: "🏃", text: "Post workout meal" },
  { emoji: "🌧️", text: "Rainy day food ideas" },
  { emoji: "❤️", text: "Healthy heart food" },
];

export const FOOD_IMAGES = [
  "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
  "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400",
  "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400",
  "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400",
  "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400",
  "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400",
];