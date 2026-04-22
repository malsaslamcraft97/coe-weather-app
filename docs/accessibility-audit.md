# 🌤️ Accessibility Audit --- Weather App (Cypress + axe)

## 📌 Overview

This document captures the accessibility testing and fixes implemented
in the Weather App using **Cypress + axe (cypress-axe)** for end-to-end
accessibility validation.

Unlike the Countries App (which focused on component-level testing with
`jest-axe`), this project focuses on:

- Real user flows (E2E)
- Runtime DOM validation
- Integration-level accessibility issues

---

## 🛠️ Setup

### 1. Install dependencies

```bash
npm install --save-dev cypress-axe axe-core
```

---

### 2. Configure Cypress support

```ts
// cypress/support/e2e.ts
import "cypress-axe";
```

---

### 3. Configure logging task

```js
// cypress.config.cjs
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/e2e/**/*.cy.{ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    viewportWidth: 1440,
    viewportHeight: 1024,

    setupNodeEvents(on) {
      on("task", {
        logA11y(violations) {
          console.log("\n=== A11Y REPORT ===");

          violations.forEach((v, i) => {
            console.log(`\n[${i + 1}] ${v.id} (${v.impact})`);
            console.log(v.description);

            v.nodes.forEach((node, idx) => {
              console.log(`  Node ${idx + 1}:`);
              console.log(`    Target: ${node.target}`);
              console.log(`    HTML: ${node.html}`);
              console.log(`    Issue: ${node.failureSummary}`);
            });
          });

          console.log("\n=== END REPORT ===\n");
          return null;
        },
      });
    },
  },
  video: false,
});
```

---

### 4. Accessibility helper

```ts
export function logA11y(context?: string) {
  cy.checkA11y(
    context,
    undefined,
    (violations) => {
      cy.task(
        "logA11y",
        violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.map((node) => ({
            target: node.target.join(" "),
            html: node.html,
            failureSummary: node.failureSummary,
          })),
        })),
      );
    },
    true,
  );
}
```

---

## 🧪 Test Coverage

- Authentication flow (login/signup)
- Weather dashboard rendering
- Search functionality
- Unit toggle
- Forecast panels

---

## ❌ Initial Violations

- Missing `<main>` landmark
- Missing `<h1>`
- Improper regions
- Color contrast failures

---

## ✅ Fixes Applied

### Semantic Fixes

- Added `<main>`
- Added `<section>` landmarks
- Removed incorrect `<aside>`

### Heading Fixes

- Added screen-reader `<h1>`
- Structured `<h2>` sections

### Color Contrast Fixes

```scss
.primaryBtn {
  background-color: #2563eb;
  color: #ffffff;
}

.authSwitchText {
  color: #e5e7eb;
}
```

### CSS Modules Fix

```tsx
<p className={styles.authSwitchText}>
```

---

## ✅ Final Result

- 8 tests passing
- 0 accessibility violations

---

## 🧠 Key Learnings

- E2E a11y testing catches real issues
- CSS modules can break fixes silently
- Proper landmarks are critical
- Contrast issues are common but easy to fix

---

## 🚀 Next Steps

- Add Pa11y to CI
- Add Lighthouse CI
- Perform manual keyboard + screen reader testing

---

## 🏁 Summary

Accessibility is now integrated into the development workflow using
Cypress + axe.
