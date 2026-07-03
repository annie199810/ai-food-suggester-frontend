import { useState } from "react";
import { useResponsive } from "../hooks/useResponsive";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import { getMealTime, getBMIStatus } from "../utils/helpers";

export default function Dashboard(props) {
  const { C, bmi, setBmi, waterCount, setWaterCount, calorieLog, setCalorieLog, messages, favourites, mood, userName } = props;
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [calorieInput, setCalorieInput] = useState("");
  const mealTime = getMealTime();
  const bmiStatus = bmi ? getBMIStatus(parseFloat(bmi)) : null;
  const { isMobile, isTablet } = useResponsive();

  const cardStyle = {
    background: C.surface,
    borderRadius: "20px",
    padding: "24px",
    border: `1px solid ${C.border}`,
    boxShadow: "0 4px 24px rgba(0,0,0,0.12)"
  };

  const statCards = [
    { label: "AI Queries", value: messages.filter(m => m.role === "user").length, color: "#ff6b35", emoji: "💬", bg: "rgba(255,107,53,0.08)" },
    { label: "Favourites", value: favourites.length, color: "#f72585", emoji: "❤️", bg: "rgba(247,37,133,0.08)" },
    { label: "Water", value: `${waterCount}/8`, color: "#4cc9f0", emoji: "💧", bg: "rgba(76,201,240,0.08)" },
    { label: "Meals", value: calorieLog.length, color: "#06d6a0", emoji: "🔥", bg: "rgba(6,214,160,0.08)" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', sans-serif", background: C.bg, color: C.text, overflow: "hidden" }}>
      <Sidebar {...props} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "16px 28px", borderBottom: `1px solid ${C.border}`, background: C.sidebar, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>📊 Dashboard</h2>
            <p style={{ margin: 0, fontSize: "12px", color: "#06d6a0" }}>● Welcome back, {userName}!</p>
          </div>
          <div style={{ background: C.card, borderRadius: "10px", padding: "8px 14px", fontSize: "12px", color: C.subtext }}>
            {mealTime.emoji} {mealTime.label} Time
          </div>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "24px 28px" }}>

          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : isTablet ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: "14px", marginBottom: "24px" }}>
            {statCards.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -3 }}
                style={{ background: s.bg, borderRadius: "16px", padding: "18px", border: `1px solid ${s.color}20` }}>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>{s.emoji}</div>
                <p style={{ margin: "0 0 3px", fontSize: "22px", fontWeight: "800", color: s.color }}>{s.value}</p>
                <p style={{ margin: 0, fontSize: "11px", color: C.subtext }}>{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Main grid */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "18px" }}>

            {/* BMI */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <div style={{ width: "42px", height: "42px", background: "rgba(255,107,53,0.12)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>⚖️</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "15px" }}>BMI Calculator</h3>
                  <p style={{ margin: 0, fontSize: "11px", color: C.subtext }}>Body Mass Index</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                <input placeholder="Height (cm)" value={height} onChange={e => setHeight(e.target.value)}
                  style={{ flex: 1, padding: "11px 14px", background: C.card, border: `1px solid ${C.border}`, borderRadius: "10px", color: C.text, fontSize: "13px", outline: "none" }}
                  onFocus={e => e.target.style.borderColor = "#ff6b35"}
                  onBlur={e => e.target.style.borderColor = C.border} />
                <input placeholder="Weight (kg)" value={weight} onChange={e => setWeight(e.target.value)}
                  style={{ flex: 1, padding: "11px 14px", background: C.card, border: `1px solid ${C.border}`, borderRadius: "10px", color: C.text, fontSize: "13px", outline: "none" }}
                  onFocus={e => e.target.style.borderColor = "#ff6b35"}
                  onBlur={e => e.target.style.borderColor = C.border} />
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => { const h = height / 100; setBmi((weight / (h * h)).toFixed(1)); }}
                style={{ width: "100%", padding: "11px", background: "linear-gradient(135deg, #ff6b35, #ff8c42)", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
                Calculate BMI
              </motion.button>
              {bmi && bmiStatus && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ marginTop: "16px", background: C.card, padding: "16px", borderRadius: "14px", display: "flex", alignItems: "center", gap: "14px", border: `1px solid ${bmiStatus.color}30` }}>
                  <div style={{ fontSize: "44px", fontWeight: "800", color: bmiStatus.color }}>{bmi}</div>
                  <div>
                    <p style={{ margin: "0 0 3px", fontSize: "13px", fontWeight: "600" }}>{bmiStatus.emoji} {bmiStatus.label}</p>
                    <p style={{ margin: 0, fontSize: "11px", color: C.subtext }}>kg/m² · WHO Standards</p>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Water */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ width: "42px", height: "42px", background: "rgba(76,201,240,0.12)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>💧</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "15px" }}>Water Tracker</h3>
                  <p style={{ margin: 0, fontSize: "11px", color: C.subtext }}>Daily goal: 8 glasses</p>
                </div>
              </div>
              <div style={{ background: C.card, borderRadius: "10px", height: "8px", marginBottom: "16px", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(waterCount / 8) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  style={{ height: "100%", background: "linear-gradient(90deg, #4361ee, #4cc9f0)", borderRadius: "10px" }} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
                {[...Array(8)].map((_, i) => (
                  <motion.button key={i} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setWaterCount(i + 1)}
                    style={{
                      width: "44px", height: "44px", fontSize: "20px",
                      background: i < waterCount ? "rgba(76,201,240,0.15)" : C.card,
                      border: `1.5px solid ${i < waterCount ? "#4cc9f0" : C.border}`,
                      borderRadius: "10px", cursor: "pointer",
                      opacity: i < waterCount ? 1 : 0.35, transition: "all 0.2s"
                    }}>💧</motion.button>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ margin: 0, fontSize: "13px", color: waterCount >= 8 ? "#06d6a0" : "#4cc9f0", fontWeight: "600" }}>
                  {waterCount >= 8 ? "🎉 Goal achieved!" : `${waterCount}/8 · ${8 - waterCount} more to go`}
                </p>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setWaterCount(0)}
                  style={{ padding: "5px 12px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "8px", cursor: "pointer", color: C.subtext, fontSize: "11px" }}>
                  Reset
                </motion.button>
              </div>
            </motion.div>

            {/* Calorie Log */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ width: "42px", height: "42px", background: "rgba(255,214,10,0.12)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🔥</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "15px" }}>Calorie Log</h3>
                  <p style={{ margin: 0, fontSize: "11px", color: C.subtext }}>Track your intake</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                <input placeholder="e.g. Idli 2 pcs — 150 kcal" value={calorieInput}
                  onChange={e => setCalorieInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && calorieInput) { setCalorieLog(p => [...p, calorieInput]); setCalorieInput(""); } }}
                  style={{ flex: 1, padding: "11px 14px", background: C.card, border: `1px solid ${C.border}`, borderRadius: "10px", color: C.text, fontSize: "13px", outline: "none" }}
                  onFocus={e => e.target.style.borderColor = "#ffd60a"}
                  onBlur={e => e.target.style.borderColor = C.border} />
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => { if (calorieInput) { setCalorieLog(p => [...p, calorieInput]); setCalorieInput(""); } }}
                  style={{ padding: "11px 16px", background: "linear-gradient(135deg, #ff6b35, #ff8c42)", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
                  Add
                </motion.button>
              </div>
              <div style={{ maxHeight: "160px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "5px" }}>
                {calorieLog.length === 0 ? (
                  <p style={{ textAlign: "center", color: C.subtext, fontSize: "13px", padding: "20px 0" }}>No meals logged yet 🍽️</p>
                ) : calorieLog.map((log, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.card, padding: "9px 13px", borderRadius: "9px", fontSize: "12px" }}>
                    <span>🍽️ {log}</span>
                    <motion.button whileHover={{ scale: 1.2 }}
                      onClick={() => setCalorieLog(p => p.filter((_, idx) => idx !== i))}
                      style={{ background: "none", border: "none", color: "#ff3b30", cursor: "pointer", fontSize: "16px", lineHeight: 1 }}>×</motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Health Tips */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ width: "42px", height: "42px", background: "rgba(6,214,160,0.12)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>💡</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "15px" }}>Smart Health Tips</h3>
                  <p style={{ margin: 0, fontSize: "11px", color: C.subtext }}>Personalized for you</p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { tip: "Drink water before every meal", icon: "💧", color: "#4cc9f0" },
                  { tip: `${mealTime.label} time — eat mindfully!`, icon: mealTime.emoji, color: "#ff6b35" },
                  { tip: mood ? `Feeling ${mood}? Food can boost your mood!` : "Set your mood for better suggestions", icon: "😊", color: "#f72585" },
                  { tip: bmi ? (parseFloat(bmi) < 25 ? `BMI ${bmi} — Great! Keep it up 💪` : "Consider lighter meal options") : "Calculate BMI for personalized tips", icon: "⚖️", color: "#ffd60a" },
                  { tip: waterCount >= 8 ? "Water goal achieved! Amazing! 🎉" : `${8 - waterCount} more glasses needed`, icon: "🎯", color: "#06d6a0" },
                ].map((item, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.07 }}
                    whileHover={{ x: 3 }}
                    style={{ display: "flex", alignItems: "center", gap: "10px", background: C.card, padding: "10px 13px", borderRadius: "10px", border: `1px solid ${item.color}15` }}>
                    <span style={{ fontSize: "18px" }}>{item.icon}</span>
                    <p style={{ margin: 0, fontSize: "12px", color: C.text }}>{item.tip}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}