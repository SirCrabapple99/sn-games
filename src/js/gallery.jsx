// this file handles loading games from sources
import { Game } from "./components.jsx";
import "./player.js";

const gallery = document.getElementById("gallery");

let sources = [
  {
    name: "main",
    url: "https://cdn.jsdelivr.net/gh/SirCrabapple99/sn-assets@latest/index.json",
  },
  {
    name: "test",
    loader: () => import("./test.js"),
    type: "js",
  }
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

      for (let g of sourceJSON.games) {
        addGame(sourceJSON._SN_INFO?.baseUrl, g);
      }

    } catch (err) {
      console.error(
        `something went wrong while loading source "${s.name}" at url ${s.url} (probably a CORS error)`,
        err
      );
    }
  }
}

async function clearGames() {

}

// source, game
async function addGame(b, g) {
  // get base url
  let gameJSON = g;
  gameJSON._SN_INFO = {
    baseUrl: b,
  };

  gallery.appendChild(
    <Game
      title={gameJSON.title}
      cover={b + gameJSON.path + gameJSON.cover}
      game={gameJSON}
    />,
  );
}

fetchGames();
