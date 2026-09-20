# RESIDENT EVIL — INTERACTIVE FAN ART EXPERIENCE

**Created by Amir Saeid Dehghan**

Fan Art / Interactive Experience by Amir Saeid Dehghan

[Open the live experience](https://saaeiddev.github.io/Resident-Evil-9-/) · [Asset credits](CREDITS.md) · [Validation details](VALIDATION.md)

An interactive real-time Three.js survival-horror fan-art city. Explore a rain-soaked quarantine street with two survivor roles, four infected figures, a motorcycle, wrecked vehicles, abandoned storefronts and fire-lit fog.

The characters are licensed independent equivalents. The city and motorcycle are original procedural assets. This working browser experience does not claim official character likenesses or AAA photorealism.

## Features

- Cinematic introduction, skip/replay, first-person movement and object inspection.
- Three optimized skinned GLB assets, six AnimationMixers, retargeted idle and asynchronous infected motion.
- PBR materials, fog, rain, smoke, fire, emergency lights and optional wet-road reflections.
- Four graphics presets and automatic downshift based on measured wall-clock frame rate.
- Touch joystick and drag camera, opt-in synthesized audio, credits and fan-art disclaimer.
- Actual loading progress, fetch/decode timeouts, missing-model recovery, boot timeout and WebGL/context-loss fallback.

## Development

Node.js 22 or newer:

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run check:scene
npx playwright install chromium
npx playwright test
npm run preview
```

The build fetches pinned, SHA-256-verified asset sources, resizes textures to 1024px, converts them to WebP and compresses geometry with Meshopt. The CC BY survivor GLB is included; Mixamo source files are fetched only for incorporation into the build. Runtime assets are local, not remote hotlinks. Three shipped GLBs total about 2.3 MB.

## Controls

| Input | Action |
| --- | --- |
| WASD / arrows | Move |
| Shift | Move faster |
| Mouse drag / touch drag | Look |
| Mouse look button | Capture mouse |
| Escape | Release mouse / close dialog |
| Click / tap character or narrative sign | Inspect |
| Touch joystick | Move |

## Performance

Static geometry is merged by material; rubble and paper use instancing. Cast instances share source geometry/textures. Quality presets reduce pixel ratio, particles, postprocessing, shadows and reflection. Medium is the conservative default. Only the moon casts shadows; distant street fixtures are emissive rather than dynamic lights. FPS adaptation uses elapsed real time independently of the animation step limit.

50–60 FPS desktop and 30+ FPS mobile remain hardware-dependent targets, not measured guarantees. CI renders with software WebGL. Physical Safari/iPhone/Android/tablet testing is still required for a full device certification.

## Screenshots and tests

Actual rendered screenshots are captured as `desktop-scene.png`, `mobile-scene.png` and title counterparts in the `browser-validation` GitHub Actions artifact. The workflow also retains the browser report and traces. No static or generated picture is used in place of the 3D scene.

## Deployment

GitHub Actions builds and tests the production bundle, then publishes `dist/` to GitHub Pages. Vite uses a relative base so models and code work under `/Resident-Evil-9-/`. Refreshing the root URL works without a client-side router.

## Disclaimer

Unofficial fan-made project inspired by Resident Evil. Resident Evil and its characters are trademarks/properties of their respective owners. This project is not affiliated with or endorsed by Capcom.
