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

const EMOJIS = ["🔥","⚡","🎯","💎","🌈","🎨","🚀","✨","🎪","🧩","🎲","💜","🟢","🔴","🟡","🔵","🟠","⭐","🪄","🎭"];
const COLORS = ["#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FFEAA7","#DDA0DD","#FF6EC7","#98D8C8","#F7DC6F","#BB8FCE","#85C1E9","#F0B27A"];

function rnd(a: number, b: number) { return a + Math.random() * (b - a); }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

interface Sticker {
  id: number;
  content: string;
  isEmoji: boolean;
  size: number;
  color: string;
  left: string;
  top: string;
  sx: string; sy: string; dx: string; dy: string;
  sr: string; er: string; dur: string;
}

let stickerIdCounter = 0;

function makeSticker(): Sticker {
  const isEmoji = Math.random() > 0.4;
  const angle = rnd(0, Math.PI * 2);
  const radius = rnd(60, 220);
  return {
    id: stickerIdCounter++,
    content: isEmoji ? pick(EMOJIS) : "",
    isEmoji,
    size: isEmoji ? rnd(1.4, 3.2) : rnd(24, 52),
    color: pick(COLORS),
    left: `calc(50% + ${Math.cos(angle) * rnd(-30, 30)}px)`,
    top: `calc(50% + ${Math.sin(angle) * rnd(-30, 30)}px)`,
    sx: `${Math.cos(angle + Math.PI) * radius}px`,
    sy: `${Math.sin(angle + Math.PI) * radius}px`,
    dx: `${Math.cos(angle) * radius * 0.8}px`,
    dy: `${Math.sin(angle) * radius * 0.8}px`,
    sr: `${rnd(-180, 180)}deg`,
    er: `${rnd(-45, 45)}deg`,
    dur: `${rnd(2, 3.5)}s`,
  };
}

function SVGShape({ color, size }: { color: string; size: number }) {
  const shapes = [
    <svg key="c" width={size} height={size} viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill={color} opacity="0.85"/></svg>,
    <svg key="r" width={size} height={size} viewBox="0 0 48 48"><rect x="6" y="6" width="36" height="36" rx="4" fill={color} opacity="0.85" transform="rotate(15 24 24)"/></svg>,
    <svg key="t" width={size} height={size} viewBox="0 0 48 48"><polygon points="24,4 44,40 4,40" fill={color} opacity="0.85"/></svg>,
    <svg key="s" width={size} height={size} viewBox="0 0 52 52"><polygon points="26,2 33,18 50,20 37,32 40,50 26,42 12,50 15,32 2,20 19,18" fill={color} opacity="0.85"/></svg>,
    <svg key="d" width={size} height={size} viewBox="0 0 48 48"><rect x="10" y="10" width="28" height="28" fill={color} opacity="0.85" transform="rotate(45 24 24)"/></svg>,
  ];
  return shapes[Math.floor(Math.random() * shapes.length)];
}

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [percent, setPercent] = useState(0);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const loadTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef(Date.now());

  const moodboardSrc = useMemo(
    () => (attempt === 0 ? MOODBOARD_SRC : `${MOODBOARD_SRC}?retry=${attempt}`),
    [attempt],
  );

  // Iframe load/retry logic
  useEffect(() => {
    setLoaded(false);
    if (loadTimerRef.current !== null) window.clearTimeout(loadTimerRef.current);
    loadTimerRef.current = window.setTimeout(() => {
      setAttempt((c) => (c < MAX_IFRAME_RETRIES ? c + 1 : c));
    }, IFRAME_LOAD_TIMEOUT_MS);
    return () => { if (loadTimerRef.current !== null) window.clearTimeout(loadTimerRef.current); };
  }, [attempt]);

  // Sticker spawner
  useEffect(() => {
    if (loaded) return;
    const iv = setInterval(() => {
      const count = Math.floor(rnd(2, 5));
      const newOnes = Array.from({ length: count }, () => makeSticker());
      setStickers(prev => [...prev.slice(-30), ...newOnes]);
    }, 400);
    return () => clearInterval(iv);
  }, [loaded]);

  // Remove stickers after animation
  useEffect(() => {
    if (stickers.length === 0) return;
    const timer = setTimeout(() => {
      setStickers(prev => prev.slice(Math.floor(rnd(2, 5))));
    }, 4000);
    return () => clearTimeout(timer);
  }, [stickers.length]);

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
          {/* Scattered stickers */}
          {stickers.map((s) => (
            <div
              key={s.id}
              style={{
                position: "absolute",
                left: s.left,
                top: s.top,
                fontSize: s.isEmoji ? `${s.size}rem` : undefined,
                width: !s.isEmoji ? s.size : undefined,
                height: !s.isEmoji ? s.size : undefined,
                opacity: 0,
                pointerEvents: "none",
                filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))",
                animation: `stickerFly ${s.dur} cubic-bezier(0.22,1,0.36,1) forwards`,
                ["--sx" as string]: s.sx,
                ["--sy" as string]: s.sy,
                ["--dx" as string]: s.dx,
                ["--dy" as string]: s.dy,
                ["--sr" as string]: s.sr,
                ["--er" as string]: s.er,
              } as React.CSSProperties}
            >
              {s.isEmoji ? s.content : <SVGShape color={s.color} size={s.size} />}
            </div>
          ))}

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
            @keyframes stickerFly{
              0%{opacity:0;transform:translate(var(--sx,0),var(--sy,0)) rotate(var(--sr,0deg)) scale(0.3)}
              15%{opacity:1;transform:translate(calc(var(--sx,0) * 0.5),calc(var(--sy,0) * 0.5)) rotate(calc(var(--sr,0deg) * 0.5)) scale(1.15)}
              40%{opacity:1;transform:translate(0,0) rotate(var(--er,0deg)) scale(1)}
              70%{opacity:1;transform:translate(var(--dx,0),var(--dy,0)) rotate(calc(var(--er,0deg) + 15deg)) scale(0.95)}
              100%{opacity:0;transform:translate(calc(var(--dx,0) * 2),calc(var(--dy,0) * 2)) rotate(calc(var(--er,0deg) + 40deg)) scale(0.5)}
            }
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
