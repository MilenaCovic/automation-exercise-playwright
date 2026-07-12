import { test } from "@playwright/test";
import { HomePage } from "../../pages/home.page";
import { ProductsPage } from "../../pages/products.page";
import { CartPage } from "../../pages/cart.page";
import { LoginPage } from "../../pages/login.page";
import { CheckoutPage } from "../../pages/checkout.page";
import { ContactUsPage } from "../../pages/contact-us.page";
import { ApiClient } from "../../utils/api-client";
import {
  PAYMENT_DATA,
  REGISTRATION_DATA,
  MESSAGES,
  REVIEW_DATA,
  CONTACT_FORM_DATA,
  getApiAccountData,
} from "../../utils/test-data";
import { PageUrl, Button, Heading, Toast } from "../../utils/labels";

/* Tag legend:
   @smoke   — critical path, run on every commit
   @critical — P0: user can't transact without this (checkout, money path)
   @high     — P1: important functionality, blocks key features
   @medium   — P2: nice to have, lower business impact
*/

test.describe("E2E Tests", () => {
  let homePage: HomePage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let loginPage: LoginPage;
  let checkoutPage: CheckoutPage;
  let contactUsPage: ContactUsPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    loginPage = new LoginPage(page);
    checkoutPage = new CheckoutPage(page);
    contactUsPage = new ContactUsPage(page);
    await cartPage.clearCart();
  });

  test("Complete checkout after login", { tag: ["@smoke", "@critical"] }, async ({ request }) => {
    const api = new ApiClient(request);
    const email = LoginPage.generateEmail();
    await api.createAccount(getApiAccountData(email));
    await productsPage.openProducts();
    await productsPage.clickFirstViewProduct();
    await productsPage.clickButton(Button.addToCart);
    await productsPage.assertProductAddedToCart();
    await productsPage.clickViewCartAfterAdd();
    await cartPage.clickProceedToCheckout();
    await loginPage.openLogin();
    await loginPage.login(email, REGISTRATION_DATA.password);
    await homePage.assertLogoutVisible();
    await cartPage.openCart();
    await cartPage.clickProceedToCheckout();
    await checkoutPage.enterOrderComment(MESSAGES.orderComment);
    await checkoutPage.clickPlaceOrder();
    await checkoutPage.assertHeadingIsVisible(Heading.payment);
    await checkoutPage.fillPaymentForm(PAYMENT_DATA);
    await checkoutPage.clickButton(Button.payAndConfirm);
    await checkoutPage.assertHeadingIsVisible(Heading.orderPlaced);
    await checkoutPage.assertToastMessage(Toast.orderPlaced);
  });

  test("Complete checkout with registration", { tag: ["@smoke", "@critical"] }, async ({ request }) => {
    const api = new ApiClient(request);
    const email = LoginPage.generateEmail();
    await api.createAccount(getApiAccountData(email));

    await productsPage.openProductDetails(1);
    const price1 = await productsPage.getProductDetailPriceNumber();
    await productsPage.clickButton(Button.addToCart);
    await productsPage.assertProductAddedToCart();
    await productsPage.clickViewCartAfterAdd();

    await productsPage.openProductDetails(2);
    const price2 = await productsPage.getProductDetailPriceNumber();
    await productsPage.clickButton(Button.addToCart);
    await productsPage.assertProductAddedToCart();
    await productsPage.clickViewCartAfterAdd();

    await cartPage.assertCartTotal(`Rs. ${price1 + price2}`);

    await cartPage.clickProceedToCheckout();
    await loginPage.openLogin();
    await loginPage.login(email, REGISTRATION_DATA.password);
    await homePage.assertLogoutVisible();
    await cartPage.openCart();
    await cartPage.clickProceedToCheckout();
    await checkoutPage.enterOrderComment(MESSAGES.orderComment);
    await checkoutPage.clickPlaceOrder();
    await checkoutPage.assertHeadingIsVisible(Heading.payment);
    await checkoutPage.fillPaymentForm(PAYMENT_DATA);
    await checkoutPage.clickButton(Button.payAndConfirm);
    await checkoutPage.assertHeadingIsVisible(Heading.orderPlaced);
    await checkoutPage.assertToastMessage(Toast.orderPlaced);
  });

  test("Add product to cart, verify it, then remove it", { tag: ["@high"] }, async () => {
    await productsPage.openProducts();
    await productsPage.clickFirstViewProduct();
    await productsPage.clickButton(Button.addToCart);
    await productsPage.assertProductAddedToCart();
    await productsPage.clickViewCartAfterAdd();

    await cartPage.assertUrl(PageUrl.cart);
    await cartPage.assertCartItemCount(1);
    await cartPage.removeFirstItem();
    await cartPage.assertCartItemCount(0);
  });

  test("Delete account after registration", { tag: ["@high"] }, async ({ request }) => {
    const api = new ApiClient(request);
    const email = LoginPage.generateEmail();
    await api.createAccount(getApiAccountData(email));

    await loginPage.openLogin();
    await loginPage.login(email, REGISTRATION_DATA.password);
    await homePage.assertLogoutVisible();
    await homePage.clickDeleteAccount();
    await loginPage.assertAccountDeletedVisible();
    await loginPage.clickContinue();
    await homePage.assertUrl(PageUrl.home);
  });

  test("Add multiple products to cart", { tag: ["@high"] }, async () => {
    await productsPage.openProductDetails(1);
    await productsPage.clickButton(Button.addToCart);
    await productsPage.assertProductAddedToCart();
    await productsPage.clickViewCartAfterAdd();

    await cartPage.assertUrl(PageUrl.cart);
    await cartPage.assertCartItemCount(1);

    await productsPage.openProductDetails(2);
    await productsPage.clickButton(Button.addToCart);
    await productsPage.assertProductAddedToCart();
    await productsPage.clickViewCartAfterAdd();

    await cartPage.assertCartItemCount(2);
  });

  test("Verify empty cart message", { tag: ["@medium"] }, async () => {
    await cartPage.openCart();
    await cartPage.assertCartEmpty();
  });

  test("Submit a product review", { tag: ["@medium"] }, async () => {
    await productsPage.clickFirstViewProduct();
    await productsPage.fillReviewForm(
      REVIEW_DATA.name,
      REVIEW_DATA.email,
      REVIEW_DATA.text,
    );
    await productsPage.clickButton(Button.submit);
    await productsPage.assertReviewSubmitted();
  });

  test("Contact us form submission", { tag: ["@medium"] }, async () => {
    await contactUsPage.openContactUs();
    await contactUsPage.fillContactForm(
      CONTACT_FORM_DATA.name,
      CONTACT_FORM_DATA.email,
      CONTACT_FORM_DATA.subject,
      CONTACT_FORM_DATA.message,
    );
    await contactUsPage.uploadFile(CONTACT_FORM_DATA.filePath);
    await contactUsPage.clickSubmit();
    await contactUsPage.assertSuccessMessage();
    await contactUsPage.clickHome();
    await homePage.assertUrl(PageUrl.home);
  });

  test("Subscribe to newsletter", { tag: ["@medium"] }, async () => {
    await homePage.openHome();
    await homePage.fillSubscriptionEmail(LoginPage.generateEmail());
    await homePage.clickSubscribe();
    await homePage.assertSubscribed();
  });
});
