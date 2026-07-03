import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Sidebar from "./Sidebar";
import { getMealTime, FOOD_IMAGES } from "../utils/helpers";

const API = "http://localhost:5000/api";

export default function MealPlanner(props) {
  const { C, token, dietType, cuisine, mood, bmi, mealPlan, setMealPlan } = props;
  const [loading, setLoading] = useState(false);
  const mealTime = getMealTime();

  const generateMealPlan = async () => {
    setLoading(true);
    setMealPlan("");
    try {
      const res = await axios.post(`${API}/suggest`,
        {
          query: `Create a complete healthy Indian meal plan for one full day.
Diet preference: ${dietType !== "Any" ? dietType : "No restriction"}
Cuisine style: ${cuisine}
BMI: ${bmi || "Not provided"}
Current mood: ${mood || "Normal"}
Current meal time: ${mealTime.label}

Format exactly like this:
🌅 BREAKFAST (7:00 AM)
Meal: [name]
Calories: [X] kcal
Why: [brief reason]

🍎 MID-MORNING SNACK (10:30 AM)
Meal: [name]
Calories: [X] kcal

☀️ LUNCH (1:00 PM)
Meal: [name]
Calories: [X] kcal
Why: [brief reason]

☕ EVENING SNACK (4:30 PM)
Meal: [name]
Calories: [X] kcal

🌙 DINNER (8:00 PM)
Meal: [name]
Calories: [X] kcal
Why: [brief reason]

📊 DAILY SUMMARY
Total Calories: [X] kcal
Protein: [X]g | Carbs: [X]g | Fat: [X]g
Tip: [one personalized health tip]

Make it practical, delicious and easy to prepare at home!`
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMealPlan(res.data.suggestion);
    } catch {
      setMealPlan("Error generating meal plan. Please try again!");
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', sans-serif", background: C.bg, color: C.text, overflow: "hidden" }}>
      <Sidebar {...props} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "16px 28px", borderBottom: `1px solid ${C.border}`, background: C.sidebar, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>🗓️ AI Meal Planner</h2>
            <p style={{ margin: 0, fontSize: "12px", color: "#4cc9f0" }}>● Personalized daily meal planning</p>
          </div>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "28px" }}>
          <div style={{ maxWidth: "720px", margin: "0 auto" }}>

            {/* Food images row */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "24px", overflow: "hidden", borderRadius: "16px" }}>
              {FOOD_IMAGES.slice(0, 4).map((img, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                  style={{ flex: 1, height: "80px", borderRadius: "10px", overflow: "hidden" }}>
                  <img src={img} alt="food" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => e.target.parentElement.style.display = "none"} />
                </motion.div>
              ))}
            </div>

            {/* Preferences card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: C.surface, borderRadius: "20px", padding: "28px", border: `1px solid ${C.border}`, marginBottom: "20px" }}>
              <h3 style={{ margin: "0 0 20px", fontSize: "15px" }}>✨ Your Preferences</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "24px" }}>
                {[
                  { label: "Diet", value: dietType !== "Any" ? dietType : "No restriction", emoji: "🥗", color: "#06d6a0" },
                  { label: "Cuisine", value: cuisine, emoji: "🍽️", color: "#ff6b35" },
                  { label: "Mood", value: mood || "Not set", emoji: "😊", color: "#f72585" },
                  { label: "BMI", value: bmi ? `${bmi} kg/m²` : "Not set", emoji: "⚖️", color: "#4cc9f0" },
                ].map((p, i) => (
                  <motion.div key={i} whileHover={{ y: -2 }}
                    style={{ background: C.card, padding: "14px", borderRadius: "12px", textAlign: "center", border: `1px solid ${p.color}20` }}>
                    <p style={{ margin: "0 0 6px", fontSize: "22px" }}>{p.emoji}</p>
                    <p style={{ margin: "0 0 3px", fontSize: "9px", color: C.subtext, textTransform: "uppercase", letterSpacing: "0.8px" }}>{p.label}</p>
                    <p style={{ margin: 0, fontSize: "12px", fontWeight: "600", color: p.color }}>{p.value}</p>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={generateMealPlan} disabled={loading}
                style={{
                  width: "100%", padding: "15px",
                  background: loading ? C.card : "linear-gradient(135deg, #ff6b35, #ff8c42)",
                  color: loading ? C.subtext : "white",
                  border: "none", borderRadius: "14px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "700", fontSize: "15px",
                  boxShadow: loading ? "none" : "0 8px 25px rgba(255,107,53,0.35)"
                }}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⏳</motion.span>
                    Generating your personalized meal plan...
                  </span>
                ) : "✨ Generate AI Meal Plan"}
              </motion.button>
            </motion.div>

            {/* Meal plan result */}
            {mealPlan && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: C.surface, borderRadius: "20px", padding: "28px", border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ margin: 0, color: "#ff6b35", fontSize: "16px" }}>📋 Your Personalized Meal Plan</h3>
                  <motion.button whileHover={{ scale: 1.05 }}
                    onClick={() => { navigator.clipboard.writeText(mealPlan); alert("Copied! 📋"); }}
                    style={{ padding: "7px 14px", background: C.card, border: `1px solid ${C.border}`, borderRadius: "8px", cursor: "pointer", color: C.text, fontSize: "12px" }}>
                    📋 Copy Plan
                  </motion.button>
                </div>
                <div style={{ whiteSpace: "pre-wrap", lineHeight: "2", fontSize: "14px", color: C.text }}>
                  {mealPlan}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}