# Image & Media Shopping List

Drop files at these exact paths and they appear on the site automatically, with no code
changes. JPG preferred, roughly the sizes noted (bigger is fine, but keep each under ~400 KB).

## Show posters: `assets/img/shows/` (**portrait, about 2:3**, e.g. 800×1200)

Every show has a typeset stand-in poster. Real artwork fades in over it the moment the file
exists, so a missing file never breaks anything. The frame is just under A4 proportions
(73:100); A4 and 3:4 posters both fit with at most ~3% trimmed at the edges.

**All 13 shows have real posters now.** Most were pulled from each show's CloudJoi page; Tears,
Short+Sweet and Once Upon A Time (the Part 3 poster) are the `.webp` files you sent. The
typeset stand-ins only appear if a file goes missing, or for a new show you add before its
poster exists.

If a show's file has a different name or type (like the `.webp` ones), set
`poster: "assets/img/shows/whatever.webp"` on that show in `js/data.js`.

## Show photo galleries (the slider under the programme notes)

Each show's pop-up can show a photo slider below the notes. Tears (the Sgt. John character
poster), Short+Sweet and Once Upon A Time already use it. To add more, put production photos in
`assets/img/shows/` (any filenames, landscape works best here) and register them in that
show's `gallery` list in `js/data.js`:

```js
gallery: ["assets/img/shows/forkbeard-1.jpg", "assets/img/shows/forkbeard-2.jpg"],
```

With no gallery, the pop-up simply shows the poster and the notes.

## Comp card headshots: `assets/img/comp/` (portrait 3:4)

| File | What |
|---|---|
| `headshot-1.jpg` | Clean neutral headshot |
| `headshot-2.jpg` | Character / expressive shot |
| `headshot-3.jpg` | Full-body or ¾ shot |

These appear in the Comp Card pop-up (button in the performer page header), alongside your
stats (age auto-updates from your birthday).

## Design portfolio: `assets/img/design/`

Your marketing material, especially the **Forkbeard campaign** (posters, socials, banners).
Any filenames; then add them to `ARTS.design.items` in `js/data.js`:

```js
items: [
  { img: "assets/img/design/forkbeard-poster.jpg", caption: "Forkbeard, main poster" },
],
```

## Voiceover samples: `assets/audio/`

MP3 clips (30–60 s each is plenty). Then register them in `js/data.js`:

```js
voiceover: { items: [
  { title: "Commercial reel", src: "assets/audio/vo-commercial.mp3" },
]}
```

The "Coming soon" label on that panel switches to "Now showing" by itself.

## Ad / screen work

If you have video links (YouTube etc.), send them over and we'll embed. If you have files,
we'll host short clips or link out.

## A note on the browser console

Each missing poster file shows up as a 404 in the browser console. That's the drop-in
design doing its job, not a bug; the 404s vanish as you add the files.
