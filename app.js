(() => {
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  // Core DOM Elements
  const body = document.body;
  const themeMeta = $('meta[name="theme-color"]');
  const skipIntroLink = $("#skip-intro");
  const hud = $("#cinema-hud");
  const prevBtn = $("#prev-chapter");
  const nextBtn = $("#next-chapter");
  const openChaptersBtn = $("#open-chapters");
  const chapterIndicator = $("#chapter-indicator");
  const replayVoiceBtn = $("#replay-voice");
  const audioToggleBtn = $("#audio-toggle");
  const audioIcon = $("#audio-icon");
  const ccToggleBtn = $("#cc-toggle");
  const autoToggleBtn = $("#auto-toggle");
  const autoLabel = $("#auto-label");
  const motionToggleBtn = $("#motion-toggle");
  const exitBtn = $("#exit-movie");

  const worldCamera = $("#world-camera");
  const sceneBgArt = $("#scene-bg-art");
  const sceneMidArt = $("#scene-mid-art");
  const sceneFgArt = $("#scene-fg-art");
  const cinemaParticles = $("#cinema-particles");
  const actorWorldMount = $("#actor-world-mount");
  const actorDarkMount = $("#actor-dark-mount");
  const framesLayer = $("#frames-layer");
  const pageTurnVeil = $("#page-turn-veil");

  const landingDust = $("#landing-dust");
  const hiWhisper = $("#hi-whisper");
  const darkPausePanel = $("#dark-pause-panel");
  const darkPauseLine = $("#dark-pause-line");
  const pauseWatchAutoBtn = $("#pause-watch-auto");
  const pauseOpenChaptersBtn = $("#pause-open-chapters");
  const pauseLeaveBtn = $("#pause-leave");

  const bonkUi = $("#bonk-ui");
  const standUpBtn = $("#stand-up-btn");
  const bonkBtn = $("#bonk-button");
  const bonkActionLabel = $("#bonk-action-label");
  const skipBonkBtn = $("#skip-bonk");
  const bonkFeedback = $("#bonk-feedback");

  const closingUi = $("#closing-ui");
  const closeQuietlyBtn = $("#close-quietly");
  const watchAgainBtn = $("#watch-again");

  const subtitleBar = $("#subtitle-bar");
  const subtitleLine = $("#subtitle-line");

  const handCornerWrap = $("#hand-corner-wrap");
  const handPortal = $("#hand-portal");
  const handWhisper = $("#hand-whisper");
  const handProgressCircle = $("#hand-progress-circle");

  const chaptersDrawer = $("#chapters-drawer");
  const chaptersList = $("#chapters-list");
  const closeChaptersBtn = $("#close-chapters");

  const frameLightbox = $("#frame-lightbox");
  const lightboxMedia = $("#lightbox-media");
  const lightboxCaption = $("#lightbox-caption");
  const closeLightboxBtn = $("#close-lightbox");

  const quietScreen = $("#quiet-screen");
  const restartFromQuietBtn = $("#restart-from-quiet");
  const srStatus = $("#sr-status");

  // Articulated Actor Rig Nodes
  const actor = $("#actor");
  const rigShadow = $("#rig-shadow");
  const rigRoot = $("#rig-root");
  const rigPelvis = $("#rig-pelvis");
  const rigSpine = $("#rig-spine");
  const rigHead = $("#rig-head");
  const rigArmL = $("#rig-arm-l");
  const rigForearmL = $("#rig-forearm-l");
  const rigArmR = $("#rig-arm-r");
  const rigForearmR = $("#rig-forearm-r");
  const rigLegL = $("#rig-leg-l");
  const rigShinL = $("#rig-shin-l");
  const rigFootL = $("#rig-foot-l");
  const rigLegR = $("#rig-leg-r");
  const rigShinR = $("#rig-shin-r");
  const rigFootR = $("#rig-foot-r");
  const blinkLids = $("#actor-blink-lids");
  const talkMouth = $("#actor-talk-mouth");
  const foamHelmet = $("#foam-helmet");
  const plushBopper = $("#plush-bopper");
  const propGuitar = $("#prop-guitar");
  const propPhone = $("#prop-phone");
  const propWrapperFrame = $("#prop-wrapper-frame");
  const propFlower = $("#prop-flower");

  const RING_CIRCUMFERENCE = 2 * Math.PI * 80; // r=80 -> 502.65

  // Movie State Machine
  // Phases: "blackout" | "prologue-drop" | "prologue-ready" | "book-portal" | "playing" | "scene-waiting" | "paused-dark" | "ending-rest" | "quiet-closed"
  let storyData = null;
  let scenes = [];
  let phase = "blackout";
  let resumeTargetPhase = "playing"; // "book-portal" or "playing"
  let sceneIndex = 1; // 1..scenes.length-1 are memory/apology/closing chapters
  let prologueElapsed = 0;
  let prologueVoiceTriggered = false;
  let portalElapsed = 0;
  const PORTAL_DURATION = 5000;
  let sceneElapsed = 0;
  let darkApproachElapsed = 0;

  let isHolding = false;
  let activePointerId = null;
  let keyboardHoldActive = false;
  let handsFree = false;
  let ccEnabled = true;
  let motionEnabled = true;
  let soundEnabled = true;
  let audioUnlocked = false;

  let bonkSkipped = false;
  let bonkCount = 0;
  let bonkAnimStart = -10;
  let squatApologyForgiven = false;
  let dustTriggered = false;
  let renderedSceneKey = "";
  let lastLightboxTrigger = null;
  let lastChaptersTrigger = null;

  function isCompactStage() {
    return (window.innerWidth || 1280) < 760;
  }

  function isModalOpen() {
    return Boolean((frameLightbox && !frameLightbox.hidden) || (chaptersDrawer && !chaptersDrawer.hidden));
  }

  // Discovered Local Plug-and-Play Assets (zero-404 safe)
  const localFiles = {
    photos: new Map(), // lowercase filename or stem -> resolved relative path
    voice: new Map(),
    audio: new Map()
  };

  // Audio Elements
  const voiceAudio = new Audio();
  voiceAudio.preload = "auto";
  voiceAudio.volume = 1.0;
  voiceAudio.addEventListener("error", () => {
    replayVoiceBtn.hidden = true;
  });
  const holdPromptAudio = new Audio();
  holdPromptAudio.preload = "auto";
  holdPromptAudio.volume = 1.0;
  holdPromptAudio.addEventListener("error", () => {});
  const ambientAudio = new Audio();
  ambientAudio.loop = true;
  const AMBIENT_BASE_VOLUME = 0.30; // 30% gentle ambient white-sound bed
  const AMBIENT_DUCK_VOLUME = 0.12; // Ducked during spoken narration
  ambientAudio.volume = AMBIENT_BASE_VOLUME;
  ambientAudio.addEventListener("error", () => {});

  function applyAmbientVolume() {
    if (!soundEnabled) {
      ambientAudio.muted = true;
      return;
    }
    ambientAudio.muted = false;
    const isSpeaking = !voiceAudio.paused && !voiceAudio.ended && voiceAudio.currentTime > 0;
    try {
      ambientAudio.volume = isSpeaking ? AMBIENT_DUCK_VOLUME : AMBIENT_BASE_VOLUME;
    } catch (_) {}
  }
  voiceAudio.addEventListener("play", applyAmbientVolume);
  voiceAudio.addEventListener("pause", applyAmbientVolume);
  voiceAudio.addEventListener("ended", applyAmbientVolume);
  const voiceDurationCache = new Map();
  let activeVoiceSrc = "";
  let dynamicVoiceDurationMs = 0;

  function getSceneDurationMs(sc) {
    const sceneDur = Number.isFinite(sc && sc.durationMs) && sc.durationMs > 0 ? sc.durationMs : 12000;
    const voiceDur = Number.isFinite(dynamicVoiceDurationMs) && dynamicVoiceDurationMs > 0 ? dynamicVoiceDurationMs : 0;
    return Math.max(sceneDur, voiceDur);
  }

  // Current Interpolated Character Pose State
  const rigState = {
    x: 50,
    bottom: 11,
    scale: 0.92,
    dropY: -120, // vh
    pelvisY: 0,
    pelvisRot: 0,
    spineRot: 0,
    headRot: 0,
    armL: 8,
    forearmL: -6,
    armR: -8,
    forearmR: 6,
    legL: 0,
    shinL: 0,
    footL: 0,
    legR: 0,
    shinR: 0,
    footR: 0,
    squashX: 1,
    squashY: 1
  };

  const ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV"];

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function damp(current, target, speed, dtSec) {
    if (!motionEnabled) return target;
    return lerp(current, target, 1 - Math.exp(-speed * dtSec));
  }

  function easeOutCubic(t) {
    const u = clamp(t, 0, 1);
    return 1 - Math.pow(1 - u, 3);
  }

  function easeInOutCubic(t) {
    const u = clamp(t, 0, 1);
    return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
  }

  function announce(msg) {
    if (srStatus && msg) {
      srStatus.textContent = msg;
    }
  }

  function setThemeColor(hex) {
    if (themeMeta) themeMeta.setAttribute("content", hex);
  }

  function setBodyPhase(nextPhase) {
    phase = nextPhase;
    body.dataset.phase = nextPhase;
  }

  function isLocalDevServer() {
    if (window.location.protocol === "file:") return false;
    const host = (window.location.hostname || "").toLowerCase();
    return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
  }

  // Zero-404 Plug-and-Play Local Asset Discovery (runs only on localhost dev servers)
  async function scanAssetDirectory(folderName, targetMap, allowedExts) {
    if (!isLocalDevServer()) return;
    try {
      const resp = await fetch(`./assets/${folderName}/`, { method: "GET" });
      if (!resp.ok) return;
      const contentType = resp.headers.get("content-type") || "";
      if (!contentType.includes("text/html")) return;
      const html = await resp.text();
      const hrefRegex = /href=["']([^"'/?#]+)["']/gi;
      let match;
      while ((match = hrefRegex.exec(html)) !== null) {
        const rawName = decodeURIComponent(match[1]);
        const lower = rawName.toLowerCase();
        const dotIdx = lower.lastIndexOf(".");
        if (dotIdx <= 0) continue;
        const ext = lower.slice(dotIdx + 1);
        if (!allowedExts.includes(ext)) continue;
        const stem = lower.slice(0, dotIdx);
        const fullPath = `./assets/${folderName}/${rawName}`;
        targetMap.set(lower, fullPath);
        if (!targetMap.has(stem)) {
          targetMap.set(stem, fullPath);
        }
      }
    } catch (_) {
      // Directory listing unavailable — fall back to explicit story.json flags
    }
  }

  function resolveAssetPath(configObj, folderMap) {
    if (!configObj) return "";
    const candidates = [configObj.src, configObj.altSrc].filter(Boolean);
    for (const candidate of candidates) {
      const clean = candidate.replace(/^\.\//, "");
      const fileName = clean.split("/").pop().toLowerCase();
      const dotIdx = fileName.lastIndexOf(".");
      const stem = dotIdx > 0 ? fileName.slice(0, dotIdx) : fileName;
      if (folderMap && folderMap.has(fileName)) return folderMap.get(fileName);
      if (folderMap && folderMap.has(stem)) return folderMap.get(stem);
      if (localFiles.voice && localFiles.voice.has(fileName)) return localFiles.voice.get(fileName);
      if (localFiles.voice && localFiles.voice.has(stem)) return localFiles.voice.get(stem);
      if (localFiles.audio && localFiles.audio.has(fileName)) return localFiles.audio.get(fileName);
      if (localFiles.audio && localFiles.audio.has(stem)) return localFiles.audio.get(stem);
      if (configObj.enabled === true || (configObj.enabled !== false && clean.startsWith("assets/"))) {
        return encodeURI(`./${clean}`);
      }
    }
    return "";
  }

  // Audio Management
  let pendingVoicePlay = false;

  function wakeAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        if (!window._movieAudioCtx) window._movieAudioCtx = new AudioCtx();
        if (window._movieAudioCtx.state === "suspended") {
          window._movieAudioCtx.resume().catch(() => {});
        }
      }
    } catch (_) {}
  }

  function stopHoldPromptAudio() {
    if (!holdPromptAudio.paused) {
      holdPromptAudio.pause();
    }
    try {
      holdPromptAudio.currentTime = 0;
    } catch (_) {}
  }

  function unlockAudio() {
    wakeAudioContext();
    if (audioUnlocked) {
      if (ambientAudio.src && ambientAudio.paused && soundEnabled && !isModalOpen() && phase !== "paused-dark" && phase !== "quiet-closed") {
        ambientAudio.play().catch(() => {});
      }
      return;
    }
    audioUnlocked = true;
    const ambSrc = resolveAssetPath(storyData && storyData.ambientMusic, localFiles.audio);
    if (ambSrc && soundEnabled) {
      if (ambientAudio.getAttribute("data-src") !== ambSrc) {
        ambientAudio.src = ambSrc;
        ambientAudio.setAttribute("data-src", ambSrc);
      }
      applyAmbientVolume();
      if (!isModalOpen() && phase !== "paused-dark" && phase !== "quiet-closed") {
        ambientAudio.play().catch(() => {});
      }
    }
  }

  function stopVoice() {
    voiceAudio.pause();
    stopHoldPromptAudio();
    activeVoiceSrc = "";
    dynamicVoiceDurationMs = 0;
    replayVoiceBtn.hidden = true;
    pendingVoicePlay = false;
  }

  function playVoiceForConfig(voiceCfg) {
    stopHoldPromptAudio();
    const resolved = resolveAssetPath(voiceCfg, localFiles.voice);
    dynamicVoiceDurationMs = 0;
    if (!resolved) {
      voiceAudio.pause();
      activeVoiceSrc = "";
      replayVoiceBtn.hidden = true;
      pendingVoicePlay = false;
      return;
    }
    replayVoiceBtn.hidden = false;
    activeVoiceSrc = resolved;
    if (voiceDurationCache.has(resolved)) {
      dynamicVoiceDurationMs = voiceDurationCache.get(resolved);
    }
    if (voiceAudio.getAttribute("data-src") !== resolved) {
      voiceAudio.src = resolved;
      voiceAudio.setAttribute("data-src", resolved);
    } else if (Number.isFinite(voiceAudio.duration) && voiceAudio.duration > 0) {
      const computedMs = Math.ceil(voiceAudio.duration * 1000) + 700;
      voiceDurationCache.set(resolved, computedMs);
      dynamicVoiceDurationMs = computedMs;
    }
    try {
      voiceAudio.currentTime = 0;
    } catch (_) {}
    voiceAudio.muted = !soundEnabled;
    const canAutoStart =
      phase === "playing" ||
      phase === "book-portal" ||
      phase === "prologue-ready" ||
      phase === "prologue-drop";
    if (soundEnabled && canAutoStart && !isModalOpen()) {
      const playPromise = voiceAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          audioUnlocked = true;
          pendingVoicePlay = false;
          if (hiWhisper) hiWhisper.textContent = "Hi, Nidhi…";
          if (ambientAudio.src && ambientAudio.paused && soundEnabled && phase !== "paused-dark" && phase !== "quiet-closed") {
            ambientAudio.play().catch(() => {});
          }
        }).catch(() => {
          // Mobile/browser autoplay policy requires user activation touch/tap
          pendingVoicePlay = true;
          if (hiWhisper && (phase === "prologue-drop" || phase === "prologue-ready")) {
            hiWhisper.textContent = "Hi, Nidhi… (Tap to listen ♪)";
          }
        });
      }
    } else if (!voiceAudio.paused) {
      voiceAudio.pause();
      pendingVoicePlay = false;
    }
  }

  const syncVoiceMetadataDuration = () => {
    if (activeVoiceSrc && Number.isFinite(voiceAudio.duration) && voiceAudio.duration > 0) {
      const computedMs = Math.ceil(voiceAudio.duration * 1000) + 700;
      voiceDurationCache.set(activeVoiceSrc, computedMs);
      dynamicVoiceDurationMs = computedMs;
    }
  };
  voiceAudio.addEventListener("loadedmetadata", syncVoiceMetadataDuration);
  voiceAudio.addEventListener("durationchange", syncVoiceMetadataDuration);

  function pauseAudioPlayback() {
    if (!voiceAudio.paused) voiceAudio.pause();
    if (!ambientAudio.paused) ambientAudio.pause();
  }

  function resumeAudioPlayback() {
    stopHoldPromptAudio();
    if (!soundEnabled || isModalOpen()) return;
    unlockAudio();
    if (activeVoiceSrc && voiceAudio.paused && voiceAudio.currentTime < (voiceAudio.duration || Infinity)) {
      voiceAudio.play().catch(() => {});
    }
    if (ambientAudio.src && ambientAudio.paused && phase !== "paused-dark" && phase !== "quiet-closed") {
      ambientAudio.play().catch(() => {});
    }
  }

  // Subtitle Update
  function updateSubtitleDisplay() {
    let line = "";
    if (phase === "prologue-ready" || phase === "prologue-drop") {
      if (prologueElapsed >= 3600) {
        line = (scenes[0] && scenes[0].subtitle) || "";
      }
    } else if (phase === "book-portal") {
      line = (storyData && storyData.specialVoices && storyData.specialVoices.bookOpen && storyData.specialVoices.bookOpen.subtitle) || "";
    } else if (phase === "playing" || phase === "scene-waiting" || phase === "ending-rest") {
      const sc = scenes[sceneIndex];
      line = (sc && sc.subtitle) || "";
    }

    const showBar = Boolean(ccEnabled && line && phase !== "paused-dark" && phase !== "quiet-closed");
    body.classList.toggle("cc-on", showBar);
    if (showBar) {
      subtitleLine.textContent = line;
      subtitleBar.hidden = false;
    } else {
      subtitleBar.hidden = true;
    }
  }

  // Line-Art Placeholder Illustrations for Empty Photo/Letter Frames
  function getFramePlaceholderSVG(kind) {
    switch (kind) {
      case "circuit":
        return `<svg viewBox="0 0 240 180" aria-hidden="true"><rect width="240" height="180" fill="#f3e3c9"/><path d="M42 132 V82 L82 52 L122 82 V132 Z" fill="#e8c396" stroke="#5a3c28" stroke-width="3"/><rect x="72" y="96" width="20" height="22" fill="#ffe89c" stroke="#5a3c28" stroke-width="2"/><path d="M144 128 H198 V108 C198 101 190 98 171 98 C152 98 144 101 144 108 Z" fill="#e58f88" stroke="#5a3c28" stroke-width="2.5"/><path d="M32 142 H208" stroke="#8a6245" stroke-width="2" stroke-dasharray="4 4"/></svg>`;
      case "guitar":
        return `<svg viewBox="0 0 240 180" aria-hidden="true"><rect width="240" height="180" fill="#232544"/><circle cx="184" cy="42" r="14" fill="#ffe4a8" opacity="0.85"/><path d="M24 156 V108 H94 V156 M148 156 V92 H214 V156" fill="#17182e" stroke="#5c628f" stroke-width="2"/><path d="M104 92 Q126 70 144 86" fill="none" stroke="#f5cb86" stroke-width="2.5" stroke-dasharray="4 4"/><text x="118" y="68" fill="#ffe3a3" font-size="20">♪ ♫</text></svg>`;
      case "snacks":
        return `<svg viewBox="0 0 240 180" aria-hidden="true"><rect width="240" height="180" fill="#f6e4c6"/><circle cx="88" cy="102" r="28" fill="#eab06d" stroke="#5c3b23" stroke-width="2.6"/><circle cx="152" cy="102" r="28" fill="#eab06d" stroke="#5c3b23" stroke-width="2.6"/><path d="M62 54 Q120 34 178 54" fill="none" stroke="#c96b59" stroke-width="3" stroke-linecap="round"/></svg>`;
      case "boat":
        return `<svg viewBox="0 0 240 180" aria-hidden="true"><defs><linearGradient id="fp-sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e36d6a"/><stop offset="100%" stop-color="#f7c47e"/></linearGradient></defs><rect width="240" height="180" fill="url(#fp-sun)"/><circle cx="120" cy="86" r="24" fill="#ffe7ad"/><path d="M0 118 H240 V180 H0 Z" fill="#5e3758" opacity="0.55"/><path d="M68 122 L172 122 L152 140 H88 Z" fill="#3a2328"/></svg>`;
      case "wrapper":
        return `<svg viewBox="0 0 240 180" aria-hidden="true"><rect width="240" height="180" fill="#f5e6d0"/><rect x="68" y="28" width="104" height="124" rx="6" fill="#fbf4e8" stroke="#6e472d" stroke-width="5"/><path d="M92 68 L148 60 L142 118 L96 122 Z" fill="#8f3552" stroke="#e2b45a" stroke-width="2.5"/></svg>`;
      case "nightcall":
        return `<svg viewBox="0 0 240 180" aria-hidden="true"><rect width="240" height="180" fill="#141c3a"/><circle cx="64" cy="48" r="2" fill="#fff"/><circle cx="176" cy="40" r="2.4" fill="#fff"/><circle cx="142" cy="68" r="1.8" fill="#fff"/><circle cx="120" cy="96" r="22" fill="none" stroke="#f5cb86" stroke-width="2" opacity="0.7"/><circle cx="120" cy="96" r="38" fill="none" stroke="#f5cb86" stroke-width="1.4" opacity="0.4"/></svg>`;
      case "letter":
        return `<svg viewBox="0 0 240 180" aria-hidden="true"><rect width="240" height="180" fill="#f7ead7"/><rect x="46" y="44" width="148" height="94" rx="5" fill="#fffaf0" stroke="#7c563c" stroke-width="2.6"/><path d="M48 47 L120 98 L192 47" fill="none" stroke="#7c563c" stroke-width="2.6"/><circle cx="120" cy="94" r="9" fill="#d97b78"/></svg>`;
      default:
        return `<svg viewBox="0 0 240 180" aria-hidden="true"><rect width="240" height="180" fill="#f4e6d2"/><rect x="34" y="30" width="172" height="120" rx="8" fill="none" stroke="#8c684c" stroke-width="2" stroke-dasharray="5 5"/><circle cx="92" cy="74" r="13" fill="#eab676"/><path d="M46 138 L96 96 L134 124 L164 102 L194 138 Z" fill="#c9956b" opacity="0.65"/></svg>`;
    }
  }

  function spawnCinemaParticles(sceneId) {
    if (!cinemaParticles) return;
    cinemaParticles.innerHTML = "";
    if (!motionEnabled) return;

    let particleClass = "particle-dust";
    let count = 12;

    if (sceneId === "rooftop-snap" || sceneId === "first-i-love-you" || sceneId === "book-portal") {
      particleClass = "particle-firefly";
      count = 18;
    } else if (sceneId === "closing") {
      particleClass = "particle-petal";
      count = 22;
    } else if (sceneId === "distance") {
      particleClass = "particle-raindrop";
      count = 24;
    } else if (sceneId === "classmates" || sceneId === "love-teacher") {
      particleClass = "particle-dust";
      count = 16;
    } else if (sceneId === "river-sunset") {
      particleClass = "particle-firefly";
      count = 15;
    } else {
      particleClass = "particle-dust";
      count = 10;
    }

    const frag = (typeof document.createDocumentFragment === "function")
      ? document.createDocumentFragment()
      : cinemaParticles;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = `cinema-particle ${particleClass}`;
      p.style.left = `${(Math.random() * 96 + 2).toFixed(1)}%`;
      p.style.top = `${(Math.random() * 88 + 4).toFixed(1)}%`;
      p.style.animationDelay = `${(Math.random() * 6).toFixed(2)}s`;
      p.style.animationDuration = `${(5 + Math.random() * 4).toFixed(2)}s`;
      if (particleClass === "particle-firefly") {
        const sz = (3.5 + Math.random() * 3).toFixed(1);
        p.style.width = `${sz}px`;
        p.style.height = `${sz}px`;
      }
      frag.appendChild(p);
    }
    if (frag !== cinemaParticles) cinemaParticles.appendChild(frag);
  }

  function renderFramesForScene(scene) {
    framesLayer.innerHTML = "";
    const frames = (scene && scene.frames) || [];
    const isSpread = scene && scene.id === "letters-and-years";
    framesLayer.classList.toggle("is-book-spread", Boolean(isSpread));
    if (!frames.length) return;

    const host = isSpread ? document.createElement("div") : framesLayer;
    if (isSpread) {
      host.className = "book-spread-grid";
      framesLayer.appendChild(host);
    }

    frames.forEach((frame) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `memory-frame ${frame.slotStyle || "polaroid-top-right"}`;
      btn.setAttribute("aria-label", `${frame.caption || "Memory frame"} — inspect frame`);

      const visual = document.createElement("div");
      visual.className = "frame-visual";

      const resolvedMedia = resolveAssetPath(frame, localFiles.photos);
      const isVideo = Boolean(resolvedMedia && /\.(mp4|webm|mov)$/i.test(resolvedMedia));
      if (resolvedMedia) {
        if (isVideo) {
          const video = document.createElement("video");
          video.src = resolvedMedia;
          video.autoplay = true;
          video.loop = true;
          video.muted = true;
          video.playsInline = true;
          video.setAttribute("playsinline", "");
          video.setAttribute("webkit-playsinline", "");
          video.setAttribute("muted", "");
          video.preload = "auto";
          video.addEventListener("error", () => {
            visual.innerHTML = getFramePlaceholderSVG(frame.illustration);
          });
          visual.appendChild(video);

          const badge = document.createElement("span");
          badge.className = "frame-badge-video";
          badge.innerHTML = "▶";
          visual.appendChild(badge);

          video.play().catch(() => {});
        } else {
          const img = document.createElement("img");
          img.src = resolvedMedia;
          img.alt = frame.alt || frame.caption || "Shared memory photo";
          img.loading = "lazy";
          img.addEventListener("error", () => {
            visual.innerHTML = getFramePlaceholderSVG(frame.illustration);
          });
          visual.appendChild(img);
        }
      } else {
        visual.innerHTML = getFramePlaceholderSVG(frame.illustration);
      }

      const cap = document.createElement("span");
      cap.className = "frame-caption";
      cap.textContent = frame.caption || "Memory frame";

      btn.appendChild(visual);
      btn.appendChild(cap);

      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        openLightbox(frame, resolvedMedia);
      });

      host.appendChild(btn);
    });
  }

  function openLightbox(frame, resolvedMedia) {
    lightboxMedia.innerHTML = "";
    const isVideo = Boolean(resolvedMedia && /\.(mp4|webm|mov)$/i.test(resolvedMedia));
    if (resolvedMedia) {
      if (isVideo) {
        const video = document.createElement("video");
        video.src = resolvedMedia;
        video.autoplay = true;
        video.loop = true;
        video.controls = true;
        video.playsInline = true;
        video.setAttribute("playsinline", "");
        video.style.maxWidth = "min(90vw, 760px)";
        video.style.maxHeight = "min(75vh, 600px)";
        video.style.borderRadius = "8px";
        video.style.boxShadow = "0 16px 40px rgba(0,0,0,0.6)";
        lightboxMedia.appendChild(video);
        video.play().catch(() => {});
      } else {
        const img = document.createElement("img");
        img.src = resolvedMedia;
        img.alt = frame.alt || frame.caption || "Memory photo";
        img.addEventListener("error", () => {
          lightboxMedia.innerHTML = getFramePlaceholderSVG(frame.illustration);
        });
        lightboxMedia.appendChild(img);
      }
    } else {
      lightboxMedia.innerHTML = getFramePlaceholderSVG(frame.illustration);
    }
    lightboxCaption.textContent = frame.caption || "Memory frame";
    frameLightbox.hidden = false;
    closeLightboxBtn.focus();
  }

  function closeLightbox() {
    const v = lightboxMedia.querySelector("video");
    if (v) {
      try {
        v.pause();
        v.src = "";
      } catch (_) {}
    }
    frameLightbox.hidden = true;
  }

  // Bespoke 1600x900 SVG Stage Builder for Every Scene
  function buildStageArt(sceneId) {
    if (renderedSceneKey === sceneId) return;
    renderedSceneKey = sceneId;
    sceneBgArt.innerHTML = "";
    sceneMidArt.innerHTML = "";
    sceneFgArt.innerHTML = "";

    switch (sceneId) {
      case "book-portal":
        sceneBgArt.innerHTML = `
          <rect x="0" y="640" width="1600" height="260" fill="#1e1310"/>
          <path d="M0 640 H1600" stroke="#4d3224" stroke-width="4"/>
          <circle cx="800" cy="430" r="360" fill="url(#warm-lamp-glow)" id="portal-lamp-aura"/>
          <rect x="180" y="140" width="220" height="360" rx="8" fill="#171019" stroke="#3c2824" stroke-width="4"/>
          <line x1="180" y1="250" x2="400" y2="250" stroke="#3c2824" stroke-width="5"/>
          <line x1="180" y1="360" x2="400" y2="360" stroke="#3c2824" stroke-width="5"/>
        `;
        sceneMidArt.innerHTML = `
          <!-- Pedestal Table & Illuminated Memory Book -->
          <g id="book-pedestal" transform="translate(800, 560)">
            <rect x="-150" y="0" width="300" height="22" rx="6" fill="#5e3924" stroke="#28160d" stroke-width="3"/>
            <rect x="-110" y="22" width="32" height="150" fill="#462919"/>
            <rect x="78" y="22" width="32" height="150" fill="#462919"/>
            <!-- Openable Handmade Memory Book -->
            <g id="magic-book" transform="translate(0, -14)">
              <ellipse id="book-inner-glow" cx="0" cy="-12" rx="115" ry="42" fill="#ffe5a3" opacity="0.25"/>
              <path d="M-98 8 L0 16 L98 8 L86 -18 L0 -8 L-86 -18 Z" fill="#6b3226" stroke="#2b120d" stroke-width="3"/>
              <path d="M-88 3 Q-44 -12 0 10 Q44 -12 88 3 L80 -14 Q40 -26 0 -4 Q-40 -26 -80 -14 Z" fill="#fcf3df" stroke="#bfa47e" stroke-width="2"/>
              <g id="book-cover-wing">
                <path d="M0 10 L-92 4 L-82 -20 L0 -8 Z" fill="#823b2c" stroke="#2b120d" stroke-width="2.5"/>
                <rect x="-64" y="-12" width="38" height="8" rx="2" fill="#e8c07a" opacity="0.8"/>
              </g>
            </g>
          </g>
          <g id="book-sparks">
            <circle cx="780" cy="500" r="4" fill="#ffe8ad"/>
            <circle cx="825" cy="480" r="5" fill="#ffd27d"/>
            <circle cx="800" cy="460" r="3.5" fill="#fff5d6"/>
          </g>
        `;
        break;

      case "classmates":
        sceneBgArt.innerHTML = `
          <!-- Sunlit Classroom Back Wall & Tall Windows -->
          <rect x="0" y="650" width="1600" height="250" fill="#d8b384"/>
          <g id="school-classroom-layer">
            <rect x="520" y="130" width="580" height="270" rx="10" fill="#2c5945" stroke="#7d5233" stroke-width="12"/>
            <path d="M560 200 H820 M560 245 H740" stroke="rgba(255,255,255,0.45)" stroke-width="4" stroke-linecap="round"/>
            <text x="960" y="195" fill="rgba(255,255,255,0.52)" font-size="24" font-family="Georgia, serif">Class VII – VIII</text>
            <!-- Tall sunlit windows on right -->
            <rect x="1210" y="110" width="150" height="330" rx="6" fill="#eaf8ff" stroke="#8c6343" stroke-width="8"/>
            <line x1="1285" y1="110" x2="1285" y2="440" stroke="#8c6343" stroke-width="5"/>
            <line x1="1210" y1="275" x2="1360" y2="275" stroke="#8c6343" stroke-width="5"/>
            <polygon points="1210,110 1360,110 1120,650 860,650" fill="rgba(255,244,198,0.26)"/>
          </g>
          <!-- Online-School Sleepy Morning Overlay (fades out at 0.45) -->
          <g id="online-school-vignette">
            <rect x="0" y="0" width="1600" height="900" fill="rgba(18, 24, 44, 0.76)"/>
            <circle cx="520" cy="520" r="240" fill="url(#warm-lamp-glow)" opacity="0.55"/>
          </g>
        `;
        sceneMidArt.innerHTML = `
          <!-- Classroom Desks -->
          <g id="school-desks">
            <g transform="translate(650, 565)">
              <rect x="-90" y="0" width="180" height="16" rx="4" fill="#9c6b43" stroke="#4d311b" stroke-width="2.5"/>
              <rect x="-72" y="16" width="14" height="95" fill="#6e482b"/>
              <rect x="58" y="16" width="14" height="95" fill="#6e482b"/>
            </g>
            <g transform="translate(1060, 585)">
              <rect x="-105" y="0" width="210" height="18" rx="4" fill="#8f5f3a" stroke="#4d311b" stroke-width="2.5"/>
              <rect x="-85" y="18" width="15" height="100" fill="#633f24"/>
              <rect x="70" y="18" width="15" height="100" fill="#633f24"/>
            </g>
          </g>
          <!-- Online Class Laptop on Left Desk -->
          <g id="online-laptop-group" transform="translate(470, 548)">
            <rect x="-110" y="20" width="220" height="16" rx="4" fill="#5e4031"/>
            <rect x="-54" y="-44" width="108" height="64" rx="5" fill="#1e2738" stroke="#93a8c9" stroke-width="2.5"/>
            <rect x="-46" y="-36" width="42" height="22" fill="#4f6d8f"/>
            <rect x="4" y="-36" width="42" height="22" fill="#5a7b9c"/>
            <rect x="-46" y="-8" width="42" height="22" fill="#486382"/>
            <rect x="4" y="-8" width="42" height="22" fill="#6385a8"/>
            <text id="sleepy-zzz" x="-95" y="-55" fill="#ffe4a8" font-size="26" font-family="Georgia, serif">z Z z</text>
          </g>
          <!-- Gliding Paper Airplane -->
          <g id="paper-plane" transform="translate(420, 320)">
            <polygon points="0,0 -44,-12 -32,6" fill="#fffdf7" stroke="#6c5a49" stroke-width="2"/>
            <polygon points="0,0 -32,6 -26,16" fill="#e6dec8" stroke="#6c5a49" stroke-width="1.6"/>
          </g>
        `;
        break;

      case "science-project":
        sceneBgArt.innerHTML = `
          <rect x="0" y="650" width="1600" height="250" fill="#3a2620"/>
          <circle cx="800" cy="480" r="420" fill="url(#warm-lamp-glow)"/>
        `;
        sceneMidArt.innerHTML = `
          <!-- Craft Worktable (Centered for Mobile & Desktop) -->
          <g transform="translate(800, 575)">
            <rect x="-360" y="0" width="720" height="24" rx="6" fill="#825336" stroke="#361f12" stroke-width="3"/>
            <rect x="-310" y="24" width="28" height="145" fill="#593621"/>
            <rect x="282" y="24" width="28" height="145" fill="#593621"/>

            <!-- Series & Parallel Circuit Miniature Houses -->
            <g transform="translate(-145, 0)">
              <path d="M-78 0 V-78 L0 -132 L78 -78 V0 Z" fill="#dfc19a" stroke="#472d1b" stroke-width="3"/>
              <path d="M-88 -74 L0 -138 L88 -74" fill="none" stroke="#8f3f34" stroke-width="8" stroke-linecap="round"/>
              <rect class="circuit-win" x="-48" y="-60" width="34" height="34" rx="3" fill="#3b3530" stroke="#472d1b" stroke-width="2.5"/>
              <rect class="circuit-win" x="14" y="-60" width="34" height="34" rx="3" fill="#3b3530" stroke="#472d1b" stroke-width="2.5"/>
              <circle class="circuit-led" cx="0" cy="-96" r="8" fill="#555"/>
            </g>

            <g transform="translate(45, 0)">
              <path d="M-72 0 V-74 L0 -124 L72 -74 V0 Z" fill="#ead0ad" stroke="#472d1b" stroke-width="3"/>
              <path d="M-82 -70 L0 -130 L82 -70" fill="none" stroke="#366c73" stroke-width="8" stroke-linecap="round"/>
              <rect class="circuit-win" x="-44" y="-56" width="30" height="32" rx="3" fill="#3b3530" stroke="#472d1b" stroke-width="2.5"/>
              <rect class="circuit-win" x="14" y="-56" width="30" height="32" rx="3" fill="#3b3530" stroke="#472d1b" stroke-width="2.5"/>
              <circle class="circuit-led" cx="0" cy="-90" r="8" fill="#555"/>
            </g>

            <!-- Battery & Circuit Wires -->
            <rect x="-265" y="-36" width="36" height="36" rx="4" fill="#28344a" stroke="#e8b468" stroke-width="2.5"/>
            <path id="circuit-wire-line" d="M-229 -18 H-145 M-67 -18 H45" stroke="#d9534f" stroke-width="3.2" stroke-dasharray="6 4"/>

            <!-- Nidhi's Tiny Hand-Painted Paper Sofa & Bed -->
            <g id="paper-furniture-tray" transform="translate(215, 0)">
              <ellipse cx="0" cy="-6" rx="95" ry="14" fill="rgba(255, 232, 182, 0.35)"/>
              <!-- Tiny Painted Paper Sofa -->
              <path d="M-66 -4 H-8 V-26 C-8 -34 -16 -38 -37 -38 C-58 -38 -66 -34 -66 -26 Z" fill="#e57d78" stroke="#4a2725" stroke-width="2.4"/>
              <rect x="-72" y="-22" width="12" height="18" rx="4" fill="#d16661" stroke="#4a2725" stroke-width="2"/>
              <rect x="-14" y="-22" width="12" height="18" rx="4" fill="#d16661" stroke="#4a2725" stroke-width="2"/>
              <!-- Tiny Painted Paper Bed -->
              <rect x="14" y="-22" width="66" height="18" rx="3" fill="#7eb5b0" stroke="#2c4745" stroke-width="2.4"/>
              <rect x="14" y="-36" width="10" height="32" rx="2" fill="#8f5d3e" stroke="#3b2416" stroke-width="2"/>
              <rect x="26" y="-29" width="20" height="9" rx="4" fill="#fff6e8" stroke="#5c4b3e" stroke-width="1.6"/>
            </g>
          </g>

          <!-- Floating First Direct Message Photo Card -->
          <g id="first-msg-card" transform="translate(1010, 320)" opacity="0">
            <rect x="-92" y="-64" width="184" height="118" rx="16" fill="#fff9ee" stroke="#e6b877" stroke-width="3"/>
            <rect x="-74" y="-48" width="148" height="72" rx="8" fill="#f5e3cc"/>
            <path d="M-46 6 H-4 V-12 C-4 -18 -12 -22 -25 -22 C-38 -22 -46 -18 -46 -12 Z" fill="#e57d78"/>
            <rect x="10" y="-8" width="44" height="14" rx="3" fill="#7eb5b0"/>
            <circle cx="66" cy="36" r="10" fill="#0084ff"/>
            <path d="M61 37 L65 33 L68 37 L72 33" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
          </g>
        `;
        break;

      case "rooftop-snap":
        sceneBgArt.innerHTML = `
          <!-- Twilight Stars & Crescent Moon -->
          <circle cx="280" cy="140" r="2.2" fill="#fff6dc"/>
          <circle cx="520" cy="95" r="2.6" fill="#fff6dc"/>
          <circle cx="790" cy="130" r="2" fill="#fff6dc"/>
          <circle cx="1040" cy="88" r="2.8" fill="#fff6dc"/>
          <circle cx="1320" cy="148" r="32" fill="#ffe7b0" opacity="0.88"/>
          <circle cx="1334" cy="138" r="28" fill="#202046"/>
          <!-- Distant City Silhouette -->
          <path d="M0 640 V490 H140 V440 H280 V510 H440 V460 H620 V540 H980 V470 H1140 V520 H1600 V640 Z" fill="rgba(16, 15, 34, 0.58)"/>
        `;
        sceneMidArt.innerHTML = `
          <!-- Left: Narrator's Rooftop -->
          <rect x="80" y="640" width="660" height="260" fill="#211d33"/>
          <rect x="80" y="568" width="660" height="74" fill="#322b4a" stroke="#151124" stroke-width="3"/>
          <line x1="80" y1="568" x2="740" y2="568" stroke="#f0be7d" stroke-width="3" opacity="0.5"/>
          <!-- Rooftop String Lights & Potted Plants -->
          <path d="M110 380 Q410 455 710 390" fill="none" stroke="#5b4d6e" stroke-width="2"/>
          <circle cx="210" cy="404" r="6" fill="#ffe09c"/>
          <circle cx="340" cy="422" r="6" fill="#ffe09c"/>
          <circle cx="480" cy="424" r="6" fill="#ffe09c"/>
          <circle cx="610" cy="408" r="6" fill="#ffe09c"/>
          <rect x="650" y="534" width="38" height="34" rx="4" fill="#9e553b"/>
          <path d="M669 534 C650 510 652 492 669 498 C686 492 688 510 669 534 Z" fill="#3b7559"/>

          <!-- Right: Neighboring Building & Warm Glowing Balcony (Zero invented likeness of Nidhi) -->
          <rect x="1050" y="250" width="430" height="650" fill="#231e38" stroke="#131022" stroke-width="3"/>
          <g transform="translate(1110, 360)">
            <!-- Warm Lit Balcony Doorway -->
            <rect x="0" y="0" width="170" height="220" rx="8" fill="#ffdfa6"/>
            <ellipse cx="85" cy="110" rx="125" ry="135" fill="url(#warm-lamp-glow)" opacity="0.72"/>
            <!-- Soft Billowing Sheer Curtains -->
            <path id="balcony-curtain-l" d="M0 0 H54 C48 80 34 150 18 220 H0 Z" fill="rgba(255, 250, 240, 0.78)"/>
            <path id="balcony-curtain-r" d="M170 0 H116 C122 80 136 150 152 220 H170 Z" fill="rgba(255, 250, 240, 0.78)"/>
            <!-- Balcony Railing -->
            <rect x="-22" y="156" width="214" height="68" fill="rgba(28, 23, 46, 0.85)" stroke="#70628c" stroke-width="3"/>
            <path d="M0 156 V224 M38 156 V224 M76 156 V224 M114 156 V224 M152 156 V224" stroke="#70628c" stroke-width="2.5"/>
          </g>

          <!-- Floating Guitar Notes & Travelling Snap Frames -->
          <g id="rooftop-notes">
            <text id="note-1" x="620" y="450" fill="#ffe49e" font-size="34">♪</text>
            <text id="note-2" x="720" y="410" fill="#ffd089" font-size="30">♫</text>
            <text id="note-3" x="830" y="440" fill="#ffe49e" font-size="28">♪</text>
          </g>
          <g id="snap-travel-card" transform="translate(1120, 430)" opacity="0">
            <rect x="-32" y="-42" width="64" height="84" rx="10" fill="#fff8e8" stroke="#f5be6b" stroke-width="3"/>
            <text x="0" y="8" text-anchor="middle" fill="#d97a48" font-size="26">♫</text>
          </g>
        `;
        break;

      case "best-friend-routines":
        sceneBgArt.innerHTML = `
          <!-- Beat 1 Layer: Power-Cut Moonlit Rooftops -->
          <g id="powercut-layer">
            <rect x="0" y="0" width="1600" height="900" fill="#10182e"/>
            <circle cx="800" cy="145" r="42" fill="#eef4ff" opacity="0.9"/>
            <rect x="90" y="590" width="600" height="310" fill="#1b243d"/>
            <rect x="980" y="340" width="480" height="560" fill="#1d2642"/>
            <!-- City Windows that Flicker OFF in Power Cut -->
            <g id="power-grid-windows">
              <rect x="1040" y="390" width="54" height="68" fill="#ffd98e"/>
              <rect x="1130" y="390" width="54" height="68" fill="#ffd98e"/>
              <rect x="1280" y="390" width="54" height="68" fill="#ffd98e"/>
              <rect x="210" y="640" width="52" height="64" fill="#ffd98e"/>
              <rect x="310" y="640" width="52" height="64" fill="#ffd98e"/>
            </g>
            <!-- Candlelit Balcony Glow After Power Cut -->
            <ellipse id="powercut-candle" cx="1090" cy="520" rx="75" ry="85" fill="url(#warm-lamp-glow)" opacity="0"/>
            <path id="silent-song-arc" d="M640 500 Q860 390 1070 490" fill="none" stroke="#9be3de" stroke-width="3" stroke-dasharray="8 8" opacity="0"/>
          </g>

          <!-- Beat 2 Layer: Sunny Afternoon Coaching Street & Snack Cart -->
          <g id="coaching-day-layer" opacity="0">
            <rect x="0" y="0" width="1600" height="640" fill="#fce4bc"/>
            <circle cx="260" cy="150" r="56" fill="#fff3c4"/>
            <rect x="0" y="640" width="1600" height="260" fill="#c7a987"/>
            <path d="M0 640 H1600" stroke="#8a6c4f" stroke-width="4"/>
            <!-- Coaching Building Gate -->
            <rect x="180" y="250" width="420" height="390" rx="8" fill="#f3d2ac" stroke="#8a6240" stroke-width="4"/>
            <rect x="280" y="290" width="220" height="48" rx="8" fill="#355c6e"/>
            <text x="390" y="322" text-anchor="middle" fill="#fff7e8" font-size="22" font-weight="700" letter-spacing="3">COACHING</text>
            <!-- Leafy Street Tree -->
            <rect x="770" y="450" width="32" height="190" fill="#6b442a"/>
            <circle cx="786" cy="400" r="92" fill="#4f8f63"/>
            <circle cx="732" cy="430" r="68" fill="#3f7a52"/>
            <circle cx="842" cy="430" r="68" fill="#5ea373"/>
            <!-- Street Food / Fuchka Snack Cart -->
            <g transform="translate(1180, 560)">
              <rect x="-95" y="-50" width="190" height="72" rx="8" fill="#d96846" stroke="#4f2316" stroke-width="3"/>
              <path d="M-110 -128 H110 L92 -92 H-92 Z" fill="#f2b857" stroke="#4f2316" stroke-width="2.5"/>
              <line x1="-82" y1="-50" x2="-82" y2="-92" stroke="#4f2316" stroke-width="4"/>
              <line x1="82" y1="-50" x2="82" y2="-92" stroke="#4f2316" stroke-width="4"/>
              <circle cx="-55" cy="52" r="28" fill="#3a281d" stroke="#f5e6d0" stroke-width="3"/>
              <circle cx="55" cy="52" r="28" fill="#3a281d" stroke="#f5e6d0" stroke-width="3"/>
            </g>
          </g>
        `;
        break;

      case "river-sunset":
        sceneBgArt.innerHTML = `
          <!-- Sunset Sun & River Water -->
          <g id="river-sunset-layer">
            <circle cx="800" cy="430" r="115" fill="#ffdf9a" opacity="0.92"/>
            <path d="M0 490 Q420 465 820 490 T1600 485 V900 H0 Z" fill="url(#river-water-grad)"/>
            <!-- Shimmering Sunset Reflections -->
            <g id="water-shimmers" opacity="0.75">
              <rect x="690" y="515" width="220" height="8" rx="4" fill="#ffe6a8"/>
              <rect x="720" y="545" width="160" height="7" rx="3.5" fill="#ffd28a"/>
              <rect x="745" y="575" width="110" height="6" rx="3" fill="#ffbe78"/>
            </g>
            <!-- Wooden Jetty for Beat 2 (Framed for Mobile & Desktop) -->
            <g id="river-jetty" transform="translate(920, 575)" opacity="0">
              <rect x="-140" y="0" width="360" height="22" rx="4" fill="#593726"/>
              <rect x="-100" y="22" width="22" height="140" fill="#3d2418"/>
              <rect x="60" y="22" width="22" height="140" fill="#3d2418"/>
              <rect x="180" y="22" width="22" height="140" fill="#3d2418"/>
              <!-- Abstract Boatman Silhouette & Fare Overcharge Bubble -->
              <g transform="translate(100, -110)">
                <circle cx="0" cy="0" r="22" fill="#231624"/>
                <path d="M-28 110 L-22 24 H22 L28 110 Z" fill="#231624"/>
                <g id="overcharge-bubble" transform="translate(-75, -42)">
                  <rect x="-58" y="-24" width="116" height="42" rx="20" fill="#fff6e0" stroke="#592e2e" stroke-width="3"/>
                  <text x="0" y="5" text-anchor="middle" fill="#a83838" font-size="20" font-weight="800">৳ ৳ ৳ !</text>
                </g>
              </g>
            </g>
          </g>

          <!-- Beat 3 Layer: Dusk Lantern-Lit Rickshaw Road -->
          <g id="rickshaw-dusk-layer" opacity="0">
            <rect x="0" y="0" width="1600" height="650" fill="#231c3d"/>
            <rect x="0" y="650" width="1600" height="250" fill="#181526"/>
            <circle cx="480" cy="340" r="110" fill="url(#warm-lamp-glow)" opacity="0.65"/>
            <circle cx="1120" cy="340" r="110" fill="url(#warm-lamp-glow)" opacity="0.65"/>
            <rect x="475" y="340" width="10" height="310" fill="#3b334f"/>
            <rect x="1115" y="340" width="10" height="310" fill="#3b334f"/>
          </g>
        `;
        sceneMidArt.innerHTML = `
          <!-- Wooden River Boat Canopy & Seat (Behind Actor) -->
          <g id="river-boat-back" transform="translate(700, 610)">
            <path d="M-92 -12 C-70 -92 70 -92 92 -12 Z" fill="#8f5638" stroke="#2e180e" stroke-width="3"/>
            <path d="M-76 -12 C-56 -74 56 -74 76 -12" fill="none" stroke="#b87650" stroke-width="2.5" stroke-dasharray="6 5"/>
            <rect x="-135" y="-16" width="270" height="12" rx="4" fill="#593322"/>
          </g>
          <!-- Rickshaw Crimson Hood & Seat (Behind Actor) -->
          <g id="rickshaw-back" transform="translate(760, 635)" opacity="0">
            <path d="M-132 -38 C-138 -166 -6 -178 30 -88 L34 -38 Z" fill="#c44953" stroke="#3b171c" stroke-width="3.5"/>
            <path d="M-118 -78 Q-52 -140 16 -78" fill="none" stroke="#f5cb78" stroke-width="4"/>
            <rect x="-126" y="-42" width="176" height="34" rx="6" fill="#2d3b59" stroke="#141a29" stroke-width="3"/>
          </g>
        `;
        sceneFgArt.innerHTML = `
          <!-- Wooden River Boat Outer Hull (In Front of Actor's Lower Legs) -->
          <g id="river-boat-front" transform="translate(700, 610)">
            <path d="M-196 -18 Q0 42 196 -18 L148 38 H-148 Z" fill="#3d2219" stroke="#1c0e0a" stroke-width="3"/>
            <path d="M-162 6 Q0 44 162 6" fill="none" stroke="#784733" stroke-width="2.5"/>
            <path d="M-156 38 Q0 50 156 38" fill="none" stroke="#ffd894" stroke-width="3" opacity="0.65"/>
          </g>
          <!-- Rolling Rickshaw Side Rail, Footboard & Spoked Wheels (In Front of Actor's Lower Legs) -->
          <g id="rickshaw-front" transform="translate(760, 635)" opacity="0">
            <path d="M-126 -10 H58 L82 28 H-110 Z" fill="#1d2538" stroke="#0f1420" stroke-width="2.8"/>
            <path d="M-124 -42 H-24 L-12 -10 H-124 Z" fill="#24314a" stroke="#111726" stroke-width="2.5"/>
            <line x1="50" y1="-22" x2="155" y2="-22" stroke="#6c7a96" stroke-width="5"/>
            <g id="rickshaw-wheel-back" transform="translate(-75, 12)">
              <circle cx="0" cy="0" r="48" fill="none" stroke="#e8dcc4" stroke-width="6"/>
              <line x1="-46" y1="0" x2="46" y2="0" stroke="#c8ba9e" stroke-width="2"/>
              <line x1="0" y1="-46" x2="0" y2="46" stroke="#c8ba9e" stroke-width="2"/>
            </g>
            <g id="rickshaw-wheel-front" transform="translate(165, 16)">
              <circle cx="0" cy="0" r="44" fill="none" stroke="#e8dcc4" stroke-width="6"/>
              <line x1="-42" y1="0" x2="42" y2="0" stroke="#c8ba9e" stroke-width="2"/>
              <line x1="0" y1="-42" x2="0" y2="42" stroke="#c8ba9e" stroke-width="2"/>
            </g>
          </g>
        `;
        break;

      case "love-teacher":
        sceneBgArt.innerHTML = `
          <rect x="0" y="650" width="1600" height="250" fill="#c9966b"/>
          <circle cx="1050" cy="340" r="340" fill="url(#warm-lamp-glow)"/>
        `;
        sceneMidArt.innerHTML = `
          <!-- Playful "Love Teacher" Easel Board -->
          <g transform="translate(960, 560)">
            <line x1="-65" y1="-150" x2="-95" y2="95" stroke="#6e472b" stroke-width="10" stroke-linecap="round"/>
            <line x1="65" y1="-150" x2="95" y2="95" stroke="#6e472b" stroke-width="10" stroke-linecap="round"/>
            <rect x="-115" y="-215" width="230" height="155" rx="8" fill="#fffaf0" stroke="#7c5335" stroke-width="5"/>
            <text x="0" y="-168" text-anchor="middle" fill="#6e472b" font-size="18" font-family="Georgia, serif">“Love Teacher 101”</text>
            <path d="M-65 -115 Q-10 -155 45 -115" fill="none" stroke="#d9756c" stroke-width="3" stroke-dasharray="5 5"/>
            <text x="-76" y="-108" fill="#7c5335" font-size="24">?</text>
            <text x="58" y="-108" fill="#d9756c" font-size="22">✦</text>
          </g>
          <!-- Floating Morning Paper Notes -->
          <g id="morning-notes">
            <g transform="translate(460, 290) rotate(-6)">
              <rect x="-70" y="-24" width="140" height="48" rx="12" fill="#fff9eb" stroke="#d9ad73" stroke-width="2"/>
              <circle cx="-42" cy="0" r="9" fill="#f5b952"/>
              <line x1="-22" y1="-4" x2="48" y2="-4" stroke="#9e7b56" stroke-width="3" stroke-linecap="round"/>
              <line x1="-22" y1="6" x2="28" y2="6" stroke="#c2a382" stroke-width="3" stroke-linecap="round"/>
            </g>
          </g>
        `;
        break;

      case "distance":
        sceneBgArt.innerHTML = `
          <rect x="0" y="650" width="1600" height="250" fill="#1e2436"/>
          <!-- Two Quiet Buildings Separated by Still Dusk Lane -->
          <rect x="80" y="210" width="440" height="440" fill="#273047"/>
          <rect x="1080" y="210" width="440" height="440" fill="#273047"/>
          <rect x="330" y="320" width="90" height="125" rx="4" fill="#3a4563"/>
          <rect x="1180" y="320" width="90" height="125" rx="4" fill="#3a4563"/>
          <!-- Two-Day Celestial Arc -->
          <circle id="quiet-moon" cx="560" cy="180" r="24" fill="#cad6f0" opacity="0.72"/>
        `;
        break;

      case "chocolate-snap":
        sceneBgArt.innerHTML = `
          <rect x="0" y="650" width="1600" height="250" fill="#4f332d"/>
          <circle cx="800" cy="430" r="410" fill="url(#warm-lamp-glow)"/>
          <!-- Two Windows Reconnected by Warm String Glow -->
          <rect x="1100" y="270" width="220" height="260" rx="8" fill="#3b2638" stroke="#6e4a5c" stroke-width="4"/>
          <rect id="reconnect-window-glow" x="1122" y="292" width="176" height="216" rx="4" fill="#ffe29e" opacity="0.2"/>
          <path id="reconnect-light-thread" d="M780 450 Q960 360 1180 410" fill="none" stroke="#ffe5a3" stroke-width="4" stroke-dasharray="10 8" opacity="0"/>
        `;
        break;

      case "first-i-love-you":
        sceneBgArt.innerHTML = `
          <rect x="0" y="660" width="1600" height="240" fill="#10152b"/>
          <!-- Starlit November Sky Outside Tall Window -->
          <g id="nov-stars">
            <circle cx="620" cy="140" r="2.4" fill="#fff8e3"/>
            <circle cx="760" cy="190" r="3" fill="#ffe6ad"/>
            <circle cx="940" cy="125" r="2.2" fill="#fff8e3"/>
            <circle cx="1060" cy="210" r="2.6" fill="#fff8e3"/>
            <circle cx="860" cy="260" r="2" fill="#ffe6ad"/>
          </g>
          <!-- Open Night Window -->
          <rect x="560" y="95" width="560" height="440" rx="10" fill="none" stroke="#36416b" stroke-width="14"/>
          <line x1="840" y1="95" x2="840" y2="535" stroke="#36416b" stroke-width="8"/>
          <!-- Unmarked November 2023 Wall Calendar (No specific day!) -->
          <g transform="translate(330, 260)">
            <rect x="-68" y="-58" width="136" height="118" rx="8" fill="#f7efe2" stroke="#47517a" stroke-width="3"/>
            <rect x="-68" y="-58" width="136" height="32" rx="6" fill="#6b4d6e"/>
            <text x="0" y="-36" text-anchor="middle" fill="#fff6e6" font-size="13" font-weight="700" letter-spacing="1.2">NOVEMBER 2023</text>
            <g fill="#c9bfb0" opacity="0.65">
              <rect x="-48" y="-10" width="18" height="12" rx="2"/><rect x="-20" y="-10" width="18" height="12" rx="2"/><rect x="8" y="-10" width="18" height="12" rx="2"/><rect x="34" y="-10" width="18" height="12" rx="2"/>
              <rect x="-48" y="12" width="18" height="12" rx="2"/><rect x="-20" y="12" width="18" height="12" rx="2"/><rect x="8" y="12" width="18" height="12" rx="2"/><rect x="34" y="12" width="18" height="12" rx="2"/>
              <rect x="-48" y="34" width="18" height="12" rx="2"/><rect x="-20" y="34" width="18" height="12" rx="2"/><rect x="8" y="34" width="18" height="12" rx="2"/><rect x="34" y="34" width="18" height="12" rx="2"/>
            </g>
          </g>
          <!-- Warm Call Soundwave Ripples -->
          <g id="call-ripples" transform="translate(840, 320)" opacity="0">
            <circle cx="0" cy="0" r="46" fill="none" stroke="#ffe39e" stroke-width="2.5"/>
            <circle cx="0" cy="0" r="88" fill="none" stroke="#ffd27d" stroke-width="2" opacity="0.7"/>
            <circle cx="0" cy="0" r="134" fill="none" stroke="#f5b86e" stroke-width="1.5" opacity="0.45"/>
          </g>
        `;
        break;

      case "letters-and-years":
        sceneBgArt.innerHTML = `
          <rect x="0" y="0" width="1600" height="900" fill="#332019"/>
          <circle cx="760" cy="450" r="560" fill="url(#warm-lamp-glow)"/>
        `;
        break;

      case "accountability":
        sceneBgArt.innerHTML = `
          <rect x="0" y="655" width="1600" height="245" fill="#141320"/>
          <polygon points="690,0 910,0 1120,760 480,760" fill="rgba(255, 234, 192, 0.16)"/>
          <ellipse cx="800" cy="705" rx="260" ry="44" fill="rgba(255, 228, 176, 0.28)"/>
        `;
        break;

      case "change":
        sceneBgArt.innerHTML = `
          <rect x="0" y="655" width="1600" height="245" fill="#3d2c33"/>
          <circle cx="800" cy="590" r="320" fill="url(#warm-lamp-glow)"/>
        `;
        sceneMidArt.innerHTML = `
          <!-- Four Quiet Commitment Lanterns (Framed for Mobile & Desktop) -->
          <g id="commitment-lanterns">
            <g class="c-lantern" id="cl-1" transform="translate(680, 145)" opacity="0">
              <rect x="-115" y="-24" width="230" height="48" rx="24" fill="rgba(255, 248, 234, 0.92)" stroke="#d9a468" stroke-width="2.5"/>
              <text x="0" y="6" text-anchor="middle" fill="#36221c" font-size="16" font-weight="700">Pause before speaking</text>
            </g>
            <g class="c-lantern" id="cl-2" transform="translate(920, 145)" opacity="0">
              <rect x="-115" y="-24" width="230" height="48" rx="24" fill="rgba(255, 248, 234, 0.92)" stroke="#d9a468" stroke-width="2.5"/>
              <text x="0" y="6" text-anchor="middle" fill="#36221c" font-size="16" font-weight="700">Never threaten us</text>
            </g>
            <g class="c-lantern" id="cl-3" transform="translate(680, 225)" opacity="0">
              <rect x="-120" y="-24" width="240" height="48" rx="24" fill="rgba(255, 248, 234, 0.92)" stroke="#d9a468" stroke-width="2.5"/>
              <text x="0" y="6" text-anchor="middle" fill="#36221c" font-size="16" font-weight="700">Listen when I hurt you</text>
            </g>
            <g class="c-lantern" id="cl-4" transform="translate(920, 225)" opacity="0">
              <rect x="-125" y="-24" width="250" height="48" rx="24" fill="rgba(255, 248, 234, 0.92)" stroke="#d9a468" stroke-width="2.5"/>
              <text x="0" y="6" text-anchor="middle" fill="#36221c" font-size="16" font-weight="700">Respect your space &amp; time</text>
            </g>
          </g>
          <!-- Growing Flower Pot -->
          <g transform="translate(800, 650)">
            <polygon points="-32,0 32,0 24,48 -24,48" fill="#b86449" stroke="#4d261a" stroke-width="2.5"/>
            <path id="growing-stem" d="M0 0 Q4 -36 0 -74" fill="none" stroke="#458756" stroke-width="5" stroke-linecap="round"/>
            <circle id="growing-bud" cx="0" cy="-78" r="11" fill="#f2959b" transform="scale(0.2)"/>
          </g>
        `;
        break;

      case "closing":
        sceneBgArt.innerHTML = `
          <rect x="0" y="660" width="1600" height="240" fill="#dfb795"/>
          <circle cx="800" cy="360" r="420" fill="url(#warm-lamp-glow)"/>
          <circle cx="480" cy="260" r="5" fill="#fff5df" opacity="0.65"/>
          <circle cx="1120" cy="290" r="6" fill="#fff5df" opacity="0.65"/>
          <circle cx="960" cy="210" r="4" fill="#ffe1c4" opacity="0.7"/>
        `;
        break;
    }
  }

  // Apply SVG Rig Transforms
  function applyRigTransforms(timeSec) {
    actor.style.setProperty("--actor-x", `${rigState.x.toFixed(2)}%`);
    actor.style.setProperty("--actor-bottom", `${rigState.bottom.toFixed(2)}%`);
    actor.style.setProperty("--actor-scale", `${rigState.scale.toFixed(3)}`);
    actor.style.setProperty("--actor-drop-y", `${rigState.dropY.toFixed(2)}vh`);

    rigRoot.setAttribute("transform", `scale(${rigState.squashX.toFixed(3)}, ${rigState.squashY.toFixed(3)})`);
    rigPelvis.setAttribute("transform", `translate(0, ${rigState.pelvisY.toFixed(1)}) rotate(${rigState.pelvisRot.toFixed(1)})`);
    rigSpine.setAttribute("transform", `rotate(${rigState.spineRot.toFixed(1)})`);
    rigHead.setAttribute("transform", `rotate(${rigState.headRot.toFixed(1)})`);

    rigArmL.setAttribute("transform", `rotate(${rigState.armL.toFixed(1)})`);
    rigForearmL.setAttribute("transform", `rotate(${rigState.forearmL.toFixed(1)})`);
    rigArmR.setAttribute("transform", `rotate(${rigState.armR.toFixed(1)})`);
    rigForearmR.setAttribute("transform", `rotate(${rigState.forearmR.toFixed(1)})`);

    rigLegL.setAttribute("transform", `rotate(${rigState.legL.toFixed(1)})`);
    rigShinL.setAttribute("transform", `rotate(${rigState.shinL.toFixed(1)})`);
    rigFootL.setAttribute("transform", `rotate(${rigState.footL.toFixed(1)})`);
    rigLegR.setAttribute("transform", `rotate(${rigState.legR.toFixed(1)})`);
    rigShinR.setAttribute("transform", `rotate(${rigState.shinR.toFixed(1)})`);
    rigFootR.setAttribute("transform", `rotate(${rigState.footR.toFixed(1)})`);

    const airFactor = clamp(-rigState.dropY / 90, 0, 1);
    const shScale = (1 - airFactor * 0.65) * rigState.squashX;
    const scCur = scenes[sceneIndex];
    const pCur = scCur ? clamp(sceneElapsed / getSceneDurationMs(scCur), 0, 1) : 0;
    const inVehicle = phase !== "paused-dark" && scCur && scCur.id === "river-sunset" && (pCur < 0.46 || pCur >= 0.72);
    rigShadow.setAttribute("transform", `scale(${shScale.toFixed(2)}, 1)`);
    rigShadow.setAttribute("opacity", inVehicle ? "0" : `${(1 - airFactor * 0.78).toFixed(2)}`);

    // Natural Blinking
    const blinkCycle = timeSec % 4.1;
    const isAutoBlink = motionEnabled && blinkCycle > 3.92 && blinkCycle < 4.06;
    const forceEyesClosed = (phase === "prologue-drop" && prologueElapsed < 2250) ||
      (phase === "playing" && scenes[sceneIndex] && scenes[sceneIndex].id === "classmates" && sceneElapsed < 5000 && (timeSec % 2.4 < 1.3));
    blinkLids.setAttribute("opacity", forceEyesClosed || isAutoBlink ? "1" : "0");

    // Subtle Lip Sync when speaking
    const isVoicePlaying = !voiceAudio.paused && !voiceAudio.ended && soundEnabled;
    const isScriptedGreeting = (phase === "prologue-drop" && prologueElapsed > 3650 && prologueElapsed < 4700) ||
      (phase === "paused-dark" && darkApproachElapsed > 600 && darkApproachElapsed < 2400);
    if (motionEnabled && (isVoicePlaying || isScriptedGreeting)) {
      const openAmt = 0.25 + 0.55 * Math.abs(Math.sin(timeSec * 11.5));
      talkMouth.setAttribute("opacity", openAmt.toFixed(2));
    } else {
      talkMouth.setAttribute("opacity", "0");
    }
  }

  function resetAllProps() {
    propGuitar.setAttribute("hidden", "");
    propPhone.setAttribute("hidden", "");
    propWrapperFrame.setAttribute("hidden", "");
    propFlower.setAttribute("hidden", "");
    plushBopper.setAttribute("hidden", "");
  }

  // Compute Target Character Pose & Stage Blocking at 60fps
  function computeDesiredActorPose(timeSec) {
    const breath = motionEnabled ? Math.sin(timeSec * 2.3) : 0;
    const t = {
      x: 50,
      bottom: 11,
      scale: 0.94,
      dropY: 0,
      pelvisY: breath * 1.6,
      pelvisRot: 0,
      spineRot: breath * 0.7,
      headRot: -1.5 + breath * 0.8,
      armL: 7,
      forearmL: -6,
      armR: -7,
      forearmR: 6,
      legL: 0,
      shinL: 0,
      footL: 0,
      legR: 0,
      shinR: 0,
      footR: 0,
      squashX: 1,
      squashY: 1
    };

    resetAllProps();
    const isAccountability = (phase === "playing" || phase === "scene-waiting") &&
      scenes[sceneIndex] && scenes[sceneIndex].id === "accountability";
    if (isAccountability && !bonkSkipped && (bonkCount > 0 || bonkAnimStart > 0)) {
      foamHelmet.removeAttribute("hidden");
    } else if (!isAccountability) {
      foamHelmet.setAttribute("hidden", "");
    }

    const applyWalkCycle = (freq, strideDeg) => {
      if (!motionEnabled) return;
      const w = timeSec * freq;
      const s = Math.sin(w);
      t.pelvisY = -Math.abs(Math.cos(w)) * 6;
      t.spineRot = 3;
      t.legL = s * strideDeg;
      t.shinL = Math.max(0, -s * strideDeg * 0.9);
      t.legR = -s * strideDeg;
      t.shinR = Math.max(0, s * strideDeg * 0.9);
      t.armL = -s * strideDeg * 0.75;
      t.forearmL = -16;
      t.armR = s * strideDeg * 0.75;
      t.forearmR = 16;
    };

    // 1. PURE BLACKOUT & MR. BEAN SKY DROP CHOREOGRAPHY
    if (phase === "blackout" || phase === "prologue-drop") {
      const ms = prologueElapsed;
      if (ms < 1320) {
        // Above ceiling in pure darkness / spotlight click-on
        t.dropY = -122;
        t.scale = 0.86;
      } else if (ms < 1960) {
        // Dropping straight from the sky!
        const u = clamp((ms - 1320) / 640, 0, 1);
        const fallEase = u * u;
        t.dropY = lerp(-118, 0, fallEase);
        t.scale = 0.86;
        const flail = Math.sin(timeSec * 22) * 12;
        t.armL = 118 + flail;
        t.forearmL = 22;
        t.armR = -118 - flail;
        t.forearmR = -22;
        t.legL = -18;
        t.shinL = 26;
        t.legR = 18;
        t.shinR = -26;
      } else if (ms < 2520) {
        // Crouched / heaped on floor right after landing in spotlight!
        t.dropY = 0;
        t.scale = 0.86;
        t.pelvisY = 74;
        t.spineRot = 24;
        t.headRot = 22;
        t.legL = -46;
        t.shinL = 78;
        t.legR = 44;
        t.shinR = -76;
        t.armL = 32;
        t.forearmL = -42;
        t.armR = -32;
        t.forearmR = 42;
        t.squashX = 1.07;
        t.squashY = 0.93;
      } else if (ms < 3650) {
        // Slowly pushing up & standing up, lifting face to look at Nidhi!
        const u = easeInOutCubic((ms - 2520) / 1130);
        t.scale = lerp(0.86, 0.92, u);
        t.pelvisY = lerp(74, 0, u);
        t.spineRot = lerp(24, 0, u);
        t.headRot = lerp(22, -2, easeOutCubic(clamp((u - 0.25) / 0.75, 0, 1)));
        t.legL = lerp(-46, 0, u);
        t.shinL = lerp(78, 0, u);
        t.legR = lerp(44, 0, u);
        t.shinR = lerp(-76, 0, u);
        t.armL = lerp(32, 7, u);
        t.forearmL = lerp(-42, -6, u);
        t.armR = lerp(-32, -7, u);
        t.forearmR = lerp(42, 6, u);
      } else if (ms < 4700) {
        // Looking directly at Nidhi & waving "Hi…"
        t.scale = 0.94;
        t.headRot = -3.5;
        t.armR = -126;
        t.forearmR = -28 + Math.sin(timeSec * 9.5) * 16;
      } else {
        // Walking forward toward the camera!
        const u = easeInOutCubic((ms - 4700) / 1150);
        t.scale = lerp(0.94, 1.15, u);
        t.bottom = lerp(11, 7, u);
        applyWalkCycle(8.5, 16);
      }
    } else if (phase === "prologue-ready") {
      // 2. PROLOGUE READY (Standing close, looking at Nidhi, reaching toward bottom-right 3D hand)
      t.scale = 1.15;
      t.bottom = 7;
      t.headRot = -2.5 + breath * 1.1;
      t.armR = -38;
      t.forearmR = -24;
    } else if (phase === "paused-dark") {
      // 3. PAUSED IN DARK (neutral pause; resume, watch hands-free, or leave)
      const u = motionEnabled ? easeOutCubic(clamp(darkApproachElapsed / 1100, 0, 1)) : 1;
      const isNarrow = (window.innerWidth || 1280) <= 460;
      t.scale = isNarrow ? lerp(0.84, 0.96, u) : lerp(0.92, 1.14, u);
      t.bottom = isNarrow ? lerp(26, 28, u) : lerp(12, 7.5, u);
      if (u < 0.94 && motionEnabled) {
        applyWalkCycle(8, 15);
      } else {
        t.headRot = -3 + breath;
        t.armR = -36;
        t.forearmR = -22;
      }
    } else if (phase === "book-portal") {
      // 4. BOOK PORTAL (Walking to the Memory Book table & opening the book)
      const p = clamp(portalElapsed / PORTAL_DURATION, 0, 1);
      if (p < 0.48) {
        const u = p / 0.48;
        t.x = lerp(34, 52, u);
        t.bottom = 12;
        t.scale = 0.88;
        applyWalkCycle(8, 22);
      } else {
        t.x = 52;
        t.bottom = 12;
        t.scale = 0.88;
        t.spineRot = 5;
        t.armR = -58;
        t.forearmR = -28;
      }
    } else {
      // 5. CHAPTER-BY-CHAPTER MOVIE ACTING
      const sc = scenes[sceneIndex];
      if (sc) {
        const dur = getSceneDurationMs(sc);
        const p = clamp(sceneElapsed / dur, 0, 1);

        switch (sc.id) {
          case "classmates":
        if (p < 0.45) {
          t.x = 34;
          t.bottom = 11;
          t.scale = 0.84;
          t.pelvisY = 24;
          t.spineRot = 10;
          t.headRot = 14 + Math.sin(timeSec * 1.8) * 4;
          t.armR = -44;
          t.forearmR = -52;
        } else if (p < 0.68) {
          const u = (p - 0.45) / 0.23;
          t.x = lerp(34, 62, u);
          t.bottom = 11;
          t.scale = 0.86;
          applyWalkCycle(8, 22);
        } else {
          t.x = 62;
          t.bottom = 11;
          t.scale = 0.86;
          t.headRot = -4 + Math.sin(timeSec * 3) * 3;
          t.armL = 16;
          t.armR = -24;
          t.forearmR = -35;
        }
        break;

      case "science-project":
        if (p < 0.34) {
          t.x = lerp(26, 44, p / 0.34);
          t.bottom = 11;
          t.scale = 0.86;
          applyWalkCycle(7.8, 20);
        } else {
          t.x = 44;
          t.bottom = 11;
          t.scale = 0.86;
          t.spineRot = 6;
          t.headRot = 5;
          t.armR = -54;
          t.forearmR = -34 + Math.sin(timeSec * 5) * 6;
        }
        break;

      case "rooftop-snap":
        t.x = 34;
        t.bottom = 12;
        t.scale = 0.86;
        if (p < 0.72) {
          propGuitar.removeAttribute("hidden");
          t.headRot = -3 + Math.sin(timeSec * 2.5) * 3;
          t.armR = -36;
          t.forearmR = -48;
          t.armL = 24;
          t.forearmL = -46 + (motionEnabled ? Math.sin(timeSec * 11) * 14 : 0);
        } else {
          propPhone.removeAttribute("hidden");
          t.armR = -76;
          t.forearmR = -34;
        }
        break;

      case "best-friend-routines":
        if (p < 0.5) {
          const u = clamp(p / 0.42, 0, 1);
          t.x = lerp(25, 42, u);
          t.bottom = 11;
          t.scale = 0.84;
          if (u < 0.95) applyWalkCycle(6.5, 18);
        } else {
          const u = (p - 0.5) / 0.5;
          t.x = lerp(42, 65, u);
          t.bottom = 11;
          t.scale = 0.88;
          applyWalkCycle(9.5, 25);
          if (u > 0.45 && u < 0.75) {
            t.armR = -118;
            t.forearmR = -24 + Math.sin(timeSec * 10) * 14;
          }
        }
        break;

      case "river-sunset": {
        const vw = Math.max(window.innerWidth || 1280, 320);
        const vh = Math.max(window.innerHeight || 800, 320);
        const svgScale = Math.max(vw / 1600, vh / 900);
        const toStageX = (sx) => 50 + (((sx - 800) * svgScale) / vw) * 100;
        const toStageBottom = (sy) => 50 - (((sy - 450) * svgScale) / vh) * 100;

        if (p < 0.46) {
          // Seated cross-legged inside gliding sunset river boat
          const boatSvgX = lerp(660, 780, p / 0.46);
          t.x = toStageX(boatSvgX);
          t.bottom = toStageBottom(620);
          t.scale = 0.78;
          t.pelvisY = 36;
          t.legL = -82;
          t.shinL = 148;
          t.legR = 82;
          t.shinR = -148;
        } else if (p < 0.72) {
          // Calm humorous shrug paying unexpected boat fare on jetty
          t.x = toStageX(850);
          t.bottom = toStageBottom(595);
          t.scale = 0.86;
          t.armL = 36;
          t.forearmL = 54;
          t.armR = -36;
          t.forearmR = -54;
          t.headRot = -5;
        } else {
          // Seated quietly on rolling twilight rickshaw seat with feet tucked on footboard
          const u = (p - 0.72) / 0.28;
          const rickSvgX = lerp(700, 820, u);
          t.x = toStageX(rickSvgX - 36);
          t.bottom = toStageBottom(625);
          t.scale = 0.78;
          t.pelvisY = 38;
          t.legL = -84;
          t.shinL = 104;
          t.legR = 80;
          t.shinR = -102;
          t.headRot = -4;
        }
        break;
      }

      case "love-teacher":
        if (p < 0.56) {
          t.x = 42 + Math.sin(p * Math.PI * 2) * 5;
          t.bottom = 11;
          t.scale = 0.88;
          t.armR = -68 + Math.sin(timeSec * 6) * 12;
          t.forearmR = -36;
        } else {
          t.x = 44;
          t.bottom = 11;
          t.scale = 0.88;
          t.headRot = -4;
          t.armL = 14;
          t.forearmL = -28;
        }
        break;

      case "distance":
        t.x = lerp(48, 38, clamp(p * 1.6, 0, 1));
        t.bottom = 11;
        t.scale = 0.86;
        if (p < 0.45) applyWalkCycle(5.5, 14);
        t.headRot = 9;
        t.spineRot = 4;
        break;

      case "chocolate-snap":
        propWrapperFrame.removeAttribute("hidden");
        t.x = lerp(38, 48, clamp(p * 2, 0, 1));
        t.bottom = 11;
        t.scale = 0.9;
        t.armL = 42;
        t.forearmL = -52;
        if (p > 0.42 && p < 0.82) {
          propPhone.removeAttribute("hidden");
          t.armR = -68;
          t.forearmR = -38;
        }
        break;

      case "first-i-love-you":
        propPhone.removeAttribute("hidden");
        t.x = lerp(40, 50, clamp(p * 2.4, 0, 1));
        t.bottom = 11;
        t.scale = 0.92;
        if (p < 0.32) {
          applyWalkCycle(6, 15);
        }
        // Rest #prop-phone cleanly beside right ear/temple (224, 96) with both eyes uncovered
        t.armR = -125;
        t.forearmR = -104;
        t.armL = 12;
        t.forearmL = -24;
        t.headRot = 4;
        break;

      case "letters-and-years":
        if ((window.innerWidth || 1280) < 760) {
          t.x = 14;
          t.bottom = 3;
          t.scale = 0.48;
          t.headRot = -4;
        } else {
          t.x = 13;
          t.bottom = 9;
          t.scale = 0.76;
          t.headRot = -4;
        }
        break;

      case "accountability": {
        t.x = 50;
        t.bottom = 10;
        t.scale = 0.98;

        if (squatApologyForgiven) {
          // She pressed "It's okay, stand up" -> Standing tall with hand on heart, relieved & thankful
          t.headRot = 2;
          t.armR = -34;
          t.forearmR = 62; // hand over heart
          t.armL = 10;
          t.forearmL = -8;
          t.pelvisY = 0;
          t.spineRot = 0;
        } else if (p < 0.16) {
          // 0% - 16%: Reaching hands up to hold ears in deep remorse
          const u = easeOutCubic(clamp(p / 0.16, 0, 1));
          t.armL = lerp(8, -142, u);
          t.forearmL = lerp(-6, 78, u);
          t.armR = lerp(-8, 142, u);
          t.forearmR = lerp(6, -78, u);
          t.headRot = lerp(0, 8, u);
          t.spineRot = lerp(0, 5, u);
          t.pelvisY = 0;
        } else if (p < 0.88) {
          // 16% - 88%: Holding ears and taking 3 sincere squats ("কান ধরে উঠবস" school punishment apology)
          t.armL = -142;
          t.forearmL = 78;
          t.armR = 142;
          t.forearmR = -78;

          const windowP = (p - 0.16) / 0.72; // 0 to 1
          const cycles = 3;
          const phaseAngle = windowP * cycles * Math.PI * 2;
          const rawSquat = (1 - Math.cos(phaseAngle)) / 2;
          const squatAmount = Math.pow(rawSquat, 1.25);

          t.pelvisY = lerp(0, 84, squatAmount);
          t.legL = lerp(0, -52, squatAmount);
          t.shinL = lerp(0, 106, squatAmount);
          t.footL = lerp(0, -26, squatAmount);
          t.legR = lerp(0, 52, squatAmount);
          t.shinR = lerp(0, -106, squatAmount);
          t.footR = lerp(0, 26, squatAmount);
          t.spineRot = lerp(5, 12, squatAmount);
          t.headRot = lerp(8, 14, squatAmount);
          t.squashY = lerp(1, 0.96, squatAmount);
          t.squashX = lerp(1, 1.04, squatAmount);
        } else {
          // 88% - 100%: Completed 3 squats, standing up respectfully, lowering hands
          const u = easeOutCubic(clamp((p - 0.88) / 0.12, 0, 1));
          t.armL = lerp(-142, 8, u);
          t.forearmL = lerp(78, -6, u);
          t.armR = lerp(142, -32, u);
          t.forearmR = lerp(-78, 62, u);
          t.headRot = lerp(14, 2, u);
          t.spineRot = lerp(10, 0, u);
          t.pelvisY = lerp(35, 0, u);
          t.legL = lerp(-16, 0, u);
          t.shinL = lerp(32, 0, u);
          t.legR = lerp(16, 0, u);
          t.shinR = lerp(-32, 0, u);
        }
        break;
      }

      case "change":
        t.x = lerp(42, 52, p);
        t.bottom = 11;
        t.scale = 0.92;
        if (p < 0.55) applyWalkCycle(6.5, 16);
        break;

      case "closing":
      default:
        propFlower.removeAttribute("hidden");
        t.x = 50;
        t.bottom = 9.5;
        t.scale = lerp(0.96, 1.06, clamp(p * 1.5, 0, 1));
        t.armR = -48;
        t.forearmR = -28;
        t.headRot = -2.5;
        break;
      }
    }
  }

  // Universal Harmless Cartoon Slap/Punch/Bonk Wobble anywhere in the story!
  const sinceBonk = timeSec - bonkAnimStart;
  if (sinceBonk >= 0 && sinceBonk < 0.95) {
    foamHelmet.removeAttribute("hidden");
    if (sinceBonk < 0.45) plushBopper.removeAttribute("hidden");
    else plushBopper.setAttribute("hidden", "");
    const env = Math.exp(-4.8 * sinceBonk);
    const osc = Math.cos(sinceBonk * 22);
    t.squashY = (t.squashY || 1) - 0.16 * env * osc;
    t.squashX = (t.squashX || 1) + 0.14 * env * osc;
    t.headRot = (t.headRot || 0) + Math.sin(sinceBonk * 24) * 14 * env;
    t.pelvisRot = (t.pelvisRot || 0) - Math.sin(sinceBonk * 20) * 8 * env;
  } else {
    const isAccountability = (phase === "playing" || phase === "scene-waiting") &&
      scenes[sceneIndex] && scenes[sceneIndex].id === "accountability";
    if (!isAccountability) {
      foamHelmet.setAttribute("hidden", "");
    }
    plushBopper.setAttribute("hidden", "");
  }

  return t;
}

  // Per-Frame SVG World Scenery Choreographer
  function updateSceneWorldAnimations(timeSec) {
    if (phase === "book-portal") {
      const p = clamp(portalElapsed / PORTAL_DURATION, 0, 1);
      const wing = $("#book-cover-wing");
      const innerGlow = $("#book-inner-glow");
      const sparks = $("#book-sparks");
      if (wing) {
        const openU = easeInOutCubic(clamp((p - 0.42) / 0.28, 0, 1));
        const flipX = lerp(1, -0.75, openU);
        wing.setAttribute("transform", `scale(${flipX.toFixed(2)}, 1)`);
      }
      if (innerGlow) {
        const glowOp = lerp(0.2, 0.95, clamp((p - 0.4) / 0.4, 0, 1));
        innerGlow.setAttribute("opacity", glowOp.toFixed(2));
      }
      if (sparks) {
        const rise = clamp((p - 0.45) / 0.55, 0, 1) * -90;
        sparks.setAttribute("transform", `translate(0, ${rise.toFixed(1)})`);
      }
      // Dramatic Zoom Into the Open Memory Book!
      if (motionEnabled && p > 0.66) {
        const zoomU = easeInOutCubic((p - 0.66) / 0.34);
        const zoom = lerp(1, 3.4, zoomU);
        const shiftX = lerp(0, -10, zoomU);
        const shiftY = lerp(0, -6, zoomU);
        worldCamera.style.transform = `translate3d(${shiftX}%, ${shiftY}%, 0) scale(${zoom.toFixed(3)})`;
      } else {
        worldCamera.style.transform = "translate3d(0, 0, 0) scale(1)";
      }
      pageTurnVeil.classList.toggle("is-active", p > 0.84);
      return;
    }

    worldCamera.style.transform = "translate3d(0, 0, 0) scale(1)";
    const sc = scenes[sceneIndex];
    if (!sc) return;
    const dur = getSceneDurationMs(sc);
    const p = clamp(sceneElapsed / dur, 0, 1);

    switch (sc.id) {
      case "classmates": {
        const onlineVig = $("#online-school-vignette");
        const laptop = $("#online-laptop-group");
        const plane = $("#paper-plane");
        const zzz = $("#sleepy-zzz");
        const fadeOut = 1 - clamp((p - 0.38) / 0.12, 0, 1);
        if (onlineVig) onlineVig.setAttribute("opacity", fadeOut.toFixed(2));
        if (laptop) laptop.setAttribute("opacity", fadeOut.toFixed(2));
        if (zzz && p < 0.42) {
          const zo = 0.5 + Math.sin(timeSec * 3) * 0.4;
          zzz.setAttribute("opacity", zo.toFixed(2));
          zzz.setAttribute("transform", `translate(0, ${(Math.sin(timeSec * 2) * 6).toFixed(1)})`);
        }
        if (plane && p > 0.42) {
          const u = (p - 0.42) / 0.58;
          const px = lerp(420, 1220, u);
          const py = 320 - Math.sin(u * Math.PI) * 95;
          plane.setAttribute("transform", `translate(${px.toFixed(1)}, ${py.toFixed(1)}) rotate(${(u * 22 - 10).toFixed(1)})`);
        }
        break;
      }
      case "science-project": {
        const lit = p > 0.4;
        document.querySelectorAll(".circuit-win").forEach((el) => {
          el.setAttribute("fill", lit ? "#ffe494" : "#3b3530");
        });
        document.querySelectorAll(".circuit-led").forEach((el, idx) => {
          el.setAttribute("fill", lit ? (idx === 0 ? "#ff6b6b" : "#5be3c8") : "#555");
        });
        const wire = $("#circuit-wire-line");
        if (wire) {
          const dashOffset = (timeSec * 45) % 30;
          wire.setAttribute("stroke-dashoffset", String(-dashOffset.toFixed(1)));
          wire.setAttribute("stroke", lit ? "#f39c12" : "#d9534f");
        }
        const card = $("#first-msg-card");
        if (card) {
          const cu = easeOutCubic(clamp((p - 0.52) / 0.22, 0, 1));
          card.setAttribute("opacity", cu.toFixed(2));
          card.setAttribute("transform", `translate(1115, ${lerp(280, 330, cu).toFixed(1)})`);
        }
        break;
      }
      case "rooftop-snap": {
        const n1 = $("#note-1");
        const n2 = $("#note-2");
        const n3 = $("#note-3");
        if (n1) n1.setAttribute("transform", `translate(0, ${(Math.sin(timeSec * 3) * 12).toFixed(1)})`);
        if (n2) n2.setAttribute("transform", `translate(0, ${(Math.sin(timeSec * 3 + 1.2) * 14).toFixed(1)})`);
        if (n3) n3.setAttribute("transform", `translate(0, ${(Math.sin(timeSec * 3 + 2.4) * 10).toFixed(1)})`);
        const cl = $("#balcony-curtain-l");
        const cr = $("#balcony-curtain-r");
        if (cl) cl.setAttribute("transform", `skewX(${(Math.sin(timeSec * 1.8) * 4).toFixed(1)})`);
        if (cr) cr.setAttribute("transform", `skewX(${(-Math.sin(timeSec * 1.8) * 4).toFixed(1)})`);
        const snapCard = $("#snap-travel-card");
        if (snapCard) {
          if (p > 0.5 && p < 0.76) {
            const u = (p - 0.5) / 0.26;
            snapCard.setAttribute("opacity", "0.95");
            snapCard.setAttribute("transform", `translate(${lerp(1140, 560, u).toFixed(1)}, ${lerp(430, 390, Math.sin(u * Math.PI)).toFixed(1)})`);
          } else if (p >= 0.76) {
            const u = (p - 0.76) / 0.24;
            snapCard.setAttribute("opacity", (1 - u * 0.4).toFixed(2));
            snapCard.setAttribute("transform", `translate(${lerp(560, 1120, u).toFixed(1)}, 420)`);
          } else {
            snapCard.setAttribute("opacity", "0");
          }
        }
        break;
      }
      case "best-friend-routines": {
        const gridWins = $("#power-grid-windows");
        const candle = $("#powercut-candle");
        const arc = $("#silent-song-arc");
        const coachLayer = $("#coaching-day-layer");
        const powerOut = p > 0.12 && p < 0.48;
        if (gridWins) gridWins.setAttribute("opacity", powerOut ? "0.06" : "0.9");
        if (candle) {
          const candleFlicker = 0.8 + Math.sin(timeSec * 8) * 0.15;
          candle.setAttribute("opacity", powerOut ? candleFlicker.toFixed(2) : "0");
        }
        if (arc) arc.setAttribute("opacity", powerOut ? "0.85" : "0");
        if (coachLayer) {
          const dayOp = clamp((p - 0.46) / 0.12, 0, 1);
          coachLayer.setAttribute("opacity", dayOp.toFixed(2));
        }
        break;
      }
      case "river-sunset": {
        const boatBack = $("#river-boat-back");
        const boatFront = $("#river-boat-front");
        const jetty = $("#river-jetty");
        const rickLayer = $("#rickshaw-dusk-layer");
        const rickBack = $("#rickshaw-back");
        const rickFront = $("#rickshaw-front");
        const wBack = $("#rickshaw-wheel-back");
        const wFront = $("#rickshaw-wheel-front");
        const shimmers = $("#water-shimmers");
        if (shimmers) {
          const shX = Math.sin(timeSec * 1.6) * 18;
          shimmers.setAttribute("transform", `translate(${shX.toFixed(1)}, 0)`);
        }

        const bx = lerp(660, 780, clamp(p / 0.46, 0, 1));
        const boatVisible = p < 0.68 ? "1" : "0";
        const boatTilt = Math.sin(timeSec * 2.2) * 2.4;
        if (boatBack) {
          boatBack.setAttribute("transform", `translate(${bx.toFixed(1)}, 610) rotate(${boatTilt.toFixed(1)})`);
          boatBack.setAttribute("opacity", boatVisible);
        }
        if (boatFront) {
          boatFront.setAttribute("transform", `translate(${bx.toFixed(1)}, 610) rotate(${boatTilt.toFixed(1)})`);
          boatFront.setAttribute("opacity", boatVisible);
        }
        if (jetty) {
          jetty.setAttribute("opacity", p >= 0.42 && p < 0.72 ? "1" : "0");
        }
        const rickOp = clamp((p - 0.7) / 0.08, 0, 1);
        if (rickLayer) rickLayer.setAttribute("opacity", rickOp.toFixed(2));
        const rx = lerp(700, 820, clamp((p - 0.72) / 0.28, 0, 1));
        if (rickBack) {
          rickBack.setAttribute("opacity", rickOp.toFixed(2));
          rickBack.setAttribute("transform", `translate(${rx.toFixed(1)}, 635)`);
        }
        if (rickFront) {
          rickFront.setAttribute("opacity", rickOp.toFixed(2));
          rickFront.setAttribute("transform", `translate(${rx.toFixed(1)}, 635)`);
        }
        if (motionEnabled && rickOp > 0) {
          const deg = (timeSec * 180) % 360;
          if (wBack) wBack.setAttribute("transform", `translate(-75, 12) rotate(${deg.toFixed(1)})`);
          if (wFront) wFront.setAttribute("transform", `translate(165, 16) rotate(${deg.toFixed(1)})`);
        }
        break;
      }
      case "love-teacher": {
        const mNotes = $("#morning-notes");
        if (mNotes) {
          mNotes.setAttribute("transform", `translate(0, ${(Math.sin(timeSec * 2) * 8).toFixed(1)})`);
        }
        break;
      }
      case "distance": {
        const moon = $("#quiet-moon");
        if (moon) {
          const mx = lerp(420, 1180, p);
          const my = 220 - Math.sin(p * Math.PI * 2) * 60;
          moon.setAttribute("cx", mx.toFixed(1));
          moon.setAttribute("cy", my.toFixed(1));
        }
        break;
      }
      case "chocolate-snap": {
        const winGlow = $("#reconnect-window-glow");
        const thread = $("#reconnect-light-thread");
        const warmU = clamp((p - 0.5) / 0.35, 0, 1);
        if (winGlow) winGlow.setAttribute("opacity", lerp(0.18, 0.95, warmU).toFixed(2));
        if (thread) {
          const dash = (timeSec * 22) % 36;
          thread.setAttribute("stroke-dashoffset", String(-dash.toFixed(1)));
          thread.setAttribute("opacity", warmU.toFixed(2));
        }
        break;
      }
      case "first-i-love-you": {
        const novStars = $("#nov-stars");
        if (novStars) {
          const stGlow = 0.85 + Math.sin(timeSec * 3) * 0.15;
          novStars.setAttribute("opacity", stGlow.toFixed(2));
        }
        const ripples = $("#call-ripples");
        if (ripples) {
          const ru = clamp((p - 0.38) / 0.3, 0, 1);
          ripples.setAttribute("opacity", ru.toFixed(2));
          const scPulse = 0.92 + (motionEnabled ? Math.sin(timeSec * 2.4) * 0.08 : 0);
          ripples.setAttribute("transform", `translate(840, 320) scale(${scPulse.toFixed(3)})`);
        }
        break;
      }
      case "change": {
        ["#cl-1", "#cl-2", "#cl-3", "#cl-4"].forEach((id, idx) => {
          const el = $(id);
          if (el) {
            const u = clamp((p - (0.06 + idx * 0.2)) / 0.16, 0, 1);
            el.setAttribute("opacity", u.toFixed(2));
            const bob = Math.sin(timeSec * 2 + idx) * 4;
            const curY = idx === 0 || idx === 3 ? 215 : 155;
            const curX = idx === 0 ? 340 : idx === 1 ? 660 : idx === 2 ? 980 : 1280;
            el.setAttribute("transform", `translate(${curX}, ${(curY + bob).toFixed(1)})`);
          }
        });
        const bud = $("#growing-bud");
        if (bud) {
          const bu = easeOutCubic(clamp((p - 0.18) / 0.72, 0, 1));
          bud.setAttribute("transform", `scale(${lerp(0.25, 1.4, bu).toFixed(2)})`);
        }
        break;
      }
    }
  }

  // Mount Actor into Dark Stage vs Vivid World Stage
  function mountActorTo(targetMount) {
    if (actor.parentElement !== targetMount) {
      targetMount.appendChild(actor);
    }
  }

  // Enter Specific Story Chapter (index 1..scenes.length-1)
  function enterChapter(idx, startMode) {
    sceneIndex = clamp(idx, 1, scenes.length - 1);
    sceneElapsed = 0;
    bonkSkipped = false;
    bonkCount = 0;
    bonkAnimStart = -10;
    bonkFeedback.textContent = "";

    const sc = scenes[sceneIndex];
    body.classList.add("world-visible");
    body.dataset.scene = sc.id;
    body.dataset.hud = "ready";
    setThemeColor("#1c1829");

    mountActorTo(actorWorldMount);
    buildStageArt(sc.id);
    renderFramesForScene(sc);
    spawnCinemaParticles(sc.id);

    // Chapter HUD indicator
    const total = scenes.length - 1;
    chapterIndicator.textContent = `${ROMAN[sceneIndex] || sceneIndex} / ${ROMAN[total] || total}`;
    prevBtn.hidden = false;
    nextBtn.hidden = false;
    prevBtn.disabled = sceneIndex <= 1;
    nextBtn.disabled = sceneIndex >= scenes.length - 1;

    // Optional Bonk UI (Accountability only)
    squatApologyForgiven = false;
    if (standUpBtn) standUpBtn.disabled = false;
    const hasBonk = Boolean(sc.optionalInteraction);
    bonkUi.hidden = !hasBonk;
    if (hasBonk) {
      bonkActionLabel.textContent = sc.optionalInteraction.actionLabel || "Bonk!";
      skipBonkBtn.textContent = sc.optionalInteraction.skipLabel || "Skip";
    }

    // Closing UI hidden until closing finishes (or shown immediately in reduced motion / waiting)
    closingUi.hidden = sc.id !== "closing" || (startMode === "playing" && motionEnabled);

    darkPausePanel.hidden = true;
    hiWhisper.classList.remove("is-visible");
    handCornerWrap.dataset.visible = sc.id === "closing" && startMode === "ending-rest" ? "false" : "true";

    setBodyPhase(startMode || (isHolding || handsFree ? "playing" : "scene-waiting"));
    handWhisper.textContent = isHolding ? "Holding…" : (handsFree ? "Playing" : "Hold my hand");

    playVoiceForConfig(sc.voice);
    updateSubtitleDisplay();
    announce(`${sc.title}. ${sc.subtitle || sc.text || ""}`);
    renderChaptersList();
  }

  // Launch Book Room Portal When Holding Starts From Opening
  function startBookPortal() {
    portalElapsed = 0;
    resumeTargetPhase = "book-portal";
    body.classList.add("world-visible");
    body.dataset.scene = "book-portal";
    body.dataset.hud = "ready";
    darkPausePanel.hidden = true;
    hiWhisper.classList.remove("is-visible");
    mountActorTo(actorWorldMount);
    buildStageArt("book-portal");
    spawnCinemaParticles("book-portal");
    framesLayer.innerHTML = "";
    bonkUi.hidden = true;
    closingUi.hidden = true;

    setBodyPhase("book-portal");
    if (storyData && storyData.specialVoices && storyData.specialVoices.bookOpen) {
      playVoiceForConfig(storyData.specialVoices.bookOpen);
    } else {
      stopVoice();
    }
    updateSubtitleDisplay();
    announce("Walking into the memory room and opening our memory book.");

    // In reduced motion mode, skip dramatic camera zoom quickly into Chapter 1
    if (!motionEnabled) {
      enterChapter(1, isHolding || handsFree ? "playing" : "scene-waiting");
    }
  }

  // Trigger Gentle Dark Spotlight Return When Nidhi Lets Go of the Hand Mid-Movie
  function enterDarkPauseReturn() {
    if (phase !== "book-portal" && phase !== "playing") return;
    resumeTargetPhase = phase;
    darkApproachElapsed = 0;
    pauseAudioPlayback();
    pageTurnVeil.classList.remove("is-active");
    setBodyPhase("paused-dark");
    mountActorTo(actorDarkMount);

    const holdCfg = storyData && storyData.specialVoices && storyData.specialVoices.holdReturn;
    darkPauseLine.textContent = (holdCfg && holdCfg.subtitle) || "We've paused here. Take your time. Resume, watch hands-free, or leave whenever you want—no explanation needed.";
    darkPausePanel.hidden = false;
    handCornerWrap.dataset.visible = "true";
    handWhisper.textContent = "Hold my hand";
    updateSubtitleDisplay();

    // Optional hold-return voice clip
    const holdVoiceSrc = resolveAssetPath(holdCfg, localFiles.voice);
    if (holdVoiceSrc && audioUnlocked && soundEnabled) {
      const promptAudio = new Audio(holdVoiceSrc);
      promptAudio.play().catch(() => {});
    }
    announce("Paused gently in the spotlight. Hold his hand when you are ready, or choose Watch hands-free.");
  }

  // Resume From Dark Spotlight Return When Holding Again
  function resumeFromDarkPause() {
    darkPausePanel.hidden = true;
    mountActorTo(actorWorldMount);
    setBodyPhase(resumeTargetPhase);
    resumeAudioPlayback();
    updateSubtitleDisplay();
    announce("Continuing our story.");
  }

  // Hand Press & Release Handlers (Bottom-Right 3D Hand)
  function isTouchDevice() {
    return ("ontouchstart" in window) || (navigator.maxTouchPoints > 0);
  }

  function beginHandHold() {
    unlockAudio();
    if (isHolding) return;
    isHolding = true;
    handPortal.classList.add("is-holding");
    handPortal.setAttribute("aria-pressed", "true");
    handWhisper.textContent = "Holding…";

    if (phase === "prologue-ready" || phase === "prologue-drop" || phase === "blackout") {
      startBookPortal();
    } else if (phase === "paused-dark") {
      resumeFromDarkPause();
    } else if (phase === "scene-waiting") {
      setBodyPhase("playing");
      resumeAudioPlayback();
      updateSubtitleDisplay();
    }
  }

  function endHandHold() {
    if (!isHolding) return;
    isHolding = false;
    activePointerId = null;
    keyboardHoldActive = false;
    handPortal.classList.remove("is-holding");
    handPortal.setAttribute("aria-pressed", "false");
    handWhisper.textContent = handsFree ? "Playing" : "Hold my hand";

    if (!handsFree && (phase === "book-portal" || phase === "playing")) {
      enterDarkPauseReturn();
    }
  }

  // Toggle Hands-Free Watch Mode
  function setHandsFreeMode(enabled) {
    unlockAudio();
    handsFree = Boolean(enabled);
    autoToggleBtn.setAttribute("aria-pressed", String(handsFree));
    autoLabel.textContent = handsFree ? "Auto: on" : "Auto";

    if (handsFree) {
      handWhisper.textContent = "Playing";
      if (phase === "prologue-ready" || phase === "prologue-drop" || phase === "blackout") {
        startBookPortal();
      } else if (phase === "paused-dark") {
        resumeFromDarkPause();
      } else if (phase === "scene-waiting") {
        setBodyPhase("playing");
        resumeAudioPlayback();
        updateSubtitleDisplay();
      }
    } else if (!isHolding && (phase === "playing" || phase === "book-portal")) {
      setBodyPhase("scene-waiting");
      pauseAudioPlayback();
      handWhisper.textContent = "Hold my hand";
    }
  }

  const BONK_WORDS = [
    "BONK!",
    "OUCH!",
    "SMACK!",
    "POW!",
    "WHACK!",
    "I DESERVE THAT!",
    "BOING!",
    "OW! MY EAR!",
    "TAKE THAT!",
    "FAIR ENOUGH!"
  ];

  function playCartoonSound() {
    if (!soundEnabled) return;
    try {
      const ctx = window.__audioCtx || (window.__audioCtx = new (window.AudioContext || window.webkitAudioContext)());
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.28);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.42);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.44);
    } catch (_) {}
  }

  // Playful Cartoon Slap / Punch / Bonk anywhere in the movie
  function triggerBonk() {
    unlockAudio();
    bonkCount += 1;
    bonkAnimStart = performance.now() / 1000;
    foamHelmet.removeAttribute("hidden");
    plushBopper.removeAttribute("hidden");
    playCartoonSound();

    const word = BONK_WORDS[(bonkCount - 1) % BONK_WORDS.length];
    const bopperText = plushBopper.querySelector("text");
    if (bopperText) bopperText.textContent = word;

    // Give extra unhurried time on scene so chapter doesn't turn mid-slap:
    sceneElapsed = Math.max(0, sceneElapsed - 2200);

    const sc = scenes[sceneIndex];
    if (bonkFeedback) {
      const reaction = (sc && sc.optionalInteraction && sc.optionalInteraction.reaction) ||
        `${word} A silly wobble—the real hurt still matters, and I'm listening.`;
      bonkFeedback.textContent = bonkCount === 1
        ? reaction
        : `${word} A cartoon wobble cannot undo my words—my actions have to.`;
    }
    announce(`You tapped the character: ${word}`);
  }

  function skipBonk() {
    bonkSkipped = true;
    foamHelmet.setAttribute("hidden", "");
    plushBopper.setAttribute("hidden", "");
    bonkUi.hidden = true;
  }

  // Quiet Exit & Restart
  function openQuietExit() {
    isHolding = false;
    handsFree = false;
    activePointerId = null;
    handPortal.classList.remove("is-holding");
    handPortal.setAttribute("aria-pressed", "false");
    autoToggleBtn.setAttribute("aria-pressed", "false");
    autoLabel.textContent = "Auto";
    pauseAudioPlayback();
    chaptersDrawer.hidden = true;
    frameLightbox.hidden = true;
    setBodyPhase("quiet-closed");
    quietScreen.hidden = false;
    if (cinemaParticles) cinemaParticles.innerHTML = "";
    restartFromQuietBtn.focus();
    announce("Story closed quietly. Take all the time you need.");
  }

  function restartFromBeginning() {
    quietScreen.hidden = true;
    closingUi.hidden = true;
    bonkUi.hidden = true;
    darkPausePanel.hidden = true;
    renderFramesForScene(scenes[0]);
    if (cinemaParticles) cinemaParticles.innerHTML = "";
    stopVoice();
    body.classList.remove("world-visible", "spotlight-on");
    delete body.dataset.scene;
    delete body.dataset.hud;
    prevBtn.hidden = false;
    nextBtn.hidden = false;
    prevBtn.disabled = true;
    nextBtn.disabled = false;
    chapterIndicator.textContent = "Chapters";
    handCornerWrap.dataset.visible = "false";
    handProgressCircle.style.strokeDashoffset = String(RING_CIRCUMFERENCE);
    mountActorTo(actorDarkMount);

    prologueElapsed = 0;
    prologueVoiceTriggered = false;
    pendingVoicePlay = false;
    if (hiWhisper) hiWhisper.textContent = "Hi, Nidhi…";
    dustTriggered = false;
    rigState.dropY = -120;
    rigState.scale = 0.86;
    rigState.x = 50;
    rigState.bottom = 11;
    setThemeColor("#020307");

    if (!motionEnabled) {
      body.classList.add("spotlight-on");
      body.dataset.hud = "ready";
      prologueElapsed = 6200;
      prologueVoiceTriggered = true;
      rigState.dropY = 0;
      rigState.scale = 1.15;
      rigState.bottom = 7;
      setBodyPhase("prologue-ready");
      handCornerWrap.dataset.visible = "true";
      playVoiceForConfig(scenes[0] && scenes[0].voice);
      updateSubtitleDisplay();
    } else {
      setBodyPhase("blackout");
    }
  }

  // Chapters List Modal
  function renderChaptersList() {
    chaptersList.innerHTML = "";
    scenes.slice(1).forEach((sc, idx) => {
      const realIdx = idx + 1;
      const item = document.createElement("button");
      item.type = "button";
      item.className = "chapter-item" + (realIdx === sceneIndex && body.classList.contains("world-visible") ? " is-current" : "");
      item.innerHTML = `
        <span class="chapter-num">${ROMAN[realIdx] || realIdx}</span>
        <span class="chapter-title">${sc.title}</span>
        <span class="chapter-date">${sc.dateLabel || ""}</span>
      `;
      item.addEventListener("click", () => {
        unlockAudio();
        chaptersDrawer.hidden = true;
        openChaptersBtn.setAttribute("aria-expanded", "false");
        enterChapter(realIdx, isHolding || handsFree ? "playing" : "scene-waiting");
      });
      chaptersList.appendChild(item);
    });
  }

  // Motion Preference
  function applyMotionSetting(enabled) {
    motionEnabled = Boolean(enabled);
    body.classList.toggle("reduce-motion", !motionEnabled);
    motionToggleBtn.setAttribute("aria-pressed", String(motionEnabled));
    const lbl = $("#motion-label");
    if (lbl) lbl.textContent = motionEnabled ? "Motion" : "Calm";
    if (!motionEnabled && (phase === "blackout" || phase === "prologue-drop")) {
      body.classList.add("spotlight-on");
      body.dataset.hud = "ready";
      prologueElapsed = 6200;
      prologueVoiceTriggered = true;
      rigState.dropY = 0;
      setBodyPhase("prologue-ready");
      handCornerWrap.dataset.visible = "true";
      playVoiceForConfig(scenes[0] && scenes[0].voice);
      updateSubtitleDisplay();
    }
  }

  // Main 60fps Movie Loop
  let lastFrameTs = performance.now();

  function tick(nowTs) {
    const dtMs = Math.min(80, Math.max(0, nowTs - lastFrameTs));
    const dtSec = dtMs / 1000;
    const timeSec = nowTs / 1000;
    lastFrameTs = nowTs;

    // Advance Active Timeline Phase
    if (phase === "blackout" || phase === "prologue-drop") {
      prologueElapsed += dtMs;
      if (prologueElapsed >= 850 && !body.classList.contains("spotlight-on")) {
        body.classList.add("spotlight-on");
        setBodyPhase("prologue-drop");
      }
      if (prologueElapsed >= 1940 && !dustTriggered) {
        dustTriggered = true;
        landingDust.classList.remove("is-active");
        void landingDust.offsetWidth;
        landingDust.classList.add("is-active");
      }
      if (prologueElapsed >= 3650 && prologueElapsed < 5600) {
        hiWhisper.classList.add("is-visible");
      } else {
        hiWhisper.classList.remove("is-visible");
      }
      if (prologueElapsed >= 3650 && !prologueVoiceTriggered) {
        prologueVoiceTriggered = true;
        playVoiceForConfig(scenes[0] && scenes[0].voice);
        updateSubtitleDisplay();
      }
      if (prologueElapsed >= 4700 && handCornerWrap.dataset.visible !== "true") {
        handCornerWrap.dataset.visible = "true";
        body.dataset.hud = "ready";
      }
      if (prologueElapsed >= 5800 && phase !== "prologue-ready") {
        setBodyPhase("prologue-ready");
        updateSubtitleDisplay();
      }
    } else if (phase === "paused-dark") {
      darkApproachElapsed += dtMs;
    } else if (phase === "book-portal") {
      if (isHolding || handsFree) {
        portalElapsed += dtMs;
        const pct = clamp(portalElapsed / PORTAL_DURATION, 0, 1);
        handProgressCircle.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - pct));
        if (portalElapsed >= PORTAL_DURATION) {
          pageTurnVeil.classList.remove("is-active");
          worldCamera.style.transform = "translate3d(0, 0, 0) scale(1)";
          enterChapter(1, "playing");
        }
      }
    } else if (phase === "playing") {
      if (isHolding || handsFree) {
        const sc = scenes[sceneIndex];
        const dur = getSceneDurationMs(sc);
        sceneElapsed += dtMs;
        const pct = clamp(sceneElapsed / dur, 0, 1);
        handProgressCircle.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - pct));

        // Gentle warm dissolve right before page turn
        pageTurnVeil.classList.toggle("is-active", sceneIndex < scenes.length - 1 && pct > 0.95);

        if (sceneElapsed >= dur) {
          pageTurnVeil.classList.remove("is-active");
          if (sceneIndex < scenes.length - 1) {
            enterChapter(sceneIndex + 1, "playing");
          } else {
            // Reached Calm Open Ending — settle peacefully without forcing dark pause!
            sceneElapsed = dur;
            setBodyPhase("ending-rest");
            closingUi.hidden = false;
            handCornerWrap.dataset.visible = "false";
            announce("End of story. You do not owe forgiveness, an answer, or a decision.");
          }
        }
      }
    }

    // Update World SVG Animations
    if (body.classList.contains("world-visible")) {
      updateSceneWorldAnimations(timeSec);
    }

    // Smoothly Damp Skeletal Rig Joints & Apply SVG Transforms
    if (phase !== "quiet-closed") {
      const target = computeDesiredActorPose(timeSec);
      const speed = phase === "prologue-drop" && prologueElapsed < 2050 ? 28 : 11;
      rigState.x = damp(rigState.x, target.x, 8, dtSec);
      rigState.bottom = damp(rigState.bottom, target.bottom, 8, dtSec);
      rigState.scale = damp(rigState.scale, target.scale, 8, dtSec);
      rigState.dropY = phase === "prologue-drop" ? target.dropY : damp(rigState.dropY, target.dropY, 14, dtSec);
      rigState.pelvisY = damp(rigState.pelvisY, target.pelvisY, speed, dtSec);
      rigState.pelvisRot = damp(rigState.pelvisRot, target.pelvisRot, speed, dtSec);
      rigState.spineRot = damp(rigState.spineRot, target.spineRot, speed, dtSec);
      rigState.headRot = damp(rigState.headRot, target.headRot, speed, dtSec);
      rigState.armL = damp(rigState.armL, target.armL, speed, dtSec);
      rigState.forearmL = damp(rigState.forearmL, target.forearmL, speed, dtSec);
      rigState.armR = damp(rigState.armR, target.armR, speed, dtSec);
      rigState.forearmR = damp(rigState.forearmR, target.forearmR, speed, dtSec);
      rigState.legL = damp(rigState.legL, target.legL, speed, dtSec);
      rigState.shinL = damp(rigState.shinL, target.shinL, speed, dtSec);
      rigState.footL = damp(rigState.footL, target.footL, speed, dtSec);
      rigState.legR = damp(rigState.legR, target.legR, speed, dtSec);
      rigState.shinR = damp(rigState.shinR, target.shinR, speed, dtSec);
      rigState.footR = damp(rigState.footR, target.footR, speed, dtSec);
      rigState.squashX = damp(rigState.squashX, target.squashX, 18, dtSec);
      rigState.squashY = damp(rigState.squashY, target.squashY, 18, dtSec);
      applyRigTransforms(timeSec);
    }

    window.requestAnimationFrame(tick);
  }

  // Bind All Interactive Controls & Edge-Case Guards
  function bindEvents() {
    let pointerDownTime = 0;

    // Mobile & Desktop Audio Unlocker (Unlocks HTML5 audio & Web Audio context on very first screen touch)
    function handleGlobalTouchUnlock() {
      unlockAudio();
      if (pendingVoicePlay && activeVoiceSrc && soundEnabled && !isModalOpen()) {
        pendingVoicePlay = false;
        if (hiWhisper) hiWhisper.textContent = "Hi, Nidhi…";
        try {
          voiceAudio.currentTime = 0;
        } catch (_) {}
        voiceAudio.play().catch(() => {});
      }
    }

    ["pointerdown", "touchstart", "touchend", "mousedown", "click", "keydown"].forEach((evt) => {
      window.addEventListener(evt, handleGlobalTouchUnlock, { capture: true, passive: true });
    });
    if (hiWhisper) {
      hiWhisper.addEventListener("click", handleGlobalTouchUnlock);
      hiWhisper.addEventListener("touchstart", handleGlobalTouchUnlock, { passive: true });
    }

    // 3D Hand Portal Pointer Hold & Tap (with pointer capture & contextmenu suppression for mobile!)
    handPortal.addEventListener("contextmenu", (ev) => ev.preventDefault());

    handPortal.addEventListener("pointerdown", (ev) => {
      if (ev.button !== undefined && ev.button !== 0) return;
      if (activePointerId !== null && activePointerId !== ev.pointerId) return;
      ev.preventDefault();
      pointerDownTime = performance.now();
      activePointerId = ev.pointerId !== undefined ? ev.pointerId : -1;
      try {
        if (ev.pointerId !== undefined && handPortal.setPointerCapture) {
          handPortal.setPointerCapture(ev.pointerId);
        }
      } catch (_) {}
      beginHandHold();
    });

    const releasePointer = (ev) => {
      if (activePointerId === null) return;
      if (activePointerId !== -1 && ev.pointerId !== undefined && ev.pointerId !== activePointerId) return;
      const pressDur = performance.now() - pointerDownTime;
      activePointerId = null;

      if (pressDur < 480 || isTouchDevice()) {
        // Quick tap or mobile touch on 3D hand -> keeps playing!
        setHandsFreeMode(true);
        if (phase === "playing") {
          // If already playing, pressing the hand moves directly to next chapter!
          if (sceneIndex < scenes.length - 1) {
            enterChapter(sceneIndex + 1, "playing");
          }
        } else if (phase === "prologue-ready" || phase === "prologue-drop" || phase === "blackout") {
          startBookPortal();
        } else if (phase === "paused-dark") {
          resumeFromDarkPause();
        } else if (phase === "scene-waiting") {
          setBodyPhase("playing");
          resumeAudioPlayback();
          updateSubtitleDisplay();
        } else if (phase === "book-portal") {
          portalElapsed = PORTAL_DURATION;
        }
      } else {
        // Continuous hold released -> gentle dark spotlight pause
        endHandHold();
      }
    };
    window.addEventListener("pointerup", releasePointer);
    window.addEventListener("pointercancel", releasePointer);

    // Keyboard Hold on 3D Hand (Space / Enter)
    handPortal.addEventListener("keydown", (ev) => {
      if ((ev.code === "Space" || ev.code === "Enter") && !ev.repeat) {
        ev.preventDefault();
        keyboardHoldActive = true;
        beginHandHold();
      }
    });
    handPortal.addEventListener("keyup", (ev) => {
      if ((ev.code === "Space" || ev.code === "Enter") && keyboardHoldActive) {
        ev.preventDefault();
        endHandHold();
      }
    });

    // Window Blur / Visibility Change safely pauses active hand-hold
    window.addEventListener("blur", () => {
      if (isHolding) endHandHold();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && isHolding) endHandHold();
    });

    // Skip Intro Accessible Link
    skipIntroLink.addEventListener("click", (ev) => {
      ev.preventDefault();
      setHandsFreeMode(true);
      enterChapter(1, "playing");
    });

    // HUD Controls
    ccToggleBtn.addEventListener("click", () => {
      ccEnabled = !ccEnabled;
      ccToggleBtn.setAttribute("aria-pressed", String(ccEnabled));
      updateSubtitleDisplay();
    });

    audioToggleBtn.addEventListener("click", () => {
      unlockAudio();
      soundEnabled = !soundEnabled;
      audioToggleBtn.setAttribute("aria-pressed", String(soundEnabled));
      audioIcon.textContent = soundEnabled ? "♪" : "✕♪";
      voiceAudio.muted = !soundEnabled;
      ambientAudio.muted = !soundEnabled;
      if (soundEnabled) resumeAudioPlayback();
    });

    replayVoiceBtn.addEventListener("click", () => {
      unlockAudio();
      if (activeVoiceSrc) {
        voiceAudio.currentTime = 0;
        voiceAudio.muted = !soundEnabled;
        voiceAudio.play().catch(() => {});
      }
    });

    autoToggleBtn.addEventListener("click", () => {
      setHandsFreeMode(!handsFree);
    });

    motionToggleBtn.addEventListener("click", () => {
      applyMotionSetting(!motionEnabled);
    });

    const prologueEnterBtn = $("#prologue-enter-btn");
    if (prologueEnterBtn) {
      prologueEnterBtn.addEventListener("click", () => {
        unlockAudio();
        setHandsFreeMode(true);
        startBookPortal();
      });
    }

    prevBtn.addEventListener("click", () => {
      unlockAudio();
      setHandsFreeMode(true);
      if (sceneIndex > 1) {
        enterChapter(sceneIndex - 1, "playing");
      } else {
        restartFromBeginning();
      }
    });

    nextBtn.addEventListener("click", () => {
      unlockAudio();
      setHandsFreeMode(true);
      if (phase === "prologue-drop" || phase === "prologue-ready" || phase === "blackout" || phase === "book-portal") {
        enterChapter(1, "playing");
      } else if (sceneIndex < scenes.length - 1) {
        enterChapter(sceneIndex + 1, "playing");
      }
    });

    openChaptersBtn.addEventListener("click", () => {
      renderChaptersList();
      chaptersDrawer.hidden = false;
      openChaptersBtn.setAttribute("aria-expanded", "true");
      closeChaptersBtn.focus();
    });

    closeChaptersBtn.addEventListener("click", () => {
      chaptersDrawer.hidden = true;
      openChaptersBtn.setAttribute("aria-expanded", "false");
      openChaptersBtn.focus();
    });

    chaptersDrawer.addEventListener("click", (ev) => {
      if (ev.target === chaptersDrawer) {
        chaptersDrawer.hidden = true;
        openChaptersBtn.setAttribute("aria-expanded", "false");
      }
    });

    closeLightboxBtn.addEventListener("click", closeLightbox);
    frameLightbox.addEventListener("click", (ev) => {
      if (ev.target === frameLightbox) closeLightbox();
    });

    window.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") {
        if (!frameLightbox.hidden) closeLightbox();
        else if (!chaptersDrawer.hidden) {
          chaptersDrawer.hidden = true;
          openChaptersBtn.setAttribute("aria-expanded", "false");
        }
      } else if (ev.key === "ArrowRight" && body.classList.contains("world-visible") && chaptersDrawer.hidden) {
        if (sceneIndex < scenes.length - 1) {
          enterChapter(sceneIndex + 1, "playing");
        }
      } else if (ev.key === "ArrowLeft" && body.classList.contains("world-visible") && chaptersDrawer.hidden) {
        if (sceneIndex > 1) {
          enterChapter(sceneIndex - 1, "playing");
        }
      }
    });

    // Dark-Return Escape Buttons
    pauseWatchAutoBtn.addEventListener("click", () => setHandsFreeMode(true));
    pauseOpenChaptersBtn.addEventListener("click", () => {
      renderChaptersList();
      chaptersDrawer.hidden = false;
      closeChaptersBtn.focus();
    });
    pauseLeaveBtn.addEventListener("click", openQuietExit);

    // Sincere Ear-Holding Apology "It's okay, stand up" Button (Chapter 11)
    if (standUpBtn) {
      standUpBtn.addEventListener("click", () => {
        squatApologyForgiven = true;
        announce("You told him it's okay and to stand up.");
        if (bonkFeedback) {
          bonkFeedback.textContent = "🤍 Thank you… I promise I will never speak that way again.";
        }
        standUpBtn.disabled = true;
        setTimeout(() => {
          if (scenes[sceneIndex] && scenes[sceneIndex].id === "accountability") {
            enterChapter(sceneIndex + 1, "playing");
          }
        }, 1800);
      });
    }

    // Slap / Punch / Bonk anywhere in the story:
    bonkBtn.addEventListener("click", triggerBonk);
    skipBonkBtn.addEventListener("click", skipBonk);
    actor.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      triggerBonk();
    });
    actor.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        triggerBonk();
      }
    });

    // Open-Ending & Quiet-Exit Controls
    exitBtn.addEventListener("click", openQuietExit);
    closeQuietlyBtn.addEventListener("click", openQuietExit);
    watchAgainBtn.addEventListener("click", () => {
      unlockAudio();
      enterChapter(1, handsFree ? "playing" : "scene-waiting");
    });
    restartFromQuietBtn.addEventListener("click", restartFromBeginning);
  }

  // Bootstrap Story & Start Pure-Black Cinema Opening
  async function boot() {
    try {
      const resp = await fetch(`./content/story.json?t=${Date.now()}`);
      if (!resp.ok) throw new Error("HTTP error");
      storyData = await resp.json();
    } catch (_) {
      const fb = $("#story-fallback");
      storyData = JSON.parse(fb ? fb.textContent : '{"scenes":[]}');
    }

    scenes = (storyData && storyData.scenes) || [];
    if (scenes.length < 2) return;

    if (storyData.autoDetectLocalAssets !== false) {
      await Promise.all([
        scanAssetDirectory("photos", localFiles.photos, ["jpg", "jpeg", "png", "webp", "avif"]),
        scanAssetDirectory("voice", localFiles.voice, ["mp3", "m4a", "wav", "ogg", "aac"]),
        scanAssetDirectory("audio", localFiles.audio, ["mp3", "m4a", "wav", "ogg"])
      ]);
    }

    mountActorTo(actorDarkMount);
    bindEvents();
    if (ccToggleBtn) ccToggleBtn.setAttribute("aria-pressed", String(ccEnabled));
    renderChaptersList();
    renderFramesForScene(scenes[0]);
    prevBtn.disabled = true;
    nextBtn.disabled = false;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    applyMotionSetting(!reducedMotionQuery.matches);
    if (typeof reducedMotionQuery.addEventListener === "function") {
      reducedMotionQuery.addEventListener("change", (ev) => applyMotionSetting(!ev.matches));
    }

    lastFrameTs = performance.now();
    window.requestAnimationFrame(tick);
  }

  boot();
})();
