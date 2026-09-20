const player = document.getElementById("player");
const frame = document.getElementById("player-frame");

import { copyBox, onMove } from "./ui.js";

// ui effect stuff to make the reveal effects still work when hovering over the player frame
frame.addEventListener("load", () => {
  const doc = frame.contentDocument;
  if (!doc) return;
  doc.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "mouse") return;
      const f = frame.getBoundingClientRect();
      onMove(e.clientX + f.left, e.clientY + f.top);
    },
    true,
  );
});
let currentItem = null

export function showPlayer(item) {
  currentItem = item;

  player.style.transition = "none";
  copyBox(item);
  player.getBoundingClientRect();
  player.style.transition = "";

  player.classList.add("visible");
}

export function hidePlayer() {
  const frame = player.querySelector("#player-frame");
  frame.src = "about:blank";

  copyBox(currentItem);
  frame.classList.remove("visible");
  player.classList.remove("visible");
}

document.getElementById("player-close").addEventListener("click", hidePlayer);

let loadId = 0;

export async function loadGame(game) {
  const id = ++loadId;
  document.getElementById("player-title").innerText = game.title;
  const url = game._SN_INFO.baseUrl + game.path + game.html;

  const transition = new Promise((res) =>
    player.addEventListener(
      "transitionend",
      (e) => {
        if (e.target === player) res();
      },
      { once: true },
    ),
  );

  try {
    const data = await fetch(url);
    if (!data.ok) return console.error(`error loading game at url ${url}`);
    let html = await data.text();

    // add eruda
    if (import.meta.env.DEV) {
      const erudaScript = `
        <script src="https://cdn.jsdelivr.net/npm/eruda"><\/script>
        <script type="module">
          import erudaIndexedDB from 'https://cdn.jsdelivr.net/npm/eruda-indexeddb@latest/+esm'
          eruda.init()
          eruda.add(erudaIndexedDB)
        <\/script>
      `;
      html = html.replace("<head>", () => "<head>" + erudaScript);
    }

    // inject base url
    if (game._SN_INFO.baseUrl) {
      const baseTag = `<base href="${game._SN_INFO.baseUrl + game.path}">`;
      if (/<base\b[^>]*>/i.test(html)) {
        html = html.replace(/<base\b[^>]*>/i, () => baseTag);
      } else {
        html = html.replace(/<head[^>]*>/i, (m) => m + baseTag);
      }
    }

    await transition;
    if (id !== loadId) return; // superseded by a newer load
    frame.srcdoc = html;
    document.getElementById("player-frame").classList.add("visible");
  } catch (err) {
    console.error(err);
  }
}

addEventListener("keydown", (e) => {
  if (e.code === "KeyN") {
    loadGame(
      "https://cdn.jsdelivr.net/gh/SirCrabapple99/sn-assets/games/cookieclicker/index.html",
    );
  }
});
