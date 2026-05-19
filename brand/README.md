# Everything Agents — Brand Assets

This folder is the canonical export package for the Everything Agents
brand. Anything outside the website itself (slide decks, PDFs, partner
CMSes, press kits, social posts) should pull from here rather than copying
from `site/`.

The site has its own working copies (`site/components/site/brand.tsx`,
`site/app/icon.svg`, `site/app/opengraph-image.tsx`) that consume the same
geometry but are wired to the live theme tokens. This folder ships
self-contained, theme-resolved files that work in any tool.

## What's here

```
brand/
├── README.md                 ← you are here
├── tokens/
│   ├── colors.json           ← hex + OKLCH for every brand color
│   └── typography.md         ← font stack, wordmark spec, don'ts
├── logo/
│   ├── mark.svg              ← square mark only, currentColor (theme-adaptive)
│   ├── mark-light.svg        ← mark on light background (concrete colors)
│   ├── mark-dark.svg         ← mark on dark background
│   ├── mark-mono-black.svg   ← printable, pure black
│   ├── mark-mono-white.svg   ← printable, pure white on dark
│   ├── wordmark-horizontal.svg       ← mark + Everything Agents (light)
│   ├── wordmark-horizontal-dark.svg  ← inverted
│   ├── wordmark-stacked.svg          ← mark above wordmark, square crop
│   └── wordmark-mono.svg             ← black-on-transparent for mono printing
├── favicon/
│   ├── favicon.svg                ← color, scales 16px and up
│   ├── favicon-{16,32,48}.png     ← legacy raster sizes
│   ├── favicon.ico                ← multi-resolution ICO (16/32/48)
│   ├── apple-touch-icon.svg       ← 180×180 source
│   ├── apple-touch-icon-180.png   ← rasterized
│   ├── android-chrome-512.svg     ← color source
│   ├── android-chrome-{192,512}.png  ← rasterized
│   └── android-chrome-maskable-512.svg  ← Android adaptive icon, safe zone
├── social/
│   ├── og-image.svg          ← 1200×630 source for OG/Twitter
│   ├── og-image.png          ← rasterized
│   ├── og-image-square.svg   ← 1200×1200 for LinkedIn / IG
│   └── og-image-square.png
├── header/
│   ├── header-banner.svg     ← 1600×320 web banner (light)
│   └── header-banner-dark.svg
└── letterhead/
    ├── letterhead-light.svg  ← A4 (1240×1754) page template, light
    └── letterhead-dark.svg
```

## When to use what

| You need… | Use this |
|---|---|
| Browser tab icon (modern browsers) | `favicon/favicon.svg` |
| Browser tab icon (legacy / older Chrome) | `favicon/favicon.ico` |
| iOS Home Screen icon | `favicon/apple-touch-icon-180.png` |
| Android Home Screen icon (legacy) | `favicon/android-chrome-512.png` |
| Android adaptive icon | `favicon/android-chrome-maskable-512.svg` |
| Twitter / Facebook / LinkedIn link card | `social/og-image.png` |
| Instagram or LinkedIn profile post | `social/og-image-square.png` |
| Site header background | `header/header-banner.svg` (or its dark sibling) |
| PDF document header / letterhead | `letterhead/letterhead-light.svg` |
| Internal slide deck cover | `logo/wordmark-stacked.svg` |
| Email signature | `logo/wordmark-horizontal.svg` |
| Partner logo lockup | `logo/wordmark-mono.svg` (matches their colors) |
| Embroidery, etching, single-color print | `logo/mark-mono-black.svg` |

## Color reference

Hex values in `tokens/colors.json`. Quick reference:

| Token | Light | Dark |
|---|---|---|
| Background | `#fbf8f2` (paper) | `#221f17` (ink deep) |
| Foreground | `#1d1a14` (ink) | `#efebde` (paper light) |
| Muted | `#f3eee3` | `#2c281f` |
| Accent | `#c8862c` (amber) | `#dfb069` (amber bright) |
| Hairline | `#dfd6c5` | `#403a2d` |

## Typography

- **Wordmark and headings:** Source Serif 4, weight 600, letter-spacing
  `-0.01em`. Falls back to Georgia.
- **UI chrome and labels:** Inter. Falls back to system-ui.
- **Code:** JetBrains Mono. Falls back to ui-monospace.

Full spec in `tokens/typography.md`.

## Brand-mark concept

A square divided diagonally. The lower-left triangle is filled with the
warm amber accent; the upper-right triangle is empty. The split represents
the spectrum of agent control — half pinned down (deterministic), half
open to the model (probabilistic). It's the visual condensation of
"guided determinism," which is the through-line of the first tutorial
and the conceptual frame of the entire site.

## Don'ts

- Don't recreate the wordmark in another typeface.
- Don't recolor the accent. Amber is the only brand color.
- Don't apply drop shadows, gradients, or photographic textures.
- Don't add a tagline under the wordmark in marks bound for headers or
  letterheads. Use a separate text element if one is needed.
- Don't stretch or condense the mark; it's a square.
- Don't recompose the mark (e.g., flipping the diagonal, filling the
  other triangle). The directionality is part of the brand.

## Regenerating raster files

The PNGs and ICOs in this folder were generated from the SVGs using
macOS-native tools (`qlmanage`, `sips`) and Python's PIL for ICO. If you
edit any source SVG, regenerate the matching raster like so:

```bash
qlmanage -t -s 32 -o /tmp favicon/favicon.svg
sips -z 32 32 /tmp/favicon.svg.png --out favicon/favicon-32.png
```

For ICO, use Python's PIL or ImageMagick:

```bash
magick favicon/favicon-16.png favicon/favicon-32.png favicon/favicon-48.png favicon/favicon.ico
```
