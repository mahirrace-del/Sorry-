# Until You Hold My Hand

A story-first apology web game project for Nidhi. This folder now contains a working static starter game, its editable story, and detailed design and handoff notes for continuing development.

## Start here

1. Read HANDOFF.md and open this folder in Antigravity to continue from the current code.
2. Preview the current version with the local instructions below.
3. If you choose Entegrity instead, paste ENTEGRITY-PROMPT.md and include this folder as context; the prompt now says to extend the existing prototype.
4. Add optional photos or voice clips using ASSET-CHECKLIST.md and content/timeline.template.json.
5. Review every personal detail and every promise before sharing the game with Nidhi.

## What's included

- `STORY.md` — a polished first-person account based on the facts provided. Dates that are not certain stay approximate.
- `GAME-DESIGN.md` — the full scene flow, interaction model, words on screen, visual direction, audio, accessibility, and respectful exit behavior.
- `ENTEGRITY-PROMPT.md` — a detailed implementation prompt for a complete mobile-first web game.
- `content/story.json` — editable scene content for the build.
- `content/timeline.template.json` and `content/timeline.template.md` — editable memory and media planning templates.
- `ASSET-CHECKLIST.md` and `assets/` — photo, voice, and audio slots. No personal media has been added yet.

## Replace photos and audio

1. Put approved photos in `assets/photos/`, voice clips in `assets/voice/`, and optional instrumental audio in `assets/audio/`.
2. Use the stable filenames listed in the timeline JSON, or update the filename there when you choose another name.
3. Keep captions and alt text in `content/story.json` or the build's equivalent content file. Describe what is in a photo; don't rely on a filename for context.
4. Ask Entegrity to make missing media fail gracefully: show a designed placeholder, never a broken image icon or dead control.
5. Replace only the sample content you are sure is true and comfortable for both of you to revisit.

## Tone and consent

This is an apology and a memory journey, not a request that Nidhi forgive you or decide anything. The game must let her pause, leave, skip the hand-hold interaction, and finish without sending a reply. Releasing the on-screen hand pauses the scene; it never scolds her or reverses progress. The closing text says plainly that the game cannot make up for hurtful words and that changed behavior matters more than a polished gesture.

## Run the current game prototype

This folder now includes a working static web prototype in index.html, styles.css, and app.js. It reads its editable scene copy from content/story.json. There is no backend or database; the browser loads local project files, and the app does not collect a reply.

From this folder, run python -m http.server 8000, then open http://localhost:8000 in your browser. Keep the server window open while using the preview. Stop it with Ctrl+C. Opening index.html directly as a file URL may prevent the browser from loading the JSON story file.

The animated SVG character is a starter illustration. To make it look more like you, attach a clear face photo in this chat; a front-facing or slight three-quarter view in even light is enough. You can also keep the character stylized and generic. No photo is required to run the game.

The accountability scene contains an optional, non-graphic cartoon bonk interaction. It is skippable, and it does not ask Nidhi to forgive or respond.


