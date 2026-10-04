// this file handles loading games from sources
import { Game } from "./components.jsx";
import "./player.js";

const gallery = document.getElementById("gallery");

let sources = [
  {
    name: "main",
    url: "https://cdn.jsdelivr.net/gh/SirCrabapple99/sn-assets@latest/index.json",
  }/* ,
  {
    name: "test",
    loader: () => import("./test.js"),
    type: "js",
  } */
];

async function fetchGames() {
  for (let s of sources) {
    try {
      let sourceJSON;

      if (s?.type === "js") {
        const module = await s.loader();
        sourceJSON = await module.default();
      } else {
        const response = await fetch(s.url);
        if (!response.ok) {
          console.error(`HTTP ${response.status} loading ${s.url}`);
          continue;
        }
        sourceJSON = await response.json();
      }

      const frag = document.createDocumentFragment();
      for (const g of sourceJSON.games) {
        frag.appendChild(buildGame(sourceJSON._SN_INFO?.baseUrl ?? "", g));
      }
      gallery.appendChild(frag);

    } catch (err) {
      console.error(
        `something went wrong while loading source "${s.name}"${s.url ? ` at url ${s.url}` : ""}`,
        err
      );
    }
  }
}

async function clearGames() {

}

// base, game
function buildGame(b, g) {
  g._SN_INFO = { baseUrl: b };

  const cover = /^https?:\/\//.test(g.cover)
    ? g.cover
    : b + g.path + g.cover;

  return <Game title={g.title} cover={cover} game={g} />;
}

window.addEventListener("load", async () => {
  fetchGames();
});