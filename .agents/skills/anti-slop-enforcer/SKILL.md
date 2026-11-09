---
name: anti-slop-enforcer
description: >-
  Master quality gate enforcer for eliminating AI slop, conversational filler, and synthetic clichés from code, copy, and UI components. Scans output against banned phrasebooks and generic styling patterns before delivery. Use on any technical text, documentation, or UI code. Triggers: $anti-slop-enforcer, kill-slop:, 'kill slop', 'remove ai filler'.
metadata:
  category: anti-ai-sop
---
# Anti-Slop Enforcer (Zero AI Slop Master Protocol)

**ANNOUNCE:** "Activating `anti-slop-enforcer` — scanning output for synthetic AI patterns."

**Core Axiom:** If it looks, sounds, or feels like an LLM generated it, rewrite it immediately. Real engineers make deliberate, mathematically grounded choices based on the specific problem.

---

## 1. The Banned Text & Prose List (Zero Tolerance)

Scan and purge these patterns from text, responses, PRs, and comments:

### Conversational Throat-Clearing & Sycophancy
- ❌ "I'd be happy to help..."
- ❌ "Certainly!", "Absolutely!", "Of course!", "Sure thing!"
- ❌ "Great question!", "That's a fantastic idea!", "You're totally right!"
- ❌ "As an AI language model..."
- ❌ "Let's dive right in!", "Without further ado..."

### Verbal Padding & Transition Bloat
- ❌ "It's important to remember/note that..."
- ❌ "Furthermore", "Moreover", "Additionally" (used consecutively)
- ❌ "In conclusion", "To summarize", "All in all", "In summary"
- ❌ "At the end of the day", "When all is said and done"
- ❌ AI vocabulary markers: "Crucial", "Vital", "Pivotal", "Delve", "Tapestry", "Testament", "Beacon", "Landscape", "Harness"

### Weak Hedging & Passive Chains
- ❌ "It could potentially be argued that..."
- ❌ "You might want to consider..."
- ❌ "In some cases, this might help..."
- ❌ Passive voice chains ("The file was attempted to be modified by...")

### Generic Sign-Offs & Platitudes
- ❌ "Feel free to reach out if you need anything else!"
- ❌ "Let me know if you have any questions or feedback!"
- ❌ "Happy coding! 🚀"

---

## 2. Banned UI & Icon Design Tells (Code & Visuals)

Scan code (CSS, Tailwind, JSX, SVG) for these dead giveaways of generated design:

### Color Tells
- ❌ **The Anthropic / AI Palette:** Warm yellow-cream ground (`#F4F1EA`, `#FAF8F5`) + terracotta / rust orange accent (`#D97757`).
- ❌ **The Dark-Mode AI Default:** Near-black background (`#0B0B0B`, `#111111`) + single neon acid-green or bright violet accent.
- ❌ **Gradient Blob Ornaments:** Radial blur spheres (`backdrop-filter: blur(80px)`) floating aimlessly in backgrounds.
- ❌ **Gradient Text:** Headlines with linear-gradient text-fill clip just to look "futuristic".

### Component & Layout Tells
- ❌ **The 3-Card Feature Row:** Content chopped into identical rounded rectangles with centered icons on top.
- ❌ **ALL-CAPS Eyebrow Labels:** Tracked-out mini uppercase text above headlines (`FEATURE · OVERVIEW`).
- ❌ **Middle-Dot Meta Strings:** `Overview · Fast · Secure` dot-separated strings.
- ❌ **The Pill Badge:** Rounded pill capsule floating above a headline (`✨ New Feature v2.0`).
- ❌ **Soft Grey Shadows:** `box-shadow: 0 4px 20px rgba(0,0,0,0.08)` under flat cards.
- ❌ **The Appended Arrow:** Appending `→` or `->` to every single button and hyperlink.
- ❌ **Spaced Em Dashes:** `Feature — details here` used purely as aesthetic decoration.
- ❌ **Gratuitous Monospace:** Putting small metrics or tags in monospace fonts when they aren't code.

### SVG Icon AI Tells
- ❌ **Curve Spaghetti:** Chaotic paths with 50+ unnecessary bezier nodes.
- ❌ **Subpixel Jitter:** Floating-point coordinates (`d="M12.435 88.234..."`) causing antialiased blurry borders.
- ❌ **Mismatched Stroke Weights:** 1.3px on one shape, 2.8px on another.
- ❌ **Hardcoded Hex Fills:** Hardcoded `#6366F1` instead of `currentColor`.
- ❌ **Giant ViewBoxes:** `0 0 1024 1024` with untamed paths.

---

## 3. The Real Engineering Replacement Standard

| Banned Tell | Real Engineering Replacement |
|---|---|
| Bullet point abuse (5 bullets for 1 thought) | One dense, well-crafted declarative sentence |
| Sycophantic opener | Direct status statement: "Running tests on module X." |
| Cream + Terracotta UI | Palette derived from client materials, industry reality, or photography |
| Eyebrow label | Put the context directly in the headline or drop it |
| Soft card shadow | Tone step between surfaces (e.g. 3% background delta) or clean border |
| 3 identical feature cards | Asymmetric editorial layout, data table, or blueprint composition |
| Appended link arrow | Meaningful verb: "View documentation", "Download binary" |
| Bloated SVG icon | 24x24 grid, 1.5px uniform stroke, pixel-snapped coordinates |

---

## 4. Verification Check Before Delivery

Before ending any turn:
1. Did I use any banned filler words or conversational throat-clearing?
2. Did I generate a default 3-card grid or pill badge?
3. Are all SVG icons snapped to clean integer coordinates with uniform stroke width?
4. Is my text direct, technical, and confident?
5. If code was written: did I run tests or verify behavior?
