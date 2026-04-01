import { useEffect, useRef, useState, useCallback } from "react";

const MOODBOARD_SRC = "/moodboard.html";

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  // Fallback: if iframe doesn't trigger onLoad within 8s, show it anyway
  useEffect(() => {
    if (loaded) return;
    const t = window.setTimeout(() => setLoaded(true), 8000);
    return () => window.clearTimeout(t);
  }, [loaded]);

  return (
    <div className="relative w-full" style={{ height: "100dvh" }}>
      <iframe
        ref={iframeRef}
        src={MOODBOARD_SRC}
        title="Akash's Moodboard"
        className="w-full border-0"
        style={{ height: "100dvh", overflow: "hidden", opacity: loaded ? 1 : 0, transition: "opacity 0.3s" }}
        onLoad={handleLoad}
        allow="autoplay"
      />
    </div>
  );
};

export default Index;
