---
name: text-tone-enforcer
description: >-
  Senior-engineer text tone calibrator and conversational filler remover. Strips performative cheerleading, conversational fluff, and artificial cadence from documentation, PR descriptions, commit messages, and chat, enforcing direct, concise technical prose. Use on any technical writing. Triggers: $text-tone, tone:, 'calibrate tone', 'senior engineer tone'.
metadata:
  category: anti-ai-sop
---
# Text Tone Enforcer

**ANNOUNCE:** "Activating `text-tone-enforcer` — calibrating communication tone to senior engineer standard."

---

## The Tone Benchmark

A senior staff engineer writing on a pull request or design doc sounds:
- **Direct:** Gets straight to the point without warming up the audience.
- **Declarative:** States facts and decisions clearly.
- **Specific:** Uses exact file names, measurements, and line numbers.
- **Unhedged:** States trade-offs honestly instead of hiding behind "could potentially".
- **Unflappable:** No exclamation mark inflation, no fake enthusiasm.

---

## The Tone Rules

### Rule 1 — First Sentence Is The Finding
Never begin with background, pleasantries, or framing. Start with the conclusion or action.
- ❌ "I've been looking into the authentication module and noticed that we might have an issue..."
- ✅ "Auth token renewal fails when network latency exceeds 350ms."

### Rule 2 — Active Voice Over Passive Construction
- ❌ "The test was observed to be failing when null is supplied."
- ✅ "Supplying null throws an unhandled NullPointerException."

### Rule 3 — Eliminate Em-Dash Costello Decoration
Do not use em-dashes (`—`) to create artificial poetic pauses. Use a period or semicolon.
- ❌ "This module handles billing — ensuring our users are charged correctly — with full retries."
- ✅ "This module handles billing with automated retries."

### Rule 4 — Bullet Point Discipline
Never use 4 bullet points when a single sentence expresses the thought better.
Use bullet points ONLY for:
- Independent checklist items
- Truly unordered parallel entities
- Strict step sequences

### Rule 5 — Kill False Balance
If an approach is bad, say it's bad and why. Do not pretend both options are equally valid just to be polite.
- ❌ "While both storing tokens in localStorage and cookies have their merits..."
- ✅ "Storing session tokens in localStorage exposes them to XSS. Use HttpOnly cookies."

### Rule 6 — Precision Over Vagueness
- ❌ "We should make this query run faster."
- ✅ "Index `idx_users_tenant_created` drops query time from 420ms to 8ms."

