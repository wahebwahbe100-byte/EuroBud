# EuroBud – Renovierung & Bau

Responsive German business website built from the supplied design reference.

## Contents

The `dist/` directory is the complete uploadable website: 5 main pages, 6 service detail pages, Impressum, privacy notes and a 404 page. All images and fonts are local. HTML pages contain their full content without JavaScript. The project gallery includes 24 original listing photos, including garden maintenance, construction details and supplied before/after collages.

Regenerate HTML after editing templates with `python build.py`. Shared presentation and interactions live in `dist/assets/style.css` and `dist/assets/app.js`.

The services overview uses six alternating image/text sections inspired by the provided Babin Bau services reference. A shared `motion.js` / `motion.css` system provides staggered entrances, opposing photo/copy reveals, and smooth hero copy across all pages. It respects reduced-motion preferences, keyboard focus, saved scroll positions and print, and leaves content visible without JavaScript. Mobile navigation animates both opening and closing.

The homepage now opens with a three-slide photographic hero for renovation, bathrooms/tiles, and painting/flooring. Each slide has its own project inquiry link. `hero.js` and `hero.css` provide crossfades, numbered slide indicators, previous/next controls, pause/resume, keyboard navigation and touch swipes. Autoplay pauses outside the viewport, in a hidden tab, during hover and keyboard interaction. Reduced-motion starts paused. Without JavaScript the first slide and its inquiry link remain available.

The homepage also includes the four-part benefits strip, a four-column “Warum EuroBud?” section, four expandable frequently asked questions, and a red project inquiry banner based on the supplied screenshots. Their layout is in `sections.css`. The questions use native `details`/`summary` controls, so they work with keyboard input and without JavaScript. A floating WhatsApp link opens the business number on every page.

## Contact flow

The form validates its fields and prepares an email or WhatsApp message. It does **not** send messages itself or claim successful delivery. Visitors explicitly open a chosen messaging application and send there. Contact details are from the public EuroBud listing.

## Before using a public business domain

- Confirm the legal company name, contact details, address and image rights with the business.
- The profile summary lists Bremer Straße 29 while the listing's legal notice lists Bremer Straße 159. The website uses the legal notice address, 159. This discrepancy must be resolved with the owner.
- The Impressum and privacy pages are transparent draft notes. Adapt them to the final operator, hosting and services.
- The current private preview has `noindex,nofollow` and `robots.txt` disallowing indexing. Configure these and the canonical origin for final public hosting.
- This is a portable HTML/CSS/JavaScript website, not an installed WordPress or Elementor theme.

## Sources

Reference layout: attached WhatsApp Image 2026-10-15 at 08.07.55.jpeg.

Hero layout and interaction reference: https://babinbau.de/
Services layout reference: https://babinbau.de/leistungen/

Business profile: https://www.kleinanzeigen.de/pro/Euro-bud

Project images and legal notice: https://www.kleinanzeigen.de/s-anzeige/fliesenleger-malerarbeit-trockenbau-spachtel-bodenverlegen-handwerker-innenausbau-/2317919800-239-3121

Services: https://www.kleinanzeigen.de/s-anzeige/handwerker-spachtel-verputzen-malerarbeit-tapezieren-trockenbau-fliesenleger-innenausbau/2237749024-239-3126

Garden care and cleaning: https://www.kleinanzeigen.de/s-anzeige/gartenpflege-allgemeine-dienstleistungen-sehr-sauber-schnell-und-zuverlaessig-garten-und-landschaftsbau/3451965449-239-3126

Additional original image URLs are recorded in `asset-sources.json`. Images that appear only in recommendation tiles were excluded.

Decorative hero photograph (not a business reference): https://images.unsplash.com/photo-1600607687920-4e2a09cf159d

Fonts: Barlow and Inter, self-hosted from Google Fonts. Logo redrawn as SVG from the supplied reference.

## Verification

The build is checked for HTML structure, unique IDs, local asset/link targets, navigation and JavaScript syntax. Browser QA is unavailable in the current environment because the required control-browser skill is not present.
