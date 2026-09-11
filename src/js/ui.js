// file to add cool ui effects and give ui function

/* ui effects */

// handle ui registration so effects always are applied to all ui
const uis = [];
let rects = [];
const measure = () => (rects = uis.map((el) => el.getBoundingClientRect()));
const ro = new ResizeObserver(measure);

// function to apply cool rotation effect thing
function rotation(el) {
  el.addEventListener("pointermove", (e) => {
    // don't activate on touchscreens
    if (e.pointerType !== "mouse") return;

    // set rotation properties
    const r = el.getBoundingClientRect();
    el.style.setProperty("--lx", `${e.clientX - r.left}px`);
    el.style.setProperty("--ly", `${e.clientY - r.top}px`);
    el.style.setProperty("--nx", (e.clientX - r.left) / r.width - 0.5);
    el.style.setProperty("--ny", (e.clientY - r.top) / r.height - 0.5);
  });
  el.addEventListener("pointerleave", () => {
    el.style.setProperty("--nx", 0);
    el.style.setProperty("--ny", 0);
  });
}

// register function
function register(el) {
  if (uis.includes(el)) return;
  uis.push(el);
  ro.observe(el);
  measure();
}

// watch stuff
new MutationObserver((mutations) => {
  for (const m of mutations) {
    for (const node of m.addedNodes) {
      if (node.nodeType !== 1) continue;
      if (node.matches?.(".ui")) register(node);
      node.querySelectorAll?.(".ui").forEach(register);

      if (node.matches?.(".game-tilt")) rotation(node);
    }
  }
}).observe(document.body, { childList: true, subtree: true });

// register ui
document.querySelectorAll?.(".ui").forEach(register);
document.querySelectorAll?.(".game-tilt").forEach(rotation);

// resize stuff
addEventListener("resize", measure);

// found out today (09/04/2026) you can declare multiple variables with one let
let queued = false,
  mx = 0,
  my = 0;

// mouse move for fluent reveal effect

// as a side note I really like this effect in windows ui but now that I've implemented it
// in my site I feel like it makes my site look vibecoded which it is NOT
addEventListener("pointermove", (e) => {
  if (e.pointerType !== "mouse") return;
  mx = e.clientX;
  my = e.clientY;
  if (queued) return;

  // guard against spamming this function
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    // iterate ui elements
    uis.forEach((el, i) => {
      const r = rects[i];
      // guard
      if (!r) return;
      // set property of x and y
      if (
        mx < r.left - 150 ||
        mx > r.right + 150 ||
        my < r.top - 150 ||
        my > r.bottom + 150
      )
        return;
      el.style.setProperty("--lx", mx - r.left + "px");
      el.style.setProperty("--ly", my - r.top + "px");
    });
  });
});

/* ui interaction */
