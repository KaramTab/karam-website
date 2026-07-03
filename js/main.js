/* Router + renderers. Content lives in js/data.js. */

const app = document.getElementById("app");
const transition = document.getElementById("transition");
const toast = document.getElementById("toast");

/* ---------- helpers ---------- */

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

/* ---------- transition between sides ---------- */

let currentRoute = null;

function navigate(route) {
  if (route === currentRoute) return;
  const theme = route === "tech" ? "t-tech" : route === "arts" ? "t-arts" : "t-split";
  transition.className = theme + " closing";
  setTimeout(() => {
    location.hash = route ? `#/${route}` : "#/";
    window.scrollTo(0, 0);
    transition.className = theme + " opening";
    setTimeout(() => (transition.className = ""), 650);
  }, 450);
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
  return `
  <header class="page-head">
    <a class="head-name" href="#/" data-nav="">${esc(PROFILE.name)}</a>
    <nav class="head-actions">
      <button class="btn-ghost" data-share="${side}">Share this side</button>
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
          ["Fiverr", PROFILE.fiverr],
          ["Email", "mailto:" + PROFILE.email],
        ];
  return `
  <footer class="page-foot">
    <p class="foot-tag">${side === "tech" ? "This site was project-managed, obviously." : "No intermission. Scroll again from the top."}</p>
    <nav class="foot-links">${links.map(([t, h]) => `<a href="${h}" target="_blank" rel="noopener">${t}</a>`).join("")}</nav>
    <p class="foot-copy">© ${new Date().getFullYear()} ${esc(PROFILE.name)} · ${esc(PROFILE.location)}</p>
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

function renderTech() {
  document.body.dataset.view = "tech";
  const years = { min: 2016, max: new Date().getFullYear() + 1 };
  const span = years.max - years.min;
  const pct = (y) => (((y ?? years.max) - years.min) / span) * 100;

  const ticks = [];
  for (let y = years.min; y <= years.max; y += 2) {
    ticks.push(`<span class="gantt-tick" style="left:${pct(y)}%">${y}</span>`);
  }

  const rows = TECH.career.map((c) => `
    <div class="gantt-row">
      <div class="gantt-label">
        <strong>${esc(c.role)}</strong>
        <span>${esc(c.org)}</span>
      </div>
      <div class="gantt-track">
        <div class="gantt-bar ${c.end === null ? "ongoing" : ""}" style="left:${pct(c.start)}%; width:${pct(c.end) - pct(c.start)}%">
          <span class="gantt-note">${esc(c.note)}</span>
        </div>
      </div>
    </div>`).join("");

  app.innerHTML = `
  ${pageHeader("tech")}
  <main class="page page-tech">
    <section class="hero-tech">
      <div class="terminal" aria-label="terminal introduction">
        <div class="term-bar"><i></i><i></i><i></i><span class="mono">karam@ytl-ai-labs:~</span></div>
        <pre class="term-body mono" id="term"></pre>
      </div>
      <div class="hero-tech-copy">
        <p class="mono kicker-tech">// ${esc(TECH.role)} — ${esc(TECH.org)}</p>
        <h1>Ambitious, messy, cross-functional?<br><span class="accent">Shipped.</span></h1>
        <p class="lede">${esc(TECH.summary)}</p>
      </div>
    </section>

    <section class="section">
      <h2 class="sec-title mono">/highlights — <span class="dim">click a card for the full story</span></h2>
      <div class="cards-grid">
        ${TECH.highlights.map((h, i) => `
          <article class="tcard tcard-click" data-modal="${i}" tabindex="0" role="button" aria-label="Expand ${esc(h.title)}">
            <span class="tcard-tag mono">${esc(h.tag)}</span>
            <h3>${esc(h.title)}</h3>
            <ul class="tcard-bullets">${h.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
            <span class="tcard-more mono">expand →</span>
          </article>`).join("")}
      </div>
    </section>

    <section class="section">
      <h2 class="sec-title mono">/career — <span class="dim">yes, the timeline is a Gantt chart</span></h2>
      <div class="gantt">
        <div class="gantt-axis">${ticks.join("")}</div>
        ${rows}
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
        <p><strong>${esc(TECH.education.degree)}</strong> · ${esc(TECH.education.school)}</p>
        <p class="mono dim">${TECH.languages.map(esc).join(" · ")}</p>
      </div>
    </section>

    <section class="section cta-row">
      <a class="btn-solid" href="${PROFILE.linkedin}" target="_blank" rel="noopener">Connect on LinkedIn</a>
      <a class="btn-ghost" href="${PROFILE.github}" target="_blank" rel="noopener">GitHub</a>
      <button class="btn-ghost" data-share="tech">Copy link to this side</button>
    </section>
  </main>
  <div class="modal-overlay" id="modal" hidden>
    <div class="modal" role="dialog" aria-modal="true">
      <button class="modal-close" aria-label="Close">✕</button>
      <div class="modal-body"></div>
    </div>
  </div>
  ${pageFooter("tech")}`;

  wirePage();
  wireModal();
  typeTerminal();
}

function wireModal() {
  const overlay = document.getElementById("modal");
  const body = overlay.querySelector(".modal-body");

  const open = (h) => {
    body.innerHTML = `
      <span class="tcard-tag mono">${esc(h.tag)}</span>
      <h3 class="modal-title">${esc(h.title)}</h3>
      ${h.story.map((p) => `<p class="modal-p">${esc(p)}</p>`).join("")}
      ${h.wins ? `<h4 class="modal-wins-title mono">// achievements</h4>
        <ul class="modal-wins">${h.wins.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>` : ""}
      ${h.links ? `<nav class="tcard-links">${h.links.map((l) => `<a href="${l.href}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("")}</nav>` : ""}`;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    overlay.querySelector(".modal-close").focus();
  };
  const close = () => {
    overlay.hidden = true;
    document.body.style.overflow = "";
  };

  document.querySelectorAll("[data-modal]").forEach((card) => {
    const show = () => open(TECH.highlights[Number(card.dataset.modal)]);
    card.addEventListener("click", show);
    card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(); } });
  });
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  overlay.querySelector(".modal-close").addEventListener("click", close);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !overlay.hidden) close(); });
}

function typeTerminal() {
  const el = document.getElementById("term");
  if (!el) return;
  const lines = TECH.heroLines;
  let li = 0, ci = 0, out = "";
  (function tick() {
    if (li >= lines.length) { el.textContent = out; return; }
    const line = lines[li];
    ci++;
    if (ci > line.length) { out += line + "\n"; li++; ci = 0; setTimeout(tick, line.startsWith(">") ? 120 : 420); }
    else { el.textContent = out + line.slice(0, ci) + "▌"; setTimeout(tick, line.startsWith(">") ? 34 : 12); return; }
    el.textContent = out + "▌";
  })();
}

/* --- ARTS --- */

function showCard(s) {
  const badge = s.badge ? `<span class="pb-badge">${esc(s.badge)}</span>` : "";
  const company = s.company ? `<p class="pb-company serif-it">${esc(s.company)}</p>` : "";
  const link = s.link ? `<a class="pb-link" href="${s.link}" target="_blank" rel="noopener">Show page ↗</a>` : "";
  return `
  <article class="playbill ${s.featured ? "featured" : ""}">
    <figure class="pb-art">
      ${img(`assets/img/shows/${s.id}.jpg`, s.title + " poster")}
      <figcaption class="pb-monogram serif" aria-hidden="true">${esc(s.title.slice(0, 1))}</figcaption>
    </figure>
    <div class="pb-body">
      ${badge}
      <p class="pb-role mono">${esc(s.role).toUpperCase()}</p>
      <h3 class="pb-title serif">${esc(s.title)}</h3>
      <p class="pb-meta">${esc(s.dates)} · ${esc(s.venue)}</p>
      ${company}
      <p class="pb-syn">${esc(s.synopsis)}</p>
      ${link}
    </div>
  </article>`;
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
  ${pageFooter("arts")}`;

  wirePage();

  /* spotlight follows the cursor in the hero */
  const spot = document.getElementById("spot");
  spot.addEventListener("pointermove", (e) => {
    const r = spot.getBoundingClientRect();
    spot.style.setProperty("--sx", `${((e.clientX - r.left) / r.width) * 100}%`);
    spot.style.setProperty("--sy", `${((e.clientY - r.top) / r.height) * 100}%`);
  });
}

/* ---------- boot ---------- */

function route() {
  const h = location.hash.replace(/^#\/?/, "").toLowerCase();
  currentRoute = h === "tech" || h === "arts" ? h : "";
  if (currentRoute === "tech") renderTech();
  else if (currentRoute === "arts") renderArts();
  else renderLanding();
}

window.addEventListener("hashchange", route);
route();
