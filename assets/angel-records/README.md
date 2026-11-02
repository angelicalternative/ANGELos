# Angel Records art and photos

Everything for `records.html` lives here. It's separate from the rest of the site:
the desktop's Photos and music player don't use any of these files.

Until a file exists, the game shows a labelled placeholder box with its name, so you can
drop files in one at a time with exactly these names.

## Photos of the places (`places/`)

Real photos of each place: any normal JPG or PNG, any size. The page pixelates them
automatically, so they match the pixel style. Use your own photos, or ones you have the
rights to use.

| File | What it should show | Used for |
|---|---|---|
| `singapore.jpg` | Singapore streets or skyline | The view through Slow Boat's window, and the shop picker |
| `bangkok.jpg` | Bangkok streets | Bangkok shop window + picker |
| `ubud.jpg` | Ubud, Bali | Ubud shop window + picker |
| `sydney.jpg` | Sydney | Sydney shop window + picker |
| `paris.jpg` | Paris | Paris shop window + picker |
| `el-retiro.jpg` | El Retiro, Colombia | El Retiro shop window + picker |
| `singapore-merlion.jpg` | The Merlion | Loading screen card |
| `singapore-hawker.jpg` | A hawker centre | Loading screen card |
| `bangkok-tuktuk.jpg` | A tuk-tuk | Loading screen card |
| `bangkok-temple.jpg` | A temple roof | Loading screen card |
| `ubud-rice.jpg` | Rice terraces | Loading screen card |
| `ubud-monkey.jpg` | A monkey in the Monkey Forest | Loading screen card |
| `sydney-opera.jpg` | The Opera House | Loading screen card |
| `sydney-harbour.jpg` | The Harbour Bridge | Loading screen card |
| `paris-eiffel.jpg` | The Eiffel Tower | Loading screen card |
| `paris-cafe.jpg` | A café terrace | Loading screen card |
| `el-retiro-plaza.jpg` | El Retiro's main square | Loading screen card |
| `el-retiro-mountains.jpg` | The green mountains around El Retiro | Loading screen card |

Each loading card's caption is in `js/records-config.js` (`intro.captions`).

## Pixel art (PNG, drawn at 1× on the game's 320×240 grid)

| File | Size | What it is |
|---|---|---|
| `shop-singapore.png`, `shop-bangkok.png`, `shop-ubud.png`, `shop-sydney.png`, `shop-paris.png`, `shop-el-retiro.png` | 320×240 | Each shop's room. Leave the bottom ~70px as floor (crates sit there) and the counter area at x 100–220, y 120–152 (the shopkeeper stands behind it). Leave the window at x 18–90, y 30–88 see-through if you want the place photo to show |
| `crate.png` | 96×56 | A record crate (the label is added on top) |
| `crate-open.png` | 320×240 | Close-up background while flipping through a crate |
| `sleeve-<record id>.png` | 64×64 | Your own sleeve art for each special record (never the real cover) |
| `sleeve-locked.png` | 64×64 | "?" sleeve for records not found yet |
| shopkeeper sprite (any name) | 56×70 | Optional: replaces the drawn sun mascot. Set `owner.sprite` in the config |

Drawn in code for now (send art any time to swap it in): the ordinary sleeves, the spinning
vinyl, the sparkle, the "FOUND IT!" burst, the dust and the chrome logo.
