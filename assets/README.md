# Assets — where everything goes

Replace a file by dropping in a new one with **the same name**; the site picks
it up automatically.

| Folder | File | What it is | Status |
|---|---|---|---|
| `images/` | `desktop-bg.png` | Desktop background (harbour photo) | ✅ |
| `images/` | `me.png` | Photo in the About Me window | ✅ |
| `images/` | `mywork-cover.png` | Cover image, top-left of My Work | ✅ |
| `icons/` | `about.svg`, `my-work.svg`, `music.svg`, `contact.svg` | Desktop icons (traced pixel-perfect from your PNGs) | ✅ |
| `icons/` | `close.svg` | Red pixel X on every window | ✅ |
| `icons/` | `cursor.svg` | Pixel arrow mouse cursor | ✅ |
| `icons/` | `typewriter.svg` | Substack icon on the desktop (old quill icon kept in `originals/`) | ✅ |
| `icons/` | `umbrella.svg`, `umbrella-32.png` | Dama de la Primavera tab icon (window icon kept in `originals/`) | ✅ |
| `icons/` | `portrait.svg` | Framed portrait above your info on the My Work page + that tab's favicon (`work-favicon-32.png`, `work-apple-touch-icon.png`) | ✅ |
| `icons/` | `favicon-32.png`, `apple-touch-icon.png` | Browser-tab icon + phone home-screen icon (the pixel computer; the tab also uses `about.svg`) | ✅ |
| `icons/` | `pen.svg`, `x-black.svg` | Spare icons, not used yet | — |
| `icons/originals/` | `*.png` | Your original icon images (incl. `newspaper.png`) | reference only |
| `resume/` | `resume.pdf` | Résumé shown in RESUME.PDF + Download | ✅ |
| `fonts/` | `pixelated-times`, `w95fa`, `seratonin` | Fonts (each with its licence) | ✅ |
| `music/` | your songs (`.mp3`, `.m4a`, `.wav`) | Music player tracks (Angelo's Mix — 7 songs) | ✅ |
| `covers/` | square images | Optional album art per song | empty |
| `photos/` | any `.jpg` / `.png` | Photos app gallery: australia, face-a, sunset (list them under `photos` in `js/config.js`) | ✅ |
| `junk/` | images, GIFs, videos (`.mp4`/`.webm`/`.mov`), notes (`.txt`/`.md`) | Junk folder — list them under `junk` in `js/config.js` (audio: .mp3/.m4a/.wav) | ✅ 6 items |
| `work/pedro/`, `work/dama/`, `work/face-a/`, `work/unbound/` | each project's PDF, images, optional video | My Work project pages — list them on the project in `js/config.js` (`pdf`, `images`, `video`, `links`) | ⏳ waiting on your files |
| `icons/` | `junk.png` | Junk folder icon (overflowing suitcase; trash can kept in `originals/`) | ✅ |
| `icons/` | `photos.svg`, `globe.svg`, `minesweeper.svg` | Fun-app icons (camera, globe, mine) | ✅ |

## Adding songs
1. Put the files in `music/` (and optional square covers in `covers/`).
2. Open `js/config.js` and list them under `tracks`, e.g.
   `{ title: 'Song Name', artist: 'Artist', src: 'assets/music/song.mp3', cover: 'assets/covers/song.jpg' }`
3. Optionally give it a `disc` colour (see the other songs for examples).

Only publish songs you own or have the rights to.

## Font licences
- **Pixelated Times New Roman** — FontStruct *non-commercial* licence. Keep `license.txt` + `readme.txt` next to the font.
- **W95FA** — SIL Open Font License, free for anything.
- **Seratonin** — *demo* licence (personal use). Not used on the site yet.

## Other settings (`js/config.js`)
- `substackUrl` — your Substack link (empty for now)
- `email` — where Contact Me sends people
- `projects` — the My Work bands (title, date, colours, link)
