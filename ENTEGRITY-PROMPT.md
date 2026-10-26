# CONTINUATION UPDATE — 26 October 2026

A working starter app now exists in index.html, styles.css, and app.js. Read and extend these files; preserve the app's current story data loading, accessible scene navigation, hold-to-advance/pause behavior, reduced-motion option, and optional cartoon bonk. Do not replace the folder with a fresh scaffold or remove existing project notes. Keep the implementation dependency-free unless a clear need arises. The story remains in content/story.json.

The avatar is currently an original SVG stand-in, not a likeness. If the owner provides a reference photo, use it only to refine the illustrated character's visual traits; do not publish the source photo by default. There is no backend by design: this is a private static experience, and the content is local. Keep it that way unless the owner explicitly asks for a feature that genuinely needs a server.

---
# Entegrity build prompt

Copy everything in the block below into Entegrity. Attach this folder or paste its supporting files into the project context.

---

## Build brief

Build on the existing files in this project folder to complete a polished, mobile-first cinematic web game called **Until You Hold My Hand**, a private first-person apology and memory journey for Nidhi. Extend the current static prototype in place; do not replace it with a fresh scaffold. Read the attached `README.md`, `STORY.md`, `GAME-DESIGN.md`, `content/story.json`, and timeline template before coding. Treat those files as the source for story facts and emotional boundaries. Do not invent dates, events, dialogue, or relationship details. The exact relationship start date is unknown; the first “I love you” call was sometime in November 2023, after November 10. Keep this approximate.

The result must be a genuinely functional web app, not a static mockup. All visible controls must work. Do not leave TODO buttons, decorative controls that appear interactive, dead links, fake upload widgets, or placeholder copy presented as a completed memory. If an optional photo or recording is absent, render a polished placeholder and keep the story playable.

## Product intent and tone

This is a sincere apology with a memory journey, not a persuasion funnel, forgiveness request, proposal, or test of affection. Be accountable and tender without emotional pressure. Never use lines like “I can't live without you”, “please don't leave me”, or “I don't want to let go forever.” Never make the character cry, beg, self-punish, or imply Nidhi is responsible for the creator's wellbeing. Do not mention her past boyfriend. Do not infer her feelings or show her crying. The end must say she owes no forgiveness, reply, or decision and can leave whenever she chooses. State that the game cannot replace changed behavior.

Use the provided story. Preserve the true sequence: online school/classmates; science group project about series and parallel circuits, with Nidhi's crafted paper furniture and first Messenger photo; nearby homes and rooftop/balcony guitar snap; daily messages, power-cut eye contact and matched steps; coaching and best-friend memories; a planned river sunset boat trip and unexpected overcharge; a period of distance initiated by the narrator; about two quiet days; reconnecting through a snap of a kept chocolate wrapper and Nidhi's question about getting back to the friendship; a mysterious November 2023 night call when “I love you” was finally said; later letters and memories; the recent hurtful breakup and “I don't love you anymore” words; an accountable apology and concrete intent to change. Do not claim an exact relationship anniversary or an exact date for the confession.

## Project setup and technical direction

1. Inspect the current files first and continue the self-contained static app already present. Preserve its working layout, story loading, navigation, hold/pause behavior, reduced-motion setting, and optional cartoon interaction. Keep it dependency-free unless a clear need arises; do not add paid APIs, back-end services, authentication, trackers, or external asset CDNs.
2. Create a runnable development setup, production build, and deployment-ready static output. Include a concise project README with exact install, run, build, preview, and deploy steps. Use the package manager appropriate to the environment and commit the lockfile.
3. Use semantic HTML for all copy and controls. Use CSS transforms/transitions for scene motion; reserve canvas for optional lightweight ambient particles. The story and controls must remain usable if canvas or animation fails.
4. Keep story and asset metadata editable outside components. Use the attached `content/story.json` as the initial source of truth; keep scene IDs stable. Use a clear architecture such as:
   - `src/content/story.json` — order, text, captions, dates, media references, alt text.
   - `src/components/` — `Intro`, `SceneFrame`, `MemoryCard`, `HandControl`, `AudioControls`, `PausePanel`, `ClosingNote`.
   - `src/state/` — typed scene state machine and pause/resume logic.
   - `public/assets/photos/`, `public/assets/voice/`, `public/assets/audio/` — optional user-supplied files.
   Adjust names to fit the stack, but preserve separation between content, state, visuals, and controls.
5. Add `.gitignore` for build output, local environment files, editor files, and optional private media if the project will be pushed publicly. Do not add personal secrets or upload media to a third-party host automatically.

## Experience and scene flow

Implement all scenes in `GAME-DESIGN.md` and `content/story.json` in the supplied order:

1. Quiet dark opening with a warm spotlight and gentle character arrival.
2. Gentle introduction and clear opt-out before the memory journey.
3. School/classroom and the science project.
4. Paper house, circuits, tiny crafted furniture, and first Messenger photo.
5. Nearby rooftop/balcony and guitar snap.
6. Best-friend routines, power outage gestures, and coaching.
7. The detailed river outing, sunset, overcharge, and quiet rickshaw ride.
8. The distance, two quiet days, chocolate wrapper snap, and friendship reconnection.
9. The approximate November 2023 “I love you” night call.
10. Editable letters/photos/memory gallery.
11. Direct apology for the breakup and “I don't love you anymore” words.
12. Concrete actions the narrator intends to practice.
13. Optional silly cartoon bonk interaction, with a foam-helmet wobble and a clear skip. It is harmless, non-graphic, and does not replace the apology.
14. Calm ending with no forgiveness question and no response collection.

Use short readable text cards with optional expand-to-read paragraphs. Do not time out copy. Include a visible scene progress indicator, scene list, next/back, skip, replay-from-start, and closing note. The gallery should be empty gracefully when no media is provided.

## Hand-hold pause/resume mechanic

Implement a real, robust pointer-based hand interaction and a complete alternative:

- On the intro, offer “Take the journey” and “Read without the hand interaction.” Never force a hold to continue.
- In hand mode, a clearly labelled, accessible hand control begins/resumes the current scene. While actively held, scene ambience/animation may run at a gentle pace. On pointer up, pointer cancel, pointer leaving the control, window blur, page becoming hidden, or lost pointer capture, pause in place immediately.
- Releasing never rewinds progress, never scolds, and never repeats a plea. Show neutral copy: “Paused. Take your time.” Provide working “Resume”, “Continue without holding”, “Previous memory”, and “Leave story” controls.
- Support touch, mouse, keyboard (Space/Enter), and assistive technology with semantic buttons and accessible labels. Use pointer capture safely; release capture on pause/unmount. Handle a second pointer without breaking state. Do not rely on pressure, gesture recognition, or perfect finger position.
- Provide persistent Pause and Leave controls. Leave is immediate or has a single neutral confirmation with a clear cancel. No guilt or additional persuasion dialog.
- Do not require continuous holding for long periods: allow normal button navigation at any time. Respect reduced motion, background/visibility events, and audio state.

## Visual design

Create a distinctive polished art direction: tactile paper, hand-drawn linework, layered memory cards, night-sky indigo, warm window amber, river dusk, restrained rose/lavender accents. Use whitespace and careful typography. Aim for an intimate illustrated storybook, not a generic Valentine's landing page. Avoid stock couples, excessive hearts, glitter overload, or photorealistic AI faces.

Use an original abstract 2D character/CSS illustration as a starter. Do not fabricate a likeness of Nidhi or the user. Provide a clearly documented slot for an approved user-supplied portrait or character art. For absent photos, use designed scenes (paper house, balcony, boat, wrapper) rather than empty grey boxes. Use small, low-amplitude animations and graceful transitions; avoid sudden movement. Honor `prefers-reduced-motion` and add a visible motion toggle.

Make layouts work on narrow phones (320 px and up), larger phones, tablets, laptops, portrait and landscape without forced orientation. Keep controls reachable and text comfortably readable. Avoid horizontal overflow. Use responsive image crops and optimize supplied image sizes without altering meaning.

## Audio

- Default to silence until a deliberate user gesture; browser autoplay restrictions must be handled without errors.
- Add working master mute, music mute, voice mute, volume control, and replay-voice control. Accurately indicate on/off states with text and accessible names.
- Stop/pause sound on pause, page hide, scene change, and leave. Never overlap voice clips. A missing/broken clip must not break scene navigation.
- Support optional locally supplied narration and licensed/owned instrumental audio. Include captions/transcripts for every clip and retain the full text narrative. No third-party speech or music generation APIs.

## Accessibility, privacy, and respectful exits

- Semantic landmarks, headings, buttons, links, skip-to-story link, visible focus, logical focus order, keyboard-only completion, and screen-reader announcements for pause/status changes.
- Minimum 44×44 px touch targets, sufficient contrast (WCAG AA target), text zoom to 200%, no color-only state, no flashing, no hover-only interaction, and useful alt text for meaningful images.
- Provide reduced-motion and silent-reading modes. Keep the full story readable without interaction or audio.
- Do not request or store Nidhi's answer. No analytics, trackers, cookies, accounts, network uploads, forced full-screen, orientation lock, or follow-up notifications. Store progress locally only if necessary and disclose it; a no-storage default is preferred.
- Include accessible “Leave story” on every scene. Closing or leaving must work without finishing a scene.

## Editable content and placeholders

- Keep all on-screen text, scene ordering, approximate date labels, captions, image paths, image alt text, and voice transcript in the content file, not buried in JSX.
- Preserve the source copy in attached `content/story.json` and `STORY.md`. Allow the owner to edit names and captions in one obvious place. Do not make Nidhi edit an app or provide a response.
- Add clear comments/documentation for replacing files in `public/assets/photos/`, `public/assets/voice/`, and `public/assets/audio/`. Use stable placeholder filenames from `content/timeline.template.json` where possible.
- If an asset is missing, show its intended CSS/illustrated fallback and hide controls that cannot function. Do not show broken images or fake uploads.
- Include a simple memory gallery with per-item caption, optional approximate date, alt text, and optional audio transcript. Do not load external image URLs by default.

## Functional requirements

- Every visible button/link/control must perform the labelled action and have a meaningful focus state.
- Implement scene navigation, pause/resume, skip, reset/replay, audio controls, motion setting, gallery behavior, and exit.
- Show actual current scene/progress and update it after navigation.
- Handle missing media, media decode errors, autoplay rejection, orientation/resize, tab switching, pointer cancellation, keyboard activation, and reduced motion without uncaught errors.
- Avoid modal traps. If a dialog is used, it must manage focus, close with Escape, and return focus to its trigger.

## Verification and deployment

Before handoff:

1. Install dependencies, run the production build, and resolve all errors and warnings that indicate broken behavior.
2. Run any available lint/type checks and automated tests. Add focused tests for the scene state machine and pointer-up/pointer-cancel pause behavior, plus an end-to-end path through silent-reading mode if the environment supports it.
3. Manually verify at 320 px phone width, a typical modern phone, tablet, and desktop; test both portrait and landscape.
4. Verify keyboard-only navigation, screen-reader labels/status, 200% zoom, reduced motion, all audio muted, missing assets, and browser autoplay rejection.
5. Verify every control, especially leave, previous/next, skip, replay, hand-hold release/resume, and silent mode. Confirm no screen asks for forgiveness or a response.
6. Provide concise build/run/preview/deploy instructions and identify exactly where the owner adds photos and recordings. Do not deploy or publish personal media automatically; leave deployment as an owner-run step unless explicitly requested.

Return the complete source project, a brief implementation summary, commands to run it locally, verification results, and any remaining user-supplied assets needed. Do not return only a screenshot or prototype.

---



