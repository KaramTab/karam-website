/* Arts hero: a dark metal truss across the top-right corner, a follow spot hanging from it, and a
   wooden stage floor seen from above. Only size-dependent geometry is computed here; the floor,
   vignette and the light-mode treatment (spot off, pale and faded) live in the "STAGE" section
   of css/style.css. */

const SVG_NS = "http://www.w3.org/2000/svg";
const svgEl = (tag, attrs, parent) => {
  const n = document.createElementNS(SVG_NS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(n);
  return n;
};

const YOKE = 9; // px between the truss rail and the lamp's pivot
const LENS_DIST = 29; // pivot-to-lens distance, unscaled
const SPOT_SCALE = 1.3;
const SPOT_RGB = "255,236,205";

const aimAt = (px, py, tx, ty) => {
  const dx = tx - px, dy = ty - py, len = Math.hypot(dx, dy) || 1;
  return { angle: (Math.atan2(-dx, dy) * 180) / Math.PI, ux: dx / len, uy: dy / len };
};

function mountStage(hero) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const stage = document.createElement("div");
  stage.className = "stage";
  stage.setAttribute("aria-hidden", "true");
  stage.innerHTML = `
    <div class="stage-floor"></div>
    <svg class="stage-light"></svg>
    <svg class="stage-rig"></svg>`;
  hero.prepend(stage);

  const lightSvg = stage.querySelector(".stage-light");
  const rigSvg = stage.querySelector(".stage-rig");

  let W = 0, H = 0;
  let spot = null;
  const cur = { x: 0, y: 0 };
  const tgt = { x: 0, y: 0 };
  let lastMove = 0;

  function build() {
    const r = hero.getBoundingClientRect();
    W = r.width; H = r.height;
    if (!W || !H) return;
    for (const svg of [lightSvg, rigSvg]) {
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.replaceChildren();
    }

    /* ---- truss geometry: enters over the top edge, leaves through the right edge ---- */
    const narrow = W < 1000;
    const P0 = { x: W * (narrow ? 0.8 : 0.7), y: -30 };
    const P1 = { x: W + 50, y: H * (narrow ? 0.45 : 0.8) };
    const dx = P1.x - P0.x, dy = P1.y - P0.y, L = Math.hypot(dx, dy);
    const d = { x: dx / L, y: dy / L };
    const nrm = { x: -d.y, y: d.x }; // points to the truss's lower-left face
    const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
    const h = Math.min(88, Math.max(54, W * 0.054)); // truss thickness
    const anchor = (u) => ({ x: P0.x + d.x * u * L + nrm.x * (h / 2 + 3), y: P0.y + d.y * u * L + nrm.y * (h / 2 + 3) });

    /* ---- metal, kept dark so the rig sits back ---- */
    const rd = svgEl("defs", {}, rigSvg);
    const rail = svgEl("linearGradient", { id: "st-rail", x1: 0, y1: 0, x2: 0, y2: 1 }, rd);
    [["0", "#7c828b"], ["0.35", "#4f545c"], ["0.7", "#2c2f35"], ["1", "#17181c"]].forEach(([o, c]) => svgEl("stop", { offset: o, "stop-color": c }, rail));
    const metal = svgEl("linearGradient", { id: "st-metal", x1: 0, y1: 0, x2: 1, y2: 0 }, rd);
    [["0", "#17181b"], ["0.45", "#3b3e44"], ["1", "#111215"]].forEach(([o, c]) => svgEl("stop", { offset: o, "stop-color": c }, metal));

    const step = h * 1.05;
    const count = Math.ceil(L / step) + 2;
    const zig = (oy) => {
      let p = "";
      for (let i = 0; i < count; i++) p += `${i ? "L" : "M"}${i * (step / 2)} ${(i % 2 ? h / 2 : -h / 2) + oy} `;
      return p;
    };

    const truss = svgEl("g", { transform: `translate(${P0.x} ${P0.y}) rotate(${deg})` }, rigSvg);
    // the far face, dimmer, offset up and back so the truss reads as a box
    const ox = h * 0.5, oy = -h * 0.32;
    const back = svgEl("g", { opacity: 0.6 }, truss);
    [-h / 2, h / 2].forEach((y) => svgEl("line", { x1: -20 + ox, y1: y + oy, x2: L + 20 + ox, y2: y + oy, stroke: "#2a2d33", "stroke-width": 3.5 }, back));
    svgEl("path", { d: zig(oy), transform: `translate(${ox} 0)`, fill: "none", stroke: "#2a2d33", "stroke-width": 2, "stroke-linejoin": "round" }, back);
    for (let i = 0; i < count; i++) {
      const x = i * (step / 2), y = i % 2 ? h / 2 : -h / 2;
      svgEl("line", { x1: x, y1: y, x2: x + ox, y2: y + oy, stroke: "#33363c", "stroke-width": 2 }, back);
    }
    // the near face: tube-like diagonals with a dark underlay, then the rails
    svgEl("path", { d: zig(0), fill: "none", stroke: "#131418", "stroke-width": 6, "stroke-linejoin": "round" }, truss);
    svgEl("path", { d: zig(0), fill: "none", stroke: "#555a62", "stroke-width": 3, "stroke-linejoin": "round" }, truss);
    [-h / 2, h / 2].forEach((y) => {
      svgEl("rect", { x: -20, y: y - 3.5, width: L + 40, height: 7, rx: 2, fill: "url(#st-rail)", stroke: "#111216", "stroke-width": 1 }, truss);
    });
    svgEl("rect", { x: -20, y: -h / 2 - 3, width: L + 40, height: 1.6, fill: "#ffffff", opacity: 0.14 }, truss);
    for (let i = 0; i < count; i++) {
      svgEl("circle", { cx: i * (step / 2), cy: i % 2 ? h / 2 : -h / 2, r: 3.8, fill: "#5c6169", stroke: "#0e0f12", "stroke-width": 1.2 }, truss);
    }

    /* ---- the follow spot's lamp ---- */
    const sa = anchor(0.4);
    const lampG = svgEl("g", { class: "lamp", transform: `translate(${sa.x} ${sa.y})` }, rigSvg);
    svgEl("line", { x1: 0, y1: -2, x2: 0, y2: YOKE, stroke: "#3c4047", "stroke-width": 3.5 }, lampG);
    const head = svgEl("g", { transform: `translate(0 ${YOKE}) scale(${SPOT_SCALE})` }, lampG);
    svgEl("path", { d: "M-9 0 L9 0 L12 26 L-12 26 Z", fill: "url(#st-metal)", stroke: "#0c0c0e", "stroke-width": 1 }, head);
    [7, 13, 19].forEach((y) => svgEl("line", { x1: -10 - y / 12, y1: y, x2: 10 + y / 12, y2: y, stroke: "#14151a", "stroke-width": 1.2 }, head));
    svgEl("rect", { x: -13.5, y: 25, width: 27, height: 4, rx: 1.2, fill: "#17181c" }, head);
    const glow = svgEl("g", { class: "glow" }, head);
    svgEl("circle", { cx: 0, cy: 31, r: 22, fill: `rgba(${SPOT_RGB},.07)` }, glow);
    svgEl("ellipse", { cx: 0, cy: 29.5, rx: 11, ry: 4, fill: `rgb(${SPOT_RGB})`, opacity: 0.55 }, glow);

    /* ---- the beam and its pool on the floor ---- */
    const ld = svgEl("defs", {}, lightSvg);
    const pg = svgEl("radialGradient", { id: "st-pool" }, ld);
    [["0", 0.12], ["0.55", 0.1], ["0.85", 0.045], ["1", 0]].forEach(([o, a]) =>
      svgEl("stop", { offset: o, "stop-color": `rgb(${SPOT_RGB})`, "stop-opacity": a }, pg));
    const sg = svgEl("linearGradient", { id: "st-sg", gradientUnits: "userSpaceOnUse" }, ld);
    svgEl("stop", { offset: 0, "stop-color": `rgba(${SPOT_RGB},.3)` }, sg);
    svgEl("stop", { offset: 1, "stop-color": `rgba(${SPOT_RGB},.03)` }, sg);
    const spotG = svgEl("g", { class: "beam spot" }, lightSvg);
    const outer = svgEl("polygon", { fill: "url(#st-sg)", opacity: 0.12 }, spotG);
    const inner = svgEl("polygon", { fill: "url(#st-sg)", opacity: 0.35 }, spotG);
    const pool = svgEl("ellipse", { fill: "url(#st-pool)" }, spotG);
    spot = { outer, inner, pool, head, grad: sg, px: sa.x, py: sa.y + YOKE, base: Math.min(170, Math.max(80, W * 0.1)) };

    if (!cur.x) { cur.x = tgt.x = W * 0.5; cur.y = tgt.y = H * 0.42; }
    placeSpot();
  }

  function placeSpot() {
    if (!spot) return;
    const { px, py, base } = spot;
    const a = aimAt(px, py, cur.x, cur.y);
    const lx = px + a.ux * LENS_DIST * SPOT_SCALE, ly = py + a.uy * LENS_DIST * SPOT_SCALE;
    const nx = -a.uy, ny = a.ux;
    const poly = (w0, w1) =>
      `${lx - nx * w0},${ly - ny * w0} ${lx + nx * w0},${ly + ny * w0} ${cur.x + nx * w1},${cur.y + ny * w1} ${cur.x - nx * w1},${cur.y - ny * w1}`;
    spot.inner.setAttribute("points", poly(6, base * 0.92));
    spot.outer.setAttribute("points", poly(10, base * 1.3));
    spot.pool.setAttribute("cx", cur.x); spot.pool.setAttribute("cy", cur.y);
    spot.pool.setAttribute("rx", base); spot.pool.setAttribute("ry", base);
    spot.grad.setAttribute("x1", lx); spot.grad.setAttribute("y1", ly);
    spot.grad.setAttribute("x2", cur.x); spot.grad.setAttribute("y2", cur.y);
    spot.head.setAttribute("transform", `translate(0 ${YOKE}) rotate(${a.angle}) scale(${SPOT_SCALE})`);
  }

  /* ---------- motion: follow the pointer, wander when idle; paused in light mode ---------- */
  let running = false, raf = 0;
  function frame(now) {
    if (!hero.isConnected || !running) return;
    if (!document.body.classList.contains("light")) {
      if (now - lastMove > 2500 && !reduced) {
        const t = now / 1000;
        tgt.x = W * (0.46 + 0.24 * Math.sin(t * 0.45));
        tgt.y = H * (0.45 + 0.15 * Math.sin(t * 0.8 + 1));
      }
      cur.x += (tgt.x - cur.x) * 0.1;
      cur.y += (tgt.y - cur.y) * 0.1;
      placeSpot();
    }
    raf = requestAnimationFrame(frame);
  }
  const start = () => { if (!running) { running = true; raf = requestAnimationFrame(frame); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    tgt.x = e.clientX - r.left;
    tgt.y = Math.max(60, e.clientY - r.top);
    lastMove = performance.now();
  });
  hero.addEventListener("pointerleave", () => { lastMove = 0; });

  build();
  if (reduced) { tgt.x = cur.x = W * 0.5; tgt.y = cur.y = H * 0.42; placeSpot(); }
  stage.classList.add("on"); // kicks off the lamp power-up in CSS

  if ("ResizeObserver" in window) new ResizeObserver(() => { if (hero.isConnected) build(); }).observe(hero);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((en) => (en[0].isIntersecting && !reduced ? start() : stop())).observe(hero);
  } else if (!reduced) start();
}
