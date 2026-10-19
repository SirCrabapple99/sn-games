// this file handles loading games from sources
import Fuse from 'fuse.js';
import { Game } from "./components.jsx";
import { loadGame, showPlayer } from "./player.js";

const gallery = document.getElementById("gallery");

const sources = [
  // using fresh on this source is kind of a horrible idea since the image cache will add up but who cares
  {
    name: "main",
    url: "https://cdn.jsdelivr.net/gh/SirCrabapple99/sn-assets@latest/index.json",
    fresh: { owner: "SirCrabapple99", repo: "sn-assets", branch: "main" }
  },
  {
    name: "morrowind",
    url: "https://cdn.jsdelivr.net/gh/SirCrabapple99/mwgame@latest/mwgame.json",
    fresh: { owner: "SirCrabapple99", repo: "mwgame", branch: "main" }
  },
  {
    name: "web-ports",
    url: "https://cdn.jsdelivr.net/gh/SirCrabapple99/sn-ports@main/ports.json"
  }
  /* ,
  {
    name: "web-ports",
    loader: () => import("../../.plugins/web-port-list.js"),
    type: "js"
  } */ /* ,
  {
    name: "test",
    loader: () => import("./test.js"),
    type: "js",
  } */
];

// now it loads the latest commit wow so cool
async function resolveHead({ owner, repo, branch }) {
  const key = `sha:${owner}/${repo}@${branch}`;
  try {
    const cached = JSON.parse(sessionStorage.getItem(key));
    if (cached && Date.now() - cached.t < 60_000) return cached.sha;
  } catch { }
  try {
    const r = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits/${branch}`,
      { headers: { Accept: "application/vnd.github.sha" } },
    );
    if (!r.ok) return null;
    const sha = (await r.text()).trim();
    if (!/^[0-9a-f]{40}$/.test(sha)) return null;
    try {
      sessionStorage.setItem(key, JSON.stringify({ sha, t: Date.now() }));
    } catch { }
    return sha;
  } catch {
    return null;
  }
}

export const loadedGames = new Map();

async function fetchGames() {
  for (const s of sources) {
    try {
      let sourceJSON;

      if (s?.type === "js") {
        const module = await s.loader();
        sourceJSON = await module.default();
      } else {
        let sha = null;
        if (s.fresh) sha = await resolveHead(s.fresh);
        const pin = (u) => (sha ? u.replace(/@latest\//, `@${sha}/`) : u);
        let response = await fetch(pin(s.url));
        if (!response.ok && sha) { sha = null; response = await fetch(s.url); }
        if (!response.ok) {
          console.error(`HTTP ${response.status} loading ${s.url}`);
          continue;
        }
        sourceJSON = await response.json();
        if (sha && sourceJSON._SN_INFO?.baseUrl)
          sourceJSON._SN_INFO.baseUrl = pin(sourceJSON._SN_INFO.baseUrl);
      }

      const frag = document.createDocumentFragment();
      for (const g of sourceJSON.games) {
        g.source = s.name;
        const el = buildGame(sourceJSON._SN_INFO?.baseUrl ?? "", g);
        frag.appendChild(el);
        loadedGames.set(JSON.stringify([g.title, s.name]), { game: g, source: sourceJSON, el });
      }

      gallery.appendChild(frag);
    } catch (err) {
      console.error(
        `something went wrong while loading source "${s.name}"${s.url ? ` at url ${s.url}` : ""}`,
        err,
      );
    }
  }
  const entries = [...loadedGames.values()];
  const fuse = new Fuse(entries, {
    keys: ["game.title"],
    threshold: 0.4,
    ignoreLocation: true
  });

  const searchInput = document.getElementById("toolbar-search");
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim();
    if (!q) {
      for (const v of entries) v.el.classList.remove('hidden');
      return;
    }
    const hits = new Set(fuse.search(q).map(r => r.item.el));
    for (const v of entries) if (!hits.has(v.el)) v.el.classList.add('hidden');
  });

  // open the game named in the URL, if any
  const params = new URLSearchParams(window.location.search);
  const wanted = params.get("game");
  const wantedSource = params.get("source");

  if (wanted) {
    const entry = [...loadedGames.values()].find(
      v => v.game.title === wanted && (!wantedSource || v.game.source === wantedSource)
    );
    if (entry) {
      try {
        showPlayer(entry.el);
        loadGame(entry.game);
      } catch (err) {
        console.error("restoring game from URL failed", err);
      }
    }
  }
}

async function clearGames() { }

// base, game
function buildGame(b, g) {
  g._SN_INFO = { baseUrl: b };

  const cover = /^https?:\/\//.test(g.cover) ? g.cover : b + g.path + g.cover;

  return <Game title={g.title} cover={cover} game={g} />;
}

window.addEventListener("load", async () => {
  fetchGames();
});