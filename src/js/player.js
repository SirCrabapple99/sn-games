const frame = document.getElementById("player-frame");
console.log(frame)

export function showPlayer() {

}

export function hidePlayer() {

}

export async function loadGame(game) {
    console.log("a")
    try {
        const data = await fetch(game.html);
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

        if (game.baseUrl) {
            if (html.querySelector("base")[0]) {
                html.querySelector("base")[0].href = game.baseUrl;
            }
            else if (html.head) {
                html.head.prepend(`<base href="${game.baseUrl}">`);
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
