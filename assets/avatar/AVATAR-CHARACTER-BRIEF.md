# Avatar character brief

## Current owner-selected base image

`owner-avatar-chatgpt-base.png` is the owner's latest ChatGPT-generated full-body avatar and is the current visual base for the game. It clearly shows the face, swept black hair, light moustache/chin beard, and green polo with red-white trim. The file has a pale cream background, so remove or mask that background before placing the character over the game's vibrant scenes.

## Additional generated poses

The owner also has earlier Canva-generated options in this folder:

- `owner-avatar-portrait-v2.png`: close-up portrait option.
- `owner-avatar-v2.png`: earlier full-body standing option.
- `owner-avatar-apology-pose.png`: kneeling apology option.
- `owner-avatar-reach-pose.png`: offered-hand option.
- `owner-avatar.svg`: first hand-drawn draft; the owner did not approve it as a likeness.

Do not bundle the original reference photos. Keep the current ChatGPT-generated base image visually consistent when creating new poses: same face, hair, green jersey, proportions, and storybook illustration style.

## How to animate the character

The PNGs are still images, not a rigged or frame-by-frame animation. Use a transparent cutout of the selected base image for gentle CSS motion: fall/land with translate and rotate, breathe with a small vertical scale/offset, and fade between scene states. Use separate matching pose images for the apology and offered-hand gestures, crossfading between them. For natural arm, leg, or facial movement, create a layered character rig or a sprite sheet with aligned frames; do not stretch the entire PNG to imitate joint motion.

Keep these assets and notes separate from `index.html`, `app.js`, and `styles.css` while Antigravity is editing those files. The invitation to hold hands must stay optional; the player can pause, skip, or leave freely. Honor reduced-motion settings by showing a static pose.
