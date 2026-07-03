import { useState } from "react";
import { motion } from "framer-motion";
import ParticleBackground from "./ParticleBackground";

export default function AuthPage({ onLogin, onRegister }) {
  const [tab, setTab] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const FOOD_FACTS = [
    "🍛 Turmeric has powerful anti-inflammatory properties",
    "🌿 Tulsi (Holy Basil) boosts immunity naturally",
    "🥥 Coconut water is nature's electrolyte drink",
    "🫚 Ghee contains healthy fats that aid digestion",
    "🌾 Millets are superfoods rich in fiber and minerals",
  ];

  const randomFact = FOOD_FACTS[Math.floor(Date.now() / 10000) % FOOD_FACTS.length];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (tab === "login") await onLogin(email, password);
      else await onRegister(name, email, password);
    } catch (err) {
      setMessage(err);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a14 0%, #0f1023 50%, #141428 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", position: "relative", overflow: "hidden"
    }}>
      <ParticleBackground isDark={true} />

      {/* Glow orbs */}
      <div style={{ position: "fixed", top: "15%", left: "8%", width: "350px", height: "350px", background: "rgba(255,107,53,0.08)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "15%", right: "8%", width: "300px", height: "300px", background: "rgba(67,97,238,0.08)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ display: "flex", gap: "60px", alignItems: "center", zIndex: 1, padding: "20px" }}>

        {/* Left side — Branding */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: "400px", display: "none" }}
          className="auth-left"
        >
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: "rgba(15,16,35,0.85)",
            backdropFilter: "blur(24px)",
            borderRadius: "28px",
            padding: "48px 40px",
            width: "100%",
            maxWidth: "420px",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
            position: "relative",
            zIndex: 2
          }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: "80px", height: "80px",
                background: "linear-gradient(135deg, #ff6b35, #ff8c42)",
                borderRadius: "24px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "40px", margin: "0 auto 16px",
                boxShadow: "0 12px 40px rgba(255,107,53,0.4)"
              }}>🍱</motion.div>
            <h1 style={{ margin: "0 0 6px", color: "#fff", fontSize: "30px", fontWeight: "800", letterSpacing: "-0.5px" }}>NutriAI</h1>
            <p style={{ margin: "0 0 6px", color: "#6b6b8a", fontSize: "14px" }}>Your Personal Indian Chef Assistant</p>
            <div style={{ background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.2)", borderRadius: "8px", padding: "8px 12px", marginTop: "12px" }}>
              <p style={{ margin: 0, color: "#ff6b35", fontSize: "11px" }}>{randomFact}</p>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: "14px", padding: "4px", marginBottom: "28px" }}>
            {["login", "register"].map(t => (
              <button key={t} onClick={() => { setTab(t); setMessage(""); }} style={{
                flex: 1, padding: "11px",
                background: tab === t ? "linear-gradient(135deg, #ff6b35, #ff8c42)" : "transparent",
                color: tab === t ? "white" : "#6b6b8a",
                border: "none", borderRadius: "11px",
                cursor: "pointer", fontSize: "14px", fontWeight: "600",
                transition: "all 0.2s", textTransform: "capitalize"
              }}>{t === "login" ? "Sign In" : "Sign Up"}</button>
            ))}
          </div>

          {message && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ background: "rgba(255,59,48,0.1)", border: "1px solid rgba(255,59,48,0.3)", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px", color: "#ff3b30", fontSize: "13px" }}>
              {message}
            </motion.div>
          )}

          {tab === "register" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
              <input placeholder="Full Name" value={name} onChange={e => setName(e.target.value)}
                style={inputStyle} onFocus={e => e.target.style.borderColor = "#ff6b35"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
            </motion.div>
          )}

          <input placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} type="email"
            style={inputStyle} onFocus={e => e.target.style.borderColor = "#ff6b35"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
          <input placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} type="password"
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={inputStyle} onFocus={e => e.target.style.borderColor = "#ff6b35"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleSubmit} disabled={loading}
            style={{
              width: "100%", padding: "14px",
              background: loading ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #ff6b35, #ff8c42)",
              color: loading ? "#6b6b8a" : "white",
              border: "none", borderRadius: "14px", cursor: loading ? "not-allowed" : "pointer",
              fontSize: "15px", fontWeight: "700",
              boxShadow: loading ? "none" : "0 8px 25px rgba(255,107,53,0.4)"
            }}>
            {loading ? "⏳ Please wait..." : tab === "login" ? "Sign In →" : "Create Account →"}
          </motion.button>

          <p style={{ textAlign: "center", color: "#6b6b8a", fontSize: "12px", marginTop: "20px" }}>
            Powered by Groq AI + MongoDB
          </p>
        </motion.div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "13px 16px", marginBottom: "12px",
  borderRadius: "12px", border: "1.5px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)", color: "#e8e8f0",
  fontSize: "14px", outline: "none", boxSizing: "border-box",
  transition: "border 0.2s"
};