import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const CUISINES = ["Any", "South Indian", "North Indian", "Chinese", "Italian", "Continental"];
const MOODS = ["😊 Happy", "😢 Sad", "😤 Stressed", "😴 Tired", "🤒 Sick", "💪 Energetic"];
const DIET_TYPES = ["Any", "🥗 Veg", "🍖 Non-Veg", "🌱 Vegan"];
const SUGGESTIONS = [
  "I have tomato, onion and rice 🍅",
  "Something spicy for dinner 🌶️",
  "Light breakfast ideas 🌅",
  "I want comfort food 🥘",
  "Quick 15 min recipe ⚡",
];

const getMealTime = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return "Breakfast";
  if (hour >= 11 && hour < 16) return "Lunch";
  if (hour >= 16 && hour < 19) return "Snacks";
  return "Dinner";
};

export default function App() {
  const [page, setPage] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [userName, setUserName] = useState("");
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState("dark");
  const [cuisine, setCuisine] = useState("Any");
  const [favourites, setFavourites] = useState([]);
  const [mood, setMood] = useState("");
  const [dietType, setDietType] = useState("Any");
  const chatEndRef = useRef(null);

  const isDark = theme === "dark";
  const colors = {
    bg: isDark ? "#0f0f1a" : "#f0f4ff",
    sidebar: isDark ? "#1a1a2e" : "#ffffff",
    chat: isDark ? "#16213e" : "#f8f9ff",
    bubble_ai: isDark ? "#1e3a5f" : "#e8f0fe",
    bubble_user: isDark ? "#2d6a4f" : "#d4edda",
    text: isDark ? "#e0e0e0" : "#1a1a2a",
    subtext: isDark ? "#888" : "#666",
    input: isDark ? "#1a1a2e" : "#ffffff",
    border: isDark ? "#2a2a4a" : "#e0e0e0",
    accent: "#ff6b35",
    accent2: "#4cc9f0",
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const register = async () => {
    try {
      const res = await axios.post(`${API}/auth/register`, { name, email, password });
      setMessage(res.data.message);
      setPage("login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  const login = async () => {
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      setToken(res.data.token);
      setUserName(res.data.user.name);
      setMessages([{
        role: "ai",
        text: `Welcome back, ${res.data.user.name}! 👋 I'm NutriAI, your personal Indian chef assistant. It's ${getMealTime()} time! Tell me what you're craving and I'll suggest the perfect dish! 🍱`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }]);
      setPage("home");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  const getSuggestion = async (customQuery) => {
    const q = customQuery || query;
    if (!q.trim()) return;

    const currentMealTime = getMealTime();
    const currentHour = new Date().getHours();

    const contextPrompt = `
      User query: ${q}
      Current meal time: ${currentMealTime} (${currentHour}:00 hrs)
      Cuisine preference: ${cuisine !== "Any" ? cuisine : "Any cuisine"}
      Diet type: ${dietType !== "Any" ? dietType.replace(/[^\w\s]/g, '') : "No restriction"}
      User mood: ${mood || "Not specified"}
      
      Based on ALL the above context, suggest a perfect Indian food dish.
      Include:
      1. Dish name and why it suits the context
      2. Key ingredients (5-6 items)
      3. Quick preparation steps (3-4 steps)
      4. Approximate nutrition: Calories, Protein, Carbs, Fat
      5. One health tip related to this dish
      Keep it friendly and conversational!
    `;

    const userMsg = {
      role: "user",
      text: `${mood ? mood + " • " : ""}${dietType !== "Any" ? dietType + " • " : ""}${q}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery("");
    setLoading(true);
    setMessages(prev => [...prev, { role: "ai", text: "typing", time: "" }]);

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
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          query: q
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev.filter(m => m.text !== "typing"),
        { role: "ai", text: "Sorry, something went wrong! 😅", time: "" }
      ]);
    }
    setLoading(false);
  };

  const toggleFavourite = (text) => {
    setFavourites(prev =>
      prev.includes(text) ? prev.filter(f => f !== text) : [...prev, text]
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard! 📋");
  };

  const styles = {
    page: { minHeight: "100vh", background: colors.bg, color: colors.text, fontFamily: "'Segoe UI', sans-serif", transition: "all 0.3s" },
    authBox: { maxWidth: "420px", margin: "0 auto", padding: "60px 20px" },
    authCard: { background: colors.sidebar, borderRadius: "20px", padding: "40px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" },
    input: { width: "100%", padding: "12px 16px", marginBottom: "12px", borderRadius: "10px", border: `1px solid ${colors.border}`, background: colors.input, color: colors.text, fontSize: "15px", outline: "none", boxSizing: "border-box" },
    btn: { padding: "12px 24px", background: `linear-gradient(135deg, ${colors.accent}, #ff8c42)`, color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "15px", fontWeight: "600" },
    btnSecondary: { padding: "12px 24px", background: colors.border, color: colors.text, border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "15px" },
  };

  if (page === "register") return (
    <div style={styles.page}>
      <div style={styles.authBox}>
        <div style={styles.authCard}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <div style={{ fontSize: "48px" }}>🍱</div>
            <h1 style={{ margin: "10px 0 5px", color: colors.accent }}>NutriAI</h1>
            <p style={{ color: colors.subtext, margin: 0 }}>Your Personal Indian Chef Assistant</p>
          </div>
          {message && <p style={{ color: "#ff4444", textAlign: "center" }}>{message}</p>}
          <input style={styles.input} placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
          <input style={styles.input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input style={styles.input} placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <div style={{ display: "flex", gap: "10px" }}>
            <button style={{ ...styles.btn, flex: 1 }} onClick={register}>Create Account</button>
            <button style={{ ...styles.btnSecondary, flex: 1 }} onClick={() => setPage("login")}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );

  if (page === "login") return (
    <div style={styles.page}>
      <div style={styles.authBox}>
        <div style={styles.authCard}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <div style={{ fontSize: "48px" }}>🍱</div>
            <h1 style={{ margin: "10px 0 5px", color: colors.accent }}>NutriAI</h1>
            <p style={{ color: colors.subtext, margin: 0 }}>Your Personal Indian Chef Assistant</p>
          </div>
          {message && <p style={{ color: "#ff4444", textAlign: "center" }}>{message}</p>}
          <input style={styles.input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input style={styles.input} placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <div style={{ display: "flex", gap: "10px" }}>
            <button style={{ ...styles.btn, flex: 1 }} onClick={login}>Login</button>
            <button style={{ ...styles.btnSecondary, flex: 1 }} onClick={() => setPage("register")}>Register</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ ...styles.page, display: "flex", height: "100vh", overflow: "hidden" }}>

      {/* Sidebar */}
      <div style={{ width: "260px", background: colors.sidebar, borderRight: `1px solid ${colors.border}`, display: "flex", flexDirection: "column", padding: "20px", overflowY: "auto" }}>
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "32px", textAlign: "center" }}>🍱</div>
          <h2 style={{ textAlign: "center", margin: "8px 0 4px", color: colors.accent }}>NutriAI</h2>
          <p style={{ textAlign: "center", fontSize: "12px", color: colors.subtext, margin: 0 }}>Personal Chef Assistant</p>
        </div>

        {/* User info */}
        <div style={{ background: colors.chat, borderRadius: "12px", padding: "12px", marginBottom: "16px" }}>
          <p style={{ margin: 0, fontSize: "13px", color: colors.subtext }}>Logged in as</p>
          <p style={{ margin: "4px 0 0", fontWeight: "600", fontSize: "15px" }}>👤 {userName}</p>
          <p style={{ margin: "4px 0 0", fontSize: "12px", color: colors.accent }}>🍽️ {getMealTime()} time</p>
        </div>

        {/* Mood Selector */}
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", color: colors.subtext, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Your Mood</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {MOODS.map(m => (
              <button key={m} onClick={() => setMood(mood === m ? "" : m)}
                style={{ padding: "5px 8px", background: mood === m ? colors.accent : colors.chat, color: mood === m ? "white" : colors.text, border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "11px" }}>
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Diet Type */}
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", color: colors.subtext, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Diet Type</p>
          {DIET_TYPES.map(d => (
            <button key={d} onClick={() => setDietType(d)}
              style={{ display: "block", width: "100%", padding: "7px 12px", marginBottom: "5px", background: dietType === d ? colors.accent2 : colors.chat, color: dietType === d ? "white" : colors.text, border: "none", borderRadius: "8px", cursor: "pointer", textAlign: "left", fontSize: "12px" }}>
              {d}
            </button>
          ))}
        </div>

        {/* Cuisine Filter */}
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", color: colors.subtext, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Cuisine</p>
          {CUISINES.map(c => (
            <button key={c} onClick={() => setCuisine(c)}
              style={{ display: "block", width: "100%", padding: "7px 12px", marginBottom: "5px", background: cuisine === c ? colors.accent : colors.chat, color: cuisine === c ? "white" : colors.text, border: "none", borderRadius: "8px", cursor: "pointer", textAlign: "left", fontSize: "12px" }}>
              {c}
            </button>
          ))}
        </div>

        {/* Favourites */}
        {favourites.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <p style={{ fontSize: "11px", color: colors.subtext, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>❤️ Favourites ({favourites.length})</p>
            {favourites.map((fav, i) => (
              <div key={i} style={{ background: colors.chat, borderRadius: "8px", padding: "8px", marginBottom: "5px", fontSize: "11px", color: colors.subtext }}>
                {fav.substring(0, 40)}...
              </div>
            ))}
          </div>
        )}

        {/* Theme + Logout */}
        <div style={{ marginTop: "auto", paddingTop: "10px" }}>
          <button onClick={() => setTheme(isDark ? "light" : "dark")}
            style={{ ...styles.btnSecondary, width: "100%", marginBottom: "8px", fontSize: "12px" }}>
            {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          <button onClick={() => { setToken(""); setPage("login"); setMessages([]); }}
            style={{ ...styles.btnSecondary, width: "100%", fontSize: "12px", color: "#ff4444" }}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: colors.chat }}>

        {/* Header */}
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${colors.border}`, background: colors.sidebar, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px" }}>🤖 NutriAI Chef</h3>
            <p style={{ margin: 0, fontSize: "12px", color: "#4caf50" }}>
              ● Online — {cuisine} • {getMealTime()} • {dietType !== "Any" ? dietType : "All diet"} {mood ? `• ${mood}` : ""}
            </p>
          </div>
          <div style={{ fontSize: "12px", color: colors.subtext }}>
            {messages.filter(m => m.role === "user").length} queries today
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflow: "auto", padding: "20px" }}>
          {messages.length <= 1 && (
            <div style={{ marginBottom: "20px" }}>
              <p style={{ color: colors.subtext, fontSize: "13px", marginBottom: "10px" }}>💡 Try these:</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} onClick={() => getSuggestion(s)}
                    style={{ padding: "8px 14px", background: colors.sidebar, color: colors.text, border: `1px solid ${colors.border}`, borderRadius: "20px", cursor: "pointer", fontSize: "13px" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: "16px" }}>
              {msg.role === "ai" && <div style={{ fontSize: "28px", marginRight: "10px", alignSelf: "flex-end" }}>🤖</div>}
              <div style={{ maxWidth: "70%" }}>
                <div style={{ background: msg.role === "user" ? colors.bubble_user : colors.bubble_ai, padding: "14px 18px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", fontSize: "14px", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                  {msg.text === "typing" ? (
                    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                      <span>●</span><span>●</span><span>●</span>
                    </div>
                  ) : msg.text}
                </div>
                {msg.role === "ai" && msg.text !== "typing" && (
                  <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                    <button onClick={() => toggleFavourite(msg.text)}
                      style={{ padding: "4px 10px", fontSize: "11px", background: "transparent", border: `1px solid ${colors.border}`, borderRadius: "12px", cursor: "pointer", color: favourites.includes(msg.text) ? "#ff6b35" : colors.subtext }}>
                      {favourites.includes(msg.text) ? "❤️ Saved" : "🤍 Save"}
                    </button>
                    <button onClick={() => copyToClipboard(msg.text)}
                      style={{ padding: "4px 10px", fontSize: "11px", background: "transparent", border: `1px solid ${colors.border}`, borderRadius: "12px", cursor: "pointer", color: colors.subtext }}>
                      📋 Copy
                    </button>
                  </div>
                )}
                {msg.time && <p style={{ fontSize: "10px", color: colors.subtext, margin: "4px 0 0", textAlign: msg.role === "user" ? "right" : "left" }}>{msg.time}</p>}
              </div>
              {msg.role === "user" && <div style={{ fontSize: "28px", marginLeft: "10px", alignSelf: "flex-end" }}>👤</div>}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${colors.border}`, background: colors.sidebar }}>
          {/* Active filters display */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
            {mood && <span style={{ padding: "3px 10px", background: colors.accent, color: "white", borderRadius: "12px", fontSize: "11px" }}>{mood}</span>}
            {dietType !== "Any" && <span style={{ padding: "3px 10px", background: colors.accent2, color: "white", borderRadius: "12px", fontSize: "11px" }}>{dietType}</span>}
            {cuisine !== "Any" && <span style={{ padding: "3px 10px", background: "#6c63ff", color: "white", borderRadius: "12px", fontSize: "11px" }}>{cuisine}</span>}
            <span style={{ padding: "3px 10px", background: colors.chat, color: colors.subtext, borderRadius: "12px", fontSize: "11px" }}>🍽️ {getMealTime()}</span>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <input
              style={{ ...styles.input, marginBottom: 0, flex: 1, borderRadius: "25px", padding: "14px 20px" }}
              placeholder={`Ask NutriAI... (${getMealTime()} • ${cuisine})`}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && getSuggestion()}
            />
            <button onClick={() => getSuggestion()} disabled={loading}
              style={{ ...styles.btn, borderRadius: "50%", width: "50px", height: "50px", padding: 0, fontSize: "20px", flexShrink: 0 }}>
              {loading ? "⏳" : "🚀"}
            </button>
          </div>
          <p style={{ fontSize: "11px", color: colors.subtext, textAlign: "center", marginTop: "8px" }}>
            Powered by Groq AI • Press Enter to send
          </p>
        </div>
      </div>
    </div>
  );
}