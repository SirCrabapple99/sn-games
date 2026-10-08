// eruda since I mostly dev on chromebook
if (import.meta.env.DEV) import("eruda").then((eruda) => eruda.default.init());

// cross origin isolation for multithreading bs
try {
  if (self.crossOriginIsolated) sessionStorage.removeItem("sw-reloads");
} catch {}
if (!self.crossOriginIsolated && self.isSecureContext && "serviceWorker" in navigator) {
  const reloadOnce = () => {
    let n = 0;
    try {
      n = +sessionStorage.getItem("sw-reloads") || 0;
      if (n >= 3) return console.error("cross-origin isolation failed after reloads");
      sessionStorage.setItem("sw-reloads", String(n + 1));
    } catch {}
    location.reload();
  };
  navigator.serviceWorker.register("/sw.js").then((reg) => {
    const sw = reg.installing || reg.waiting || reg.active;
    if (sw && sw.state !== "activated")
      sw.addEventListener("statechange", () => sw.state === "activated" && reloadOnce());
    else reloadOnce();
  }).catch((e) => console.error("sw registration failed", e));
}

// css
import "./css/main.css";
import "./css/gallery.css";
import "./css/toolbar.css";
import "./css/player.css";
import "./css/settings.css";

// always load this one last
import "./js/settings.js";
import "./css/compat.css";

// js
import "./js/gallery.jsx";
