# Test Strategy & Planning — Automation Exercise

**Author:** Milena Andric 
**Date:** 2026-07-08 
**Application under test:** [https://automationexercise.com](https://automationexercise.com)

---

## 1. Approach

This is a demo e-commerce application with a UI and public REST APIs. My approach follows the **test pyramid**:

```
        /\
       /E2E\          ← Critical user journeys only
      /------\
     /  API   \        ← Business logic, data integrity, contract
    /----------\
   /    Unit    \      ← N/A
  /--------------\
```

I treat this as a **black-box testing** scenario — we test behaviour, not implementation.

### Testing phases:

| Phase | Activity | When |
|-------|----------|------|
| **Smoke** | Verify core endpoints and pages are reachable | Every commit |
| **API** | Business logic, CRUD, auth, error handling | Every commit |
| **E2E** | Critical user flows through the UI | Every commit / nightly |
| **Exploratory** | Charter-based session to uncover unexpected issues | Pre-release |

---

## 2. Prioritization

I prioritize based on **business risk × usage frequency**:

| Priority | Area | Rationale |
|----------|------|-----------|
| **P0** | User registration & login | Gate to all other functionality; broken auth = lost users |
| **P0** | Product search & browse | Core discovery path; directly impacts revenue |
| **P0** | Add to cart & checkout | The money path; bugs here directly lose revenue |
| **P1** | API contract correctness | Backbone for any mobile app or third-party integration |
| **P1** | Error states (invalid login, missing fields) | Poor error handling erodes trust |
| **P2** | Newsletter subscription | Marketing pipeline; lower business impact |
| **P2** | Contact form | Customer support path |
| **P3** | Visual/layout regressions | Annoying but rarely blocking |

---

## 3. API Tests vs E2E Tests — Decision Framework

I decide based on **what I'm trying to validate**:

| What to validate | API | E2E |
|-----------------|-----|-----|
| HTTP status codes & response schema | ✅ | ❌ |
| Business logic (e.g. "duplicate email rejected") | ✅ | ❌ (slow, fragile) |
| Authentication/authorization tokens | ✅ | ❌ |
| Edge cases (empty body, missing headers, SQL injection-like inputs) | ✅ | ❌ |
| User sees correct UI after action | ❌ | ✅ |
| Full multi-page journey (register → browse → buy) | ❌ | ✅ |
| Browser-specific behaviour | ❌ | ✅ |
| Visual layout, responsiveness | ❌ | ✅ |

**Rule of thumb:** If I can validate it via the API, I test it via the API. E2E is reserved for flows that span multiple pages/systems and test the **integration** of UI + API.

---

## 4. Key Risks & Assumptions

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Test data collisions (shared demo environment) | High | Medium | Use random unique emails; clean up created accounts |
| Flaky E2E tests due to network/animations | Medium | High | Auto-retry in CI; use `waitForLoadState('networkidle')`; avoid fixed `sleep()` |
| API rate limiting from the demo server | Medium | Medium | Run API tests sequentially; respect `Retry-After` headers |
| UI selectors break on DOM changes | Medium | High | Prefer `data-qa` attributes over CSS classes; use `getByRole`/`getByText` where possible |
| Uncontrolled test data accumulation on server | Low | Low | Delete created accounts as teardown |

### Assumptions

- The demo application is stateless and shared — tests must be **idempotent**
- `data-qa` attributes on the site are stable (they exist on the login/checkout pages)
- The API does not require authentication tokens for most endpoints
- Test accounts can be created and deleted freely
- The application is not under heavy load during test execution

---

## 5. What I Intentionally Chose NOT to Test

| Area | Reason |
|------|--------|
| **Performance / load testing** | Requires dedicated tooling (k6, JMeter) and a controlled environment |
| **Security penetration testing** | Out of scope; demo app, no auth tokens to exploit |
| **Payment gateway integration** | The payment form is a mock — no real payment processor to validate |
| **Cross-browser pixel-perfect rendering** | Visual diff testing requires Percy/Chromatic; disproportionate effort |
| **Every product in the catalog** | Sampling 1-2 products per category is sufficient |
| **Every API endpoint variation** | Focus on representative happy-path + key error scenarios |
| **Accessibility (a11y) audits** | Requires axe-core integration; valuable but out of scope for this phase |
| **Mobile responsive testing** | Can be covered by Playwright viewport projects if needed |

---

## 6. Test Data Strategy

- **Emails:** Generated randomly per test (`testuser_<random>@example.com`) to avoid collisions
- **Passwords:** Fixed known value (`Test12345`) — no need for randomness
- **Payment data:** Static test card (`4111111111111111`) — mock payment form
- **Cleanup:** Delete created accounts via UI (`Delete Account`) or API where possible

---

## 7. Coverage Summary

| Layer | # Tests | Covers |
|-------|---------|--------|
| API | 19 | Auth, products, users, brands, error handling |
| E2E | 9 | Checkout (login + registration), cart CRUD, delete account, multiple products, empty cart, contact form, product review, newsletter subscription |
| **Total** | **28** | Critical paths across both layers |
