import { type Locator, type Page, expect } from "@playwright/test";
import { Helper } from "../utils/helper";
import { PageUrl } from "../utils/labels";
import { BasePage } from "./base.page";

export class CartPage extends BasePage {
  private readonly helper: Helper;

  readonly shoppingCartHeading: Locator;
  readonly cartItems: Locator;
  readonly cartItemName: Locator;
  readonly cartItemTotal: Locator;
  readonly removeItemButton: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.helper = new Helper(page);

    this.shoppingCartHeading = page.locator('li.active:has-text("Shopping Cart")');
    this.cartItems = page.locator("#cart_info_table tbody tr");
    this.cartItemName = page.locator(".cart_description h4 a");
    this.cartItemTotal = page.locator("td.cart_total p.cart_total_price");
    this.removeItemButton = page.locator(".cart_quantity_delete");
    this.emptyCartMessage = page.locator("#empty_cart");
  }

  async openCart() {
    await this.page.goto(PageUrl.cart);
    await expect(this.shoppingCartHeading).toBeVisible();
  }

  async clickProceedToCheckout() {
    await this.page.getByText("Proceed To Checkout").click();
  }

  async removeFirstItem() {
    await this.removeItemButton.first().click();
  }

  async clearCart() {
    await this.openCart();
    try {
      while ((await this.cartItems.count()) > 0) {
        await this.removeItemButton.first().click();
        await this.page.waitForLoadState("networkidle");
      }
    } catch {
      // Cart is already empty or page failed to load — safe to proceed
    }
  }

  async assertUrl(expectedPath: string) {
    await expect(this.page).toHaveURL(new RegExp(expectedPath));
  }

  async assertCartItemCount(expectedCount: number) {
    await expect(this.cartItems).toHaveCount(expectedCount);
  }

  async assertCartEmpty() {
    await expect(this.emptyCartMessage).toBeVisible();
  }

  async assertCartTotal(expectedTotal: string) {
    const totals = this.cartItemTotal.all();
    let sum = 0;
    for (const el of await totals) {
      const text = await el.textContent();
      if (text) sum += parseInt(text.replace(/[^0-9]/g, ""));
    }
    expect(`Rs. ${sum}`).toBe(expectedTotal);
  }
}
