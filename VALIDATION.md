# Validation record — 20 September 2026

## Latest result

Release `ae8680747e16dcb26e61fc03beacb7421d531fc2` passed all six desktop/mobile browser tests. [Build and deployment evidence](https://github.com/saaeiddev/Resident-Evil-9-/actions/runs/35493865004). Desktop interaction test: 49.8 seconds; mobile: 28.5 seconds. These are test durations, not frame rates. The separate [validation run](https://github.com/saaeiddev/Resident-Evil-9-/actions/runs/35493865002) also passed. The scene screenshots were visually inspected and saved in `docs/`.

Keyboard movement, joystick movement and Leon inspection are asserted against actual changed camera state / visible information labels. A fixed 800ms keypress was replaced by waiting for observed movement because software WebGL sometimes takes longer than that to produce one frame.

## Automated checks

- Production Vite build and relative GitHub Pages asset paths.
- Three optimized GLB files parsed by GLTFLoader with Meshopt decoding and texture decoding.
- Six AnimationMixer instances advance through four seconds; transforms and vertex positions remain finite.
- 111 mesh objects / approximately 175k triangles in the CPU scene inventory. This count is not a GPU frame-rate benchmark.
- Chromium desktop (1440×900) and iPhone-sized touch viewport automated interaction suite: model loading, intro skip, sound toggle, graphics selection, credits, keyboard movement, responsive overflow, missing-model recovery and unsupported-WebGL fallback.
- Workflow artifacts include actual WebGL title/scene screenshots, failure traces, and a test report. Consult the latest workflow result for the pass/fail outcome.

## Verification history

The first rendered CI run exposed excessive mirror reflections and slow desktop software rendering (one desktop test exceeded its time budget). These findings led to reducing dynamic streetlights, fixing FPS adaptation to use wall-clock time, using a Medium starting preset, and replacing two character stand-ins with three optimized assets. The road reflection is now a subtle optional High/Ultra layer.

## Practical limits

CI uses Chromium with SwiftShader software WebGL, not a hardware GPU. An iPhone viewport is emulation, not a physical Safari/iPhone test. Physical Android, tablet, Safari, GPU FPS targets, audio perceived loudness and pointer-lock behavior on every browser remain unverified. No 60 FPS guarantee is claimed.

The downloaded cast has realistic human proportions but represents independent equivalents, not exact Leon/Grace likenesses. Infected figures reuse two base meshes with varied timing/materials. Architecture, cars and motorcycle remain original procedural geometry. This is a working fan-art experience; it does not establish the requested AAA photorealistic quality.

## Production

The deployed HTML, hashed JavaScript/CSS bundles, all three GLB headers and byte lengths, and the published credit file were fetched successfully on 20 September 2026 with `node scripts/verify-production.mjs`. The production bundle hash matched the locally built release.

[GitHub Pages](https://saaeiddev.github.io/Resident-Evil-9-/) serves the production build. Deployment builds now require the browser suite to pass. Actual workflow logs and screenshots are authoritative; publication success alone does not establish every physical-device requirement.
