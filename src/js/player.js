const player = document.getElementById("player");
const frame = document.getElementById("player-frame");

export function showPlayer() {
    player.classList.add('visible');
}

export function hidePlayer() {
    player.classList.remove('visible');
}

export async function loadGame(game) {
    // update player info
    document.getElementById("player-title").innerText = game.title

    try {
        const data = await fetch(game._SN_INFO.baseUrl + game.path + game.html);
        if (!data.ok) {
            console.error(`error loading game at url ${url}`);
            return;
        }

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
            `
            html = html.replace('<head>', '<head>' + erudaScript);
        }

        // inject base url
        if (game._SN_INFO.baseUrl) {
            const baseTag = `<base href="${game._SN_INFO.baseUrl + game.path}">`;
            if (/<base\b[^>]*>/i.test(html)) {
                html = html.replace(/<base\b[^>]*>/i, baseTag);
            } else {
                html = html.replace(/<head[^>]*>/i, m => m + baseTag);
            }
        }

        frame.srcdoc = html;
    } catch (err) {
        console.error(err);
        return;
    }
}

addEventListener("keydown", (e) => {
    if (e.code === "KeyN") {
        loadGame("https://cdn.jsdelivr.net/gh/SirCrabapple99/sn-assets/games/cookieclicker/index.html");
    }
})
