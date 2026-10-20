const settings = document.getElementById("settings");
const storageKey = "sn-games";
const defaults = Object.freeze({
    "sn-color": "#0053a0",
    "sources": []
});

const picker = document.getElementById("settings-colorpicker-real");
document.getElementById("settings-colorpicker").addEventListener("click", () => {
    picker.showPicker();
})

function loadStorage() {
    try {
        const saved = JSON.parse(localStorage.getItem(storageKey)) ?? {};
        return { ...structuredClone(defaults), ...saved };
    } catch {
        return structuredClone(defaults);
    }
}

function saveStorage(data) {
    localStorage.setItem(storageKey, JSON.stringify(data));
    return data;
}

saveStorage(loadStorage());

const getStorage = (key) => (key === undefined ? loadStorage() : loadStorage()[key]);

function updateStorage(keyOrUpdater, value) {
    const data = loadStorage();

    if (typeof keyOrUpdater === "function") {
        const result = keyOrUpdater(data);
        return saveStorage(result ?? data);
    }

    if (typeof keyOrUpdater === "object" && keyOrUpdater !== null) {
        return saveStorage({ ...data, ...keyOrUpdater });
    }

    data[keyOrUpdater] = typeof value === "function" ? value(data[keyOrUpdater]) : value;
    return saveStorage(data);
}

document.getElementById("toolbar-settings").addEventListener("click", () => {
    settings.classList.toggle("visible");
    document.documentElement.style.setProperty("--ui-thing-visiblity", 0);
});

document.documentElement.style.setProperty("--sn-color", getStorage("sn-color"));
picker.value = getStorage("sn-color");

picker.addEventListener("input", (e) => {
    updateStorage("sn-color", e.target.value);
    document.documentElement.style.setProperty("--sn-color", e.target.value)
});