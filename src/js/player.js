const player = document.getElementById("player");
const frame = document.getElementById("player-frame");

import { copyBox } from "./ui.js";

let currentItem = null;

export function showPlayer(item) {
  currentItem = item;
  copyBox(item);
  player.getBoundingClientRect(); // reflow
  player.classList.add("visible");

  player.style.width = "100%";
  player.style.height = "100%";
  player.style.left = "0";
  player.style.top = "0";
}
export function hidePlayer() {
  player.classList.remove("visible");
}

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
