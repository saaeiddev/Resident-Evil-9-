# Validation record — 19 September 2026

## Passed

- Production compilation with Vite 6.1.0 / Three.js 0.180.0.
- Both downloaded GLB files parsed by Three.js GLTFLoader, including texture decoding.
- Six character instances created and all six AnimationMixer instances advanced through four seconds of animation.
- Scene transforms and geometry positions checked for finite values after animation.
- CPU scene assembly with modular architecture, motorcycle, weather, instanced debris and planar reflection object.
- Missing-all-character-assets path creates an empty cast without crashing.
- Unsupported-WebGL browser renders a readable error panel with a working retry action rather than remaining on loading.

## Blocked / not verified

The available Chrome testing session reports:

```
GL_VENDOR = Disabled
GL_RENDERER = Disabled
THREE.WebGLRenderer: Error creating WebGL context.
```

The same failure recurred after one retry. No visual scene screenshot, rendered animation verification or FPS measurement is claimed.

Desktop movement and pointer lock, mobile touch controls, object raycasting in the rendered scene, sound playback, quality changes, model loading in a WebGL renderer, iPhone/Android/tablet layout and deployed production behavior remain unverified.

## Asset quality gap

The current two character sources are independent stand-ins. They do not deliver realistic Leon/Grace likenesses or four distinct premium zombie models. Architecture and motorcycle are authored procedural geometry, not high-quality downloaded environment and motorcycle models. Photorealism and the requested AAA presentation are not established.

## Publication

Not deployed. The user required actual browser verification before completion. The repository contains a source checkpoint and validation workflow only, not an approved release or a claimed final experience.
