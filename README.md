# Karam Altabaa — Personal Site

> *"I run programmes by day. I appear in them by night."*

A dual-identity bio site. One side for the **AI Programme Manager** (YTL AI Labs, ILMU),
one side for the **performer** (writer / director / actor). The landing page lets a visitor
pick a side; each side has its own shareable deep link.

## Shareable links

| Audience | Link to share |
|---|---|
| Everyone (split landing) | `https://<your-domain>/` |
| Tech conference crowd | `https://<your-domain>/#/tech` |
| Theatre & creative crowd | `https://<your-domain>/#/arts` |

Each side also has a **"Share this side"** button that copies the right link.

## Editing content

Everything editable lives in **one file: [`js/data.js`](js/data.js)**.
Shows, career history, skills, synopses, links — change the text there and refresh.
Shows render in array order (most prominent first), so reorder the array to reorder the page.

## Adding images & media

See [`IMAGES.md`](IMAGES.md) for the exact filenames to drop in. Short version:
put show posters at `assets/img/shows/<show-id>.jpg` and they appear automatically —
until then each card shows a styled monogram placeholder.

## Running locally

It's a plain static site — no build step, no dependencies. Either double-click
`index.html`, or serve it properly:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Deploying (GitHub Pages — free)

1. Push this repo to GitHub (public).
2. Repo → **Settings → Pages** → Source: *Deploy from a branch* → `main` / `(root)`.
3. Site goes live at `https://<username>.github.io/<repo>/`.
4. Optional: buy a domain later and point it there under the same Pages settings.

## Privacy note

Phone number and home address from the resume are deliberately **not** on this site —
it's public. Contact goes through email, LinkedIn, and Instagram only.

## Stack

Vanilla HTML/CSS/JS. Hash-based routing (`#/tech`, `#/arts`) so it works on any static
host with zero configuration. Fonts: Fraunces (stage), Space Grotesk + JetBrains Mono (tech).
