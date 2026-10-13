const settings = document.getElementById("settings");

document.getElementById("toolbar-settings").addEventListener("click", () => {
    settings.classList.toggle("visible");
    document.documentElement.style.setProperty("--ui-thing-visiblity", 0);
});