const uis = new Set();
const tilted = new WeakSet();

let mx = -9999;
let my = -9999;
let queued = false;

const registered = new WeakSet();
const visible = new Set();
const lit = new Set();
const R = 130;

const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) visible.add(e.target);
      else visible.delete(e.target);
    }
  },
  { rootMargin: "150px" }
);

function register(el) {
  if (registered.has(el)) return;
  registered.add(el);
  io.observe(el);
}

function updateReveal() {
  queued = false;

  const hits = [];
  for (const el of visible) {
    const r = el.getBoundingClientRect();
    if (mx > r.left - R && mx < r.right + R && my > r.top - R && my < r.bottom + R) {
      hits.push([el, r]);
    }
  }

  const next = new Set();
  for (const [el, r] of hits) {
    el.style.setProperty("--lx", `${mx - r.left}px`);
    el.style.setProperty("--ly", `${my - r.top}px`);
    next.add(el);
  }

  for (const el of lit) {
    if (!next.has(el)) {
      el.style.removeProperty("--lx");
      el.style.removeProperty("--ly");
    }
  }

  lit.clear();
  for (const el of next) lit.add(el);
}

function queueReveal() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(updateReveal);
}

function track(x, y) {
  mx = x;
  my = y;
  const s = document.documentElement.style;
  s.setProperty("--mx", x + "px");
  s.setProperty("--my", y + "px");
  queueReveal();
}

function rotation(el) {
  if (tilted.has(el)) return;
  tilted.add(el);

  el.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;

    const r = el.getBoundingClientRect();
    el.style.setProperty("--nx", (e.clientX - r.left) / r.width - 0.5);
    el.style.setProperty("--ny", (e.clientY - r.top) / r.height - 0.5);
  });
  el.addEventListener("pointerleave", () => {
    el.style.setProperty("--nx", 0);
    el.style.setProperty("--ny", 0);
  });
}

new MutationObserver((mutations) => {
  for (const m of mutations) {
    for (const node of m.addedNodes) {
      if (node.nodeType !== 1) continue;

      if (node.matches?.(".ui")) register(node);
      node.querySelectorAll?.(".ui").forEach(register);

      if (node.matches?.(".game-tilt")) rotation(node);
      node.querySelectorAll?.(".game-tilt").forEach(rotation);
    }
  }
}).observe(document.body, { childList: true, subtree: true });

document.querySelectorAll(".ui").forEach(register);
document.querySelectorAll(".game-tilt").forEach(rotation);

addEventListener("pointermove", (e) => {
  if (e.pointerType === "mouse") track(e.clientX, e.clientY);
});

document.documentElement.addEventListener("pointerleave", () => {
  mx = my = -9999;
  queueReveal();
});

export function forwardFrame(frame) {
  if (!frame) return;

  frame.addEventListener("load", () => {
    const doc = frame.contentDocument;
    if (!doc) return;

    doc.addEventListener(
      "pointermove",
      (e) => {
        if (e.pointerType !== "mouse") return;
        const r = frame.getBoundingClientRect();
        const sx = r.width / frame.clientWidth || 1;
        const sy = r.height / frame.clientHeight || 1;
        track(r.left + e.clientX * sx, r.top + e.clientY * sy);
      },
      { capture: true }
    );
  });
}

forwardFrame(document.getElementById("player-frame"));

export function copyBox(item, playerSelector = "#player") {
  const r = item.getBoundingClientRect();
  const player = document.querySelector(playerSelector);

  Object.assign(player.style, {
    position: "fixed",
    left: r.left + "px",
    top: r.top + "px",
    width: r.width + "px",
    height: r.height + "px",
    borderRadius: "calc(var(--game-width) / 15)",
  });
}