import { useState, useRef, useEffect } from "react";
import { useResponsive } from "../hooks/useResponsive";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Sidebar from "./Sidebar";
import { getMealTime, QUICK_PROMPTS, FOOD_IMAGES } from "../utils/helpers";
import { useVoice } from "../hooks/useVoice";

const API = `${process.env.REACT_APP_API_URL}/api`;

export default function ChatPage(props) {
  const {
  C,
  token,
  messages,
  setMessages,
  cuisine,
  mood,
  dietType,
  favourites,
  setFavourites,
  userName,
} = props;
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const mealTime = getMealTime();
  const randomImage = FOOD_IMAGES[Math.floor(Date.now() / 30000) % FOOD_IMAGES.length];
  const [sidebarOpen, setSidebarOpen] = useState(false);
const { isMobile, isTablet } = useResponsive();
  const { isListening, startListening, supported } = useVoice((transcript) => {
    setQuery(transcript);
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getSuggestion = async (customQuery) => {
    const q = customQuery || query;
    if (!q.trim()) return;

    const contextPrompt = `User query: ${q}
Current meal time: ${mealTime.label}
Cuisine: ${cuisine !== "Any" ? cuisine : "Any"}
Diet: ${dietType !== "Any" ? dietType : "No restriction"}
Mood: ${mood || "Not specified"}
Suggest a perfect Indian dish. Include:
1. Dish name and why it fits perfectly
2. Key ingredients (5-6 items)  
3. Step-by-step preparation (4-5 steps)
4. Nutrition info: Calories, Protein, Carbs, Fat
5. One pro health tip
Be warm, friendly and conversational!`;

    setMessages(prev => [
      ...prev,
      {
        role: "user",
        text: `${mood ? mood + " · " : ""}${dietType !== "Any" ? dietType + " · " : ""}${q}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      },
      { role: "ai", text: "typing", time: "" }
    ]);
    setQuery("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/suggest`,
        { query: contextPrompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(prev => [
        ...prev.filter(m => m.text !== "typing"),
        {
          role: "ai",
          text: res.data.suggestion,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev.filter(m => m.text !== "typing"),
        { role: "ai", text: "Oops! Something went wrong. Try again! 😅", time: "" }
      ]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', sans-serif", background: C.bg, color: C.text, overflow: "hidden" }}>
     {(!isMobile || sidebarOpen) && (
  <Sidebar
    {...props}
    messages={messages}
  />
)}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>

        {/* Ambient background */}
        <div style={{ position: "absolute", top: "10%", right: "5%", width: "300px", height: "300px", background: "rgba(255,107,53,0.04)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "20%", left: "5%", width: "200px", height: "200px", background: "rgba(67,97,238,0.04)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />

        {/* Header */}
        {/* Header */}
<div style={{ padding: isMobile ? "12px 16px" : "14px 24px", borderBottom: `1px solid ${C.border}`, background: C.sidebar, display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 10 }}>
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    {/* Hamburger for mobile */}
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
      onClick={() => setSidebarOpen(!sidebarOpen)}
      style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: "8px", padding: "7px 10px", cursor: "pointer", fontSize: "15px" }}>
      ☰
    </motion.button>
    <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #ff6b35, #ff8c42)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🤖</div>
    <div>
      <p style={{ margin: 0, fontWeight: "700", fontSize: isMobile ? "13px" : "15px" }}>NutriAI Chef</p>
      {!isMobile && <p style={{ margin: 0, fontSize: "11px", color: C.green }}>● Online · {cuisine} · {mealTime.label}{mood ? ` · ${mood}` : ""}</p>}
    </div>
  </div>
  {!isMobile && (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{ textAlign: "right" }}>
        <p style={{ margin: 0, fontSize: "11px", color: C.subtext }}>Featured</p>
        <p style={{ margin: 0, fontSize: "11px", color: C.accent }}>{mealTime.emoji} {mealTime.label} Special</p>
      </div>
      <img src={randomImage} alt="food"
        style={{ width: "40px", height: "40px", borderRadius: "10px", objectFit: "cover", border: `2px solid ${C.border}` }}
        onError={e => e.target.style.display = "none"} />
    </div>
  )}
</div>

        {/* Messages */}
        <div style={{ flex: 1, overflow: "auto", padding: "24px 28px" }}>

          {/* Quick prompts */}
          {messages.length <= 1 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "28px" }}>

              {/* Food image banner */}
              <div style={{ borderRadius: "16px", overflow: "hidden", marginBottom: "20px", position: "relative", height: "140px" }}>
                <img src={randomImage} alt="Indian Food" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={e => e.target.parentElement.style.display = "none"} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,10,20,0.9), rgba(10,10,20,0.3))", display: "flex", alignItems: "center", padding: "24px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 6px", color: "white", fontSize: "18px" }}>What would you like to eat? 🍱</h3>
                    <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>Tell me your ingredients, mood, or craving — I'll suggest the perfect dish!</p>
                  </div>
                </div>
              </div>

              <p style={{ color: C.subtext, fontSize: "11px", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>Quick Prompts</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {QUICK_PROMPTS.map((p, i) => (
                  <motion.button key={i}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.03, borderColor: C.accent }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => getSuggestion(p.text)}
                    style={{
                      padding: "9px 16px", background: C.surface, color: C.text,
                      border: `1px solid ${C.border}`, borderRadius: "20px", cursor: "pointer",
                      fontSize: "13px", display: "flex", alignItems: "center", gap: "6px",
                      transition: "all 0.2s"
                    }}>
                    <span>{p.emoji}</span> {p.text}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Messages */}
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: "20px", gap: "10px" }}>

                {msg.role === "ai" && (
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: msg.text === "typing" ? Infinity : 0 }}
                    style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #ff6b35, #ff8c42)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0, alignSelf: "flex-end", boxShadow: "0 4px 15px rgba(255,107,53,0.3)" }}>
                    🤖
                  </motion.div>
                )}

                <div style={{ maxWidth: "65%" }}>
                  <div style={{
                    background: msg.role === "user"
                      ? "linear-gradient(135deg, #4361ee, #7c3aed)"
                      : C.surface,
                    color: msg.role === "user" ? "white" : C.text,
                    padding: "14px 18px",
                    borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    fontSize: "14px", lineHeight: "1.7", whiteSpace: "pre-wrap",
                    border: msg.role === "ai" ? `1px solid ${C.border}` : "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
                  }}>
                    {msg.text === "typing" ? (
                      <div style={{ display: "flex", gap: "5px", alignItems: "center", padding: "2px 0" }}>
                        {[0, 1, 2].map(j => (
                          <motion.div key={j}
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: j * 0.15 }}
                            style={{ width: "7px", height: "7px", background: C.accent, borderRadius: "50%" }} />
                        ))}
                      </div>
                    ) : msg.text}
                  </div>

                  {msg.role === "ai" && msg.text !== "typing" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                      style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setFavourites(p => p.includes(msg.text) ? p.filter(f => f !== msg.text) : [...p, msg.text])}
                        style={{ padding: "4px 12px", fontSize: "11px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "10px", cursor: "pointer", color: favourites.includes(msg.text) ? "#f72585" : C.subtext, transition: "all 0.2s" }}>
                        {favourites.includes(msg.text) ? "❤️ Saved" : "🤍 Save"}
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => navigator.clipboard.writeText(msg.text)}
                        style={{ padding: "4px 12px", fontSize: "11px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "10px", cursor: "pointer", color: C.subtext }}>
                        📋 Copy
                      </motion.button>
                    </motion.div>
                  )}
                  {msg.time && <p style={{ fontSize: "10px", color: C.subtext, margin: "5px 0 0", textAlign: msg.role === "user" ? "right" : "left" }}>{msg.time}</p>}
                </div>

                {msg.role === "user" && (
                  <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #4361ee, #7c3aed)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "700", color: "white", flexShrink: 0, alignSelf: "flex-end" }}>
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, background: C.sidebar, zIndex: 10 }}>
          {(mood || dietType !== "Any" || cuisine !== "Any") && (
            <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
              {mood && <span style={{ padding: "3px 10px", background: "rgba(255,107,53,0.15)", color: "#ff6b35", borderRadius: "10px", fontSize: "11px", border: "1px solid rgba(255,107,53,0.25)" }}>{mood}</span>}
              {dietType !== "Any" && <span style={{ padding: "3px 10px", background: "rgba(76,201,240,0.15)", color: "#4cc9f0", borderRadius: "10px", fontSize: "11px", border: "1px solid rgba(76,201,240,0.25)" }}>{dietType}</span>}
              {cuisine !== "Any" && <span style={{ padding: "3px 10px", background: "rgba(67,97,238,0.15)", color: "#4361ee", borderRadius: "10px", fontSize: "11px", border: "1px solid rgba(67,97,238,0.25)" }}>{cuisine}</span>}
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <input
                style={{
                  width: "100%", padding: "14px 50px 14px 20px",
                  background: C.card, border: `1.5px solid ${isListening ? "#ff6b35" : C.border}`,
                  borderRadius: "25px", color: C.text, fontSize: "14px", outline: "none",
                  boxSizing: "border-box", transition: "border 0.2s",
                  boxShadow: isListening ? "0 0 0 3px rgba(255,107,53,0.15)" : "none"
                }}
                placeholder={isListening ? "🎤 Listening..." : `Ask about ${mealTime.label.toLowerCase()} ideas...`}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && getSuggestion()}
                onFocus={e => e.target.style.borderColor = "#ff6b35"}
                onBlur={e => !isListening && (e.target.style.borderColor = C.border)}
              />
              {/* Voice button inside input */}
              {supported && (
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  animate={{ scale: isListening ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
                  onClick={startListening}
                  style={{
                    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                    background: isListening ? "#ff6b35" : "transparent",
                    border: "none", cursor: "pointer", fontSize: "18px", padding: "4px",
                    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                  {isListening ? "🔴" : "🎤"}
                </motion.button>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => getSuggestion()} disabled={loading}
              style={{
                width: "50px", height: "50px",
                background: loading ? C.card : "linear-gradient(135deg, #ff6b35, #ff8c42)",
                color: loading ? C.subtext : "white",
                border: "none", borderRadius: "50%", cursor: loading ? "not-allowed" : "pointer",
                fontSize: "20px", flexShrink: 0,
                boxShadow: loading ? "none" : "0 6px 20px rgba(255,107,53,0.4)"
              }}>
              {loading ? "⏳" : "🚀"}
            </motion.button>
          </div>

          <p style={{ fontSize: "11px", color: C.subtext, textAlign: "center", margin: "10px 0 0" }}>
            Powered by Groq AI · Press Enter or 🎤 voice to send
          </p>
        </div>
      </div>
    </div>
  );
}