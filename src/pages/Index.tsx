import { useEffect, useMemo, useRef, useState } from "react";

const MOODBOARD_SRC = "/moodboard.html";
const IFRAME_LOAD_TIMEOUT_MS = 12000;
const MAX_IFRAME_RETRIES = 1;

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const loadTimerRef = useRef<number | null>(null);
  const revealTimerRef = useRef<number | null>(null);

  const moodboardSrc = useMemo(
    () => (attempt === 0 ? MOODBOARD_SRC : `${MOODBOARD_SRC}?retry=${attempt}`),
    [attempt],
  );

  useEffect(() => {
    setLoaded(false);

    if (loadTimerRef.current !== null) {
      window.clearTimeout(loadTimerRef.current);
    }

    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current);
    }

    revealTimerRef.current = window.setTimeout(() => {
      setLoaded(true);
    }, 1800);

    loadTimerRef.current = window.setTimeout(() => {
      setAttempt((current) => (current < MAX_IFRAME_RETRIES ? current + 1 : current));
    }, IFRAME_LOAD_TIMEOUT_MS);

    return () => {
      if (loadTimerRef.current !== null) {
        window.clearTimeout(loadTimerRef.current);
      }

      if (revealTimerRef.current !== null) {
        window.clearTimeout(revealTimerRef.current);
      }
    };
  }, [attempt]);

  const handleLoad = () => {
    if (loadTimerRef.current !== null) {
      window.clearTimeout(loadTimerRef.current);
      loadTimerRef.current = null;
    }

    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }

    setLoaded(true);
  };

  const handleError = () => {
    if (loadTimerRef.current !== null) {
      window.clearTimeout(loadTimerRef.current);
      loadTimerRef.current = null;
    }

    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }

    setLoaded(true);

    setAttempt((current) => (current < MAX_IFRAME_RETRIES ? current + 1 : current));
  };

  return (
    <div className="relative w-full" style={{ height: '100dvh' }}>
      {!loaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background">
          <p
            className="text-sm text-muted-foreground"
            style={{ fontFamily: "system-ui" }}
          >
            Loading moodboard…
          </p>
        </div>
      )}

      <iframe
        key={attempt}
        src={moodboardSrc}
        title="Akash's Moodboard"
        className="w-full border-0"
        style={{ height: '100dvh', overflow: "hidden", opacity: loaded ? 1 : 0, transition: "opacity 0.4s" }}
        onLoad={handleLoad}
        onError={handleError}
        allow="autoplay"
      />
    </div>
  );
};

export default Index;
