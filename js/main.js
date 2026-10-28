/* Router + renderers. Content lives in js/data.js. */

const app = document.getElementById("app");
const transition = document.getElementById("transition");
const toast = document.getElementById("toast");

/* ---------- helpers ---------- */

/* storage can throw (sandboxed viewers, private modes) — never let that break the page */
const store = {
  get: (area, k) => { try { return window[area].getItem(k); } catch { return null; } },
  set: (area, k, v) => { try { window[area].setItem(k, v); } catch {} },
  del: (area, k) => { try { window[area].removeItem(k); } catch {} },
};

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove("show"), 2200);
}

function shareLink(side) {
  const url = `${location.origin}${location.pathname}#/${side}`;
  navigator.clipboard
    .writeText(url)
    .then(() => showToast(side === "tech" ? "Tech-side link copied — see you at the conference." : "Arts-side link copied — break a leg."))
    .catch(() => showToast(url));
}

/* image that quietly disappears if the file isn't there yet */
const img = (src, alt, cls = "") =>
  `<img class="${cls}" src="${src}" alt="${esc(alt)}" loading="lazy" onerror="this.closest('figure') ? this.closest('figure').classList.add('no-img') : this.remove()" />`;

function ageFrom(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const now = new Date();
  let age = now.getFullYear() - y;
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) age--;
  return age;
}

/* ---------- link pills with icons ---------- */

const ICONS = {
  apple:
    '<svg viewBox="0 0 384 512" aria-hidden="true"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>',
  gplay:
    '<svg viewBox="0 0 512 512" aria-hidden="true"><path fill="currentColor" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>',
  globe:
    '<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="8" cy="8" r="6.4"/><path d="M1.6 8h12.8M8 1.6c2.4 2.6 2.4 10.2 0 12.8-2.4-2.6-2.4-10.2 0-12.8z"/></svg>',
};

function linkIcon(label) {
  const l = label.toLowerCase();
  if (l.includes("app store")) return ICONS.apple;
  if (l.includes("play")) return ICONS.gplay;
  return ICONS.globe;
}

const linksRow = (links) =>
  links && links.length
    ? `<nav class="tcard-links">${links
        .map((l) => `<a href="${l.href}" target="_blank" rel="noopener">${linkIcon(l.label)}<span>${esc(l.label)}</span></a>`)
        .join("")}</nav>`
    : "";

/* ---------- transition between sides ---------- */

let currentRoute = null;

function navigate(route) {
  if (route === currentRoute) return;
  const theme = route === "tech" ? "t-tech" : route === "arts" ? "t-arts" : "t-split";
  transition.className = theme + " closing";
  setTimeout(() => {
    location.hash = route ? `#/${route}` : "#/";
    window.scrollTo({ top: 0, behavior: "instant" });
    transition.className = theme + " opening";
    setTimeout(() => (transition.className = ""), 650);
  }, 450);
}

/* ---------- shared modal ---------- */

const modalShell = `
  <div class="modal-overlay" id="modal" hidden>
    <div class="modal" role="dialog" aria-modal="true">
      <button class="modal-close" aria-label="Close">✕</button>
      <div class="modal-body"></div>
    </div>
  </div>`;

function setupModal() {
  const overlay = document.getElementById("modal");
  const body = overlay.querySelector(".modal-body");
  let lastFocus = null;
  const open = (html) => {
    lastFocus = document.activeElement;
    body.innerHTML = html;
    overlay.querySelector(".modal").setAttribute("aria-label", (body.querySelector(".modal-title") || {}).textContent || "Details");
    wireSlider(body);
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    overlay.querySelector(".modal-close").focus();
  };
  const close = () => {
    overlay.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  overlay.querySelector(".modal-close").addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (overlay.hidden) return;
    if (e.key === "Escape") return close();
    if (e.key !== "Tab") return;
    /* keep Tab inside the dialog */
    const f = [...overlay.querySelectorAll("a[href], button:not([disabled])")].filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  return open;
}

/* ---------- image slider (used inside modals) ---------- */

function sliderHTML(imgs, altBase) {
  return `
  <div class="slider">
    ${imgs.map((s, i) => `<img class="slide ${i === 0 ? "on" : ""}" src="${s}" alt="${esc(altBase)} — photo ${i + 1}" onerror="this.remove()" />`).join("")}
    <div class="slide-fallback serif" aria-hidden="true">${esc(altBase.slice(0, 1))}</div>
    <button class="slide-nav prev" aria-label="Previous photo">‹</button>
    <button class="slide-nav next" aria-label="Next photo">›</button>
  </div>`;
}

function wireSlider(root) {
  const slider = root.querySelector(".slider");
  if (!slider) return;
  const move = (dir) => {
    const slides = [...slider.querySelectorAll(".slide")];
    if (slides.length < 2) return;
    let i = slides.findIndex((s) => s.classList.contains("on"));
    if (i < 0) i = 0;
    slides[i].classList.remove("on");
    slides[(i + dir + slides.length) % slides.length].classList.add("on");
  };
  slider.querySelector(".prev").addEventListener("click", () => move(-1));
  slider.querySelector(".next").addEventListener("click", () => move(1));
}

/* ---------- views ---------- */

function renderLanding() {
  document.body.dataset.view = "landing";
  app.innerHTML = `
  <main class="landing">
    <section class="half half-tech" data-go="tech" tabindex="0" role="link" aria-label="Enter the tech side">
      <div class="half-inner">
        <p class="half-kicker mono">01 · BY DAY</p>
        <h2 class="half-title">The&nbsp;Programme<br>Manager</h2>
        <p class="half-sub">AI programme management at YTL AI Labs.<br>Helping build ILMU, Malaysia's own AI.</p>
        <p class="half-enter mono">[ enter ↵ ]</p>
      </div>
      <div class="grid-bg" aria-hidden="true"></div>
    </section>

    <div class="landing-center" aria-hidden="false">
      <p class="lc-eyebrow">One person. Two programmes.</p>
      <h1 class="lc-name">${esc(PROFILE.name)}</h1>
      <p class="lc-tag">${esc(PROFILE.tagline)}</p>
    </div>

    <section class="half half-arts" data-go="arts" tabindex="0" role="link" aria-label="Enter the arts side">
      <div class="half-inner">
        <p class="half-kicker serif-it">02 · By night</p>
        <h2 class="half-title serif">The<br>Performer</h2>
        <p class="half-sub">Writer, director, actor.<br>25+ productions on the Malaysian stage.</p>
        <p class="half-enter serif-it">— take your seat —</p>
      </div>
      <div class="spotlight-bg" aria-hidden="true"></div>
    </section>
  </main>`;

  app.querySelectorAll("[data-go]").forEach((el) => {
    el.addEventListener("click", () => navigate(el.dataset.go));
    el.addEventListener("keydown", (e) => { if (e.key === "Enter") navigate(el.dataset.go); });
  });
}

/* --- shared page chrome --- */

function pageHeader(side) {
  const mainBtn =
    side === "arts"
      ? `<button class="btn-solid arts" data-comp>Comp Card</button>`
      : `<button class="btn-solid" data-print="resume">Résumé PDF</button>`;
  return `
  <header class="page-head">
    <a class="head-name" href="#/" data-nav="">${esc(side === "tech" ? PROFILE.proName : PROFILE.name)}</a>
    <nav class="head-actions">
      <button class="btn-ghost" data-share="${side}">Share this side</button>
      ${mainBtn}
    </nav>
  </header>`;
}

/* Each side keeps its own links only — sharing one side never leaks the other. */
function pageFooter(side) {
  const links =
    side === "tech"
      ? [
          ["LinkedIn", PROFILE.linkedin],
          ["GitHub", PROFILE.github],
          ["Email", "mailto:" + PROFILE.email],
        ]
      : [
          ["CloudJoi", PROFILE.cloudjoi],
          ["Instagram", PROFILE.instagram],
          ["YouTube", PROFILE.youtube],
          ["Fiverr", PROFILE.fiverr],
          ["Email", "mailto:" + PROFILE.email],
        ];
  return `
  <footer class="page-foot">
    <p class="foot-tag">${side === "tech" ? "This site was project-managed, obviously." : "No intermission. Scroll again from the top."}</p>
    <nav class="foot-links">${links.map(([t, h]) => `<a href="${h}" target="_blank" rel="noopener">${t}</a>`).join("")}</nav>
    <p class="foot-copy">© ${new Date().getFullYear()} ${esc((side === "tech" ? PROFILE.proName : PROFILE.name))} · ${esc(PROFILE.location)}</p>
  </footer>`;
}

function wirePage() {
  app.querySelectorAll("[data-nav]").forEach((el) =>
    el.addEventListener("click", (e) => { e.preventDefault(); navigate(el.dataset.nav); })
  );
  app.querySelectorAll("[data-share]").forEach((el) =>
    el.addEventListener("click", () => shareLink(el.dataset.share))
  );
}

/* --- TECH --- */

/* kanban lanes are statuses (like a real board); domains become chips on the tickets */
const BOARD_COLUMNS = [
  { lane: "inflight", label: "In Flight", pill: "● IN FLIGHT", pillClass: "s-inflight" },
  { lane: "shipped", label: "Shipped & Scaled", pill: "✓ SHIPPED", pillClass: "s-shipped" },
  { lane: "practice", label: "Standard Practice", pill: "∞ EVERGREEN", pillClass: "s-evergreen" },
];

function renderTech() {
  document.body.dataset.view = "tech";
  const now = new Date();
  const nowY = now.getFullYear() + (now.getMonth() + 0.5) / 12;
  const years = { min: 2016, max: now.getFullYear() + 1 };
  const span = years.max - years.min;
  const pct = (y) => (((y ?? years.max) - years.min) / span) * 100;

  const ticks = [];
  for (let y = years.min; y <= years.max; y += 2) {
    ticks.push(`<span class="gantt-tick" style="left:${pct(y)}%">${y}</span>`);
  }

  /* a proper Gantt reads top-down: earliest engagement first, cascading to today */
  const rows = TECH.career.slice().reverse().map((c, i) => `
    <div class="gantt-row">
      <div class="gantt-label">
        <strong>${esc(c.role)}</strong>
        <span>${esc(c.org)}</span>
      </div>
      <div class="gantt-track">
        <div class="gantt-bar ${c.end === null ? "ongoing" : ""}" data-from="${pct(c.start)}" data-to="${pct(c.end)}" style="left:${pct(c.start)}%; width:${pct(c.end) - pct(c.start)}%; animation-delay:${0.15 + i * 0.18}s">
          <span class="gantt-note">${esc(c.note)}</span>
        </div>
        ${(c.milestones || []).map((ms) => `<button type="button" class="gantt-ms" style="left:${pct(ms.at)}%" aria-label="${esc(ms.label)}"><span class="gantt-note">${esc(ms.label)}</span></button>`).join("")}
      </div>
    </div>`).join("");

  /* kanban board: status lanes, domain chips on tickets */
  const board = BOARD_COLUMNS.map((col) => {
    const items = TECH.highlights.map((h, i) => [h, i]).filter(([h]) => h.lane === col.lane);
    return `
    <div class="kcol kcol-${col.lane}">
      <div class="kcol-head mono"><span>${esc(col.label)}</span><span class="kcount">${items.length}</span></div>
      ${items.map(([h, i]) => `
        <article class="ticket tcard-click" data-modal="${i}" tabindex="0" role="button" aria-label="Expand ${esc(h.title)}">
          <div class="ticket-top mono">
            <span class="ticket-id">KRM-${101 + i}<b class="dom dom-${esc(h.tag)}">${esc(h.tag)}</b></span>
            <span class="ticket-status ${col.pillClass}">${col.pill}</span>
          </div>
          <h3>${esc(h.title)}</h3>
          <ul class="tcard-bullets">${h.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
          ${linksRow(h.links)}
          <span class="tcard-more mono">expand →</span>
        </article>`).join("")}
    </div>`;
  }).join("");

  /* the plan at a glance: schematic and not to scale; each bar opens its ticket */
  const CP = [
    { row: 0, from: 0, to: 24, label: "ERP deliveries", short: "ERP", status: "shipped", ticket: 5 },
    { row: 1, from: 24, to: 50, label: "Frog VLE & Launchpad", short: "Frog VLE", status: "shipped", ticket: 3 },
    { row: 2, from: 50, to: 100, label: "ILMU", status: "inflight", ticket: 0 },
    { row: 3, from: 54, to: 74, label: "Ryt AI", status: "shipped", ticket: 1 },
    { row: 3, from: 78, to: 100, label: "ILMUchat", status: "inflight", ticket: 2 },
  ];
  const CP_LINKS = [[0, 1], [1, 2], [2, 3], [2, 4]]; // source bar → bar that depends on it
  const CP_ROW = 24, CP_PITCH = 38;
  const cpHTML = `
    <figure class="cp" aria-label="How the programmes connect (schematic)" style="height:${3 * CP_PITCH + CP_ROW}px">
      ${CP.map((b, i) => `<button type="button" class="cp-bar ${b.status}" style="left:${b.from}%; width:${b.to - b.from}%; top:${b.row * CP_PITCH}px; --i:${i}" data-ticket="${b.ticket}"><span class="cp-full">${esc(b.label)}</span><span class="cp-short">${esc(b.short || b.label)}</span></button>`).join("")}
      ${CP_LINKS.map(([s, t], i) => `<i class="cp-link" style="left:${CP[t].from}%; top:${CP[s].row * CP_PITCH + CP_ROW}px; height:${(CP[t].row - CP[s].row) * CP_PITCH - CP_ROW}px; --i:${i}"></i>`).join("")}
    </figure>`;

  /* a one-line status report, driven by the board below */
  const inFlight = TECH.highlights.filter((h) => h.lane === "inflight").length;
  const today = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  app.innerHTML = `
  ${pageHeader("tech")}
  <main class="page page-tech">
    <section class="hero-tech">
      <div class="terminal" aria-label="terminal introduction">
        <div class="term-bar"><i></i><i></i><i></i><span class="mono">Karam/AI-Programme-Manager-Professional;~</span></div>
        <pre class="term-body mono" id="term"></pre>
      </div>
      <div class="hero-tech-copy">
        <p class="mono kicker-tech">// ${esc(TECH.role)} — ${esc(TECH.org)}</p>
        <h1>Ambitious, messy, cross-functional?<br><span class="accent">Shipped.</span></h1>
        <p class="lede">${esc(TECH.summary)}</p>
        <p class="rag mono"><i class="rag-dot" aria-hidden="true"></i>Status green · ${inFlight} in flight, 0 blocked · updated ${today}</p>
      </div>
      ${cpHTML}
    </section>

    <section class="section">
      <h2 class="sec-title mono">/the-board — <span class="dim">nothing blocked, nothing in review. click a ticket, or try to move one.</span></h2>
      <div class="kanban">${board}</div>
    </section>

    <section class="section">
      <h2 class="sec-title mono">/career — <span class="dim">yes, the timeline is a Gantt chart</span></h2>
      <div class="gantt">
        <div class="gantt-axis">${ticks.join("")}</div>
        ${rows}
        <div class="gantt-today-wrap" aria-hidden="true"><i class="gantt-today" style="left:${pct(nowY)}%"><span class="mono">today</span></i></div>
      </div>
      <p class="gantt-hint mono">hover the bars ↑</p>
    </section>

    <section class="section">
      <h2 class="sec-title mono">/skills</h2>
      <div class="skills-grid">
        ${TECH.skills.map((g) => `
          <div class="skill-group">
            <h3 class="mono">${esc(g.group)}</h3>
            <div class="chips">${g.items.map((i) => `<span class="chip">${esc(i)}</span>`).join("")}</div>
          </div>`).join("")}
      </div>
      <div class="edu-row">
        <p><strong>${esc(TECH.education.degree)}</strong> · ${esc(TECH.education.school)}<br>
        <span class="dim">${TECH.certifications.map(esc).join(" · ")}</span></p>
        <p class="mono dim">${TECH.languages.map(esc).join(" · ")}</p>
      </div>
    </section>

    <section class="section cta-row">
      <a class="btn-solid" href="${PROFILE.linkedin}" target="_blank" rel="noopener">Connect on LinkedIn</a>
      <button class="btn-ghost" data-print="resume">Download Résumé (PDF)</button>
      <a class="btn-ghost" href="${PROFILE.github}" target="_blank" rel="noopener">GitHub</a>
      <button class="btn-ghost" data-share="tech">Copy link to this side</button>
    </section>
  </main>
  ${modalShell}
  ${pageFooter("tech")}`;

  wirePage();
  const open = setupModal();
  document.querySelectorAll("[data-modal]").forEach((card) => {
    const show = (e) => {
      if (e && e.target && e.target.closest("a")) return; // link clicks pass through
      const h = TECH.highlights[Number(card.dataset.modal)];
      open(`
        <span class="tcard-tag mono">${esc(h.tag)}</span>
        <h3 class="modal-title">${esc(h.title)}</h3>
        ${h.story.map((p) => `<p class="modal-p">${esc(p)}</p>`).join("")}
        ${h.wins ? `<h4 class="modal-wins-title mono">// achievements</h4>
          <ul class="modal-wins">${h.wins.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>` : ""}
        ${linksRow(h.links)}`);
    };
    card.addEventListener("click", show);
    card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(); } });
  });
  wireCriticalPath();
  wireBoardDrag();
  drawGanttDeps();
  typeTerminal();
}

/* hero plan: each bar opens the matching ticket from the board */
function wireCriticalPath() {
  document.querySelectorAll(".cp-bar").forEach((bar) =>
    bar.addEventListener("click", () => {
      const card = document.querySelector(`.ticket[data-modal="${bar.dataset.ticket}"]`);
      if (card) card.click();
    })
  );
}

/* board tickets can be picked up with a mouse, but status stays with the programme manager */
const DROP_NOTES = {
  "inflight>shipped": "Not shipped yet. It stays in flight.",
  "inflight>practice": "That isn't a habit yet. Still in flight.",
  "shipped>inflight": "Shipped means shipped. Reopening needs a change request.",
  "shipped>practice": "Shipped, not standard practice. Yet.",
};
const laneOf = (el) => (el.className.match(/kcol-(\w+)/) || [])[1];

function wireBoardDrag() {
  document.querySelectorAll(".ticket").forEach((t) => {
    let dragged = false;
    t.addEventListener("click", (e) => { if (dragged) { e.stopImmediatePropagation(); e.preventDefault(); } }, true);

    t.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "touch" || e.button !== 0 || e.target.closest("a")) return;
      const sx = e.clientX, sy = e.clientY;
      const home = t.closest(".kcol");
      let active = false, over = null;

      const move = (ev) => {
        const dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (!active) {
          if (Math.hypot(dx, dy) < 6) return;
          active = true;
          t.classList.remove("snap");
          t.classList.add("dragging");
        }
        t.style.transform = `translate(${dx}px, ${dy}px) rotate(1.4deg)`;
        const col = document.elementsFromPoint(ev.clientX, ev.clientY).map((n) => n.closest && n.closest(".kcol")).find(Boolean) || null;
        if (col !== over) {
          if (over) over.classList.remove("drop");
          over = col && col !== home ? col : null;
          if (over) over.classList.add("drop");
        }
      };

      const up = () => {
        window.removeEventListener("pointermove", move);
        if (over) over.classList.remove("drop");
        if (!active) return;
        dragged = true;
        setTimeout(() => { dragged = false; }, 0);
        if (over) {
          const id = t.querySelector(".ticket-id").firstChild.textContent;
          const from = laneOf(home), to = laneOf(over);
          showToast(`${id}: ${DROP_NOTES[`${from}>${to}`] || "Habits don't move. They just keep running."}`);
        }
        t.classList.add("snap");
        t.style.transform = "";
        setTimeout(() => t.classList.remove("dragging", "snap"), 450);
      };

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up, { once: true });
    });
  });
}

/* dependency arrows between the career bars, drawn from the track geometry (not the animated bars) */
function drawGanttDeps() {
  const g = document.querySelector(".gantt");
  if (!g) return;
  const NS = "http://www.w3.org/2000/svg";
  let svg = g.querySelector(".gantt-deps");
  if (!svg) {
    svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "gantt-deps");
    svg.setAttribute("aria-hidden", "true");
    g.appendChild(svg);
  }
  const draw = () => {
    if (!g.isConnected) return;
    const gr = g.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${gr.width} ${gr.height}`);
    const rows = [...g.querySelectorAll(".gantt-track")].map((tr) => {
      const r = tr.getBoundingClientRect(), bar = tr.querySelector(".gantt-bar");
      const x = (p) => r.left - gr.left + (r.width * p) / 100;
      return { from: x(+bar.dataset.from), to: x(+bar.dataset.to), top: r.top - gr.top + 3, bottom: r.bottom - gr.top - 3 };
    });
    let d = "";
    for (let i = 0; i < rows.length - 1; i++) {
      const a = rows[i], b = rows[i + 1];
      const mid = (a.bottom + b.top) / 2;
      d += Math.abs(b.from - a.to) < 4
        ? `M${b.from} ${a.bottom}V${b.top}`
        : `M${a.to} ${a.bottom}V${mid}H${b.from}V${b.top}`;
      d += `M${b.from - 3.5} ${b.top - 5}L${b.from} ${b.top}L${b.from + 3.5} ${b.top - 5}`;
    }
    svg.replaceChildren();
    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", d);
    svg.appendChild(path);
  };
  draw();
  if ("ResizeObserver" in window) new ResizeObserver(draw).observe(g);
}

function typeTerminal() {
  const el = document.getElementById("term");
  if (!el) return;
  const HOLD = 2400, TYPE = 26, DEL = 11;
  let out = "";
  const put = (t) => { el.textContent = out + t + "▌"; };

  const typeLine = (line, speed, done) => {
    let i = 0;
    (function step() {
      if (!el.isConnected) return; // page changed — stop this loop
      i++;
      put(line.slice(0, i));
      if (i < line.length) setTimeout(step, speed);
      else done();
    })();
  };

  /* intro lines, typed once */
  let li = 0;
  (function nextIntro() {
    if (!el.isConnected) return;
    if (li >= TECH.heroLines.length) { cycle(0); return; }
    const line = TECH.heroLines[li++];
    typeLine(line, line.startsWith(">") ? 30 : 12, () => {
      out += line + "\n";
      setTimeout(nextIntro, line.startsWith(">") ? 110 : 380);
    });
  })();

  /* then cycle through shipped achievements forever */
  function cycle(a) {
    if (!el.isConnected) return;
    const line = TECH.shipped[a % TECH.shipped.length];
    typeLine(line, TYPE, () =>
      setTimeout(() => {
        let i = line.length;
        (function del() {
          if (!el.isConnected) return;
          i -= 2;
          if (i > 0) { put(line.slice(0, i)); setTimeout(del, DEL); }
          else { put(""); setTimeout(() => cycle(a + 1), 300); }
        })();
      }, HOLD)
    );
  }
}

/* --- ARTS --- */

/* typeset stand-in poster: shown until assets/img/shows/<id>.jpg exists */
const POSTER_HUES = [205, 28, 355, 150, 275];
function posterHTML(s, i) {
  const [main, ...rest] = s.title.split(/:\s+/);
  const year = (s.dates.match(/\d{4}/) || [""])[0];
  return `<figcaption class="pb-poster" style="--h:${POSTER_HUES[i % POSTER_HUES.length]}" aria-hidden="true">
        <span class="pb-poster-year serif-it">${esc(year)}</span>
        <span class="pb-poster-title serif">${esc(main)}</span>
        ${rest.length ? `<span class="pb-poster-sub serif-it">${esc(rest.join(": "))}</span>` : ""}
      </figcaption>`;
}

/* what Karam did on each show; drives the tag pills and the filter */
const SHOW_TAGS = { directed: "Directed", written: "Written", acted: "Acted" };
const tagPills = (s) =>
  `<ul class="pb-tags" aria-label="Karam's contribution">${(s.tags || []).map((t) => `<li class="pb-tag pb-tag-${t}">${SHOW_TAGS[t]}</li>`).join("")}</ul>`;

function showFilterHTML() {
  const count = (t) => ARTS.shows.filter((s) => (s.tags || []).includes(t)).length;
  const chip = (key, label, n, on) =>
    `<button type="button" class="pb-filter${on ? " on" : ""}" data-filter="${key}" aria-pressed="${on}">${label} <span class="pb-filter-n">${n}</span></button>`;
  return `<div class="pb-filters" role="group" aria-label="Filter shows by what I did">
    ${chip("all", "All shows", ARTS.shows.length, true)}
    ${Object.entries(SHOW_TAGS).map(([k, label]) => chip(k, label, count(k), false)).join("")}
  </div>`;
}

function showCard(s, i) {
  const badge = s.badge ? `<span class="pb-badge">${esc(s.badge)}</span>` : "";
  const company = s.company ? `<p class="pb-company serif-it">${esc(s.company)}</p>` : "";
  return `
  <article class="playbill ${s.featured ? "featured" : ""}" data-show="${i}" data-tags="${(s.tags || []).join(" ")}" tabindex="0" role="button" aria-label="Open details for ${esc(s.title)}">
    <figure class="pb-art">
      ${img(`assets/img/shows/${s.id}.jpg`, s.title + " poster")}
      ${posterHTML(s, i)}
    </figure>
    <div class="pb-body">
      ${badge}
      ${tagPills(s)}
      <p class="pb-role serif-it">${esc(s.role)}</p>
      <h3 class="pb-title serif">${esc(s.title)}</h3>
      <p class="pb-meta">${esc(s.dates)} · ${esc(s.venue)}</p>
      ${company}
      <p class="pb-syn">${esc(s.synopsis)}</p>
      <span class="pb-open serif-it">Full programme notes →</span>
    </div>
  </article>`;
}

function compCardHTML() {
  const c = ARTS.compCard;
  const stats = [["Age", String(ageFrom(PROFILE.born))], ...c.stats];
  return `
    <div class="comp-shots">
      ${c.headshots.map((h, i) => `<img src="${h}" alt="Headshot ${i + 1}" onerror="this.remove()" />`).join("")}
      <div class="comp-shots-fallback serif-it">Headshots coming soon</div>
    </div>
    <h3 class="modal-title serif">${esc(PROFILE.name)}</h3>
    <p class="comp-sub serif-it">${esc(c.subtitle)} — ${esc(PROFILE.location)}</p>
    <dl class="comp-stats">
      ${stats.map(([k, v]) => `<div class="comp-stat"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}
    </dl>
    <nav class="tcard-links comp-links">
      <a href="mailto:${PROFILE.email}">${ICONS.globe}<span>${esc(PROFILE.email)}</span></a>
      <a href="${PROFILE.cloudjoi}" target="_blank" rel="noopener">${ICONS.globe}<span>CloudJoi profile</span></a>
    </nav>
    <button class="btn-solid arts comp-dl" data-print="comp-card">Download as PDF</button>`;
}

function renderArts() {
  document.body.dataset.view = "arts";
  app.innerHTML = `
  ${pageHeader("arts")}
  <main class="page page-arts">
    <section class="hero-arts" id="spot">
      <p class="serif-it hero-arts-kicker">Presenting, for one website only —</p>
      <h1 class="serif hero-arts-title">${esc(ARTS.heroTitle)}</h1>
      <p class="hero-arts-sub">${esc(ARTS.heroSub)}</p>
      <div class="stats-row">
        ${ARTS.stats.map((s) => `<div class="stat"><span class="stat-n serif">${esc(s.n)}</span><span class="stat-l">${esc(s.label)}</span></div>`).join("")}
      </div>
    </section>

    <section class="section">
      <h2 class="sec-title-arts serif">The Programme <span class="serif-it dim">— in order of applause</span></h2>
      ${showFilterHTML()}
      <div class="playbills">
        ${ARTS.shows.map(showCard).join("")}
      </div>
    </section>

    <section class="section three-col">
      <div class="side-block">
        <h3 class="serif">🎙 Voiceover</h3>
        <p>${esc(ARTS.voiceover.intro)}</p>
        ${ARTS.voiceover.items.map((v) => `<audio controls src="${v.src}" title="${esc(v.title)}"></audio>`).join("")}
      </div>
      <div class="side-block">
        <h3 class="serif">📺 On screen</h3>
        <p>${esc(ARTS.screen.intro)}</p>
        <nav class="tcard-links arts-links"><a href="${PROFILE.youtube}" target="_blank" rel="noopener">${ICONS.globe}<span>YouTube channel</span></a></nav>
      </div>
      <div class="side-block">
        <h3 class="serif">🎨 The posters</h3>
        <p>${esc(ARTS.design.intro)}</p>
        <div class="design-grid">
          ${ARTS.design.items.map((d) => `<figure>${img(d.img, d.caption)}<figcaption>${esc(d.caption)}</figcaption></figure>`).join("")}
        </div>
      </div>
    </section>

    <section class="section cta-row">
      <a class="btn-solid arts" href="${PROFILE.cloudjoi}" target="_blank" rel="noopener">Full profile on CloudJoi</a>
      <a class="btn-ghost arts" href="${PROFILE.fiverr}" target="_blank" rel="noopener">Hire me on Fiverr</a>
      <button class="btn-ghost arts" data-share="arts">Copy link to this side</button>
    </section>
  </main>
  ${modalShell}
  ${pageFooter("arts")}`;

  wirePage();
  const open = setupModal();

  /* filter the programme by what I did on each show */
  const filters = document.querySelectorAll(".pb-filter");
  filters.forEach((btn) =>
    btn.addEventListener("click", () => {
      const key = btn.dataset.filter;
      filters.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("on", on);
        b.setAttribute("aria-pressed", on);
      });
      document.querySelectorAll(".playbill").forEach((card) => {
        card.hidden = key !== "all" && !card.dataset.tags.split(" ").includes(key);
      });
    })
  );

  /* show detail modals with photo slider */
  document.querySelectorAll("[data-show]").forEach((card) => {
    const show = (e) => {
      if (e && e.target && e.target.closest("a")) return;
      const s = ARTS.shows[Number(card.dataset.show)];
      const gallery = s.gallery && s.gallery.length ? s.gallery : [`assets/img/shows/${s.id}.jpg`];
      open(`
        ${sliderHTML(gallery, s.title)}
        ${tagPills(s)}
        <p class="pb-role serif-it">${esc(s.role)}</p>
        <h3 class="modal-title serif">${esc(s.title)}</h3>
        <p class="pb-meta">${esc(s.dates)} · ${esc(s.venue)}${s.company ? " · " + esc(s.company) : ""}</p>
        <p class="modal-p">${esc(s.synopsis)}</p>
        ${(s.more || []).map((p) => `<p class="modal-p">${esc(p)}</p>`).join("")}
        ${s.link ? `<nav class="tcard-links arts-links"><a href="${s.link}" target="_blank" rel="noopener">${ICONS.globe}<span>Show page</span></a></nav>` : ""}`);
    };
    card.addEventListener("click", show);
    card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(); } });
  });

  /* comp card */
  document.querySelectorAll("[data-comp]").forEach((btn) =>
    btn.addEventListener("click", () => open(compCardHTML()))
  );

  /* lighting rig, runway and follow spot behind the hero (js/stage.js) */
  mountStage(document.getElementById("spot"));
}

/* ---------- printable documents (PDF via the browser's print-to-PDF) ---------- */

function printBar(backHash) {
  return `
  <div class="print-bar no-print">
    <a href="${backHash}">← Back to site</a>
    <button class="print-go" onclick="window.print()">🖨 Print / Save as PDF</button>
  </div>`;
}

function maybeAutoPrint() {
  if (store.get("sessionStorage", "autoprint")) {
    store.del("sessionStorage", "autoprint");
    setTimeout(() => window.print(), 500);
  }
}

/* Résumé — generated from the same TECH data as the site, so they never drift. */
function renderResume() {
  document.body.dataset.view = "print";
  app.innerHTML = `
  ${printBar("#/tech")}
  <main class="print-doc resume-doc">
    <header class="r-head">
      <h1 class="serif">${esc(PROFILE.proName)}</h1>
      <p class="r-title">${esc(TECH.role)} · ${esc(TECH.org)}</p>
      <p class="r-contact">${esc(PROFILE.email)} &nbsp;·&nbsp; linkedin.com/in/karam-altabba &nbsp;·&nbsp; ${esc(PROFILE.location)}</p>
    </header>

    <section>
      <h2>Summary</h2>
      <p class="r-summary">${esc(TECH.summary)}</p>
    </section>

    <section>
      <h2>Experience</h2>
      ${TECH.career.map((c) => `
        <div class="r-job">
          <div class="r-job-head">
            <h3>${esc(c.role)} <span class="r-org">— ${esc(c.org)}</span></h3>
            <span class="r-period">${esc(c.period)}</span>
          </div>
          <ul>${(c.resumePoints || [c.note]).map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
        </div>`).join("")}
    </section>

    <section>
      <h2>Skills</h2>
      ${TECH.skills.map((g) => `<p class="r-skill"><strong>${esc(g.group)}:</strong> ${g.items.map(esc).join(" · ")}</p>`).join("")}
    </section>

    <div class="r-cols">
      <section>
        <h2>Education</h2>
        <p><strong>${esc(TECH.education.degree)}</strong><br>${esc(TECH.education.school)}</p>
      </section>
      <section>
        <h2>Certifications</h2>
        <p>${TECH.certifications.map(esc).join("<br>")}</p>
      </section>
      <section>
        <h2>Languages</h2>
        <p>${TECH.languages.map(esc).join("<br>")}</p>
      </section>
    </div>
  </main>`;
  maybeAutoPrint();
}

/* Comp card — same data as the on-site comp card modal. */
function renderCompPrint() {
  document.body.dataset.view = "print";
  const c = ARTS.compCard;
  const stats = [["Age", String(ageFrom(PROFILE.born))], ...c.stats];
  app.innerHTML = `
  ${printBar("#/arts")}
  <main class="print-doc comp-doc">
    <header class="r-head comp-head">
      <h1 class="serif">${esc(PROFILE.name)}</h1>
      <p class="r-title">${esc(c.subtitle)}</p>
      <p class="r-contact">${esc(PROFILE.email)} &nbsp;·&nbsp; cloudjoi.com/profiles/116861 &nbsp;·&nbsp; ${esc(PROFILE.location)}</p>
    </header>
    <div class="comp-doc-shots">
      ${c.headshots.map((h, i) => `<img src="${h}" alt="Headshot ${i + 1}" onerror="this.remove()" />`).join("")}
    </div>
    <dl class="comp-doc-stats">
      ${stats.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}
    </dl>
    <section class="comp-doc-credits">
      <h2>Selected credits</h2>
      <ul>
        ${ARTS.shows.slice(0, 5).map((s) => `<li><strong>${esc(s.title)}</strong> — ${esc(s.role)} · ${esc(s.dates)} · ${esc(s.venue)}</li>`).join("")}
      </ul>
    </section>
  </main>`;
  maybeAutoPrint();
}

/* Any [data-print] button anywhere (pages or modals) opens the print view
   and auto-triggers the print dialog. */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-print]");
  if (!btn) return;
  store.set("sessionStorage", "autoprint", "1");
  location.hash = "#/" + btn.dataset.print;
});

/* ---------- scroll reveal + reading progress ---------- */

const REVEAL = ".terminal, .hero-tech-copy, .sec-title, .sec-title-arts, .kcol, .gantt, .skill-group, .edu-row, .cta-row, .playbill, .side-block, .stat";
let revealIO = null;

function initReveal() {
  if (revealIO) revealIO.disconnect();
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.body.classList.add("reveal-ready");
  revealIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); revealIO.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  app.querySelectorAll(REVEAL).forEach((el) => {
    const i = [...el.parentElement.children].filter((c) => c.matches(REVEAL)).indexOf(el);
    el.style.setProperty("--d", Math.min(i * 0.08, 0.4) + "s");
    el.classList.add("rv");
    revealIO.observe(el);
  });
}

const progress = document.getElementById("progress");
function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = "scaleX(" + (max > 0 ? Math.min(scrollY / max, 1) : 0) + ")";
}
addEventListener("scroll", updateProgress, { passive: true });

/* ---------- boot ---------- */

function route() {
  const h = location.hash.replace(/^#\/?/, "").toLowerCase();
  document.body.style.overflow = ""; // in case a modal was open
  if (h === "tech") { currentRoute = "tech"; renderTech(); }
  else if (h === "arts") { currentRoute = "arts"; renderArts(); }
  else if (h === "resume") { currentRoute = "resume"; renderResume(); }
  else if (h === "comp-card") { currentRoute = "comp-card"; renderCompPrint(); }
  else { currentRoute = ""; renderLanding(); }
  document.title = currentRoute === "tech" || currentRoute === "resume"
    ? `${PROFILE.proName} — ${TECH.role}`
    : currentRoute === "arts" || currentRoute === "comp-card"
      ? `${PROFILE.name} — Writer, Director & Actor`
      : "Karam Tabba — I run programmes by day. I appear in them by night.";
  window.scrollTo({ top: 0, behavior: "instant" });
  initReveal();
  updateProgress();
}

/* ---------- theme: follows the system until the user picks one ---------- */

const themeToggle = document.getElementById("themeToggle");
const sysLight = window.matchMedia("(prefers-color-scheme: light)");
let themePref = store.get("localStorage", "theme"); // 'light' | 'dark' | null = follow system

function currentTheme() {
  return themePref || (sysLight.matches ? "light" : "dark");
}
function refreshTheme() {
  document.body.classList.toggle("light", currentTheme() === "light");
  themeToggle.textContent = currentTheme() === "light" ? "🌙" : "☀️";
  themeToggle.title = currentTheme() === "light" ? "Switch to dark" : "Switch to light";
}
themeToggle.addEventListener("click", () => {
  themePref = currentTheme() === "light" ? "dark" : "light";
  store.set("localStorage", "theme", themePref);
  refreshTheme();
});
sysLight.addEventListener("change", refreshTheme);
refreshTheme();

window.addEventListener("hashchange", route);
route();
