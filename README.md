# RESIDENT EVIL — INTERACTIVE FAN ART EXPERIENCE

**Created by Amir Saeid Dehghan**

Fan Art / Interactive Experience by Amir Saeid Dehghan

## Status: implementation checkpoint — not a finished release

The application builds successfully. Character files decode, six animation mixers advance, geometry and transforms validate, and the browser's unsupported-WebGL fallback works. The available test browser reports `GL_VENDOR = Disabled` and cannot create a WebGL context. The rendered scene, controls, visual quality, mobile behavior and frame rates therefore remain unverified. GitHub Pages publication is intentionally held because passing browser QA was a condition of release.

The current cast uses a Mixamo tactical character and Babylon.js HVGirl as independent stand-ins. Infected figures are altered variants of these two meshes, not four distinct zombie assets. The motorcycle and architecture are procedurally authored. These assets **do not yet meet the requested premium realistic Leon/Grace/zombie and motorcycle target**. This checkpoint must not be described as AAA or as a completed implementation of that brief.

## Implemented

- Real Three.js 3D scene with a confined ruined-city street, damaged storefronts, background skyline, rubble, paper, road barriers and abandoned vehicles.
- PBR materials, procedural surface detail, planar wet-road reflection, cool skylight, warm fires, emergency lights, fog, rain and smoke.
- Six skeletal character instances with AnimationMixer playback, desynchronized infected movement and role labels.
- Cinematic introduction with skip/replay, WASD/arrow movement, Shift movement speed, mouse drag, optional pointer lock, collision regions and a touch joystick.
- Ultra/High/Medium/Low presets and automatic quality reduction.
- Opt-in original synthesized ambience, footsteps, credits and fan-art disclaimer.
- Actual completed-model loading progress; fetch and decode timeouts; partial-model recovery; boot timeout; WebGL/context-loss fallback.

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
npm run assets
npm run dev
```

```sh
npm run check:scene
npm run build
npm run preview
```

Models are downloaded once from pinned source revisions and SHA-256 checked. Runtime model URLs are local and relative. The application does not depend on model-library hotlinks. The `dist/` folder is the production output. Vite's relative base supports GitHub Pages project paths and refreshes at the root route.

## Controls

| Input | Action |
| --- | --- |
| WASD / arrows | Move |
| Shift | Move faster |
| Drag / touch drag | Look |
| Mouse look button | Capture mouse |
| Escape | Release mouse / close dialog |
| Click / tap a character or narrative sign | Inspect |
| Touch joystick | Move on touchscreens |

## Performance

Static city geometry is merged by material; rubble and paper are instanced. Characters reuse source geometries and textures. Quality settings reduce pixel ratio, postprocessing, particles, shadows and reflections. Only one directional light casts shadows. No FPS guarantee has been measured. The target remains 50–60 FPS on capable desktops and 30+ FPS on mid-range hardware, pending testing on actual devices.

## Screenshots

No rendered screenshot is included: the available browser could not initialize WebGL. A screenshot must be captured from the actual scene after visual QA; no generated image is being presented as a working scene.

## Release requirements

1. Replace the current cast and motorcycle with licensed assets that satisfy the realistic visual brief.
2. Inspect the scene on WebGL-capable desktop and mobile browsers, fix any visual or runtime defects, and capture real screenshots.
3. Verify character animation, interactions, sound, loading failure recovery, touch navigation and measured performance.
4. Publish the verified `dist/` output to GitHub Pages and verify that production URL.

See [credits](CREDITS.md) and [validation record](VALIDATION.md).

## Disclaimer

Unofficial fan-made project inspired by Resident Evil. Resident Evil and its characters are trademarks/properties of their respective owners. This project is not affiliated with or endorsed by Capcom.
