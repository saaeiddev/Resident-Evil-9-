# Validation record — 20 September 2026

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

[GitHub Pages](https://saaeiddev.github.io/Resident-Evil-9-/) serves the production build. Deployment builds now require the browser suite to pass. Actual workflow logs and screenshots are authoritative; publication success alone does not establish every physical-device requirement.
