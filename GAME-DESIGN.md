# Game design: Until You Hold My Hand

## Purpose

A short, mobile-first, first-person memory journey and apology for Nidhi. It should feel personal, warm, and cinematic, while making room for her choice. It is not a forgiveness quiz, a proposal, or a test of whether she cares. It must never imply that she is responsible for the creator's wellbeing.

## Color transition and visual mood

The opening is nearly black with a focused warm spotlight. That darkness ends when Nidhi chooses to begin the memory journey, whether by taking the hand or choosing hands-free reading. At that moment, the space should bloom into a vivid, colorful storybook world; the memory journey must not remain dark. Reveal warm paper textures, glowing windows, and comfortable saturated amber, rose, teal, sky-blue, and river-sunset colors through a smooth crossfade or layered reveal. Avoid a sudden white flash. Give each memory a distinct palette while preserving strong text contrast. With reduced motion enabled, display the colorful destination immediately instead of animating the reveal.
## Player promise

At the first screen, say that the story can be paused, skipped, or left at any time and that no answer is expected. The hand-hold image is a gentle interaction metaphor. Releasing pauses the scene without undoing progress. A visible “Continue without holding” option keeps the story accessible and avoids requiring a sustained grip.

## Scene arc

| # | Scene | Story beat and sample copy | Visual and sound |
|---|---|---|---|
| 0 | A quiet beginning | Black screen. Fade in: “Hey, Nidhi. I made this to say I'm sorry and to remember our story. You can pause, skip, or leave whenever you want. You don't have to answer anything.” Button: “Begin.” | Near-black canvas, one soft pool of warm light. No autoplay audio. An illustrated silhouette settles into view; gentle, unhurried motion. |
| 1 | The little bow | The narrator rises, gives a small awkward smile, and says: “I don't want to rush into the apology. First, if you're comfortable, I'd like to walk through a few memories with you.” Buttons: “Take the journey” and “Read without the hand interaction.” | Simple original character illustration or user-provided portrait, never a generated lookalike. A small bow can replace kneeling or self-punishment. Soft room tone. |
| 2 | Our classroom | “We were classmates before we really noticed each other. During online school I was half-asleep in class, and when school resumed I was busy with my friends at the back.” | Paper texture, desk silhouettes, quiet chalk-line drawing. Approximate dates only. |
| 3 | The paper house | Reveal the two little houses, then a paper sofa and bed. “Our science group had to show series and parallel circuits. I worked on the electrical part; you made the tiny furniture and sent me a picture on Messenger. That was your first direct message to me.” | A house assembles in layers; circuit lights respond to keyboard/tap. Add project photo slot and descriptive alt text. |
| 4 | Across the rooftops | “You moved close enough that I could see your balcony from my rooftop. One day you heard my cousins and me playing guitar, asked if that was my house, and sent a snap of the song. I sent one back.” | Two balcony frames across a night sky. A few stars and a drawn music line; user can turn music off. |
| 5 | A friendship in little messages | “Good morning, good night, coaching together, teasing each other, and sharing all the small details. When the power went out, we sometimes met each other's eyes from the rooftop and balcony and matched steps.” | Chat bubbles become soft lights; simple step animation. No real chat content shown unless the user supplies and approves it. |
| 6 | The river sunset | “I planned our outing minute by minute. We watched the sunset from a boat. Then the renter asked for much more than we expected, so we paid and left. In the rickshaw back, we had plenty to say and mostly just looked at each other.” | Warm river gradient, slow parallax water, boat silhouette; optional actual photo. Brief light comic beat on the overcharge, never make either person the joke. |
| 7 | Best friends | “For months, we were each other's first good-morning message. I acted like a love teacher even though I had never been in love. When you said someone would love me, I secretly wished you meant yourself.” | Paper letters and small memory cards drift in; keep the pace gentle and skip-ready. |
| 8 | Two quiet days | “I thought we should make distance because I believed people were misunderstanding our friendship. I stopped talking properly, then told you we should end that closeness. We barely messaged for two days. I should have explained myself with more care.” | Sound and motion settle. Avoid storm, heartbreak, or guilt imagery. Never show Nidhi crying or attribute a private reaction to her. |
| 9 | The chocolate wrapper | “I sent you a snap of the chocolate wrapper I had kept. You asked if we could get back to how we were. We began talking again and found our friendship.” | A small paper wrapper in a frame; use an abstract stand-in unless the real photo is provided. Scene color warms gently. |
| 10 | The unmarked date | “Sometime in November 2023, after my birthday, we were on a normal night call. We both knew what we were trying to say. Then the words came: ‘I love you.’ We never chose one exact anniversary.” | A night sky with one slow light; optional voice clip of the line. Do not show a specific calendar date. |
| 11 | The years in small things | Show only memory photos, letters, and captions the user adds. Default text: “Our story is also made of the ordinary things I don't want to pretend I can fit into one scene.” | A scrollable memory gallery with per-item captions, alt text, and dates marked “approximate” when needed. Empty slots stay hidden or show a calm placeholder. |
| 12 | The apology | “Recently, I said we should break up and said I didn't love you anymore. Those were my words, and I am sorry. Whatever I was feeling does not excuse how much that could hurt.” | Return to the quiet opening light. No sad violin cue, tears, or dramatic pleading. Let the text remain readable without timed disappearance. |
| 13 | What changes after this | “I want to pause before I speak when I'm upset, explain my feelings without threatening the relationship, listen when you say I hurt you, and respect the time or space you ask for. This game cannot prove that. My actions have to.” | A small flower grows beside a handwritten note; keep it a gift, not a reward for forgiveness. |
| 14 | An open ending | “I'm sorry, Nidhi. Thank you for sharing so many chapters with me. You don't owe me forgiveness, a reply, or a decision. You can close this here. Whatever you need next, I will respect it.” Buttons: “Close story” and “Read the note again.” No “forgive me / don't forgive me” choice. | Fade to a calm warm background. No forced contact, confetti, answer form, or follow-up notification. |

## Interaction model

- Use a clear scene state machine: `intro → scene → paused → scene → closing → ended`. Keep the current scene index and completion state in memory; optionally persist locally only if the player opts in.
- When “Take the journey” is selected, show an on-screen hand card. Pointer down / touch start begins or resumes the scene. Pointer up, pointer cancel, window blur, or loss of document visibility immediately pauses animation, narration, and timed transitions. Never jump backward, chastise the player, or repeat a plea. Show “Paused. Take your time.” with functional “Resume”, “Continue without holding”, “Previous memory”, and “Leave story” controls.
- `Continue without holding` advances through the exact same story with ordinary Next/Previous buttons. Every interaction is operable by mouse, touch, keyboard, and assistive technology. Do not depend on precise multi-touch or pressure sensing.
- Provide persistent “Pause”, “Skip scene”, and “Leave story” controls. Leaving asks no confirmation that could guilt the player; one confirmation is acceptable only if needed to prevent accidental navigation, with neutral copy and a working cancel.
- Scene progress is informational, not a countdown. Provide next/back and a scene list so the player can skip freely.
- Offer a silent-reading mode. The experience must remain complete with audio off and with all media missing.

## Visual and sound direction

- Art direction: hand-painted paper memories, charcoal night skies, warm amber window light, river dusk, soft lavender/rose accents. Avoid generic hearts everywhere, stock couple photos, photorealistic AI faces, or childish slapstick.
- Build the character as original 2D illustration/CSS silhouette until the user supplies an approved image. Never synthesize Nidhi's likeness. Keep her representation abstract or use only photos the user owns and has permission to include.
- Use smooth fades, small parallax, paper reveals, and ambient particles. Keep motion slow, low-amplitude, and skippable. Honor `prefers-reduced-motion` and add an in-game motion toggle.
- No sound before a deliberate user gesture. Add global master mute, music mute, voice mute, a visible volume slider, and a “Replay voice” button for each spoken line. Keep playback state accurate. Use captions/transcripts for every voice clip. Stop audio on pause, leave, or scene change.
- Use only user-supplied music or licensed/royalty-free audio. Provide silence as the default fallback.

## Content and asset handling

- `content/story.json` is the source of truth for display copy, captions, alt text, scene order, approximate date labels, and media paths. Keep the longer prose in `STORY.md` as the editorial source.
- Missing or invalid assets must degrade gracefully to designed placeholders. Do not leave broken image icons, fake upload controls, or dead buttons.
- Images need responsive crops, `alt` text, and captions. Voice/audio may be omitted without changing the narrative. Personal media should be loaded locally and never sent to analytics or an external service.
- Keep relationship dates approximate. The exact November 2023 confession date and the official relationship start date are intentionally unspecified.

## Accessibility and comfort

- Mobile-first, semantic HTML, keyboard focus that is visible, skip-to-story link, useful heading order, descriptive button names, and `aria-live="polite"` for pause/status changes.
- Minimum 44×44 CSS pixel touch targets; no essential hover-only effects; avoid flashing. Keep text contrast WCAG AA or better and support browser zoom to 200%.
- Use real buttons and links. Include captions/transcripts, alt text, screen-reader labels for art, and a full text-only route through the same story.
- Honor reduced motion and do not autoplay audio. Pausing stops animation and audio. Do not force fullscreen or orientation locking.
- No account, form submission, tracking, external upload, or collection of Nidhi's response.

## Completion criteria

The end screen is reachable in silent-reading and hand-interaction modes; every visible control works; pause preserves the current scene; resume continues from the same point; leaving is immediate and neutral; the entire story can be read with keyboard and screen reader; missing assets do not break layout; and no part of the game asks Nidhi to forgive or answer.

## Optional cartoon bonk interaction

In the apology scene, offer a clearly optional, silly cartoon bonk. A tap makes the avatar wobble and squash under an oversized foam helmet, with a short “BONK!” label. The player can repeat it or skip it. It is a harmless cartoon reaction, not a simulation of injury; no bruises, pain sounds, escalating damage, or guilt. Keep the text clear that this does not erase the hurt or replace an apology. The regular story controls remain available.


