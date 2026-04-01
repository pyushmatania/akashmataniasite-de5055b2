import { useEffect, useRef, useState, useCallback } from "react";

const MOODBOARD_SRC = "/moodboard.html";

export default function Index() {
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const mountedRef = useRef(true);
  const iframeLoadCountRef = useRef(0);

  const handleLoad = useCallback(() => {
    iframeLoadCountRef.current += 1;
    (window as Window & { __dbgLog?: (...args: unknown[]) => void }).__dbgLog?.(
      "IFRAME_LOAD",
      "#" + iframeLoadCountRef.current,
      MOODBOARD_SRC,
    );
    if (mountedRef.current) setLoaded(true);
  }, []);

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
}
