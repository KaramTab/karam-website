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
    .then(() => showToast(side === "tech" ? "Link copied. Send it to whoever needs a programme manager." : "Link copied. Break a leg."))
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
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)");

function navigate(route) {
  if (route === currentRoute) return;
  if (REDUCED.matches) { location.hash = route ? `#/${route}` : "#/"; return; } // no curtain, no wait
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

let modalKeys = null; // one document-level key handler at a time; each page render replaces the last

function setupModal() {
  const overlay = document.getElementById("modal");
  const body = overlay.querySelector(".modal-body");
  let lastFocus = null;
  const open = (html, cls = "") => {
    lastFocus = document.activeElement;
    body.innerHTML = html;
    overlay.querySelector(".modal").className = "modal " + cls;
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
  if (modalKeys) document.removeEventListener("keydown", modalKeys);
  modalKeys = (e) => {
    if (overlay.hidden) return;
    if (e.key === "Escape") return close();
    if (e.key !== "Tab") return;
    /* keep Tab inside the dialog, even after a click on plain text has dropped focus to the page */
    const f = [...overlay.querySelectorAll("a[href], button:not([disabled])")].filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (!overlay.contains(document.activeElement)) { e.preventDefault(); (e.shiftKey ? last : first).focus(); }
    else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  document.addEventListener("keydown", modalKeys);
  return open;
}

/* ---------- image slider (used inside modals) ---------- */

function sliderHTML(imgs, altBase) {
  return `
  <div class="slider">
    ${imgs.map((s, i) => `<img class="slide ${i === 0 ? "on" : ""}" src="${s}" alt="${esc(altBase)}, photo ${i + 1}" onerror="const sl=this.parentElement,was=this.classList.contains('on');this.remove();if(was){const n=sl.querySelector('.slide');if(n)n.classList.add('on')}" />`).join("")}
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

/* a rubber stamp that sits on the seam of the landing page */
const STAMP = `
  <svg class="stamp" viewBox="0 0 120 120" role="img" aria-label="One person, two programmes">
    <defs><path id="st-path" d="M60,60 m-42.5,0 a42.5,42.5 0 1,1 85,0 a42.5,42.5 0 1,1 -85,0"/></defs>
    <circle class="st-disc" cx="60" cy="60" r="57"/>
    <circle class="st-ring" cx="60" cy="60" r="52"/>
    <circle class="st-ring" cx="60" cy="60" r="33"/>
    <text><textPath href="#st-path" textLength="262" lengthAdjust="spacing">ONE PERSON · TWO PROGRAMMES · </textPath></text>
    <text class="st-k" x="60" y="79" text-anchor="middle">K</text>
  </svg>`;

function renderLanding() {
  document.body.dataset.view = "landing";
  const calRows = CALENDAR.map((r) => `
    <div class="cal-row">
      <div class="cal-day">${r.day.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
      <div class="cal-yr"><span>${r.y}</span></div>
      <div class="cal-night">${r.night.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
    </div>`).join("");

  app.innerHTML = `
  <main class="landing">
    <h1 class="sr-only">Karam Altabaa, who goes by Karam Tabba on stage</h1>
    <div class="split">
      <section class="half half-tech" data-go="tech" tabindex="0" role="link" aria-label="Enter the programme manager side">
        <div class="half-inner">
          <p class="half-kicker">By day</p>
          <p class="half-first">Karam</p>
          <h2 class="half-surname">Altabaa</h2>
          <p class="half-role">Programme Manager, AI<br>YTL AI Labs</p>
          <p class="half-sub">I work on ILMU, Malaysia's own AI, and make sure the things we build actually ship.</p>
          <p class="half-enter">Open the status report <span aria-hidden="true">→</span></p>
        </div>
        <div class="grid-bg" aria-hidden="true"></div>
      </section>

      <div class="seam" aria-hidden="true">${STAMP}</div>

      <section class="half half-arts" data-go="arts" tabindex="0" role="link" aria-label="Enter the performer side">
        <div class="half-inner">
          <p class="half-kicker">By night</p>
          <p class="half-first">Karam</p>
          <h2 class="half-surname">Tabba</h2>
          <p class="half-role">Writer, director, actor</p>
          <p class="half-sub">25+ productions on the Malaysian stage. One of them has Vikings.</p>
          <p class="half-enter">Take your seat <span aria-hidden="true">→</span></p>
        </div>
        <div class="spotlight-bg" aria-hidden="true"></div>
      </section>

      <button type="button" class="scroll-cue" data-scroll="calendar">The calendar ↓</button>
    </div>

    <section class="calendar" id="calendar" aria-labelledby="cal-h">
      <div class="cal-head">
        <h2 id="cal-h">The calendar</h2>
        <p>Same decade, two programmes. Passport says Altabaa. The playbill says Tabba.</p>
      </div>
      <p class="cal-key" aria-hidden="true"><span class="k-day">By day</span><span class="k-night">By night</span></p>
      <div class="cal-grid">
        <div class="cal-row cal-heads" aria-hidden="true"><div class="cal-col day">By day</div><div></div><div class="cal-col night">By night</div></div>
        ${calRows}
      </div>
    </section>

    <footer class="landing-foot">
      <p class="foot-sign" aria-hidden="true">Karam</p>
      <p>Set in Archivo, Bodoni Moda, Newsreader and Courier Prime. Kuala Lumpur, ${new Date().getFullYear()}.</p>
    </footer>
  </main>`;

  app.querySelectorAll("[data-go]").forEach((el) => {
    el.addEventListener("click", () => navigate(el.dataset.go));
    el.addEventListener("keydown", (e) => { if (e.key === "Enter") navigate(el.dataset.go); });
  });
  app.querySelector("[data-scroll]").addEventListener("click", (e) => {
    const to = document.getElementById(e.currentTarget.dataset.scroll);
    if (to) to.scrollIntoView({ behavior: REDUCED.matches ? "auto" : "smooth", block: "start" });
  });
}

/* --- shared page chrome --- */

function pageHeader(side) {
  const mainBtn =
    side === "arts"
      ? `<button class="btn-solid arts" data-comp>Comp card</button>`
      : `<button class="btn-solid" data-print="resume">Résumé (PDF)</button>`;
  return `
  <header class="page-head">
    <a class="head-name" href="#/" data-nav="">${esc(side === "tech" ? PROFILE.proName : PROFILE.name)}</a>
    <nav class="head-actions">
      <button class="btn-ghost" data-share="${side}">Share this side</button>
      ${mainBtn}
    </nav>
  </header>`;
}

/* Each side keeps its own links only, so sharing one side never leaks the other. */
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
  const tag = side === "tech"
    ? "End of report. Next update: when something ships."
    : "That's the end of the programme. Please switch off your mobile phones.";
  return `
  <footer class="page-foot">
    <p class="foot-tag">${tag}</p>
    <nav class="foot-links">${links.map(([t, h]) => `<a href="${h}" target="_blank" rel="noopener">${t}</a>`).join("")}</nav>
    <p class="foot-sign" aria-hidden="true">Karam</p>
    <p class="foot-copy">© ${new Date().getFullYear()} ${esc(side === "tech" ? PROFILE.proName : PROFILE.name)} · ${esc(PROFILE.location)}</p>
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

/* kanban lanes are statuses (like a real board); domains become tags on the tickets */
const BOARD_COLUMNS = [
  { lane: "inflight", label: "In flight", pill: "● IN FLIGHT", pillClass: "s-inflight" },
  { lane: "shipped", label: "Shipped", pill: "✓ SHIPPED", pillClass: "s-shipped" },
  { lane: "practice", label: "Standard practice", pill: "∞ EVERGREEN", pillClass: "s-evergreen" },
];

/* "a, b and c" */
const prose = (arr) => (arr.length < 3 ? arr.join(" and ") : arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1]);

const secHead = (n, title, note) =>
  `<h2 class="sec-h"><span class="sec-n">${n}</span>${esc(title)}</h2>${note ? `<p class="sec-note">${esc(note)}</p>` : ""}`;

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

  /* kanban board: status lanes, domain tags on tickets */
  const board = BOARD_COLUMNS.map((col) => {
    const items = TECH.highlights.map((h, i) => [h, i]).filter(([h]) => h.lane === col.lane);
    return `
    <div class="kcol kcol-${col.lane}">
      <div class="kcol-head"><span>${esc(col.label)}</span><span class="kcount">${items.length}</span></div>
      ${items.map(([h, i]) => `
        <article class="ticket tcard-click" data-modal="${i}" tabindex="0" role="button" aria-label="Expand ${esc(h.title)}">
          <div class="ticket-top">
            <span class="ticket-id">KRM-${101 + i}<b class="dom">${esc(h.tag)}</b></span>
            <span class="ticket-status ${col.pillClass}">${col.pill}</span>
          </div>
          <h3>${esc(h.title)}</h3>
          <ul class="tcard-bullets">${h.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
          ${linksRow(h.links)}
          <span class="tcard-more">expand →</span>
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

  /* the status report: the date and the RAG line are worked out live from the board */
  const inFlight = TECH.highlights.filter((h) => h.lane === "inflight");
  const today = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const R = TECH.report;
  const report = `
    <aside class="report" aria-label="Programme status report">
      <div class="rp-head"><b>Programme status report</b><span>No. KRM-001</span></div>
      <dl class="rp-rows">
        <div><dt>Programme</dt><dd>${esc(PROFILE.proName)}</dd></div>
        <div><dt>Role</dt><dd>${esc(TECH.role.replace(" · ", ", "))}, ${esc(TECH.org)}</dd></div>
        <div><dt>Reported</dt><dd>${today}</dd></div>
        <div><dt>Status</dt><dd><i class="rag-dot" aria-hidden="true"></i>Green. ${inFlight.length} in flight, 0 blocked</dd></div>
        <div><dt>Shipped</dt><dd><ul>${R.shipped.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></dd></div>
        <div><dt>In flight</dt><dd>${esc(prose(inFlight.map((h) => h.title.split(":")[0])))}</dd></div>
        <div><dt>Risks</dt><dd>${esc(R.risks)}</dd></div>
        <div><dt>Asks</dt><dd>${esc(R.asks)}</dd></div>
      </dl>
      <div class="rp-foot"><span class="rp-sign" aria-hidden="true">Karam</span></div>
      <div class="rp-stamp" aria-hidden="true">ON TRACK</div>
    </aside>`;

  const skillRows = TECH.skills.map((g) => `<div><dt>${esc(g.group)}</dt><dd>${esc(prose(g.items))}.</dd></div>`).join("");
  const credRows = [
    ["Studied", `${TECH.education.degree}, ${TECH.education.school}`],
    ["Certified", prose(TECH.certifications)],
    ["Speaks", prose(TECH.languages)],
  ].map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}.</dd></div>`).join("");

  app.innerHTML = `
  ${pageHeader("tech")}
  <main class="page page-tech">
    <section class="hero-tech">
      <div class="hero-tech-copy">
        <p class="kicker-tech">${esc(TECH.kicker)}</p>
        <h1>${esc(TECH.headline)}</h1>
        ${TECH.lede.map((p) => `<p class="lede">${esc(p)}</p>`).join("")}
        <p class="now"><b>Now</b><span>${esc(TECH.now)}</span></p>
      </div>
      ${report}
    </section>

    <section class="section">
      ${secHead("01", "The board", "Nothing blocked, nothing in review. Click a ticket for the detail, or try to move one.")}
      <div class="kanban">${board}</div>
    </section>

    <section class="section">
      ${secHead("02", "Critical path", "Not to scale. Each bar opens its ticket.")}
      ${cpHTML}
    </section>

    <section class="section">
      ${secHead("03", "Career", "Yes, my career is a Gantt chart. Hover the bars.")}
      <div class="gantt" style="--gl:${(200 / span).toFixed(3)}%">
        <div class="gantt-axis">${ticks.join("")}</div>
        ${rows}
        <div class="gantt-today-wrap" aria-hidden="true"><i class="gantt-today" style="left:${pct(nowY)}%"><span>today</span></i></div>
      </div>
    </section>

    <section class="section">
      ${secHead("04", "Skills")}
      <dl class="skill-list">${skillRows}</dl>
      <dl class="skill-list creds">${credRows}</dl>
    </section>

    <section class="section cta-row">
      <a class="btn-solid" href="${PROFILE.linkedin}" target="_blank" rel="noopener">Connect on LinkedIn</a>
      <button class="btn-ghost" data-print="resume">Download résumé (PDF)</button>
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
        <span class="tcard-tag">${esc(h.tag)}</span>
        <h3 class="modal-title">${esc(h.title)}</h3>
        ${h.story.map((p) => `<p class="modal-p">${esc(p)}</p>`).join("")}
        ${h.wins ? `<h4 class="modal-wins-title">// achievements</h4>
          <ul class="modal-wins">${h.wins.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>` : ""}
        ${linksRow(h.links)}`);
    };
    card.addEventListener("click", show);
    card.addEventListener("keydown", (e) => {
      if (e.target !== card) return; // a link inside the ticket keeps its own Enter/Space
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(); }
    });
  });
  wireCriticalPath();
  wireBoardDrag();
  drawGanttDeps();
  fitGanttNotes();
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
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up); // pen/touch gestures the browser takes over
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
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
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
  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(() => (g.isConnected ? draw() : ro.disconnect())); // stop watching once the page re-renders
    ro.observe(g);
  }
}

/* hover notes are invisible until hovered but still take up layout, so on a narrow screen the
   right-hand ones can push the page wider than the phone. Keep every note inside the chart. */
function fitGanttNotes() {
  const g = document.querySelector(".gantt");
  if (!g) return;
  const fit = () => {
    if (!g.isConnected) return;
    const gr = g.getBoundingClientRect();
    g.querySelectorAll(".gantt-note").forEach((n) => {
      n.style.marginLeft = "0px";
      const r = n.getBoundingClientRect();
      let shift = 0;
      if (r.right > gr.right - 6) shift = gr.right - 6 - r.right;
      if (r.left + shift < gr.left + 6) shift = gr.left + 6 - r.left;
      n.style.marginLeft = shift + "px";
    });
  };
  fit();
  setTimeout(fit, 1700); // after the bars have finished growing in
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit); // notes get wider once the web fonts land
  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(() => (g.isConnected ? fit() : ro.disconnect()));
    ro.observe(g);
    g.querySelectorAll(".gantt-note").forEach((n) => ro.observe(n));
  }
}

/* --- ARTS --- */

const roman = (n) => {
  let r = "";
  for (const [v, s] of [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]])
    while (n >= v) { r += s; n -= v; }
  return r;
};
const spiral = (cx, cy, turns, rMax, steps = 180) => {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * turns * Math.PI * 2, r = (i / steps) * rMax;
    d += `${i ? "L" : "M"}${(cx + r * Math.cos(t)).toFixed(1)} ${(cy + r * Math.sin(t)).toFixed(1)} `;
  }
  return d;
};
const SVG_OPEN = `<svg viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">`;

/* A typeset stand-in for each show's poster, one idea each. Real artwork dropped at
   assets/img/shows/<id>.jpg replaces these automatically (see posterFig). Sizes are in
   cqw (1% of the poster's width) so every poster scales with its frame. */
const POSTER_ART = {
  forkbeard: {
    bg: "#0e2231", fg: "#e8f0f4",
    html: () => {
      const spokes = Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4 + Math.PI / 8;
        return `<line x1="${100 + 14 * Math.cos(a)}" y1="${100 + 14 * Math.sin(a)}" x2="${100 + 70 * Math.cos(a)}" y2="${100 + 70 * Math.sin(a)}"/>`;
      }).join("");
      const wave = (y, o) => `<path d="M-10 ${y} q12.5 -9 25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0" opacity="${o}"/>`;
      return `${SVG_OPEN}<g fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="100" cy="100" r="70" opacity=".55"/><circle cx="100" cy="100" r="57" opacity=".3"/><g opacity=".4">${spokes}</g><circle cx="100" cy="100" r="14" fill="currentColor" fill-opacity=".14" opacity=".8"/>${wave(236, .55)}${wave(248, .4)}${wave(260, .25)}</g></svg>
        <span class="pz-x pz-top">klpac · Oct 2023</span>
        <span class="pz-x pz-big" style="left:6cqw;right:6cqw;top:80cqw;font-size:20.5cqw">Forkbeard</span>
        <span class="pz-x pz-type" style="left:7cqw;right:7cqw;top:101cqw;font-size:3.7cqw;font-weight:700;letter-spacing:.14em;text-transform:uppercase">A Viking Musical Odyssey</span>
        <span class="pz-x pz-bot" style="text-align:right">${roman(2023)}</span>`;
    },
  },
  "relationshit-chronicles": {
    bg: "#f1d3c8", fg: "#1b0f0f",
    html: () => `${SVG_OPEN}<g fill="none" stroke-linejoin="round" stroke-linecap="round"><path d="M100 150 C28 100 36 36 74 36 C90 36 100 48 100 58 C100 48 110 36 126 36 C164 36 172 100 100 150 Z" stroke="currentColor" stroke-width="3"/><path d="M100 58 L91 80 L109 94 L93 112 L106 128 L100 150" stroke="#d3203d" stroke-width="3.2"/></g></svg>
        <span class="pz-x pz-top">klpac · Oct 2026</span>
        <span class="pz-x pz-big" style="left:7cqw;top:60cqw;font-size:17cqw">Relation</span>
        <span class="pz-x pz-big" style="left:7cqw;top:76cqw;font-size:31cqw;color:#d3203d">Sh*t</span>
        <span class="pz-x pz-big" style="left:7cqw;top:107cqw;font-size:10.5cqw">Chronicles</span>
        <span class="pz-x pz-bot">KL Edition</span>`,
  },
  us: {
    bg: "#e9b9a6", fg: "#3b0f12",
    html: () => `${SVG_OPEN}<g style="mix-blend-mode:multiply"><circle cx="78" cy="92" r="58" fill="#3b0f12" fill-opacity=".9"/><circle cx="122" cy="92" r="58" fill="#c0392b" fill-opacity=".85"/></g></svg>
        <span class="pz-x pz-top">klpac · 2025</span>
        <span class="pz-x pz-disp pz-ital" style="left:7cqw;top:78cqw;font-size:56cqw;font-weight:800;line-height:.8">US</span>
        <span class="pz-x" style="left:7cqw;right:7cqw;bottom:6cqw;font-style:italic;font-size:5.2cqw;line-height:1.2">A journey of love, loss &amp; belonging</span>`,
  },
  twisted: {
    bg: "#123127", fg: "#f4e7a1",
    html: () => `${SVG_OPEN}<path d="${spiral(100, 104, 3.2, 86)}" fill="none" stroke="#ffcf3a" stroke-width="2.4" stroke-linecap="round" opacity=".85"/></svg>
        <span class="pz-x pz-top">klpac · Jul 2024</span>
        <span class="pz-x pz-big" style="left:6cqw;top:84cqw;font-size:24.5cqw;transform:rotate(-7deg) skewX(-8deg);transform-origin:left bottom;color:#ffcf3a">Twisted</span>
        <span class="pz-x" style="left:7cqw;right:7cqw;bottom:6cqw;font-style:italic;font-size:5.4cqw;line-height:1.2">A different kind of fairy tale</span>`,
  },
  "his-story": {
    bg: "#ece5d3", fg: "#1c1912",
    html: () => {
      const widths = [150, 120, 160, 90, 140, 110, 155, 70];
      const lines = widths.map((w, i) => `<rect x="26" y="${40 + i * 15}" width="${w}" height="5" fill="${i === 3 ? "#c63a2f" : "currentColor"}" opacity="${i === 3 ? 1 : 0.28}"/>`).join("");
      return `${SVG_OPEN}${lines}</svg>
        <span class="pz-x pz-top">klpac · Feb 2023</span>
        <span class="pz-x pz-type" style="left:7cqw;right:3cqw;top:86cqw;font-size:14.5cqw;font-weight:700;line-height:.95">HIS<br>STORY<span style="color:#c63a2f">_</span></span>
        <span class="pz-x pz-type" style="left:7cqw;right:7cqw;bottom:6cqw;font-size:3.5cqw;letter-spacing:.06em">EIGHT MONOLOGUES, EIGHT WRITERS</span>`;
    },
  },
  "epic-game-show": {
    bg: "#f2c230", fg: "#1a1206",
    html: () => {
      let bulbs = "";
      const bulb = (x, y) => `<circle cx="${x}" cy="${y}" r="3.4"/>`;
      for (let x = 14; x <= 186; x += 14.33) bulbs += bulb(x, 12) + bulb(x, 288);
      for (let y = 26; y <= 274; y += 14.2) bulbs += bulb(12, y) + bulb(188, y);
      return `${SVG_OPEN}<g fill="#fff7cf" stroke="#1a1206" stroke-width="1">${bulbs}</g><rect x="22" y="22" width="156" height="256" fill="none" stroke="#1a1206" stroke-width="1.4"/></svg>
        <span class="pz-x pz-type" style="left:0;right:0;top:19cqw;text-align:center;font-size:5.4cqw;font-weight:700;letter-spacing:.3em">THE</span>
        <span class="pz-x pz-big" style="left:0;right:0;top:26cqw;text-align:center;font-size:38cqw">Epic</span>
        <span class="pz-x pz-big" style="left:0;right:0;top:62cqw;text-align:center;font-size:17.5cqw">Game Show</span>
        <span class="pz-x pz-type" style="left:16cqw;right:16cqw;top:91cqw;text-align:center;background:#c8102e;color:#fff4d6;font-size:5.4cqw;font-weight:700;letter-spacing:.1em;padding:1.6cqw 0">NUHA vs KARAM</span>
        <span class="pz-x pz-type" style="left:0;right:0;bottom:15cqw;text-align:center;font-size:3.5cqw;font-weight:700;letter-spacing:.12em">BOBOKL · NOV 2025</span>`;
    },
  },
  "short-sweet": {
    bg: "#f6f2e8", fg: "#151515",
    html: () => `<span class="pz-x pz-top">Penang · Dec 2021</span>
        <span class="pz-x" style="left:9cqw;top:66cqw;font-size:11cqw;font-weight:600;line-height:1;letter-spacing:-.02em">Short<br><span style="color:#e4572e">+</span><br>Sweet</span>
        <span class="pz-x pz-bot" style="font-weight:400">Theatre Penang 2021</span>`,
  },
  "once-upon-a-time": {
    bg: "#1b2540", fg: "#f0e2bf",
    html: () => {
      const star = (cx, cy, r) => `<path d="M${cx} ${cy - r} Q${cx} ${cy} ${cx + r} ${cy} Q${cx} ${cy} ${cx} ${cy + r} Q${cx} ${cy} ${cx - r} ${cy} Q${cx} ${cy} ${cx} ${cy - r}Z"/>`;
      const nums = ["II", "III", "IV", "V"].map((n, i) => `<text x="${40 + i * 40}" y="96" text-anchor="middle" font-size="8.5" font-family="'Courier Prime', monospace" fill="currentColor" opacity=".8">${n}</text>`).join("");
      return `${SVG_OPEN}<g fill="#d8b25a">${[40, 80, 120, 160].map((x) => star(x, 70, 11)).join("")}</g>${nums}</svg>
        <span class="pz-x pz-top">2021 – 2022</span>
        <span class="pz-x pz-disp pz-ital" style="left:9cqw;top:62cqw;font-size:17cqw;font-weight:500">Once<br>upon<br>a time</span>
        <span class="pz-x pz-bot">Parts II to V</span>`;
    },
  },
  "love-in-georgetown": {
    bg: "#bfe2d8", fg: "#12302a",
    html: () => {
      const house = (i) => {
        const x = 8 + i * 37;
        return `<rect x="${x}" y="190" width="33" height="100" fill="currentColor" opacity="${i % 2 ? 0.2 : 0.3}"/><path d="M${x + 8} 232 v-18 a8.5 8.5 0 0 1 17 0 v18z" fill="#bfe2d8"/><path d="M${x + 8} 272 v-18 a8.5 8.5 0 0 1 17 0 v18z" fill="#bfe2d8"/>`;
      };
      return `${SVG_OPEN}${[0, 1, 2, 3, 4].map(house).join("")}<path d="M100 178 C78 160 80 140 92 140 C97 140 100 144 100 148 C100 144 103 140 108 140 C120 140 122 160 100 178Z" fill="#e0566b"/></svg>
        <span class="pz-x pz-top">George Town · Dec 2020</span>
        <span class="pz-x pz-disp pz-ital" style="left:7cqw;right:7cqw;top:17cqw;font-size:15cqw;font-weight:500">Love in Georgetown City</span>`;
    },
  },
  "tales-from-the-scars": {
    bg: "#151515", fg: "#ececec",
    html: () => {
      const stitches = Array.from({ length: 11 }, (_, i) => {
        const t = 0.03 + (i / 10) * 0.94, x = 30 + t * 140, y = 46 + t * 184;
        return `<line x1="${(x + 6.4).toFixed(1)}" y1="${(y - 4.8).toFixed(1)}" x2="${(x - 6.4).toFixed(1)}" y2="${(y + 4.8).toFixed(1)}"/>`;
      }).join("");
      return `${SVG_OPEN}<path d="M30 46 L170 230" stroke="#262626" stroke-width="26" stroke-linecap="round" fill="none"/><path d="M30 46 L170 230" stroke="#d3203d" stroke-width="2.2" stroke-dasharray="7 5" fill="none"/><g stroke="#d3203d" stroke-width="2.2" stroke-linecap="round">${stitches}</g></svg>
        <span class="pz-x pz-top">Penang · Dec 2020</span>
        <span class="pz-x pz-big" style="left:7cqw;bottom:34cqw;font-size:20cqw">Tales</span>
        <span class="pz-x pz-big" style="left:7cqw;bottom:25cqw;font-size:7.5cqw;letter-spacing:.2em">from the</span>
        <span class="pz-x pz-big" style="left:7cqw;bottom:6cqw;font-size:20cqw;color:#d3203d">Scars</span>`;
    },
  },
};

/* a show with no hand-built poster yet still gets a respectable one */
function genericPoster(s) {
  const hue = [...s.id].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return {
    bg: `hsl(${hue} 30% 16%)`, fg: `hsl(${hue} 40% 88%)`,
    html: () => `<span class="pz-x pz-top">${esc(s.venue)}</span>
      <span class="pz-x pz-disp pz-ital" style="left:8cqw;right:8cqw;bottom:14cqw;font-size:13cqw;font-weight:500">${esc(s.title.split(/:\s+/)[0])}</span>
      <span class="pz-x pz-bot">${esc(s.dates)}</span>`,
  };
}

/* what I did on each show; drives the tag text and the filter */
const SHOW_TAGS = { directed: "Directed", written: "Written", acted: "Acted" };
const tagPills = (s) =>
  `<ul class="pb-tags" aria-label="What I did on this show">${(s.tags || []).map((t) => `<li class="pb-tag">${SHOW_TAGS[t]}</li>`).join("")}</ul>`;

function showFilterHTML() {
  const count = (t) => ARTS.shows.filter((s) => (s.tags || []).includes(t)).length;
  const tab = (key, label, n, on) =>
    `<button type="button" class="pb-filter${on ? " on" : ""}" data-filter="${key}" aria-pressed="${on}">${label}<span class="pb-filter-n">${n}</span></button>`;
  return `<div class="pb-filters" role="group" aria-label="Filter shows by what I did">
    ${tab("all", "All shows", ARTS.shows.length, true)}
    ${Object.entries(SHOW_TAGS).map(([k, label]) => tab(k, label, count(k), false)).join("")}
  </div>`;
}

/* the poster: real artwork if the file exists, otherwise the typeset stand-in */
function posterFig(s) {
  const art = POSTER_ART[s.id] || genericPoster(s);
  const src = s.poster || `assets/img/shows/${s.id}.jpg`; // a show can name its own file (e.g. a .webp)
  return `<figure class="pz-fig">
    <img src="${src}" alt="${esc(s.title)} poster" loading="lazy" onload="this.closest('figure').classList.add('has-img')" onerror="this.remove()" />
    <div class="pz" style="--bg-p:${art.bg};--fg-p:${art.fg}" aria-hidden="true">${art.html()}</div>
    ${s.badge ? `<span class="pz-badge">${esc(s.badge)}</span>` : ""}
  </figure>`;
}

function showCard(s, i) {
  const company = s.company ? `<p class="pb-company">${esc(s.company)}</p>` : "";
  return `
  <article class="show ${s.featured ? "featured" : ""}" data-show="${i}" data-tags="${(s.tags || []).join(" ")}" tabindex="0" role="button" aria-label="Open the programme notes for ${esc(s.title)}">
    ${posterFig(s)}
    <div class="show-body">
      <p class="pb-meta">${esc(s.dates)} · ${esc(s.venue)}</p>
      <h3 class="pb-title">${esc(s.title)}</h3>
      <p class="pb-role">${esc(s.role)}</p>
      ${s.featured ? `${company}<p class="pb-syn">${esc(s.synopsis)}</p>` : ""}
      ${tagPills(s)}
      ${s.featured ? `<span class="pb-open">Read the programme notes →</span>` : ""}
    </div>
  </article>`;
}

function compCardHTML() {
  const c = ARTS.compCard;
  const stats = [["Age", String(ageFrom(PROFILE.born))], ...c.stats];
  return `
    <div class="comp-shots">
      ${c.headshots.map((h, i) => `<img src="${h}" alt="Headshot ${i + 1}" onerror="this.remove()" />`).join("")}
      <div class="comp-shots-fallback">Headshots coming soon</div>
    </div>
    <h3 class="modal-title">${esc(PROFILE.name)}</h3>
    <p class="comp-sub">${esc(c.subtitle)}, ${esc(PROFILE.location)}</p>
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
  const soon = (items) => (items.length ? "Now showing" : "Coming soon");
  app.innerHTML = `
  ${pageHeader("arts")}
  <main class="page page-arts">
    <section class="hero-arts" id="spot">
      <p class="hero-arts-kicker">${esc(ARTS.heroKicker)}</p>
      <h1 class="hero-arts-title">${esc(ARTS.heroTitle)}</h1>
      <p class="hero-arts-sub">${esc(ARTS.heroSub)}</p>
      <div class="stats-row">
        ${ARTS.stats.map((s) => `<div class="stat"><span class="stat-n">${esc(s.n)}</span><span class="stat-l">${esc(s.label)}</span></div>`).join("")}
      </div>
    </section>

    <p class="now-bar"><b>Now</b>${esc(ARTS.now)}</p>

    <section class="section">
      <h2 class="sec-h-arts">The programme <span class="note">(in order of applause)</span></h2>
      ${showFilterHTML()}
      <div class="wall">
        ${ARTS.shows.map(showCard).join("")}
      </div>
    </section>

    <section class="section">
      <h2 class="sec-h-arts">Coming attractions</h2>
      <div class="three-col">
        <div class="side-block">
          <span class="soon">${soon(ARTS.voiceover.items)}</span>
          <h3>Voiceover</h3>
          <p>${esc(ARTS.voiceover.intro)}</p>
          ${ARTS.voiceover.items.map((v) => `<audio controls src="${v.src}" title="${esc(v.title)}"></audio>`).join("")}
        </div>
        <div class="side-block">
          <span class="soon">${soon(ARTS.screen.items)}</span>
          <h3>On screen</h3>
          <p>${esc(ARTS.screen.intro)}</p>
          <nav class="tcard-links"><a href="${PROFILE.youtube}" target="_blank" rel="noopener">${ICONS.globe}<span>YouTube channel</span></a></nav>
        </div>
        <div class="side-block">
          <span class="soon">${soon(ARTS.design.items)}</span>
          <h3>The posters</h3>
          <p>${esc(ARTS.design.intro)}</p>
          <div class="design-grid">
            ${ARTS.design.items.map((d) => `<figure>${img(d.img, d.caption)}<figcaption>${esc(d.caption)}</figcaption></figure>`).join("")}
          </div>
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
      document.querySelectorAll(".show").forEach((card) => {
        card.hidden = key !== "all" && !card.dataset.tags.split(" ").includes(key);
      });
    })
  );

  /* programme notes: poster on the left, notes on the right, photos below if there are any */
  document.querySelectorAll("[data-show]").forEach((card) => {
    const show = (e) => {
      if (e && e.target && e.target.closest("a")) return;
      const s = ARTS.shows[Number(card.dataset.show)];
      open(`
        <div class="ms">
          <div class="ms-poster">${posterFig(s)}</div>
          <div class="ms-text">
            ${tagPills(s)}
            <h3 class="modal-title">${esc(s.title)}</h3>
            <p class="pb-role">${esc(s.role)}</p>
            <p class="pb-meta">${esc(s.dates)} · ${esc(s.venue)}${s.company ? " · " + esc(s.company) : ""}</p>
            <p class="modal-p" style="margin-top:1rem">${esc(s.synopsis)}</p>
            ${(s.more || []).map((p) => `<p class="modal-p">${esc(p)}</p>`).join("")}
            ${linksRow(s.links || (s.link ? [{ label: "Show page", href: s.link }] : []))}
          </div>
        </div>
        ${s.gallery && s.gallery.length ? sliderHTML(s.gallery, s.title) : ""}`, "modal-show");
    };
    card.addEventListener("click", show);
    card.addEventListener("keydown", (e) => {
      if (e.target !== card) return;
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(); }
    });
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
    <button class="print-go" onclick="window.print()">Print / Save as PDF</button>
  </div>
  <p class="print-hint no-print">Choose the <strong>Save as PDF</strong> destination (A4) so the text stays selectable and searchable. "Microsoft Print to PDF" turns words into drawn shapes that recruiter software can't read.</p>`;
}

function maybeAutoPrint() {
  if (store.get("sessionStorage", "autoprint")) {
    store.del("sessionStorage", "autoprint");
    setTimeout(() => window.print(), 500);
  }
}

/* Résumé — roles, bullets and periods come from the same TECH.career as the
   site; headline, summary, skills and credentials are résumé-specific (RESUME in data.js). */
function renderResume() {
  const linkedin = PROFILE.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  const email = PROFILE.email.toLowerCase();
  const contact = [
    RESUME.phone && `<a href="tel:${esc(RESUME.phone.replace(/[^+\d]/g, ""))}">${esc(RESUME.phone)}</a>`,
    `<a href="mailto:${esc(email)}">${esc(email)}</a>`,
    `<a href="${esc(PROFILE.linkedin)}" target="_blank" rel="noopener">${esc(linkedin)}</a>`,
    esc(PROFILE.location),
  ].filter(Boolean).join(" &nbsp;·&nbsp; ");
  const credential = (label, value) => `<p class="r-skill"><strong>${label}</strong> ${value}</p>`;

  document.body.dataset.view = "print";
  app.innerHTML = `
  ${printBar("#/tech")}
  <main class="print-doc resume-doc">
    <header class="r-head">
      <h1>${esc(PROFILE.proName)}</h1>
      <p class="r-title">${esc(RESUME.headline)}</p>
      <p class="r-contact">${contact}</p>
    </header>

    <section>
      <h2>Summary</h2>
      <p class="r-summary">${esc(RESUME.summary)}</p>
    </section>

    <section>
      <h2>Experience</h2>
      ${TECH.career.map((c) => `
        <div class="r-job">
          <div class="r-job-head">
            <h3>${esc(c.resumeRole || c.role)} <span class="r-org">— ${esc(c.org)}</span></h3>
            <span class="r-period">${esc(c.period)}</span>
          </div>
          ${c.resumeBlurb ? `<p class="r-blurb">${esc(c.resumeBlurb)}</p>` : ""}
          <ul>${(c.resumePoints || [c.note]).map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
        </div>`).join("")}
    </section>

    <section>
      <h2>Skills</h2>
      ${RESUME.skills.map((g) => `<p class="r-skill"><strong>${esc(g.group)}</strong> ${g.items.map(esc).join(" · ")}</p>`).join("")}
    </section>

    <section>
      <h2>Credentials</h2>
      ${credential("Education", `${esc(TECH.education.degree)} — ${esc(TECH.education.school)}`)}
      ${credential("Certifications", TECH.certifications.map(esc).join(" · "))}
      ${credential("Languages", RESUME.languages.map(esc).join(" · "))}
      ${credential("Volunteering", esc(RESUME.volunteering))}
    </section>
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
      <h1>${esc(PROFILE.name)}</h1>
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

const REVEAL = ".hero-tech-copy, .sec-h, .sec-note, .sec-h-arts, .kcol, .cp, .gantt, .skill-list, .cta-row, .show, .side-block, .stat, .cal-head, .cal-row:not(.cal-heads)";
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

/* tab titles per page; the résumé and comp card double as the default PDF file name */
const TITLES = {
  tech: () => `${PROFILE.proName}, ${TECH.role}`,
  arts: () => `${PROFILE.name}, writer, director and actor`,
  resume: () => `${PROFILE.proName} Résumé`,
  "comp-card": () => `${PROFILE.name} Comp Card`,
  "": () => `${PROFILE.proName} / ${PROFILE.name}`,
};
/* what the tab says when you wander off to another one */
const AWAY = { tech: "Come back, the report isn't finished", arts: "Places, please", "": "Karam is waiting" };
let pageTitle = document.title;

function route() {
  const h = location.hash.replace(/^#\/?/, "").toLowerCase();
  document.body.style.overflow = ""; // in case a modal was open
  if (h === "tech") { currentRoute = "tech"; renderTech(); }
  else if (h === "arts") { currentRoute = "arts"; renderArts(); }
  else if (h === "resume") { currentRoute = "resume"; renderResume(); }
  else if (h === "comp-card") { currentRoute = "comp-card"; renderCompPrint(); }
  else { currentRoute = ""; renderLanding(); }
  pageTitle = document.title = TITLES[currentRoute]();
  window.scrollTo({ top: 0, behavior: "instant" });
  initReveal();
  updateProgress();
}

document.addEventListener("visibilitychange", () => {
  if (currentRoute === "resume" || currentRoute === "comp-card") return;
  document.title = document.hidden ? AWAY[currentRoute] : pageTitle;
});

/* ---------- theme: follows the system until the user picks one ---------- */

const themeToggle = document.getElementById("themeToggle");
const sysLight = window.matchMedia("(prefers-color-scheme: light)");
let themePref = store.get("localStorage", "theme"); // 'light' | 'dark' | null = follow system

function currentTheme() {
  return themePref || (sysLight.matches ? "light" : "dark");
}
const ICON_SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const ICON_MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></svg>';
function refreshTheme() {
  const light = currentTheme() === "light";
  document.body.classList.toggle("light", light);
  themeToggle.innerHTML = light ? ICON_MOON : ICON_SUN;
  themeToggle.title = light ? "Switch to dark" : "Switch to light";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = light ? "#e9e8e1" : "#0c1117";
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

/* for whoever opens the console */
console.log("%cKaram Altabaa / Karam Tabba", "font: italic 700 15px Georgia");
console.log("Reading the source? You'd make a good stage manager. karamtabba@gmail.com");
