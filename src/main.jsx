// file to handle imports, manage states, etc.
import { createState } from "dreamland/core";

// css
import './css/main.css';
import './css/gallery.css';
import './css/toolbar.css';

// always load this one last
import './css/mobile.css';

// js
import './js/ui.jsx';
import { Game } from "./js/components.jsx";

// gallery
const gallery = document.getElementsByTagName("game-gallery")[0];

// add example game
addEventListener("keydown", (e) => {
  if (e.code === "KeyH") {
    gallery.appendChild(<Game title="Example Game" />);
  }
})
