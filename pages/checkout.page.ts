import { type Locator, type Page, expect } from "@playwright/test";
import { Helper } from "../utils/helper";
import { PageUrl, Toast } from "../utils/labels";
import { BasePage } from "./base.page";

type PaymentData = {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
};

export class CheckoutPage extends BasePage {
  private readonly helper: Helper;

  readonly checkoutHeading: Locator;
  readonly orderCommentTextarea: Locator;
  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payAndConfirmButton: Locator;
  readonly orderPlacedMessage: Locator;
  readonly registerLoginLink: Locator;

  constructor(page: Page) {
    super(page);
    this.helper = new Helper(page);

    this.checkoutHeading = page.locator(".checkout-information");
    this.orderCommentTextarea = page.locator('textarea[name="message"]');

    this.nameOnCardInput = page.locator('[data-qa="name-on-card"]');
    this.cardNumberInput = page.locator('[data-qa="card-number"]');
    this.cvcInput = page.locator('[data-qa="cvc"]');
    this.expiryMonthInput = page.locator('[data-qa="expiry-month"]');
    this.expiryYearInput = page.locator('[data-qa="expiry-year"]');
    this.payAndConfirmButton = page.locator('[data-qa="pay-button"]');

    this.orderPlacedMessage = page.getByText(Toast.orderPlaced);
    this.registerLoginLink = page.locator('a[href="/login"]').filter({ hasText: /Register \/ Login/ });
  }

  async clickPlaceOrder() {
    await this.page.locator('a[href="/payment"]').click();
    await this.page.waitForTimeout(1000);
    if (!this.page.url().includes("/payment")) {
      await this.page.goto(PageUrl.payment);
    }
    await this.page.waitForURL("**/payment", { timeout: 10000 });
  }

  async enterOrderComment(comment: string) {
    await this.helper.fillField(this.orderCommentTextarea, comment);
  }

  async fillPaymentForm(data: PaymentData) {
    await this.helper.fillField(this.nameOnCardInput, data.nameOnCard);
    await this.helper.fillField(this.cardNumberInput, data.cardNumber);
    await this.helper.fillField(this.cvcInput, data.cvc);
    await this.helper.fillField(this.expiryMonthInput, data.expiryMonth);
    await this.helper.fillField(this.expiryYearInput, data.expiryYear);
  }

  async assertCheckoutPageVisible() {
    await expect(this.checkoutHeading).toBeVisible();
  }

  async assertHeadingIsVisible(heading: string) {
    await expect(this.page.getByRole("heading", { name: heading })).toBeVisible();
  }

  async assertToastMessage(toast: string) {
    const message = await this.helper.getText(this.orderPlacedMessage);
    expect(message).toContain(toast);
  }

  async clickRegisterLogin() {
    await this.registerLoginLink.click();
  }

}
