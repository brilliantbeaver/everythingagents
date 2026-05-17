# Everything Agents — Design System

> The visual and interaction language of [everythingagents.org](https://everythingagents.org).
> Every component, color, spacing decision, and motion behavior is grounded
> here. If it isn't in this document, it shouldn't be in the code.

## Brand

**Name:** Everything Agents.
**Domain:** everythingagents.org.

**Brand mark:** a square divided diagonally. The lower-left triangle is
filled with the warm amber accent; the upper-right triangle is empty.
The motif speaks to the spectrum of deterministic control that runs
through the tutorials: half pinned down, half open to the model.

The mark is rendered as inline SVG so the accent and stroke pick up
theme tokens at runtime. For favicons and OG cards the colors are
resolved to hex once at build time (`#fbf8f2` background, `#c8862c`
accent, `#1d1a14` foreground). Source files:

- `components/site/brand.tsx` — `<BrandMark>` and `<Wordmark>`
- `app/icon.svg` — favicon
- `app/apple-icon.svg` — Apple touch icon
- `app/opengraph-image.tsx` — OG card

The wordmark pairs the mark with **Everything Agents** set in Source
Serif 4. No all-caps, no letter-spacing tricks. The mark sits at 20 px
in the header and 14 px in the footer.

---

## Voice and visual direction

**Friendly and editorial-technical.** Think of a knowledgeable peer walking
you through something they actually use. Warm but precise. Short sentences.
Second person ("you"). Helpful asides, not hedged academic prose. Reading
is still the primary activity, so layout stays calm and uncluttered.

**Microcopy defaults** (set the tone):
- "On this page" (not "Table of contents")
- "Quick check" (not "Knowledge check" or "Quiz")
- "Heads up" (not "Warning")
- "Try this" (not "Exercise")
- "Worth knowing" (not "Note")
- "Watch out" (not "Pitfall")

**Reference points**: a good O'Reilly programming book, Bartosz Ciechanowski's
explainers, Julia Evans' zines (warmth without cuteness), Edward Tufte's
restraint with one accent color.

**Anti-references**: SaaS marketing pages with gradient hero blocks, robot
mascots, animated parallax, "Get started in 60 seconds" badges, or
color-coded gamification. Also avoid: cold corporate-blue palettes,
all-grey enterprise dashboards, anything that screams "platform."

---

## Typography

| Role | Family | Notes |
|---|---|---|
| Body / headings | **Source Serif 4** (variable) | Warm, readable, low-key academic. Loaded via `next/font/google`. |
| UI chrome | **Inter** (variable) | Header, sidebar, buttons, small labels |
| Code | **JetBrains Mono** (variable) | Ligatures off |

The serif body is the most important choice on the site. It signals
"reading material, not a SaaS product" within a glance, and pairs well
with restrained UI chrome.

Base size: **16px** (browser default). Line-height for body: **1.65**.
Line-height for headings: **1.2**. Letter-spacing on headings: **-0.01em**
above 24px.

### Type scale (modular, ratio 1.2)

| Token | Size | Usage |
|---|---|---|
| `text-xs` | 12px | Captions, footnotes |
| `text-sm` | 14px | Secondary UI, table cells |
| `text-base` | 16px | **Body** |
| `text-lg` | 18px | Lead paragraph |
| `text-xl` | 20px | H4 / lesson sub-headings |
| `text-2xl` | 24px | H3 / lesson headings |
| `text-3xl` | 30px | H2 / topic headings |
| `text-4xl` | 36px | H1 / page title |
| `text-5xl` | 48px | Topic landing hero |

Body copy max-width: **72ch** (about 680px at 16px). Code blocks may exceed
this for long lines but never the prose.

---

## Color tokens

Single accent. Two surface families. No gradient ramps. All tokens are CSS
variables consumed by Tailwind v4.

### Light theme — warm paper

Backgrounds are slightly warm (paper-cream, not stark white). Accent is
a low-saturation amber that reads like a highlighter mark, not a brand
color.

| Token | OKLCH | Use |
|---|---|---|
| `--background` | `oklch(98.5% 0.005 80)` | Page surface (warm off-white) |
| `--foreground` | `oklch(22% 0.01 60)` | Body text (warm near-black) |
| `--muted` | `oklch(96% 0.008 80)` | Card/section surface |
| `--muted-foreground` | `oklch(48% 0.01 60)` | Secondary text |
| `--border` | `oklch(90% 0.008 80)` | Hairlines |
| `--accent` | `oklch(58% 0.13 70)` | Warm amber/ochre |
| `--accent-foreground` | `oklch(99% 0 0)` | Text on accent |
| `--code-bg` | `oklch(96.5% 0.008 80)` | Inline + block code background |
| `--ring` | `oklch(58% 0.13 70 / 0.4)` | Focus ring |

### Dark theme — warm ink

Dark mode keeps the warm temperature so the site doesn't read as two
different products. Background is a warm near-black (slight brown), not
a cool grey.

| Token | OKLCH | Use |
|---|---|---|
| `--background` | `oklch(16% 0.005 60)` | Page surface (warm near-black) |
| `--foreground` | `oklch(94% 0.005 80)` | Body text |
| `--muted` | `oklch(21% 0.008 60)` | Card/section surface |
| `--muted-foreground` | `oklch(70% 0.008 80)` | Secondary text |
| `--border` | `oklch(29% 0.008 60)` | Hairlines |
| `--accent` | `oklch(75% 0.12 75)` | Lifted warm amber |
| `--accent-foreground` | `oklch(16% 0.005 60)` | Text on accent |
| `--code-bg` | `oklch(19% 0.005 60)` | Inline + block code background |
| `--ring` | `oklch(75% 0.12 75 / 0.5)` | Focus ring |

### Semantic / callout colors

Reserved for callouts only. Never used decoratively.

| Variant | Light tint | Light rule | Dark tint | Dark rule | Meaning |
|---|---|---|---|---|---|
| `key-idea` | `oklch(96% 0.04 250)` | `oklch(45% 0.12 250)` | `oklch(22% 0.04 250)` | `oklch(70% 0.10 250)` | Conceptual highlight |
| `pitfall` | `oklch(96% 0.05 60)` | `oklch(55% 0.14 60)` | `oklch(24% 0.05 60)` | `oklch(75% 0.12 60)` | "Don't do this" |
| `note` | `oklch(96% 0 0)` | `oklch(60% 0 0)` | `oklch(22% 0 0)` | `oklch(70% 0 0)` | Side comment |
| `warning` | `oklch(96% 0.05 30)` | `oklch(55% 0.16 30)` | `oklch(24% 0.05 30)` | `oklch(75% 0.13 30)` | Risk / gotcha |

### Code-block syntax theme

Shiki: **`github-light`** in light mode, **`github-dark-dimmed`** in dark
mode. Both are calm, neutral, and well-tested. Avoid neon themes.

---

## Spacing scale

Tailwind defaults. Body content uses a vertical rhythm of `space-y-6`
(24px) between paragraphs, `space-y-10` (40px) between H2 sections.

Lesson page horizontal padding: `px-6` mobile, `px-12` tablet, `px-16`
desktop. Outer page max-width: `max-w-7xl`.

---

## Layout

### Desktop (≥1024px)

```
┌──────────────────────────────────────────────────────────────────────┐
│  Header (sticky, 56px tall)                                          │
├────────────┬───────────────────────────────────┬─────────────────────┤
│            │                                   │                     │
│  Sidebar   │   Content (max-w-prose)           │   Right TOC         │
│  (sticky)  │                                   │   (sticky)          │
│  240px     │                                   │   220px             │
│            │                                   │                     │
└────────────┴───────────────────────────────────┴─────────────────────┘
```

### Tablet (640–1023px)

Sidebar collapses behind a Sheet (hamburger). Right TOC hidden.

### Mobile (<640px)

Sidebar via Sheet. Single column. TOC accessible via "On this page"
collapsible above the lesson body.

---

## Components

All primitives come from **shadcn/ui** (Radix-based). Custom MDX
components in §"Component inventory."

### Header (56px tall, sticky)

- Left: brand mark + "Everything Agents" wordmark, with a small topic breadcrumb on
  lesson pages.
- Right: search trigger (`⌘K` button), theme toggle, GitHub link.
- Border bottom: `1px solid var(--border)`. No drop shadow.

### Sidebar

- Topic groups with collapsible lesson lists. Active lesson highlighted
  with `--accent` left border (2px) and slightly heavier weight.
- Completion dot (4px) next to each lesson when knowledge check passed.

### Right TOC

- Headings level 2 and 3 from the current lesson. Active heading gets
  `--accent` color and small left dot.

### Code block

- Background `--code-bg`, 1px `--border` ring, 8px corners, 16px padding.
- Optional title bar (e.g. filename) with monospace font.
- Copy button at top-right, visible on hover, focusable on keyboard.

### Callout

Left rule (4px) in the variant color, tint background, 16px padding,
8px corners. Heading uses the variant color for the icon only; text
remains `--foreground`.

### Term tooltip (`<Term>`)

Inline span with **dotted underline** in `--muted-foreground`, becomes
solid on hover/focus. Hovering or focusing opens a Radix Popover with:
- The term in bold
- One-line definition
- Small "Glossary →" link

Close on Escape, click-away, or focus loss. Keyboard accessible.

### Knowledge check

A bordered card with:
- "Knowledge check" eyebrow (small, uppercase, tracking-wide).
- The question.
- 2–4 radio options. Selecting an option immediately reveals:
  - A short feedback line (one sentence) for that option.
  - The "correct" badge if right; otherwise neutral, no shaming.
- A subtle "Show explanation" disclosure for a longer paragraph.
- Per-lesson completion stored in LocalStorage.

No streaks, XP, or unlocks.

### Mermaid container

Renders client-side via `next/dynamic({ ssr: false })`. While loading,
shows a placeholder with the diagram's accessible-name text and a
muted background. Theme switches between Mermaid's `default` (light)
and `dark` themes via a key prop.

---

## Motion

- Hover transitions: `150ms ease-out`. Color-only.
- Sheet/Dialog open: `200ms cubic-bezier(0.2, 0, 0, 1)`.
- Knowledge-check correct flash: `200ms cubic-bezier(0.2, 0, 0.2, 1)`.
- No autoplay video, no parallax, no scroll-jacking, no auto-advance.
- All motion respects `prefers-reduced-motion: reduce`.

---

## Focus and interaction states

- Focus ring: 2px outer + 2px offset, color `--ring`. Always visible on
  keyboard focus (`focus-visible`).
- Active/pressed: 1px translateY shift on buttons.
- Disabled: 50% opacity, no pointer events.

---

## Accessibility targets

- WCAG 2.2 AA contrast on every token pair.
- Every interactive element keyboard-reachable.
- Skip-to-content link as the first focusable element.
- All Mermaid diagrams have an accessible-name caption.
- Knowledge-check feedback rendered into an `aria-live="polite"` region.

---

## Iconography

- **Lucide** icons only (shadcn default). 16–20px in UI, 14px inline.
- One stroke weight throughout. No mixing of icon sets.

---

## What we deliberately don't have

- Marketing hero blocks with gradient backgrounds
- Auto-rotating carousels
- "Get started in 60 seconds" badges
- Progress streaks, XP, badges, gamification
- Decorative emoji
- Animated illustrations of robots
- Blurred glassy backdrops
- Multiple accent colors
