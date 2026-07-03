# Image & Media Shopping List

Drop files at these exact paths and they appear on the site automatically —
no code changes needed. JPG preferred, roughly the sizes noted (bigger is fine).

## Show posters — `assets/img/shows/` (landscape ~1200×800, or your actual poster art)

| File | Show | Priority |
|---|---|---|
| `forkbeard.jpg` | Forkbeard: A Viking Musical Odyssey | ⭐ HIGHEST — it's the featured card |
| `us.jpg` | US: A Journey of Love, Loss & Belonging | High |
| `twisted.jpg` | TWISTED: A Different Kind of Fairy Tale | High |
| `his-story.jpg` | His Story | High |
| `epic-game-show.jpg` | The Epic Game Show with Nuha & Karam | High |
| `short-sweet.jpg` | Short+Sweet Penang 2021 | Medium |
| `once-upon-a-time.jpg` | Once Upon A Time series | Medium |
| `love-in-georgetown.jpg` | Love in Georgetown City | Medium |
| `tales-from-the-scars.jpg` | Tales from the Scars | Medium |

Best sources: your CloudJoi/klpac show pages, your own poster files (ideal — you designed them),
or production photos where you're visible on stage.

## Show photo galleries (for the pop-up detail sliders)

Each show's pop-up has an image slider. Send me a few production photos per show
(any filenames), and I'll drop them in `assets/img/shows/` and register them in the
show's `gallery` list in `js/data.js`, e.g.:

```js
gallery: ["assets/img/shows/forkbeard-1.jpg", "assets/img/shows/forkbeard-2.jpg"],
```

Until then, the slider falls back to the show's poster (or a monogram).

## Comp card headshots — `assets/img/comp/` (portrait 3:4)

| File | What |
|---|---|
| `headshot-1.jpg` | Clean neutral headshot |
| `headshot-2.jpg` | Character / expressive shot |
| `headshot-3.jpg` | Full-body or ¾ shot |

These appear in the Comp Card pop-up (button in the performer page header),
alongside your stats (age auto-updates from your birthday).

## Portraits (nice-to-have, for future hero upgrades)

| File | What |
|---|---|
| `assets/img/portrait-tech.jpg` | You in work mode — conference, office, ILMU launch, lanyard energy |
| `assets/img/portrait-arts.jpg` | You on stage — costume, spotlight, mid-performance |

Two portraits of the same person looking like two different people = the whole thesis of the site.

## Design portfolio — `assets/img/design/`

Your marketing material — especially the **Forkbeard campaign** (posters, socials, banners).
Any filenames; then add them to `ARTS.design.items` in `js/data.js`:

```js
items: [
  { img: "assets/img/design/forkbeard-poster.jpg", caption: "Forkbeard — main poster" },
],
```

## Voiceover samples — `assets/audio/`

MP3 clips (30–60s each is plenty). Then register them in `js/data.js`:

```js
voiceover: { items: [
  { title: "Commercial reel", src: "assets/audio/vo-commercial.mp3" },
]}
```

## Ad / screen work

If you have video links (YouTube etc.) send them over — we'll embed. If you have files,
we'll host short clips or link out.
