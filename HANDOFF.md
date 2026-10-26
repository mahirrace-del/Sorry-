# Antigravity Handoff — Until You Hold My Hand (Interactive Movie-Game)

Last updated: 26 October 2026 (All 41 Real Photos & Looping Memory Videos Integrated, Multi-Frame Scene Memory Slots, Autoplaying Mobile Video Frames, 30% White-Sound Ambient Music, and Mobile Stage Adaptation)

## Project overview

*Until You Hold My Hand* is a **fullscreen interactive animated movie-game** for Nidhi (`N-I-D-H-I`). There is zero website header, zero webpage title card, zero wall-of-text paragraphs, and zero backend/analytics/tracking.

## What is included & verified in this build

1. **All 41 Real Photos & Autoplaying Looping Memory Videos Integrated**:
   - **11 Living Video Memory Frames**: All 11 user video clips (`.mp4`) are integrated into the story scenes. On web and mobile browsers, they autoplay seamlessly on loop with `muted`, `playsinline`, and `webkit-playsinline` attributes without triggering native fullscreen takeovers.
   - **Video Memory Badge (`▶`)**: Each moving memory frame displays a subtle translucent video badge in the top-right corner.
   - **High-Res Video & Photo Lightbox**: Tapping any photo or video opens the memory in a high-resolution darkroom lightbox view with play/pause controls, captions, and tap-outside / escape dismissal.
   - **All 30 Photos & Random Memories Deployed**: Every single photo provided by the user—including all photos from `11-random-memories`—is strategically placed across the chapters to replace emptiness with shared memories.
   - **Chapter 10 (Open Memory Book Album Spread)**: Holds 12 memories (2 videos + 10 photos) displayed in a scrollable open-book album view (4 columns on desktop, 2 columns on mobile).

2. **Categorized Media Structure Across Chapters**:
   - `01-school-and-classmates` (5 files: 1 video, 4 photos) -> Chapters I & II (Classmates & Science Project)
   - `03-rooftops-and-music` (4 files: 1 video, 3 photos) -> Chapter III (Rooftops & Song)
   - `04-coaching-and-street-walks` (2 files: 1 video, 1 photo) -> Chapter IV (Coaching & Street Walks)
   - `05-river-and-sunset-dates` (7 files: 3 videos, 4 photos) -> Chapter V (River Sunset) & Chapter X
   - `06-dates-and-outings` (6 files: 2 videos, 4 photos) -> Chapters VI & VII (Love Teacher & Distance)
   - `07-fun-and-silly-moments` (4 files: 2 videos, 2 photos) -> Chapters VIII & X (Chocolates & Letters)
   - `08-chocolates-and-little-gifts` (2 files: 2 photos) -> Chapter VIII (Chocolate Wrapper & Gifts)
   - `09-late-night-calls-and-chats` (3 files: 3 photos) -> Chapter IX (Late Night Calls & Nov 2023)
   - `11-random-memories` (8 files: 1 video, 7 photos) -> Chapters II, IV, X, XI, XII, and XIII (Closing)

3. **True Mobile-First Stage Adaptation (All Scenes Match Prologue Display)**:
   - **Replaced Rigid 16:9 Letterbox Container**: Removed the artificial 16:9 camera constraint (`width: min(100vw, ...); aspect-ratio: 16/9;`) that shrunk all world scenes into a miniature 219px tall strip on mobile portrait screens.
   - **Full-Screen Immersion**: `.world-camera` now occupies `position: absolute; inset: 0; width: 100%; height: 100%;` just like the prologue first scene (`.dark-stage`).
   - **Natural `xMidYMid slice` Coverage**: SVG background and foreground canvases cover 100% of the screen seamlessly on iPhone, Android, iPad, and PC widescreen without horizontal split seams or letterbox letterboxing.
   - **Full-Sized Articulated Actor in All Chapters**: Removed `.actor-world-mount .actor { width: 18.5% !important; }` which had shrunk the character down to 72px. The character now maintains the exact same handsome, expressive proportion (`width: min(230px, 42vh, 56vw);`) in every chapter as seen in Scene 1.
   - **Synchronized Centered Scenery & Vehicles**:
     - **Chapter 5 (River Sunset)**: Centered the sunset sun at `cx=800` and aligned the boat and actor to glide from `660` to `780` directly under the sun, followed by the wooden jetty and rolling rickshaw (`700` to `820`). The actor sits right in the boat bench (`toStageBottom(620)`) and rickshaw seat.
     - **Chapter 2 (Memory Book Portal)**: Centered the pedestal table and illuminated memory book at `translate(800, 560)` so the actor and book are in the focal center on mobile.
     - **Chapter 3 (Science Project)**: Centered the craft table at `translate(800, 575)` with Nidhi's tiny paper sofa and miniature houses prominently in view.
     - **Chapter 12 (Commitments)**: Positioned the four glowing commitment lanterns in a balanced 2x2 grid (`680` and `920`) right above the character.

2. **30% Gentle "White-Sound" Background Music & iOS Hardware Fix**:
   - **Hardware Attenuation via FFmpeg**: Addressed iOS Safari's WebKit limitation where `HTMLMediaElement.volume` is read-only and ignores JS volume assignments. Re-encoded `ambient-instrumental.mp3`, `videoplayback.weba`, and `ambient-instrumental.weba` with `volume=0.25` (-12 dB reduction) so the background music natively plays as a whisper-level white-noise bed even on iPhones.
   - **Dynamic Voice Ducking**: Set base ambient music volume to `0.30` (30% soft acoustic bed). Whenever the narrator's voiceover plays, `ambientAudio` automatically ducks down to `0.12`, allowing the spoken voice to be loud, upfront, and crystal clear. When the voice pauses or ends, the background music gently returns to `0.30`.
   - **Prominent Spoken Voiceover**: Voice recordings are set to full volume (`1.0`), maintaining a +6 dB to +12 dB prominence over the background music at all times.

3. **Mobile UI Polish & Callout Menu Prevention**:
   - **Single-Row Top Navigation Bar**: Updated `.cinema-hud` on mobile screens (`max-width: 680px`) with `flex-wrap: nowrap`, compact 36px buttons, and 3px gaps. The chapter navigator (`< • V / XIII >`) and all action buttons (`replay`, `sound`, `CC`, `auto`, `motion`, `exit`) now fit on a single horizontal row on iPhone screens without breaking into two rows.
   - **Prevented Browser Selection Menus**: Added `-webkit-user-select: none; user-select: none; -webkit-touch-callout: none;` to prevent the browser from popping up "Copy | Search with Google" callout menus during touches or taps.
   - **Closing Subtitle Alignment**: Removed premature bottom offset on `.subtitle-bar` in Chapter 13 so subtitles rest comfortably at the bottom during the narration and do not cut across the character's body.

4. **Sincere Ear-Holding Squat / Knee-Down Apology ("কান ধরে উঠবস" in Chapter 11)**:
   - **Animation Choreography**: In Chapter 11 (*What I am sorry for now*), as the narrator acknowledges his hurtful words, he raises both hands up to firmly hold his ears (`t.armL = -142`, `t.forearmL = 78`, `t.armR = 142`, `t.forearmR = -78`), bows his head, and bends down into 3 deep, earnest kneeling squats on the floor.
   - **Interactive Forgiveness Button (`[ 🤍 It's okay, stand up ]`)**: Nidhi can tap this button at any point during his squats. He immediately lets go of his ears, places his hand over his heart with a grateful nod, stands tall, and the story smoothly transitions forward after a warm acknowledgement (*"🤍 Thank you… I promise I will never speak that way again."*).
   - **Zero-Pressure Fallback**: If she doesn't press anything or is watching hands-free, he naturally completes the 3 squats, stands up humbly, and the story automatically turns the page to Chapter 12 (Commitments).

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

