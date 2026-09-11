// this file handles loading games from sources
import { Game } from "./components.jsx";
const gallery = document.getElementById("gallery");

let sources = [
  {
    name: "main",
    url: "https://cdn.jsdelivr.net/gh/SirCrabapple99/sn-assets@latest/index.json",
  },
  // example source
  {
    name: "example",
    url: "https://example.net/",
    translationFunction: () => {
      return {
        games: [
          {
            title: "exampleGame",
            path: "exampleGame/",
            html: "example.html",
            cover: "example.png",
            _SN_INFO: null,
          },
        ],
        _SN_INFO: {
          baseUrl:
            "https://cdn.jsdelivr.net/gh/SirCrabapple99/sn-assets@latest/",
        },
      };
    },
  },
];

async function fetchGames() {
  for (let s of sources) {
    try {
      const sourceData = await fetch(s.url);
      if (!sourceData.ok) {
        console.error(`HTTP ${sourceData.status} loading ${s.url}`);
        continue;
      }

      // get json
      let sourceJSON;
      try {
        sourceJSON = await sourceData.json();
      } catch (parseErr) {
        console.error(`invalid JSON from ${s.url}`, parseErr);
        continue;
      }

      for (let g of sourceJSON.games) {
        addGame(sourceJSON, g);
      }
    } catch (err) {
        console.error(`something went wrong while loading source "${s.name}" at url ${s.url} (probably a CORS error)`);
    }
  }
}

async function clearGames() {}

// source, game
async function addGame(s, g) {
  // get base url
  const baseUrl = s._SN_INFO.baseUrl;

  gallery.appendChild(
    <Game
      title={g.title}
      cover={baseUrl + g.path + g.cover}
      html={baseUrl + g.path + g.html}
    />,
  );
}

fetchGames();

addEventListener("keydown", (e) => {
  if (e.code === "KeyJ") {
    fetchGames();
  }
});
