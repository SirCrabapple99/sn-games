// eruda since I mostly dev on chromebook
if (import.meta.env.DEV) import('eruda').then(eruda => eruda.default.init());

// file to handle imports, manage states, etc.
import { createState } from "dreamland/core";

// css
import './css/main.css';
import './css/gallery.css';
import './css/toolbar.css';
import './css/player.css';

// always load this one last
import './css/compat.css';

// js
import './js/ui.js';
import './js/gallery.jsx';

import './js/player.js';

// gallery
const gallery = document.getElementById("gallery");

// add example game
addEventListener("keydown", (e) => {
  if (e.code === "KeyH") {
    gallery.appendChild(<Game title="Example Game" />);
  }
})
