# Antigravity Project Prompt — Until You Hold My Hand

You are continuing an existing personal web-game project. Work inside this folder and preserve its current files and notes. Do not replace the project with a new scaffold.

## Your role and the project

Help me build a complete, polished, mobile-first, illustrated web game called “Until You Hold My Hand.” It is a private apology and memory journey for my girlfriend, Nidhi (spelled N-I-D-H-I). The purpose is to remember how our relationship grew, acknowledge words that hurt her, and express a sincere apology. The game must never pressure her to forgive me, reply, make a decision, or keep playing.

I want to continue the work in small, reviewable stages. Read the existing project before changing it. Keep a concise progress record in HANDOFF.md after each stage so another agent or I can continue without losing decisions.

## Current project state

This folder already contains a starter static app:

- index.html — opening screen, story layout, controls, and inline SVG avatar.
- styles.css — dark illustrated-storybook styling, responsive layout, and animation.
- app.js — loads the story JSON and handles scene navigation, holding/releasing, motion preference, and the optional cartoon bonk.
- content/story.json — editable story copy and scene data.
- STORY.md — refined long-form story.
- GAME-DESIGN.md — narrative and interaction design.
- README.md — local preview and asset instructions.
- HANDOFF.md — current decisions and continuation notes.
- ENTEGRITY-PROMPT.md — an alternate implementation brief.

The app is deliberately static and has no account, API, database, analytics, response collection, or upload service. Keep that architecture unless a later feature truly requires a backend. Personal photos and recordings should be local project assets. Do not send them to a service or publish them automatically.

The current avatar is a generic hand-drawn SVG placeholder, not a likeness. I may upload a clear photo of myself later. Until then, keep the avatar stylized and generic. If I provide a photo, use it only as a reference for the illustrated character’s visible traits; do not publish or embed the original photo by default. Do not create a likeness of Nidhi unless she has supplied or approved an image.

## Our story: facts and chronology

Use the files in this project as the source of truth. The summary below explains the relationship arc and the details the game should preserve:

1. We were classmates in school. During COVID online classes, I barely noticed the new students because I often joined class half-asleep and was distracted by my own friends. When school resumed, around the period we were moving through Class Seven and Class Eight, I was a joking, fairly clever back-bencher and did not pay much attention to the girls in class.
2. A teacher put us in the same science-project group. We made small houses to demonstrate series and parallel circuits. I was interested in the electrical/robotics part. Nidhi was good at crafts: she made and painted tiny paper furniture, including a sofa and bed, and sent me a picture on Messenger. That was our first direct message.
3. Around then she moved to a nearby home. I could see her balcony from my rooftop. One day I was on the roof with cousins, playing guitar and singing. She asked someone we both knew whether that was my home, then sent a snap of the song. I replied with a snap of my surroundings. Our contact grew shyly from there.
4. Messages turned into daily good mornings, good nights, long conversations, and sharing small details. During power cuts, when phones went quiet, we sometimes met each other’s eyes from her balcony and my rooftop, matched steps, and shared songs without speaking.
5. We went to coaching together and came home together. We teased each other, I tried silly things to get her attention, and she laughed. We sometimes skipped coaching to get food. We became best friends before either of us clearly named the deeper feelings.
6. During a break between coaching classes, she suggested going somewhere. I planned a nearby river trip almost minute by minute: reserve a boat, watch the sunset, and return before coaching. At that time we called it an outing, not a date. After the boat ride, the renter demanded much more money than we expected. We paid and left to avoid a public confrontation. The rickshaw ride back felt long; we had a lot to say but mostly communicated through eye contact. The funny overcharge became part of the memory.
7. For months we messaged constantly and shared everything. I used to say I had never had a girlfriend and that no one would love me. Nidhi would tell me to be patient. I acted like a “love teacher,” explaining love even though I had never been in love. When she said someone would love me, I secretly wished she meant herself.
8. At one point I believed people were misunderstanding our closeness, so I decided to create distance. I stopped talking properly at coaching and then told her we should keep distance and end that close friendship. I did not explain myself carefully. We said we could at least say hi, then barely messaged for about two days.
9. I had kept and framed a chocolate wrapper from a chocolate she gave me. I sent her a snap of it. She asked whether we could get back to how we were. We resumed messaging and restored the friendship. Be precise: this was reconnecting as best friends; do not turn it into a proposal or claim that this was when we officially became a couple.
10. Sometime in November 2023, after my birthday on November 10, we were on a regular night call. We both seemed to know what we wanted to say but lacked courage. The words “I love you” finally came out. We never agreed on an exact anniversary or exact relationship start date.
11. We have years of messages, letters, calls, photos, jokes, and other small shared memories. Add only memories and media that I provide or approve. Do not invent scenes, dates, private dialogue, or Nidhi’s feelings.
12. Recently, during a relationship crisis, I said we should break up and said, “I don’t love you anymore.” Those were my words. I now want to apologize sincerely and change how I speak and behave.

### Important date ambiguity

I have described the relationship as lasting more than four years, but I also place the first “I love you” call in November 2023 and say we never knew the exact start date. Do not calculate a duration, claim an anniversary, or treat the first call as the confirmed start date. In public-facing copy, say “for years” or use approximate school-era timing unless I clarify the timeline.

### Privacy and story exclusions

Do not mention Nidhi’s past boyfriend. Do not show or state that she cried, stopped eating, or felt a particular emotion unless I explicitly approve that content. Keep the narrative in my first-person voice, but do not make my sadness or longing her responsibility.

## Color transition: dark opening into a vivid story

Keep the opening scene nearly black while the character arrives under the spotlight. The darkness belongs only to the opening. As soon as Nidhi chooses the hand interaction or the hands-free story route, transition into a clearly vibrant, colorful illustrated world. Do not leave the journey on a dark or near-black stage.

Make the transition feel like the memories are coming alive: let warm light spread from the character’s hand, then reveal richly colored paper-storybook scenery, glowing windows, saturated but comfortable rose, amber, teal, sky blue, and river-sunset tones. Use a smooth crossfade or gentle layered reveal, not a sudden white flash. Give each memory a distinct visual mood while keeping the text and controls highly readable. The first memory should visibly feel brighter and more alive than the black opening. In reduced-motion mode, show the same colorful final scene immediately, without animated travel.
## Intended experience, from opening to ending

1. Begin in a quiet, nearly black space. A warm spotlight comes on. My illustrated character drops gently into view, lands, wakes up, looks toward the player, and says “Hi, Nidhi.” The character may give a small sheepish bow or touch one ear briefly. Keep the gesture warm and self-aware, never self-punishing.
2. The character explains that this is a memory journey and offers a hand. Suggested tone: “If you’d like, take my hand and I’ll show you a few memories. You can release, pause, skip, or leave whenever you want.”
3. The player can choose the hand interaction or a hands-free reading route. Do not make the hand interaction mandatory.
4. Move through the school, paper-house science project, rooftop/balcony, best-friend routines and coaching, river sunset, distance and reconnection, November call, and editable gallery of later memories.
5. Include an optional cartoon bonk moment because I want Nidhi to be able to tap my character if it would feel funny or cathartic. Keep it clearly fictional and harmless: an oversized foam helmet, a squash-and-wobble animation, a short “BONK!” label, and a short line that recognizes the hurt. No bruises, realistic violence, pain sounds, damage meter, punishment, or suggestion that she should hit anyone in real life. She may tap it repeatedly or skip it. Skipping must not skip the apology.
6. Acknowledge the recent hurtful breakup and “I don’t love you anymore” words directly. Do not excuse them as anger, panic, or misunderstanding. State that I am sorry and that a game cannot undo what I said.
7. Let me name only changes I genuinely intend to practice: pause before speaking when upset, describe my feelings without threatening the relationship, listen when she says I have hurt her, and respect the space or time she asks for. Do not promise behaviors on my behalf that are not in the project or that I have not confirmed.
8. End with a calm apology and a flower as a no-obligation gift. Do not ask “Will you forgive me?”, require a response, add yes/no forgiveness buttons, display “I can’t live without you,” or show a follow-up prompt. Make clear she owes no forgiveness, reply, or decision and that I will respect what she needs next.

## Interaction, accessibility, and technical requirements

- Keep story copy, scene order, approximate date labels, captions, alt text, and media references editable in content/story.json rather than hard-coding text in app.js.
- Hand mode: pressing and holding the hand control may advance at a gentle reading pace. Releasing, pointer cancel, leaving the control, losing window focus, or switching tabs pauses in place. Never rewind, scold, or repeat a plea when she releases.
- Always offer ordinary Previous/Next controls, a scene progress indicator, a visible Pause/Leave route, and a hands-free mode. A player must be able to finish without holding a finger down.
- Support touch, mouse, keyboard, and assistive technology. Use semantic buttons, visible keyboard focus, useful labels, polite status announcements, and touch targets at least 44 px.
- Honor the operating system’s reduced-motion setting and provide a motion toggle. Do not force fullscreen or device orientation.
- No sound before an intentional action. Audio is currently off because no recordings have been supplied. When recordings are added, provide working mute/volume/replay controls and transcripts. Do not create a synthetic voice that pretends to be me.
- Missing photos or recordings must never break the game. Show designed illustrations/placeholders and hide controls that cannot function.
- Do not add analytics, tracking, logins, cloud uploads, response forms, or a database. Keep media local unless I later explicitly request a specific deployment.
- Use a coherent handmade storybook art direction: paper texture, hand-drawn lines, warm window light, indigo night, river dusk, restrained rose/lavender accents. Avoid generic stock couples, excessive hearts, photorealistic AI faces, flashing, and heavy motion.
- Support narrow phones from 320 px, larger phones, tablets, and desktop. Avoid horizontal overflow. Keep paragraphs readable and give images descriptive alt text.
- No visible control may be decorative-only or nonfunctional. If a feature is not ready, omit or clearly disable it.

## Work plan: use these stages

### Stage 1 — Project handoff and animated character (do this now)

1. Read HANDOFF.md, README.md, STORY.md, GAME-DESIGN.md, content/story.json, index.html, styles.css, and app.js.
2. Start the existing app using the local static-server instructions in README.md. Inspect the current opening and story view in a browser. Note any immediate runtime or layout errors.
3. Refine the existing SVG avatar in place as a reusable character with clearly separated parts and editable CSS variables. Implement the opening arrival/fall, landing, waking/blink, simple expression changes, sheepish apology gesture, and gentle idle animation. Add distinct states for listening, reaching a hand, paused, and the harmless foam-helmet bonk. Also implement the key color transition: preserve the nearly black opening, then make the world clearly vivid and colorful as soon as she chooses to take the hand or enter hands-free mode. Keep the reduced-motion version readable and static, but still colorful.
4. Do not require a photo. If no reference photo is attached, keep the current stylized placeholder. Do not invent a likeness.
5. Preserve the current app and story. Do not start all later stages yet.
6. Update HANDOFF.md with what changed, the files edited, how to preview, any unresolved issue, and the exact next stage. Then stop and report the Stage 1 result so I can review it.

### Stage 2 — Story flow and interaction polish

After Stage 1 is reviewed, strengthen the scene state and navigation. Confirm hold-to-advance/pause, keyboard and touch behavior, Previous/Next, scene skip, leave, return to cover, progress, and focus movement. Preserve all story copy and date uncertainty. Keep the optional bonk skippable and separate from the apology.

### Stage 3 — Illustrated memory scenes

Add distinct lightweight illustrations and transitions for classroom, circuit houses and paper furniture, rooftops/balcony, coaching, river sunset and boat, the two quiet days, chocolate wrapper, night call, letters, apology, and flower ending. Prefer original SVG/CSS scenes. Use local approved photos only where supplied, with captions and alt text. Do not block the story on missing assets.

### Stage 4 — Personal media and audio

When I provide approved photos, voice clips, or music, map them through the editable content data. Keep local files replaceable, optimize responsibly, provide useful fallbacks, add transcripts, and ensure audio controls really work. Do not use an AI voice impersonation or publish private media automatically.

### Stage 5 — Accessibility, responsive polish, and handoff

Review mobile, tablet, desktop, landscape, keyboard, screen-reader labels, 200% zoom, reduced motion, silent mode, missing media, and browser autoplay behavior. Run the available build/lint/test checks once the app has an appropriate setup. Fix issues, document deployment steps, and update HANDOFF.md. Do not deploy or publish without a separate explicit request.

## Your task for this session

Execute Stage 1 only. Start by inspecting and previewing the current app, then refine the animated character in the existing files. Do not proceed to Stages 2–5 in this session. Keep all progress in HANDOFF.md, then stop with a concise summary and the exact next step for me.

