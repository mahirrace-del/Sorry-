# Antigravity Handoff — Until You Hold My Hand (Interactive Movie-Game)

Last updated: 26 October 2026 (Complete Fullscreen Interactive Movie-Game Build)

## Project overview

*Until You Hold My Hand* has been rebuilt from a webpage-style prototype into a **fullscreen interactive animated movie-game** for Nidhi (`N-I-D-H-I`). There is zero website header, zero webpage title card, zero wall-of-text paragraphs, and zero backend/analytics/tracking.

## What changed in this build

1. **Pure-Black Mr. Bean Opening Drop (`index.html`, `styles.css`, `app.js`)**:
   - Opens on a **100% pure black screen** (`#020307`) with zero visible text or buttons.
   - An overhead theatrical spotlight clicks on, and the character drops straight down from above the ceiling into the warm pool of light, lands crouched with a soft dust ring, slowly stands up, looks directly at Nidhi, waves *"Hi…"*, walks forward toward the camera, and extends his **3D foreshortened hand into the bottom-right corner**.
2. **Real Portrait Likeness + Sharp Dark-Navy Open Jacket Puppet Rig (`assets/avatar/owner-head-cutout.png`, `index.html`, `app.js`)**:
   - Extracted a clean, zero-halo transparent cutout of the owner's face, swept black hair, ears, light moustache, and chin beard directly from `assets/avatar/owner-avatar-chatgpt-base.png` into `assets/avatar/owner-head-cutout.png` (leaving all original reference/generated files in `assets/avatar/` untouched).
   - Paired the high-res face cutout (with aligned natural eyelid blinking and subtle speaking lip motion) onto a 60fps skeletal SVG puppet body dressed in a **sharp dark navy/charcoal open collared jacket over a crisp white crew-neck tee, dark slim tailored trousers, and clean sneakers with cream soles**.
   - The character walks, sits, nods sleepily in online class, wires the circuit houses, strums an acoustic guitar on the rooftop, matches steps in a power cut, rides the sunset river boat, shrugs calmly at the boatman's overcharge, rides in the twilight rickshaw, gestures at the "love teacher" board, holds up the framed chocolate wrapper, talks on the November 2023 night call, stands humbly (with an optional playful cushioned foam-helmet `"BONK!"`), and gently offers a blooming flower at the open ending.
3. **Bottom-Right 3D Hand Portal & Gentle Dark-Spotlight Pause Return**:
   - Holding the **bottom-right 3D outstretched hand** (`#hand-portal`) walks into the warm **Memory Book Room**, opens the glowing Memory Book, zooms the camera into its pages, and plays through all 13 vivid, colorful chapters automatically.
   - Releasing the hand mid-movie freezes the exact millisecond of scene animation and voice playback, dims back to the dark theatrical spotlight, walks the character gently toward the camera (*"Why did you let go of my hand? Hold it when you're ready."*), and reaches his hand back to the bottom-right corner—warm and gentle, never angry or guilting.
   - Discreet zero-guilt controls (`Auto / Hands-free`, `Chapters`, `CC` 1-line subtitles, `♪` mute, `Motion`, and `✕ Leave quietly`) ensure Nidhi is never trapped and can watch hands-free, skip chapters, or exit peacefully at any time.
4. **Zero-Text Visual Narrative + Plug-and-Play Voice & Photo Frame System (`content/story.json`, `app.js`)**:
   - Zero story paragraphs appear on screen; an optional `[CC]` toggle displays crisp 1-line cinema subtitles.
   - Every scene has a plug-and-play voice slot (`assets/voice/*.mp3`) and Memory Book photo/letter frames (`assets/photos/*`), including a full 6-frame open Memory Book two-page spread in Chapter X (`letters-and-years`).

---

## How to preview locally

From `c:\Users\Mahir Rahman\Desktop\sorry`, run:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000` in Chrome, Edge, Safari, or mobile browsers on your local Wi-Fi.

---

## How to add your real photos (`assets/photos/`)

Drop your real `.jpg`, `.jpeg`, `.png`, or `.webp` images directly into `assets/photos/` using the filenames below:

| Filename in `assets/photos/` | Movie Chapter | Where it appears |
|---|---|---|
| `school-days.jpg` | I — *Before we really noticed each other* | Top-left Polaroid frame |
| `science-project.jpg` | II — *The paper house* | Top-right Polaroid frame (circuit houses / tiny paper sofa) |
| `rooftop-song.jpg` | III — *Across the rooftops* | Top-left Polaroid frame |
| `coaching-days.jpg` | IV — *Our own little language* | Top-right Polaroid frame |
| `river-sunset.jpg` | V — *The river and our very detailed plan* | Top-left Polaroid frame |
| `best-friends.jpg` | VI — *Best friends, before we had the words* | Top-right Polaroid frame |
| `chocolate-wrapper.jpg` | VIII — *The chocolate wrapper* | Top-left Polaroid frame |
| `november-night.jpg` | IX — *The night our feelings had words* | Top-right Polaroid frame |
| `memory-01.jpg` .. `memory-04.jpg` | X — *All the little chapters after that* | Open Memory Book two-page spread (4 photo frames) |
| `letter-01.jpg`, `letter-02.jpg` | X — *All the little chapters after that* | Open Memory Book two-page spread (2 letter frames) |

- **Local preview (`python -m http.server`)**: Completely automatic! Even if your file is `.png` or `.webp` instead of `.jpg` (e.g., `science-project.png`), the game detects it automatically with zero console 404s when missing.
- **Static web hosting (GitHub Pages / Netlify / Cloudflare Pages)**: After placing a photo into `assets/photos/`, open `content/story.json` and change `"enabled": false` to `"enabled": true` on that frame entry (and update `"caption"` if you'd like). Any frame left `false` or missing gracefully keeps its handmade line-art illustration.

---

## How to add your real voice recordings (`assets/voice/`)

Record your own natural voice (never an AI voice) as `.mp3`, `.m4a`, `.wav`, or `.ogg` and place the files into `assets/voice/`:

| Filename in `assets/voice/` | When it plays |
|---|---|
| `opening.mp3` | After you drop in, stand up, and reach your hand toward her |
| `book-open.mp3` | Walking to the desk and zooming into the open Memory Book |
| `hold-return.mp3` | When she lets go of your hand mid-movie (*"Why did you let go of my hand?..."*) |
| `classmates.mp3` | Chapter I — Online school & Class 7/8 back benches |
| `science-project.mp3` | Chapter II — Series/parallel circuit houses & painted paper sofa |
| `rooftop-snap.mp3` | Chapter III — Rooftop guitar & balcony snap |
| `best-friend-routines.mp3` | Chapter IV — Power-cut rooftop glances & coaching walks |
| `river-sunset.mp3` | Chapter V — River sunset boat outing, overcharge & quiet rickshaw |
| `love-teacher.mp3` | Chapter VI — Best friends & "love teacher" |
| `distance.mp3` | Chapter VII — Two quiet days of distance |
| `chocolate-snap.mp3` | Chapter VIII — Framed chocolate wrapper & reconnecting as best friends |
| `november-call-memory.mp3` *(or `first-i-love-you.mp3`)* | Chapter IX — Sometime after Nov 10, 2023 night call |
| `letters-and-years.mp3` | Chapter X — Open Memory Book frames |
| `apology.mp3` *(or `accountability.mp3`)* | Chapter XI — Direct apology for the breakup / *"I don't love you anymore"* words |
| `change.mp3` | Chapter XII — Four behavioral commitments |
| `closing.mp3` | Chapter XIII — Calm open ending with flower |

- **Automatic timing**: If your voice clip for a chapter is longer than the default chapter animation (e.g., 24 seconds), the chapter automatically extends its duration so your voice finishes cleanly before turning the page.
- **Pause/Resume sync**: Letting go of the hand pauses your voice clip in place; holding again resumes from the exact moment it paused. A `↻ Voice` replay button also appears automatically in the top-right HUD whenever a chapter has a recording.
- **Static web hosting note**: Just like photos, set `"enabled": true` on each added `"voice"` object in `content/story.json` when deploying to a static host where directory listing is disabled.
- **Optional instrumental background music**: Drop a licensed/original soft instrumental at `assets/audio/ambient-instrumental.mp3` (and set `"enabled": true` under `"ambientMusic"` in `content/story.json` for static hosts).

---

## Files touched in this build

- `assets/avatar/owner-head-cutout.png` (created from `owner-avatar-chatgpt-base.png`)
- `content/story.json`
- `index.html`
- `styles.css`
- `app.js`
- `ASSET-CHECKLIST.md`
- `HANDOFF.md`
