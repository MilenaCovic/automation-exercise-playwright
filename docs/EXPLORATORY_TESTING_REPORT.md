# Exploratory Testing Report — Automation Exercise

**Date:** 2026-07-10  
**Tester:** QA Engineer  
**Application:** [https://automationexercise.com](https://automationexercise.com)  
**Environment:** Chrome 149, Windows 11, 1920×1080

---

## 1. Charter / Goal

> **Explore the end-to-end purchase flow** (registration → browse → cart → checkout → order confirmation)  
> with focus on **data consistency**, **error handling**, and **edge cases around the cart and login state**.  
> Time box: **60 minutes**.

---

## 2. Observations & Findings

### ✅ What works well

- Registration flow is straightforward; `data-qa` attributes make automation reliable
- Product search returns relevant results quickly
- Cart persists items correctly when navigating between pages
- Order confirmation page provides clear feedback after successful purchase
- The site is responsive and functional on desktop resolutions

### ⚠️ Areas of concern

- No CAPTCHA or rate limiting on signup — vulnerable to bot registration
- Password strength is not enforced (e.g., "123" is accepted)
- The "Recommended Items" carousel sometimes loads slowly, causing layout shift
- Category sidebar does not collapse subcategories clearly — can be confusing
- No visual feedback when "Subscribe" button is clicked (only page-level alert)

---

## 3. Documented Issues

### Issue #1 — Cart counter does not update after removing item via "X" button

| Field | Detail |
|-------|--------|
| **Severity** | Medium |
| **Priority** | P1 |
| **Steps to reproduce** | 1. Add a product to cart<br>2. Go to Cart page<br>3. Click the "X" button to remove the item<br>4. Observe the cart icon counter in the header |
| **Expected** | Cart counter decrements or disappears |
| **Actual** | Cart counter sometimes remains unchanged until page refresh |
| **Impact** | User may think removal failed; leads to confusion and potential cart abandonment |
| **Root cause hypothesis** | The header counter is updated via a separate AJAX call that may not always fire after DOM removal |

### Issue #2 — Signup form accepts `email@email` (no TLD)

| Field | Detail |
|-------|--------|
| **Severity** | Low |
| **Priority** | P2 |
| **Steps to reproduce** | 1. Navigate to Signup<br>2. Enter name and email `test@test` (missing `.com`)<br>3. Submit the form |
| **Expected** | Client-side validation rejects malformed email |
| **Actual** | Form submits; the registration may fail later with a generic server error |
| **Impact** | Poor UX — user doesn't know what went wrong |
| **Root cause hypothesis** | HTML5 `type="email"` allows `test@test`; server-side validation gives a non-specific error |

### Issue #3 — "Continue Shopping" modal does not close on outside click

| Field | Detail |
|-------|--------|
| **Severity** | Low |
| **Priority** | P3 |
| **Steps to reproduce** | 1. Add product to cart from product list<br>2. A modal appears with "Continue Shopping" / "View Cart"<br>3. Click outside the modal (on the darkened overlay) |
| **Expected** | Modal closes (standard modal UX pattern) |
| **Actual** | Nothing happens; must explicitly click "Continue Shopping" |
| **Impact** | Minor annoyance; inconsistent with common web patterns |

### Issue #4 — Newsletter subscription: success message persists across pages

| Field | Detail |
|-------|--------|
| **Severity** | Low |
| **Priority** | P3 |
| **Steps to reproduce** | 1. Scroll to footer<br>2. Enter email and click Subscribe<br>3. Note the success alert<br>4. Navigate to another page |
| **Expected** | Alert clears on navigation |
| **Actual** | The green success alert is still visible on the new page |
| **Impact** | Confusing — user may think they subscribed again |

---

## 4. Summary

The application is functional for its core purpose (demo e-commerce). The main risks I identified are around **data consistency in the cart UI** and **weak input validation**, both of which could erode user trust in a production environment.

**Recommendations:**

1. Add client-side email format validation before form submission
2. Ensure cart counter in the header updates synchronously with cart mutations
3. Implement a minimum password strength policy
4. Consider adding a debounce/throttle on the subscribe button to prevent double-submission
5. Add `aria-live` regions for dynamic content updates (accessibility win + testability win)
