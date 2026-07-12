import { type Locator, type Page, expect } from "@playwright/test";
import { Helper } from "../utils/helper";
import { Heading, PageUrl } from "../utils/labels";
import { BasePage } from "./base.page";

export class ProductsPage extends BasePage {
  private readonly helper: Helper;

  readonly allProductsHeading: Locator;
  readonly productItems: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchResultsHeading: Locator;
  readonly viewProductLink: Locator;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productQuantity: Locator;
  readonly addToCartButton: Locator;
  readonly addedToCartModal: Locator;
  readonly viewCartLink: Locator;
  readonly reviewNameInput: Locator;
  readonly reviewEmailInput: Locator;
  readonly reviewTextarea: Locator;
  readonly reviewSubmitButton: Locator;
  readonly reviewSuccessMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.helper = new Helper(page);

    this.allProductsHeading = page.getByRole("heading", { name: Heading.allProducts });
    this.productItems = page.locator(".features_items .col-sm-4");
    this.searchInput = page.locator("#search_product");
    this.searchButton = page.locator("#submit_search");
    this.searchResultsHeading = page.getByRole("heading", {
      name: Heading.searchedProducts,
    });
    this.viewProductLink = page.getByRole("link", { name: /View Product/ }).first();
    this.productName = page.locator(".product-information h2");
    this.productPrice = page.locator(".product-information span span");
    this.productQuantity = page.locator("#quantity");
    this.addToCartButton = page.locator('button:has-text("Add to cart")');
    this.addedToCartModal = page.getByText("Added!");
    this.viewCartLink = page.locator('a[href="/view_cart"]');
    this.reviewNameInput = page.locator("#name");
    this.reviewEmailInput = page.locator("#email");
    this.reviewTextarea = page.locator("#review");
    this.reviewSubmitButton = page.locator("#button-review");
    this.reviewSuccessMessage = page.getByText(/Thank you for your review/);
  }

  async openProducts() {
    await this.page.goto(PageUrl.products);
    await expect(this.allProductsHeading).toBeVisible();
  }

  async searchProduct(term: string) {
    await this.helper.fillField(this.searchInput, term);
    await this.searchButton.click();
  }

  async clickFirstViewProduct() {
    await this.openProductDetails(1);
  }

  async openProductDetails(id: number) {
    await this.page.goto(PageUrl.productDetails(id));
    await expect(this.productName).toBeVisible({ timeout: 15000 });
  }

  async assertProductAddedToCart() {
    await expect(this.addedToCartModal).toBeVisible();
  }

  async clickViewCartAfterAdd() {
    await this.viewCartLink.last().waitFor({ state: "visible", timeout: 5000 });
    await this.viewCartLink.last().click({ force: true });
  }

  async assertProductCountGreaterThan(minCount: number) {
    const count = await this.productItems.count();
    expect(count).toBeGreaterThan(minCount);
  }

  async getProductDetailPriceNumber() {
    const text = await this.helper.getText(this.productPrice);
    return parseInt(text.replace(/[^0-9]/g, ""));
  }

  async setQuantity(quantity: number) {
    await this.helper.fillField(this.productQuantity, String(quantity));
  }

  async fillReviewForm(name: string, email: string, review: string) {
    await this.helper.fillField(this.reviewNameInput, name);
    await this.helper.fillField(this.reviewEmailInput, email);
    await this.helper.fillField(this.reviewTextarea, review);
  }

  async assertReviewSubmitted() {
    await expect(this.reviewSuccessMessage).toBeVisible();
  }
}
