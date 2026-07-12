# Automation Exercise — Playwright Test Suite

Automated test solution for [https://automationexercise.com](https://automationexercise.com) covering **API** and **end-to-end** testing using **Playwright + TypeScript**.

---

## 📁 Project Structure

```
milenaproject/
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI/CD pipeline (GitHub Actions)
├── docs/
│   ├── TEST_STRATEGY.md            # Test strategy, prioritization & decisions
│   └── EXPLORATORY_TESTING_REPORT.md  # Exploratory testing findings
├── pages/                          # Page Object Models (E2E)
│   ├── base.page.ts                # Shared BasePage (clickButton, page)
│   ├── home.page.ts
│   ├── products.page.ts
│   ├── cart.page.ts
│   ├── login.page.ts
│   ├── checkout.page.ts
│   └── contact-us.page.ts
├── tests/
│   ├── e2e/
│   │   └── automationExcerciseTests.spec.ts  # E2E tests (9 critical flows)
│   └── api/
│       ├── products.api.spec.ts          # API tests — Products & Brands
│       └── users.api.spec.ts             # API tests — Users & Auth
├── utils/
│   ├── helper.ts                   # Browser helper utilities (fillField, getText, etc.)
│   ├── api-client.ts               # API client wrapper & assertions
│   ├── labels.ts                   # Shared UI labels (Button, Heading, Toast, etc.)
│   └── test-data.ts                # Test data constants
├── playwright.config.ts            # Playwright configuration
├── package.json
└── tsconfig.json
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# 1. Clone or navigate to the project
cd milenaproject

# 2. Install dependencies
npm install

# 3. Install Playwright browsers (Chromium needed for E2E)
npx playwright install chromium
```

### Run Tests

| Command | Description |
|---------|-------------|
| `npm test` | Run **API + E2E** (Chromium) |
| `npm run test:api` | Run **API tests only** |
| `npm run test:e2e` | Run **E2E tests only** (Chromium, headless) |
| `npm run test:e2e:headed` | Run E2E tests with browser visible |
| `npm run test:e2e:debug` | Run E2E tests in debug mode (step-through) |
| `npm run test:cross-browser` | Run E2E on Chromium + Firefox + WebKit |
| `npm run report` | Open the HTML test report |

---

## 🧪 What's Tested

### API Tests (19 tests)

| Suite | Tests | Endpoints |
|-------|-------|-----------|
| **Products** | 8 | `GET /productsList`, `POST /searchProduct`, `GET /brandsList`, `PUT /brandsList` |
| **Users** | 11 | `POST /createAccount`, `POST /verifyLogin`, `DELETE /verifyLogin`, `GET /getUserDetailByEmail`, `PUT /updateAccount` |

Covers: happy paths, invalid credentials, duplicate emails, missing fields, non-existent resources, data updates, account deletion.

### E2E Tests (9 tests)

| # | Test | Priority |
|---|------|----------|
| 1 | Complete checkout after login | P0 |
| 2 | Complete checkout with registration + cart total assertion | P0 |
| 3 | Add product to cart, verify, then remove it | P1 |
| 4 | Delete account after registration | P1 |
| 5 | Add multiple products to cart | P1 |
| 6 | Verify empty cart message | P2 |
| 7 | Contact us form submission | P2 |
| 8 | Submit a product review | P2 |
| 9 | Subscribe to newsletter | P2 |

> **Registration**, **login**, and **search** are covered by **API tests**. Cart, review, subscribe, and contact form have no working API — tested via E2E.

---

## ⚙️ Configuration

### Playwright Config (`playwright.config.ts`)

| Setting | Value | Notes |
|---------|-------|-------|
| `baseURL` | `https://automationexercise.com` | All page navigations use relative paths |
| `retries` | `0` (local), `2` (CI) | Controlled via `CI` env variable |
| `workers` | `undefined` (local), `1` (CI) | Serial execution in CI for stability |
| `trace` | `on-first-retry` | Saves trace only on failure retry |
| `screenshot` | `only-on-failure` | Captures screenshot on test failure |
| `video` | `retain-on-failure` | Records video on test failure |

### Projects

- **`api`** — API tests (no browser)
- **`chrome`** — E2E on Chrome
- **`firefox`** — E2E on Firefox
- **`webkit`** — E2E on WebKit (Safari)

---

## 🔄 CI/CD

The pipeline is defined in `.github/workflows/playwright.yml`:

```
push/PR → [API Tests] + [E2E Chromium]
nightly → [API Tests] + [E2E Chromium] + [E2E Firefox] + [E2E WebKit]
```

Artifacts (reports, traces, screenshots) are uploaded on failure for debugging.

---

## 📝 Assumptions & Prerequisites

- The demo application is publicly accessible and shared — all tests use **random unique emails** to avoid data collisions
- Tests are **idempotent** — they can be run repeatedly without side effects
- API tests do not require authentication tokens
- The `data-qa` attributes on the site are assumed to be stable (they are used for locators where available)
- Payment is mocked — no real credit card data is used or validated

---

## 🔮 Improvements with More Time

- [ ] Integrate with **Allure** or **Monocart** reporter for richer reporting
- [ ] Add **visual regression tests** using Playwright snapshots or Percy
- [ ] Add **accessibility audits** using `@axe-core/playwright`
- [ ] Add **performance assertions** (LCP, CLS) using Playwright's `performance` API
- [ ] Dockerize the test suite for hermetic execution environment
