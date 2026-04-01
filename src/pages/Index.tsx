import { useEffect, useMemo, useRef, useState } from "react";

const MOODBOARD_SRC = "/moodboard.html";
const IFRAME_LOAD_TIMEOUT_MS = 12000;
const MAX_IFRAME_RETRIES = 1;

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
  const loadTimerRef = useRef<number | null>(null);

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

  const handleLoad = () => {
    if (loadTimerRef.current !== null) { window.clearTimeout(loadTimerRef.current); loadTimerRef.current = null; }
    setLoaded(true);
  };

  const handleError = () => {
    if (loadTimerRef.current !== null) { window.clearTimeout(loadTimerRef.current); loadTimerRef.current = null; }
    setAttempt((c) => (c < MAX_IFRAME_RETRIES ? c + 1 : c));
  };

  return (
    <div className="relative w-full" style={{ height: "100dvh" }}>
      {!loaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden" style={{ background: "#0a0812" }}>
          {/* Floating shapes */}
          <div style={{position:"absolute",width:120,height:120,borderRadius:"50%",border:"1.5px solid rgba(201,169,110,0.15)",top:"15%",left:"10%",animation:"shapeFloat 4s ease-in-out infinite"}}/>
          <div style={{position:"absolute",width:0,height:0,borderLeft:"50px solid transparent",borderRight:"50px solid transparent",borderBottom:"86px solid rgba(206,147,216,0.08)",top:"20%",right:"12%",animation:"shapeFloat 4s 0.5s ease-in-out infinite"}}/>
          <div style={{position:"absolute",width:60,height:60,background:"rgba(201,169,110,0.06)",transform:"rotate(45deg)",bottom:"25%",left:"15%",animation:"shapeFloat 4s 1s ease-in-out infinite"}}/>
          <div style={{position:"absolute",width:180,height:180,borderRadius:"50%",border:"1px solid rgba(206,147,216,0.08)",bottom:"15%",right:"8%",animation:"shapeFloat 4s 0.3s ease-in-out infinite"}}/>
          <div style={{position:"absolute",width:8,height:8,borderRadius:"50%",background:"rgba(201,169,110,0.2)",top:"40%",left:"75%",animation:"shapeFloat 4s 0.7s ease-in-out infinite"}}/>

          {/* Name */}
          <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:"clamp(2rem,7vw,3.2rem)",fontWeight:900,letterSpacing:"-0.02em",lineHeight:1,background:"linear-gradient(135deg,#fff 30%,#C9A96E 60%,#CE93D8 90%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",animation:"ldUp 0.6s 0.15s both",position:"relative",zIndex:2}}>
            Akash Matania
          </h1>

          {/* Role cycling */}
          <div style={{height:"2rem",overflow:"hidden",marginTop:12,position:"relative",zIndex:2,animation:"ldUp 0.5s 0.4s both"}}>
            <div style={{display:"flex",flexDirection:"column",animation:"roleScroll 2.4s 0.6s steps(1) forwards"}}>
              {ROLES.map(([icon, label]) => (
                <div key={label} style={{height:"2rem",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"'Space Grotesk',sans-serif",fontSize:"0.85rem",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",whiteSpace:"nowrap"}}>
                  <span>{icon}</span>
                  <span style={{background:"linear-gradient(90deg,rgba(255,255,255,0.6),rgba(255,255,255,0.35))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Accent line */}
          <div style={{width:50,height:2,marginTop:20,background:"linear-gradient(90deg,transparent,#C9A96E,#CE93D8,transparent)",animation:"ldUp 0.4s 0.5s both",position:"relative",zIndex:2}}/>

          {/* Progress bar */}
          <div style={{width:140,height:3,borderRadius:3,background:"rgba(255,255,255,0.06)",marginTop:24,overflow:"hidden",animation:"ldUp 0.5s 0.7s both",position:"relative",zIndex:2}}>
            <div style={{height:"100%",width:0,borderRadius:3,background:"linear-gradient(90deg,#C9A96E,#CE93D8)",animation:"ldBar 2s 0.8s cubic-bezier(0.4,0,0.2,1) forwards"}}/>
          </div>

          <style>{`
            @keyframes shapeFloat{0%{opacity:0;transform:translateY(20px) rotate(0deg)}20%{opacity:.7}50%{opacity:1;transform:translateY(-15px) rotate(8deg)}80%{opacity:.7}100%{opacity:0;transform:translateY(20px) rotate(0deg)}}
            @keyframes ldUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
            @keyframes roleScroll{0%{transform:translateY(0)}16%{transform:translateY(-2rem)}32%{transform:translateY(-4rem)}48%{transform:translateY(-6rem)}64%{transform:translateY(-8rem)}80%,100%{transform:translateY(-10rem)}}
            @keyframes ldBar{0%{width:0}60%{width:70%}100%{width:100%}}
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
