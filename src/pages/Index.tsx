import { useEffect, useRef, useState, useCallback, memo } from "react";

const MOODBOARD_SRC = "/moodboard.html";

const Index = memo(function Index() {
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const mountedRef = useRef(true);

  const handleLoad = useCallback(() => {
    if (mountedRef.current) setLoaded(true);
  }, []);

  // Fallback timeout — show iframe even if onLoad doesn't fire
  useEffect(() => {
    mountedRef.current = true;
    if (loaded) return;
    const t = window.setTimeout(() => {
      if (mountedRef.current) setLoaded(true);
    }, 6000);
    return () => {
      mountedRef.current = false;
      window.clearTimeout(t);
    };
  }, [loaded]);

  return (
    <div className="relative w-full" style={{ height: "100dvh", contain: "strict" }}>
      <iframe
        ref={iframeRef}
        src={MOODBOARD_SRC}
        title="Akash's Moodboard"
        className="w-full border-0"
        loading="eager"
        style={{
          height: "100dvh",
          overflow: "hidden",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.25s ease-out",
          willChange: loaded ? "auto" : "opacity",
          contain: "strict",
        }}
        onLoad={handleLoad}
        allow="autoplay"
      />
    </div>
  );
});

export default Index;
