// eruda since I mostly dev on chromebook
if (import.meta.env.DEV) import("eruda").then((eruda) => eruda.default.init());

// cross origin isolation for multithreading bs
if (!self.crossOriginIsolated && self.isSecureContext && "serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then((reg) => {
    if (sessionStorage.getItem("sw-reloaded")) return;
    sessionStorage.setItem("sw-reloaded", "1");
    const sw = reg.installing || reg.waiting || reg.active;
    if (sw && sw.state !== "activated")
      sw.addEventListener("statechange", () => sw.state === "activated" && location.reload());
    else location.reload();
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
