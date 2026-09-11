import { Game } from "./components.jsx";

let sources = [
    {
        name: "main",
        url: "https://cdn.jsdelivr.net/gh/SirCrabapple99/sn-assets@latest/index.json"
    },
    {
        name: "example",
        url: "https://example.net",
        translationFunction: () => {
            return ({
                exampleGame: {
                    path: "exampleGame/",
                    html: "example.html",
                    cover: "example.png",
                    _SN_INFO: null
                },
                _SN_INFO: {
                    "baseUrl": "https://example.com/index.js"
                }
            })
        }
    }
]

async function fetchGames() {
    for (let s of sources) {
        try {
            const sourceData = await fetch(s.url);
            if (!sourceData.ok) {
                console.error(`HTTP ${sourceData.status} loading ${s.url}`);
                continue;
            }

            
            try {
                let sourceJSON;
                sourceJSON = await sourceData.json();
            } catch (parseErr) {
                console.error(`invalid JSON from ${s.url}`, parseErr);
            }

            console.log(sourceJSON)
        } catch (fetchErr) {
            console.error(`network/fetch failure for ${s.url}`, fetchErr);
        }
    };
}

async function clearGames() {

}

async function populateGames() {

}

populateGames();

addEventListener("keydown", (e) => {
    if (e.code === "KeyJ") {
        fetchGames();
    }
})