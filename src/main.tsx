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

// Triple-tap bottom-right corner to toggle debug overlay
let tapCount = 0;
let tapTimer: number;
document.addEventListener("click", (e) => {
  const x = e.clientX, y = e.clientY;
  if (x > innerWidth - 60 && y > innerHeight - 60) {
    tapCount++;
    clearTimeout(tapTimer);
    tapTimer = window.setTimeout(() => { tapCount = 0; }, 600);
    if (tapCount >= 3) {
      tapCount = 0;
      pre.style.display = pre.style.display === "none" ? "block" : "none";
    }
  }
});

dbg("BOOT", navigator.userAgent.slice(0, 80));
dbg("SCREEN", innerWidth + "x" + innerHeight, "dpr=" + devicePixelRatio);

// Mount React
createRoot(document.getElementById("root")!).render(<App />);
dbg("REACT_MOUNTED");
