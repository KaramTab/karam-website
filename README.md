# Karam Altabaa / Karam Tabba — Personal Site

> *"I run programmes by day. I appear in them by night."*

One person, two programmes. The **day** side is a programme status report (AI programme
management at YTL AI Labs, ILMU, Ryt AI). The **night** side is a theatre programme
(writer, director, actor). Passport says Altabaa; the playbill says Tabba. The landing page
lets a visitor pick a side, and each side has its own shareable deep link.

## Shareable links

| Audience | Link to share |
|---|---|
| Everyone (split landing + the two-career calendar) | `https://<your-domain>/` |
| Tech conference crowd | `https://<your-domain>/#/tech` |
| Theatre & creative crowd | `https://<your-domain>/#/arts` |
| Recruiters (printable résumé) | `https://<your-domain>/#/resume` |
| Casting agencies (printable comp card) | `https://<your-domain>/#/comp-card` |

The résumé and comp card are generated from the same `js/data.js` content as the site, so
updating your experience there updates the PDFs too. The "PDF" buttons open a print-ready
page and trigger the browser's Print dialog. **Choose "Save as PDF" (A4)**, not
"Microsoft Print to PDF", or the text turns into drawn shapes that recruiter software can't read.

Each side also has a **"Share this side"** button that copies the right link.

## Editing content

Everything editable lives in **one file: [`js/data.js`](js/data.js)**.

| Block | What it controls |
|---|---|
| `PROFILE` | Names, links, email, birthday (the comp-card age is computed from it) |
| `CALENDAR` | The year-by-year "two careers on one spine" on the landing page |
| `TECH` | Day side: `headline`, `lede`, the status `report`, the `now` line, board `highlights`, `career` (feeds the Gantt **and** the résumé), `skills` |
| `RESUME` | Résumé-only text: headline, summary, skills, languages, phone |
| `ARTS` | Night side: hero text, the `now` line, comp card, and `shows` |

Two lines to keep fresh: **`TECH.now`** and **`ARTS.now`**. They say what is happening *now*,
and go stale quietly.

Shows render in array order (most prominent first; the first one is the big feature),
so reorder the array to reorder the page.

### Keeping it sounding like a person

- First person, plain words, say the specific thing. "Four shows, four sold out" beats "a smash hit".
- British spelling (programme, organised). Go easy on dashes, lists of three and slogans.
- If a sentence could be on anyone's website, rewrite it until it could only be on yours.

## Adding images & media

See [`IMAGES.md`](IMAGES.md) for the exact filenames. Short version: put **portrait** show
posters (about 2:3) at `assets/img/shows/<show-id>.jpg` and they fade in over the typeset
stand-in automatically. Every show already has a hand-built stand-in poster (see
`POSTER_ART` in `js/main.js`); a show added to `data.js` without one gets a generic poster.

## Running locally

It's a plain static site: no build step, no dependencies. Serve it properly:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

When you change `css/` or `js/`, bump the `?v=` numbers in `index.html` so browsers
fetch the new files.

## Deploying (GitHub Pages, free)

1. Push this repo to GitHub (public).
2. Repo → **Settings → Pages** → Source: *Deploy from a branch* → `main` / `(root)`.
3. Site goes live at `https://<username>.github.io/<repo>/`.
4. Optional: buy a domain later and point it there under the same Pages settings.

## Privacy note

Phone number and home address are deliberately **not** on this site, because it's public.
Contact goes through email, LinkedIn and Instagram only. Leave `RESUME.phone` empty in the
repo; type it in locally just before you export a PDF, and don't commit it.

`js/data.js` also holds the résumé bullets (billing models, tenders, and so on). Check that
anything in `resumePoints` is fine to publish before the repo goes public.

## Design notes

- **Day side:** Archivo + IBM Plex Mono, ruled paper, YTL blue as the one ink. The hero is a
  status report because that's the artefact of the job.
- **Night side:** Bodoni Moda, Newsreader and Courier Prime (the typewriter face of a script),
  with Anton for poster caps. The hero is a stage: truss, follow spot, wooden floor.
- House rules: flat colour, no gradient text, no glass blur, squared corners, no emoji.
- Hash-based routing (`#/tech`, `#/arts`) so it works on any static host with zero configuration.
