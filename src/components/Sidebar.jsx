import { motion, AnimatePresence } from "framer-motion";
import { CUISINES, MOODS, DIET_TYPES, getMealTime } from "../utils/helpers";
import { useResponsive } from "../hooks/useResponsive";

export default function Sidebar({ C, page, setPage, userName, mood, setMood, dietType, setDietType, cuisine, setCuisine, theme, setTheme, logout, favourites, messages, sidebarOpen, setSidebarOpen }) {
  const mealTime = getMealTime();
  const { isMobile, isTablet } = useResponsive();

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 99, backdropFilter: "blur(4px)" }} />
      )}

      <AnimatePresence>
        {(sidebarOpen || (!isMobile)) && (
          <motion.div
            initial={isMobile ? { x: -280 } : false}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -280 } : {}}
            transition={{ type: "spring", damping: 25 }}
            style={{
              width: isMobile ? "260px" : isTablet ? "200px" : "240px",
              minWidth: isMobile ? "260px" : isTablet ? "200px" : "240px",
              background: C.sidebar,
              borderRight: `1px solid ${C.border}`,
              display: "flex", flexDirection: "column",
              overflow: "hidden", height: "100vh",
              position: isMobile ? "fixed" : "relative",
              zIndex: isMobile ? 100 : 1,
              left: 0, top: 0,
            }}>
            <div style={{ padding: isMobile ? "16px 14px" : "18px 16px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column" }}>

              {/* Logo + close button */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", paddingBottom: "16px", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    style={{ width: "34px", height: "34px", background: "linear-gradient(135deg, #ff6b35, #ff8c42)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
                    🍱
                  </motion.div>
                  <div>
                    <p style={{ margin: 0, fontWeight: "800", fontSize: "15px", color: "#ff6b35" }}>NutriAI</p>
                    <p style={{ margin: 0, fontSize: "10px", color: C.subtext }}>AI Chef Assistant</p>
                  </div>
                </div>
                {isMobile && (
                  <button onClick={() => setSidebarOpen(false)}
                    style={{ background: "none", border: "none", color: C.subtext, cursor: "pointer", fontSize: "20px", padding: "4px" }}>✕</button>
                )}
              </div>

              {/* User */}
              <div style={{ background: C.card, borderRadius: "12px", padding: "12px", marginBottom: "16px", border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #4361ee, #7c3aed)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", color: "white", flexShrink: 0 }}>
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: "600", fontSize: "13px" }}>{userName}</p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#ff6b35" }}>{mealTime.emoji} {mealTime.label} time</p>
                  </div>
                </div>
              </div>

              {/* Stats pills */}
              <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
                <div style={{ flex: 1, background: "rgba(255,107,53,0.1)", borderRadius: "8px", padding: "6px", textAlign: "center", border: "1px solid rgba(255,107,53,0.2)" }}>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#ff6b35" }}>{messages.filter(m => m.role === "user").length}</p>
                  <p style={{ margin: 0, fontSize: "9px", color: C.subtext }}>Queries</p>
                </div>
                <div style={{ flex: 1, background: "rgba(248,37,133,0.1)", borderRadius: "8px", padding: "6px", textAlign: "center", border: "1px solid rgba(248,37,133,0.2)" }}>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#f72585" }}>{favourites.length}</p>
                  <p style={{ margin: 0, fontSize: "9px", color: C.subtext }}>Saved</p>
                </div>
              </div>

              {/* Nav */}
              <div style={{ marginBottom: "16px" }}>
                <p style={{ fontSize: "9px", color: C.subtext, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: "700" }}>Navigation</p>
                {[
                  { id: "home", emoji: "💬", label: "AI Chat" },
                  { id: "dashboard", emoji: "📊", label: "Dashboard" },
                  { id: "mealplan", emoji: "🗓️", label: "Meal Planner" },
                ].map(nav => (
                  <motion.button key={nav.id} whileHover={{ x: 3 }}
                    onClick={() => { setPage(nav.id); if (isMobile) setSidebarOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      width: "100%", padding: "9px 11px", marginBottom: "3px",
                      background: page === nav.id ? "rgba(255,107,53,0.12)" : "transparent",
                      color: page === nav.id ? "#ff6b35" : C.text,
                      border: page === nav.id ? "1px solid rgba(255,107,53,0.25)" : "1px solid transparent",
                      borderRadius: "9px", cursor: "pointer", fontSize: "13px",
                      fontWeight: page === nav.id ? "600" : "400",
                      textAlign: "left", transition: "all 0.2s"
                    }}>
                    <span style={{ fontSize: "15px" }}>{nav.emoji}</span> {nav.label}
                  </motion.button>
                ))}
              </div>

              {/* Mood */}
              <div style={{ marginBottom: "14px" }}>
                <p style={{ fontSize: "9px", color: C.subtext, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: "700" }}>Your Mood</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {MOODS.map(m => (
                    <motion.button key={m.label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => setMood(mood === m.label ? "" : m.label)}
                      style={{ padding: "4px 8px", fontSize: "11px", border: "none", borderRadius: "7px", cursor: "pointer", background: mood === m.label ? "#ff6b35" : C.card, color: mood === m.label ? "white" : C.subtext, transition: "all 0.2s" }}>
                      {m.emoji} {m.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Diet */}
              <div style={{ marginBottom: "14px" }}>
                <p style={{ fontSize: "9px", color: C.subtext, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: "700" }}>Diet Type</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {DIET_TYPES.map(d => (
                    <motion.button key={d.label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => setDietType(d.label)}
                      style={{ padding: "4px 8px", fontSize: "11px", border: "none", borderRadius: "7px", cursor: "pointer", background: dietType === d.label ? "#4cc9f0" : C.card, color: dietType === d.label ? "white" : C.subtext, transition: "all 0.2s" }}>
                      {d.emoji} {d.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Cuisine */}
              <div style={{ marginBottom: "14px" }}>
                <p style={{ fontSize: "9px", color: C.subtext, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: "700" }}>Cuisine</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {CUISINES.map(c => (
                    <motion.button key={c} whileHover={{ x: 3 }}
                      onClick={() => setCuisine(c)}
                      style={{ padding: "6px 10px", fontSize: "12px", border: "none", borderRadius: "7px", cursor: "pointer", background: cuisine === c ? "rgba(67,97,238,0.15)" : "transparent", color: cuisine === c ? "#4361ee" : C.subtext, textAlign: "left", fontWeight: cuisine === c ? "600" : "400", transition: "all 0.2s" }}>
                      {cuisine === c ? "▶ " : "  "}{c}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Bottom */}
              <div style={{ marginTop: "auto", paddingTop: "14px", borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: "5px" }}>
                <motion.button whileHover={{ scale: 1.02 }}
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  style={{ padding: "8px 12px", background: C.card, color: C.text, border: `1px solid ${C.border}`, borderRadius: "9px", cursor: "pointer", fontSize: "12px", textAlign: "left" }}>
                  {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} onClick={logout}
                  style={{ padding: "8px 12px", background: "rgba(255,59,48,0.08)", color: "#ff3b30", border: "1px solid rgba(255,59,48,0.15)", borderRadius: "9px", cursor: "pointer", fontSize: "12px", textAlign: "left" }}>
                  🚪 Sign Out
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}