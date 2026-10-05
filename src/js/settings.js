const settings = document.getElementById("settings");
settings.classList.toggle("visible");
document.getElementById("toolbar-settings").addEventListener("click", () => {
    settings.classList.toggle("visible");
});