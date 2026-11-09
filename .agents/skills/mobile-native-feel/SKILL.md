---
name: mobile-native-feel
description: >-
  Mobile web native-feel optimizer (320px–480px). Eliminates 300ms mobile tap delays, configures safe-area-inset padding for device notches, enforces 100svh viewport geometry, and adds native iOS/Android touch behaviors. Use when making mobile web apps feel native. Triggers: $mobile-native-feel, mobile-feel:, 'mobile native feel', 'native web app'.
metadata:
  category: frontend
---
# Mobile Native Feel

**ANNOUNCE:** "Reading `mobile-native-feel` — fixing mobile web for installed-app quality."

The emulator lies. Every fix here should be tested on a real device before shipping.

---

## The Foundation (Apply to Every Web App)

```html
<!-- Viewport — ALWAYS include maximum-scale=1 to prevent zoom on input focus -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

<!-- Status bar (PWA) -->
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="theme-color" content="#YOUR_COLOR">
```

```css
/* Global reset for native feel */
* {
  /* Kill tap flash on iOS (the blue/grey highlight on tap) */
  -webkit-tap-highlight-color: transparent;
  /* Kill text selection on interactive elements */
  -webkit-user-select: none;
  user-select: none;
}

/* But re-enable text selection for content */
p, h1, h2, h3, article, .selectable {
  -webkit-user-select: text;
  user-select: text;
}

/* Smooth scrolling on iOS — REQUIRED for momentum scroll */
.scroll-container {
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
}
```

---

## The 100vh Bug

`100vh` on iOS includes the browser chrome (address bar). When it scrolls away, your element is clipped.

```css
/* WRONG */
.full-screen { height: 100vh; }

/* RIGHT */
.full-screen {
  height: 100svh; /* Small viewport height — excludes browser chrome */
}

/* Fallback for older browsers */
@supports not (height: 100svh) {
  .full-screen { height: 100vh; }
}
```

---

## Input Zoom (iOS zooms when font-size < 16px)

```css
/* Every input, select, textarea must be at least 16px */
input, select, textarea {
  font-size: 16px; /* Never less than this on mobile */
}
```

---

## Sticky Hover States

CSS `:hover` stays active after a tap on iOS. Elements stay in their hover state until the user taps elsewhere.

```css
/* Wrap all hover styles in this media query */
@media (hover: hover) {
  .button:hover { background: var(--color-hover); }
}

/* Use :active for tap feedback instead */
.button:active { transform: scale(0.97); }
```

---

## Laggy Taps (300ms delay)

```css
/* Remove the 300ms tap delay globally */
* { touch-action: manipulation; }

/* For scroll containers, specify axis to avoid hijacking */
.scroll-x { touch-action: pan-x; }
.scroll-y { touch-action: pan-y; }
```

---

## Pull-to-Refresh Hijacking

When your page scrolls to top, the browser's pull-to-refresh gesture triggers. To prevent it on a scroll container:
```css
.app-container {
  overscroll-behavior-y: contain; /* Prevents pull-to-refresh inside the container */
}

/* Global disable (only for PWAs that handle their own refresh) */
body { overscroll-behavior-y: none; }
```

---

## Safe Area (Notch / Dynamic Island)

```css
/* Padding for notch/home indicator/dynamic island */
.header {
  padding-top: env(safe-area-inset-top);
}
.bottom-nav {
  padding-bottom: env(safe-area-inset-bottom);
}
.content {
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

---

## Carousel Scroll Direction

```css
.carousel {
  display: flex;
  overflow-x: scroll;
  scroll-snap-type: x mandatory; /* Snaps to items */
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Hide scrollbar */
}
.carousel::-webkit-scrollbar { display: none; }

.carousel-item {
  scroll-snap-align: start;
  flex-shrink: 0;
}
```

---

## Bottom Sheet

```css
.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 20px 20px 0 0;
  /* Critical: add safe area for home indicator */
  padding-bottom: max(env(safe-area-inset-bottom), 16px);
  /* Prevent the sheet itself from triggering pull-to-refresh */
  overscroll-behavior: contain;
}
```

---

## Real Device Test Checklist

Before shipping any mobile UI:
- [ ] Test on real iOS (not just Simulator) — `100vh`, hover states, and scroll feel differently
- [ ] Test on real Android — Chrome handles some things differently than WebKit
- [ ] Test with device in low-power mode — animations may be reduced by the OS
- [ ] Test landscape orientation — layout shouldn't break
- [ ] Test with system font size increased — text should reflow, not overflow
- [ ] Tap every interactive element — check for 300ms delay and hover state sticking
- [ ] Scroll to page top — check if pull-to-refresh is incorrectly activated
- [ ] Check content around notch/Dynamic Island

