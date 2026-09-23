# Project Status: Loji Birthday Poetic Experience

## Current Completion State
- **Status:** Cinematic Old-World Rebuild — Implementing / Deploying
- **Repository:** https://github.com/3bud-ZC/loji.git
- **Verified Live URL:** https://3bud-zc.github.io/loji/

## Architecture
- **Framework & Tooling:** Vanilla TypeScript + Vite (Target: ES2022)
- **Styling Architecture:** Art-directed CSS with custom properties (~70% warm paper, ~20% ink, ~8% burgundy, ~2% gold accents), fluid `clamp()` responsive typography, safe area insets (`env(safe-area-inset-*)`), and strict RTL directionality.
- **Animation System:** Ink diffusion reveals, delicate 3D paper unfolding, vinyl tonearm rotation, and high-performance Canvas-based particle simulation with auto-pausing RAF loop.
- **Audio Engine:** Dual-mode engine in `src/audio/player.ts` (Web Audio API procedural vintage acoustic tone generator + HTML5 Audio support for local MP3 files). Strict compliance with iOS Safari user-gesture policies (zero autoplay on page load).
- **Content Store:** Fully centralized in `src/content/site.ts` for instant personalization.

## Premium Refinement Pass (Art Direction & Copy Elevation)
1. **Visual De-cluttering:** Removed all generic component wrappers, bordered card boxes, pill badges, and repetitive section title/subtitle pairings. The experience now flows seamlessly as an authentic illuminated manuscript page.
2. **Hero Elevation:** Removed the four-item metadata grid to let the calligraphic name *"لُـجَـيْـن"* command wide negative space, followed only by *"بعض الأسماء تُقال، وبعضها يُروى."* and a quiet manuscript footnote.
3. **Radical Simplification of "Her Little World":** Transformed the dashboard panel into an editorial spatial composition of 4 core keywords (*الشعر، الأغاني القديمة، الليل، الكلاسيكيات*), each revealing only a single, poignant one-line reflection on tap.
4. **Cinematic Poetry Sequence:** Eliminated repetitive card frames; transformed the poetry sequence into near-fullscreen scroll scenes with authentic verses from Qays ibn al-Mulawwah and Imru' al-Qais, ending with the understated original voice (*"وأنا"*).
5. **Humanized Arabic Copy:** Reduced text volume by ~40%, pruned artificial/AI clichés, and rewrote personal wishes and the final sealed letter with authentic conversational literary Arabic.
6. **Tactile Micro-Interactions:** Replaced web pill buttons with an embossed wax-seal medallion prompt for the opening, streamlined the turntable interaction to a single elegant prompt (*"شغّليها."*), and refined the physical sealed envelope.

## Verification
- **Mobile Viewports Verified (Artboard Reference 390×844):** 360×800, 375×812, 390×844, 393×852, 412×915, 430×932 (Zero horizontal overflow, minimum touch targets >= 44px, safe area insets respected).
- **Desktop Viewports Verified:** 768px, 1024px, 1440px (Spacious editorial negative space and restrained subtle depth).
- **Accessibility & Motion:** Full RTL compliance, semantic HTML5 tags (`<main>`, `<header>`, `<article>`, `<button>`), ARIA attributes, and `@media (prefers-reduced-motion: reduce)` support.
- **Build & Path Validation:** `npm run build` and `npm test` pass with 100% resolution of all asset references under `/loji/` base path.

## Deployment
- **Workflow:** `.github/workflows/deploy.yml` configured using official `actions/deploy-pages@v4` and `actions/upload-pages-artifact@v3`.
- **Target URL:** `https://3bud-zc.github.io/loji/`

## Final Personalization Pass
- Integrated Loji's real portrait as an optimized WebP asset in `public/images/loji.webp`.
- Rewrote the personal letter around her personality, technical passion, the natural matching between both personalities, and the sender's appreciation of her voice and appearance.
- Signature is now **عابد**.
- Strengthened the old-world atmosphere with candle-like glow, drifting dust, manuscript ornaments, vintage photo treatment, wood turntable styling, wax-seal motion, and more differentiated poetry scene reveals.
- Added a visible classic listening list centered on Fairuz and older Arabic classics without falsely embedding copyrighted songs as local audio.
- The interactive player still uses the existing original procedural vintage ambience until an owned/provided audio file is supplied.

## Remaining Optional Asset
- A user-provided/local audio file can still be added later under `public/audio/` and configured in `src/content/site.ts`.


## Cinematic Old-World Rebuild
- Reframed the experience from a flat parchment page into full-screen cinematic chapters: parchment, study, moonlit poetry, dark photo desk, gramophone room, scroll, midnight birthday, and sealed-letter finale.
- Added a persistent animated environment with an arched moon window, stars, candles/flames, drifting dust, floating pages, ink ribbons, film-burn treatment, astrolabe ornamentation, and scene-aware background transitions.
- Added GSAP + ScrollTrigger choreography for chapter-aware transitions, poetry line reveals, photo depth/parallax, turntable entrance, wish-line sequencing, and the birthday name reveal.
- Rebuilt the procedural audio engine for a louder and more reliable user-triggered Arabic/Hijaz-inspired instrumental (oud-like plucks, ney-like lead, frame drum, vinyl texture) with explicit iOS AudioContext resume handling.
- Actual Fairuz recordings are not bundled; visible Fairuz titles are inspiration/listening references only.
