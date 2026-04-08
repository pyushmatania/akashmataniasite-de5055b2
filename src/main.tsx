import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ── Debug logger (lightweight, capped) ──
const MAX_LOGS = 40;
const logs: string[] = [];
function dbg(...args: unknown[]) {
  const s = `[${new Date().toISOString().slice(11, 23)}] ${args.map(x => typeof x === "string" ? x : JSON.stringify(x)).join(" ")}`;
  logs.push(s);
  if (logs.length > MAX_LOGS) logs.splice(0, logs.length - MAX_LOGS);
  const el = document.getElementById("__dbg__");
  if (el && el.style.display !== "none") el.textContent = logs.join("\n");
}

(window as any).__dbgLog = dbg;

// Catch uncaught errors
window.addEventListener("error", (e) => {
  dbg("ERR", e.message, e.filename?.split("/").pop(), "L" + e.lineno);
});
window.addEventListener("unhandledrejection", (e) => {
  dbg("PROMISE", String(e.reason).slice(0, 120));
});

// Track resizes — debounced to avoid log spam
let resizeCount = 0;
let resizeTimer: ReturnType<typeof setTimeout> | null = null;
window.addEventListener("resize", () => {
  resizeCount++;
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    dbg("RESIZE #" + resizeCount, innerWidth + "x" + innerHeight);
  }, 300);
});

// Track page visibility
document.addEventListener("visibilitychange", () => {
  dbg("VISIBILITY", document.hidden ? "hidden" : "visible");
});

// Track if page is being unloaded
window.addEventListener("beforeunload", () => {
  dbg("BEFOREUNLOAD — page reloading!");
});

// Track navigation/history
window.addEventListener("popstate", () => {
  dbg("POPSTATE", location.pathname);
});

// Performance: track long tasks
if (typeof PerformanceObserver !== "undefined") {
  try {
    const obs = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 100) {
          dbg("LONG_TASK", Math.round(entry.duration) + "ms");
        }
      }
    });
    obs.observe({ type: "longtask", buffered: true });
  } catch (_) {}
}

// Memory monitor — only runs when debug overlay is visible, with cleanup on page hide
let memMonitorId: ReturnType<typeof setInterval> | null = null;
function startMemMonitor() {
  if (memMonitorId) return;
  memMonitorId = setInterval(() => {
    const perf = (performance as any).memory;
    if (perf) {
      const used = Math.round(perf.usedJSHeapSize / 1048576);
      const total = Math.round(perf.totalJSHeapSize / 1048576);
      dbg("MEM", used + "/" + total + "MB");
    }
  }, 30000);
}
function stopMemMonitor() {
  if (memMonitorId) { clearInterval(memMonitorId); memMonitorId = null; }
}
// Start/stop monitoring based on tab visibility to save resources
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopMemMonitor();
  else startMemMonitor();
});

window.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.type !== "moodboard-debug" || !Array.isArray(data.args)) return;
  dbg("MB", ...data.args);
});

dbg("BOOT", navigator.userAgent.slice(0, 80));
dbg("SCREEN", innerWidth + "x" + innerHeight, "dpr=" + devicePixelRatio);

// Mount React with safety check
const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
  dbg("REACT_MOUNTED");
} else {
  console.error("Root element not found — cannot mount React app");
}
