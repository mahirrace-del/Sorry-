# Antigravity Handoff — Until You Hold My Hand (Interactive Movie-Game)

Last updated: 26 October 2026 (Responsive Multi-Screen Background Adaptation for Mobile, iPad, Samsung Tab, and PC + Whisper-Quiet Music Volume)

## Project overview

*Until You Hold My Hand* is a **fullscreen interactive animated movie-game** for Nidhi (`N-I-D-H-I`). There is zero website header, zero webpage title card, zero wall-of-text paragraphs, and zero backend/analytics/tracking.

## What is included & verified in this build

1. **Full Responsive Background Adaptation (All Screen Sizes)**:
   - **Resolved Mobile Background Cut-off**: Switched `scene-canvas` and `scene-fg-canvas` from `xMidYMid slice` to `xMidYMid meet` so the entire background artwork is 100% visible on all screens.
   - **Unified 16:9 Cinematic Container (`.world-camera`)**: Sized to `width: min(100vw, calc(100dvh * 16 / 9)); height: min(100dvh, calc(100vw * 9 / 16)); aspect-ratio: 16 / 9; flex-shrink: 0;`, perfectly centered via flexbox in `.world-layer`.
   - **Cross-Device Compatibility**:
     - **PC / Laptops (16:9 & ultrawide)**: 100% widescreen film presentation.
     - **iPads & Tablets (3:4, 4:3)**: Stage fits 100% width with zero crop; scene sky bleeds top and bottom.
     - **Samsung Galaxy Tab (16:10, 10:16)**: Full background visible, zero crop.
     - **Mobile Phones (iPhone & Android portrait / landscape)**: The full width of every scene (classroom, rooftop, river boat, rickshaw, balconies, lamps, and lanterns) is 100% visible without sides cut off.
   - **Seamless Floor & Sky Bleed**: Implemented `--ground-bot` per scene with vertical gradient so the floor color smoothly extends to the bottom of portrait devices while sky covers the top.
   - **Aligned Actor & Photo Frames**: Embedded `frames-layer` inside `.world-camera` and scaled `.actor-world-mount .actor` to `18.5%` so character and photo frames stay 1:1 aligned with the scenery across all devices.

2. **Whisper-Quiet Background Music Volume**:
   - Decreased `ambientAudio.volume` to `0.04` (a gentle, unobtrusive background instrumental bed).
   - Allows the spoken voiceover (`1.0`) to be completely clear, prominent, and intelligible across all smartphone speakers and headphones.

3. **User's Chosen Background Music (`videoplayback.weba`)**:
   - Integrated `videoplayback.weba` (and converted to universal 192k stereo MP3 for iOS/Android).

4. **Automatic Opening Voice Playback & Synchronized Timing**:
   - The opening speech (`opening.mp3`) starts automatically at `3650ms` right as the character finishes standing up and waves.

5. **Mobile Browser Audio Unlock**:
   - Universal gesture unlock on first touch across the entire viewport.

4. **Full 16-Track Voiceover Soundtrack**:
   - Integrated all 16 user-recorded voice tracks (`opening.mp3`, `book-open.mp3`, `hold-return.mp3`, `classmates.mp3`, `science-project.mp3`, `rooftop-snap.mp3`, `best-friend-routines.mp3`, `river-sunset.mp3`, `love-teacher.mp3`, `distance.mp3`, `chocolate-snap.mp3`, `first-i-love-you.mp3`, `letters-and-years.mp3`, `apology.mp3`, `change.mp3`, `closing.mp3`) in both `assets/voice/` and `assets/audio/`.
   - Synchronized all subtitles and transcripts in `content/story.json`. Subtitles are active by default (`[CC]` on).
   - Dynamic scene duration: each scene automatically expands to accommodate the exact length of each voice recording plus comfortable cinematic breathing room.

2. **Cinema Visual Effects & Atmosphere**:
   - Added `#cinema-particles` engine with scene-specific particles:
     - Golden classroom and craft dust motes (`.particle-dust`) for Chapters I, II, VI.
     - Twinkling starlight fireflies (`.particle-firefly`) for Rooftop song, River sunset, and November night call.
     - Melancholy rain mist (`.particle-raindrop`) for Chapter VII (Distance).
     - Gentle falling rose/lotus petals (`.particle-petal`) for the calm open ending.
   - Dynamic scene animations: floating sleepy Zs on the laptop, electric sparks pulsing along circuit wires, floating music notes, candle flickers during power cut, shimmering river water ripples, bobbing boat pitch tilt, rotating rickshaw wheels, swaying notes, animated glowing thread, starlight twinkling, heartbeat call ripples, bobbing commitment lanterns, and blossoming flower.

3. **Playful Character Slap / Punch Interaction & Hand Controls**:
   - Nidhi can playfully tap/slap/punch the character at any point during any chapter. The character responds with a cartoon wobble, sound effect, and empathetic feedback ("The real hurt still matters, and I'm listening").
   - Holding the bottom-right 3D hand continues the cinematic story.
   - Tapping the hand advances directly to the next chapter.
   - Releasing the hand pauses into a dark spotlight pause with zero pressure to continue.

4. **Pure-Black Mr. Bean Opening Drop**:
   - Opens on a 100% pure black screen (`#020307`) with zero text.
   - An overhead spotlight clicks on, character drops in, lands, stands up, waves "Hi…", walks forward, and offers his hand.

5. **Real Portrait Likeness + Open Jacket Puppet Rig**:
   - High-res portrait face cutout (`assets/avatar/owner-head-cutout.png`) paired with a skeletal SVG puppet rig in dark navy jacket, white crew-neck tee, dark slim trousers, and sneakers.

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
| `hold-return.mp3` | When she lets go mid-movie; a neutral pause that offers resume, hands-free mode, or leaving |
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
- `app.js` (fixed `scene` undeclared reference error, unified `getSceneDurationMs` guard, tap-to-advance hand interaction, and universal playful character slap/punch anywhere)
- `ASSET-CHECKLIST.md`
- `HANDOFF.md`

## Recent Bugfixes & Enhancements (26 October 2026)

1. **Chapter 1 Progression Stall Fix (`app.js`)**:
   - Replaced undeclared `scene` variable in `computeDesiredActorPose` with `sc` / `isAccountability` safety check. In the previous commit, accessing `scene.id` threw `ReferenceError: scene is not defined` on the very first frame of Chapter 1, halting the `requestAnimationFrame(tick)` animation loop and freezing the page.
   - Introduced `getSceneDurationMs(sc)` to safely compute finite scene durations, preventing `NaN` durations even if audio files are missing or incomplete.
2. **Hand Portal Hold vs Quick-Tap Responsiveness (`app.js`)**:
   - **Hold (> 320ms)**: Plays the movie smoothly with animated character rig and fills the glowing progress circle. Letting go pauses in the dark spotlight and offers neutral resume, hands-free, and leave options.
   - **Quick Tap (< 320ms)**: If already in `"playing"`, tapping the hand instantly moves forward to the next chapter. If paused in the dark or waiting, a quick tap resumes playback immediately without re-pausing.
   - Next/Prev buttons (`#next-chapter`, `#prev-chapter`) and Arrow keys (`→`, `←`) also advance directly into playing mode.
3. **Universal Playful Character Slap/Punch Anytime (`app.js`)**:
   - Nidhi can tap/click the character puppet at any point in the story to playfully wobble him with a soft cartoon foam helmet, plush bopper word (`"BONK!"`, `"OUCH!"`, `"SMACK!"`, `"POW!"`, `"WHACK!"`, `"I DESERVE THAT!"`), and Web Audio sound effect.

