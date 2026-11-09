---
name: ui-stress-tester
description: >-
  Adversarial UI layout stress tester. Feeds worst-case data (extreme string lengths, non-Latin scripts, zero-state arrays, negative numbers, ultra-long URLs) into UI components to expose layout breaks, text clipping, and responsive failures. Use to stress-test components and pages before shipping. Triggers: $ui-stress-tester, stress-test-ui:, 'stress test ui', 'break layout'.
metadata:
  category: frontend
---
# UI Stress Tester

**ANNOUNCE:** "Reading `ui-stress-tester` — feeding worst-case data to find what breaks."

Real products break on real data. Find the breaks before users do.

---

## The Test Dataset

Apply every one of these to the component under test:

### Names and Text
```
Worst cases:
- 1 character: "J"
- Very long: "Bartholomew Christopher Alexander-Worthington-Smythe III"
- All uppercase: "JOHN SMITH"
- Unicode: "André Müller", "张伟", "محمد علي", "Ångström"
- Emoji in name: "Alex 🚀 Developer"
- Special chars: "O'Brien-McDonald & Associates, LLC"
- SQL injection: "'; DROP TABLE users; --"
- Empty string: ""
- Only spaces: "   "
- Newlines: "First\nSecond"
```

### Numbers and Counts
```
- Zero: 0
- One: 1
- Negative: -1
- Very large: 9,999,999
- Very small: 0.000001
- Infinity: ∞ (or "N/A")
- String instead of number: "abc"
```

### Lists and Collections
```
- Empty list: []
- Single item: [one thing]
- Two items: [first, second]
- Very long list: 1,000+ items
- Items with extremely long text
- Items with empty text
```

### Dates and Times
```
- Today
- Yesterday
- One year ago
- 50 years ago
- Tomorrow (future)
- Invalid date
- Different timezones (midnight can shift day)
```

### URLs and Email
```
- Very long URL (500+ characters)
- URL with no protocol: "example.com"
- Email: "user+tag+extra@very-long-domain-name.co.uk"
- No email provided: null / undefined
```

---

## How to Apply Tests

1. **Add a toggle** to the component: `Demo data / Worst case`
2. **In "Worst case" mode**, replace all data with the worst-case dataset
3. **Screenshot** every state
4. **List every break**: overflow, truncation, layout shift, invisible text, broken layout

---

## What to Look For

| Category | Common Breaks |
|---|---|
| Typography | Text overflowing container, truncation cutting important info, `nowrap` causing horizontal scroll |
| Layout | Card height growing unexpectedly, grid misalignment, z-index stacking issues |
| Empty states | Blank space where content should be, no empty state message, broken layout with zero items |
| Numbers | Overflow, no thousand separators, no handling for infinity or null |
| Images | Broken image placeholder, alt text overflow, aspect ratio breaking with tall images |
| RTL text | Layout mirror issues, text alignment wrong for Arabic/Hebrew |
| Emoji | Line height disruption, character breaking in truncation |

---

## Output Format

For each break found:
```
BREAK: [Component / element]
DATA: [What data caused it]
SYMPTOM: [What broke visually]
SEVERITY: FAIL (unusable) / WARN (degraded) / NOTE (minor)
FIX: [Specific CSS or logic change]
```

Then: summary count of FAIL / WARN / NOTE, and the demo toggle code snippet.

