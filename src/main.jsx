// eruda since I mostly dev on chromebook
if (import.meta.env.DEV) import("eruda").then((eruda) => eruda.default.init());

// css
import "./css/main.css";
import "./css/gallery.css";
import "./css/toolbar.css";
import "./css/player.css";

// always load this one last
import "./css/compat.css";

// js
import "./js/ui.js";
import "./js/gallery.jsx";
