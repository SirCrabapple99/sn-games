// file to handle imports, manage states, etc.
import { createState } from "dreamland/core";

// css
import './css/main.css';
import './css/gallery.css';
import './css/toolbar.css';

// js
import './js/ui.jsx';
import { Game } from "./js/components.jsx";

// define all custom elements
[
  'game-gallery',
  'game-tilt',
  'game-card',
  'game-image',
  'game-text',
  'sn-logo',
  'bottom-bar',
].forEach((tag) => customElements.define(tag, class extends HTMLElement {}));
