import { useState } from "react";
import axios from "axios";
import AuthPage from "./components/AuthPage";
import ChatPage from "./components/ChatPage";
import Dashboard from "./components/Dashboard";
import MealPlanner from "./components/MealPlanner";
import { getMealTime } from "./utils/helpers";

const API = `${process.env.REACT_APP_API_URL}/api`;

export default function App() {
  const [page, setPage] = useState("login");
  const [token, setToken] = useState("");
  const [userName, setUserName] = useState("");
  const [theme, setTheme] = useState("dark");
  const [messages, setMessages] = useState([]);
  const [cuisine, setCuisine] = useState("Any");
  const [mood, setMood] = useState("");
  const [dietType, setDietType] = useState("Any");
  const [favourites, setFavourites] = useState([]);
  const [bmi, setBmi] = useState(null);
  const [waterCount, setWaterCount] = useState(0);
  const [calorieLog, setCalorieLog] = useState([]);
  const [mealPlan, setMealPlan] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isDark = theme === "dark";
  const C = {
    bg: isDark ? "#0a0a14" : "#f5f7ff",
    sidebar: isDark ? "#0f1023" : "#ffffff",
    surface: isDark ? "#141428" : "#ffffff",
    card: isDark ? "#181830" : "#f0f2ff",
    bubble_ai: isDark ? "#1a2744" : "#eef2ff",
    bubble_user: isDark ? "#1a3a2a" : "#e8f5e9",
    text: isDark ? "#e8e8f0" : "#1a1a2e",
    subtext: isDark ? "#6b6b8a" : "#6b7280",
    border: isDark ? "#1e1e35" : "#e5e7eb",
    accent: "#ff6b35",
    blue: "#4361ee",
    teal: "#4cc9f0",
    green: "#06d6a0",
    purple: "#7c3aed",
    pink: "#f72585",
    yellow: "#ffd60a",
  };

  const mealTime = getMealTime();

  const handleLogin = async (email, password) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    setToken(res.data.token);
    setUserName(res.data.user.name);
    setMessages([{
      role: "ai",
      text: `Hey ${res.data.user.name}! 👋 I'm NutriAI, your personal AI chef. It's ${mealTime.emoji} ${mealTime.label} time — what are you craving today? 🍱`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }]);
    setPage("home");
  };

  const handleRegister = async (name, email, password) => {
    await axios.post(`${API}/auth/register`, { name, email, password });
    await handleLogin(email, password);
  };

  const logout = () => { setToken(""); setPage("login"); setMessages([]); };

  const sharedProps = {
    C, theme, setTheme,
    userName, token,
    messages, setMessages,
    cuisine, setCuisine,
    mood, setMood,
    dietType, setDietType,
    favourites, setFavourites,
    page, setPage, logout,
    bmi, setBmi,
    waterCount, setWaterCount,
    calorieLog, setCalorieLog,
    mealPlan, setMealPlan,
    sidebarOpen, setSidebarOpen,
  };

  if (page === "login" || page === "register") {
    return <AuthPage onLogin={handleLogin} onRegister={handleRegister} />;
  }
  if (page === "dashboard") return <Dashboard {...sharedProps} />;
  if (page === "mealplan") return <MealPlanner {...sharedProps} />;
  return <ChatPage {...sharedProps} />;
}