import { Game } from "./components.jsx";

let sources = [
    {
        "name": "main",
        "url": "https://cdn.jsdelivr.net/gh/SirCrabapple99/sn-assets@latest/index.json"
    },
    {
        "name": "example",
        "url": "https://example.net",
        "translationFunction": () => {
            return ({
                "exampleGame": {
                    "path": "exampleGame/",
                    "html": "example.html",
                    "cover": "example.png",
                    "_SN_INFO": null
                },
                "_SN_INFO": {
                    "baseUrl": "https://cdn.jsdelivr.net/gh/SirCrabapple99/sn-assets@latest/"
                }
            })
        }
    }
]

async function fetchGames() {

}

async function clearGames() {

}

async function populateGames() {

}

populateGames();