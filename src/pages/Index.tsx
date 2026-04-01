import { useEffect, useMemo, useRef, useState, useCallback } from "react";

const MOODBOARD_SRC = "/moodboard.html";
const IFRAME_LOAD_TIMEOUT_MS = 12000;
const MAX_IFRAME_RETRIES = 1;
const LOADER_DURATION_MS = 3200;

const ROLES: [string, string][] = [
  ["🚀", "FOUNDER"],
  ["🛠", "BUILDER"],
  ["📦", "PRODUCT MANAGER"],
  ["🎨", "DESIGNER"],
  ["⚡", "ENGINEER"],
  ["✨", "CREATOR"],
];

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [percent, setPercent] = useState(0);
  const loadTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef(Date.now());

  const moodboardSrc = useMemo(
    () => (attempt === 0 ? MOODBOARD_SRC : `${MOODBOARD_SRC}?retry=${attempt}`),
    [attempt],
  );

  useEffect(() => {
    setLoaded(false);
    if (loadTimerRef.current !== null) window.clearTimeout(loadTimerRef.current);
    loadTimerRef.current = window.setTimeout(() => {
      setAttempt((c) => (c < MAX_IFRAME_RETRIES ? c + 1 : c));
    }, IFRAME_LOAD_TIMEOUT_MS);
    return () => { if (loadTimerRef.current !== null) window.clearTimeout(loadTimerRef.current); };
  }, [attempt]);

  // Percentage counter
  useEffect(() => {
    if (loaded) return;
    startTimeRef.current = Date.now();
    const iv = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, Math.round((elapsed / LOADER_DURATION_MS) * 100));
      setPercent(pct);
      if (pct >= 100) clearInterval(iv);
    }, 30);
    return () => clearInterval(iv);
  }, [loaded]);

  const handleLoad = useCallback(() => {
    if (loadTimerRef.current !== null) { window.clearTimeout(loadTimerRef.current); loadTimerRef.current = null; }
    setLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    if (loadTimerRef.current !== null) { window.clearTimeout(loadTimerRef.current); loadTimerRef.current = null; }
    setAttempt((c) => (c < MAX_IFRAME_RETRIES ? c + 1 : c));
  }, []);

  return (
    <div className="relative w-full" style={{ height: "100dvh" }}>
      {!loaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden" style={{ background: "#0a0812" }}>
          {/* Name */}
          <h1 style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: "clamp(2rem,7vw,3.2rem)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            background: "linear-gradient(135deg,#fff 30%,#C9A96E 60%,#CE93D8 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "ldUp 0.6s 0.15s both",
            position: "relative",
            zIndex: 3,
          }}>Akash Matania</h1>

          {/* Role cycling */}
          <div style={{ height: "2rem", overflow: "hidden", marginTop: 12, position: "relative", zIndex: 3, animation: "ldUp 0.5s 0.4s both" }}>
            <div style={{ display: "flex", flexDirection: "column", animation: "roleScroll 2.4s 0.6s steps(1) forwards" }}>
              {ROLES.map(([icon, label]) => (
                <div key={label} style={{ height: "2rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "'Space Grotesk',sans-serif", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                  <span>{icon}</span>
                  <span style={{ background: "linear-gradient(90deg,rgba(255,255,255,0.6),rgba(255,255,255,0.35))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Accent line */}
          <div style={{ width: 50, height: 2, marginTop: 20, background: "linear-gradient(90deg,transparent,#C9A96E,#CE93D8,transparent)", animation: "ldUp 0.4s 0.5s both", position: "relative", zIndex: 3 }} />

          {/* Percentage counter */}
          <div style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: "clamp(4rem,15vw,8rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            background: "linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            position: "absolute",
            bottom: "12%",
            right: "8%",
            zIndex: 1,
            fontVariantNumeric: "tabular-nums",
          }}>{percent}</div>

          <style>{`
            @keyframes ldUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
            @keyframes roleScroll{0%{transform:translateY(0)}16%{transform:translateY(-2rem)}32%{transform:translateY(-4rem)}48%{transform:translateY(-6rem)}64%{transform:translateY(-8rem)}80%,100%{transform:translateY(-10rem)}}
          `}</style>
        </div>
      )}

      <iframe
        key={attempt}
        src={moodboardSrc}
        title="Akash's Moodboard"
        className="w-full border-0"
        style={{ height: "100dvh", overflow: "hidden", opacity: loaded ? 1 : 0, transition: "opacity 0.4s" }}
        onLoad={handleLoad}
        onError={handleError}
        allow="autoplay"
      />
    </div>
  );
};

export default Index;
