import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ── Debug logger to diagnose mobile reload loop ──
const logs: string[] = [];
function dbg(...args: any[]) {
  const s = `[${new Date().toISOString().slice(11, 23)}] ${args.map(x => typeof x === "string" ? x : JSON.stringify(x)).join(" ")}`;
  logs.push(s);
  if (logs.length > 60) logs.shift();
  const el = document.getElementById("__dbg__");
  if (el) el.textContent = logs.join("\n");
}

(window as any).__dbgLog = dbg;

// Catch uncaught errors
window.addEventListener("error", (e) => {
  dbg("ERR", e.message, e.filename?.split("/").pop(), "L" + e.lineno);
});
window.addEventListener("unhandledrejection", (e) => {
  dbg("PROMISE", String(e.reason).slice(0, 120));
});

// Track resizes (address bar, keyboard, orientation)
let resizeCount = 0;
window.addEventListener("resize", () => {
  resizeCount++;
  dbg("RESIZE #" + resizeCount, innerWidth + "x" + innerHeight);
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

// Memory monitor (runs every 10s)
setInterval(() => {
  const perf = (performance as any).memory;
  if (perf) {
    const used = Math.round(perf.usedJSHeapSize / 1048576);
    const total = Math.round(perf.totalJSHeapSize / 1048576);
    dbg("MEM", used + "/" + total + "MB");
  }
}, 10000);

// Create debug overlay
const pre = document.createElement("pre");
pre.id = "__dbg__";
pre.style.cssText =
  "position:fixed;left:0;right:0;bottom:0;max-height:35vh;overflow:auto;" +
  "z-index:2147483647;margin:0;background:rgba(0,0,0,0.85);color:#0f0;" +
  "padding:8px;font:10px/1.3 monospace;white-space:pre-wrap;pointer-events:auto;" +
  "display:none;";
document.body.appendChild(pre);

const toggleDebug = () => {
  pre.style.display = pre.style.display === "none" ? "block" : "none";
  pre.textContent = logs.join("\n");
};

(window as any).__dbgToggle = toggleDebug;

const hit = document.createElement("button");
hit.id = "__dbg_hit__";
hit.type = "button";
hit.setAttribute("aria-label", "Toggle debug console");
hit.style.cssText =
  "position:fixed;left:0;top:0;width:88px;height:88px;z-index:2147483647;" +
  "opacity:0;border:0;background:transparent;padding:0;margin:0;pointer-events:auto;" +
  "touch-action:manipulation;-webkit-tap-highlight-color:transparent;";
document.body.appendChild(hit);

let tapTimes: number[] = [];
let tapLock = false;

const registerDebugTap = (e?: Event) => {
  e?.preventDefault();
  e?.stopPropagation();
  const now = performance.now();
  tapTimes = tapTimes.filter((t) => now - t < 600);
  tapTimes.push(now);
  if (tapTimes.length >= 3 && !tapLock) {
    tapLock = true;
    tapTimes = [];
    toggleDebug();
    window.setTimeout(() => {
      tapLock = false;
    }, 800);
  }
};

hit.addEventListener("touchend", registerDebugTap, { passive: false, capture: true });
hit.addEventListener("click", registerDebugTap, true);

window.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.type !== "moodboard-debug" || !Array.isArray(data.args)) return;
  dbg("MB", ...data.args);
});

dbg("BOOT", navigator.userAgent.slice(0, 80));
dbg("SCREEN", innerWidth + "x" + innerHeight, "dpr=" + devicePixelRatio);
dbg("DEBUG_HIT", "triple-tap top-left corner");

// Mount React
createRoot(document.getElementById("root")!).render(<App />);
dbg("REACT_MOUNTED");
