# Asset Checklist — Plug-and-Play Photos, Voice & Music

The interactive movie-game works 100% out of the box with illustrated fallbacks and zero console 404s. Whenever you are ready, drop your real files into the folders below.

## 1. Real Photos & Letters (`assets/photos/`)

| Suggested filename | Chapter | Notes |
|---|---|---|
| `assets/photos/school-days.jpg` | I — Classmates | Optional school-era memory |
| `assets/photos/science-project.jpg` | II — The paper house | Series/parallel circuit houses or tiny painted paper sofa/bed |
| `assets/photos/rooftop-song.jpg` | III — Across the rooftops | Guitar on the rooftop or rooftop view |
| `assets/photos/coaching-days.jpg` | IV — Our own little language | Coaching walks or snack break memory |
| `assets/photos/river-sunset.jpg` | V — River sunset outing | Sunset river boat outing |
| `assets/photos/best-friends.jpg` | VI — Best friends | Best-friend era memory |
| `assets/photos/chocolate-wrapper.jpg` | VIII — Chocolate wrapper | Framed chocolate wrapper snap |
| `assets/photos/november-night.jpg` | IX — November 2023 call | Keep date approximate (no exact anniversary) |
| `assets/photos/memory-01.jpg` | X — Memory Book spread | Open book frame 1 |
| `assets/photos/memory-02.jpg` | X — Memory Book spread | Open book frame 2 |
| `assets/photos/letter-01.jpg` | X — Memory Book spread | Open book letter frame 1 |
| `assets/photos/memory-03.jpg` | X — Memory Book spread | Open book frame 3 |
| `assets/photos/memory-04.jpg` | X — Memory Book spread | Open book frame 4 |
| `assets/photos/letter-02.jpg` | X — Memory Book spread | Open book letter frame 2 |

## 2. Per-Scene Voice Recordings (`assets/voice/`)

Record in your own calm, natural voice (do not use AI voice synthesis):

- `assets/voice/opening.mp3` — Greeting when reaching your hand out in the spotlight
- `assets/voice/book-open.mp3` — Walking to the desk & opening the Memory Book
- `assets/voice/hold-return.mp3` — Gentle line when she releases your hand mid-movie
- `assets/voice/classmates.mp3` — Chapter I
- `assets/voice/science-project.mp3` — Chapter II
- `assets/voice/rooftop-snap.mp3` — Chapter III
- `assets/voice/best-friend-routines.mp3` — Chapter IV
- `assets/voice/river-sunset.mp3` — Chapter V
- `assets/voice/love-teacher.mp3` — Chapter VI
- `assets/voice/distance.mp3` — Chapter VII
- `assets/voice/chocolate-snap.mp3` — Chapter VIII
- `assets/voice/november-call-memory.mp3` (or `first-i-love-you.mp3`) — Chapter IX
- `assets/voice/letters-and-years.mp3` — Chapter X
- `assets/voice/apology.mp3` (or `accountability.mp3`) — Chapter XI
- `assets/voice/change.mp3` — Chapter XII
- `assets/voice/closing.mp3` — Chapter XIII

## 3. Optional Instrumental Music (`assets/audio/`)

- `assets/audio/ambient-instrumental.mp3` — Quiet, licensed/original instrumental loop (plays softly at 20% volume once audio is unlocked).

> **Deploying to static hosting:** On `localhost` (`python -m http.server`), added files are detected automatically. Before deploying to a static host (e.g., GitHub Pages / Netlify), set `"enabled": true` for each added photo/voice/music item in `content/story.json`.
