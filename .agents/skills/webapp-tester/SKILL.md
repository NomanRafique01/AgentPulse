---
name: webapp-tester
description: >-
  Automated browser web application tester using Playwright. Formulates and executes automated browser test scripts across mobile and desktop viewports, validating responsive layouts, form interactions, navigation, and visual regression. Use for browser automation and end-to-end testing. Triggers: $webapp-tester, test-webapp:, 'test webapp', 'browser test', 'playwright test'.
metadata:
  category: frontend
---
# Web App Tester

**ANNOUNCE:** "Reading `webapp-tester` — testing the web application with Playwright."

---

## Setup (If Not Already Installed)

```bash
npm install -D @playwright/test
npx playwright install chromium
```

---

## Basic Test Structure

```js
// tests/feature.spec.js
import { test, expect } from '@playwright/test';

test('user can complete [action]', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Take a screenshot before interaction
  await page.screenshot({ path: 'before.png', fullPage: true });
  
  // Interact
  await page.click('[data-testid="submit-button"]');
  
  // Assert
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  
  // Take a screenshot after
  await page.screenshot({ path: 'after.png', fullPage: true });
});
```

---

## Key Playwright Commands

```js
// Navigation
await page.goto(url);
await page.goBack();

// Finding elements
page.locator('[data-testid="id"]')    // preferred — use data-testid
page.locator('text=Submit')           // by text
page.locator('button >> nth=0')       // nth element

// Interactions
await locator.click();
await locator.fill('text input');
await locator.selectOption('value');
await locator.check();                // checkbox
await page.keyboard.press('Enter');

// Assertions
await expect(locator).toBeVisible();
await expect(locator).toHaveText('expected text');
await expect(locator).toHaveValue('input value');
await expect(page).toHaveURL('/path');

// Screenshots
await page.screenshot({ path: 'screenshot.png', fullPage: true });
await locator.screenshot({ path: 'element.png' });

// Console logs
page.on('console', msg => console.log('BROWSER:', msg.text()));

// Network
await page.waitForResponse(url => url.includes('/api/'));
```

---

## Test Strategy

For any UI feature, write tests for:
1. **Happy path** — the expected flow works end to end
2. **Error path** — what happens when things fail (API error, validation failure)
3. **Empty state** — the UI when there's no data
4. **Full state** — the UI with maximum realistic data

## Screenshot Comparison

Take screenshots at critical points and compare before/after any change:
```js
await expect(page).toHaveScreenshot('feature-name.png', {
  maxDiffPixels: 100  // allow small rendering differences
});
```

## Running Tests

```bash
npx playwright test                    # all tests
npx playwright test --headed           # with browser visible
npx playwright test tests/feature.spec.js  # specific file
npx playwright show-report             # view HTML report
```

