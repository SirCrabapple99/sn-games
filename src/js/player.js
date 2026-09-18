const frame = document.getElementById("player-frame");
console.log(frame)

export function showPlayer() {

}

export function hidePlayer() {

}

export async function loadGame(url) {
    try {
        const data = await fetch(url);
        if (!data.ok) {
            console.error(`error loading game at url ${url}`);
            return;
        }

        let html = await data.text();

        if (import.meta.env.DEV) {
            const erudaScript = `
                <script src="https://cdn.jsdelivr.net/npm/eruda"><\/script>
                <script type="module">
                    import erudaIndexedDB from 'https://cdn.jsdelivr.net/npm/eruda-indexeddb@latest/+esm'
                    eruda.init()
                    eruda.add(erudaIndexedDB)
                <\/script>
            `
            html = html.replace('<head>', '<head>' + erudaScript + `<base href="https://cdn.jsdelivr.net/gh/SirCrabapple99/sn-assets/games/cookieclicker/">`);

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
