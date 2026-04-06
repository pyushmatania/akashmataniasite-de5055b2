import { useEffect, useRef, useState, useCallback } from "react";

const MOODBOARD_SRC = "/moodboard.html";
const LOAD_TIMEOUT_MS = 4000;

export default function Index() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
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
    if (mountedRef.current) {
      setLoaded(true);
      setError(false);
    }
  }, []);

  const handleError = useCallback(() => {
    if (mountedRef.current) {
      setError(true);
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    if (loaded) return;
    const t = window.setTimeout(() => {
      if (mountedRef.current && !loaded) setLoaded(true);
    }, LOAD_TIMEOUT_MS);
    return () => {
      mountedRef.current = false;
      window.clearTimeout(t);
    };
  }, [loaded]);

  if (error) {
    return (
      <div style={{ height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui" }}>
        <div style={{ textAlign: "center" }}>
          <p>Failed to load moodboard.</p>
          <button
            onClick={() => { setError(false); setLoaded(false); }}
            style={{ marginTop: 12, padding: "8px 20px", borderRadius: 8, border: "1px solid #ccc", cursor: "pointer" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
        onError={handleError}
        allow="autoplay"
      />
    </div>
  );
}
