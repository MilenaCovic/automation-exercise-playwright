import { type Locator, type Page, expect } from "@playwright/test";
import { Helper } from "../utils/helper";
import { ErrorMessage, PageUrl } from "../utils/labels";
import { BasePage } from "./base.page";

type RegistrationData = {
  password: string;
  day: string;
  month: string;
  year: string;
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  address2?: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
};

export class LoginPage extends BasePage {
  private readonly helper: Helper;

  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly loginErrorMessage: Locator;
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly titleMrRadio: Locator;
  readonly passwordInput: Locator;
  readonly dayDropdown: Locator;
  readonly monthDropdown: Locator;
  readonly yearDropdown: Locator;
  readonly newsletterCheckbox: Locator;
  readonly specialOffersCheckbox: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly addressInput: Locator;
  readonly address2Input: Locator;
  readonly countryDropdown: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly accountCreatedHeading: Locator;
  readonly accountCreatedMessage: Locator;
  readonly accountDeletedHeading: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.helper = new Helper(page);

    this.loginEmailInput = page.locator('[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');
    this.loginErrorMessage = page
      .locator(".login-form form p")
      .filter({ hasText: new RegExp(ErrorMessage.loginIncorrect, "i") });

    this.signupNameInput = page.locator('[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('[data-qa="signup-email"]');
    this.signupButton = page.locator('[data-qa="signup-button"]');

    this.titleMrRadio = page.locator("#id_gender1");
    this.passwordInput = page.locator('[data-qa="password"]');
    this.dayDropdown = page.locator('[data-qa="days"]');
    this.monthDropdown = page.locator('[data-qa="months"]');
    this.yearDropdown = page.locator('[data-qa="years"]');
    this.newsletterCheckbox = page.locator("#newsletter");
    this.specialOffersCheckbox = page.locator("#optin");
    this.firstNameInput = page.locator('[data-qa="first_name"]');
    this.lastNameInput = page.locator('[data-qa="last_name"]');
    this.companyInput = page.locator('[data-qa="company"]');
    this.addressInput = page.locator('[data-qa="address"]');
    this.address2Input = page.locator('[data-qa="address2"]');
    this.countryDropdown = page.locator('[data-qa="country"]');
    this.stateInput = page.locator('[data-qa="state"]');
    this.cityInput = page.locator('[data-qa="city"]');
    this.zipcodeInput = page.locator('[data-qa="zipcode"]');
    this.mobileNumberInput = page.locator('[data-qa="mobile_number"]');

    this.accountCreatedHeading = page.locator('[data-qa="account-created"]');
    this.accountCreatedMessage = page.getByText(/account has been successfully created/);
    this.accountDeletedHeading = page.locator('[data-qa="account-deleted"]');
    this.continueButton = page.locator('[data-qa="continue-button"]');
  }

  async openLogin() {
    await this.page.goto(PageUrl.login);
    await expect(this.loginEmailInput).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.helper.fillField(this.loginEmailInput, email);
    await this.helper.fillField(this.loginPasswordInput, password);
    await this.loginButton.click();
  }

  async assertLoginError(errorMsg: string) {
    const error = await this.helper.getText(this.loginErrorMessage);
    expect(error.toLowerCase()).toContain(errorMsg);
  }

  static generateEmail() {
    return Helper.generateRandomEmail();
  }

  async fillSignupForm(name: string, email: string) {
    await this.helper.fillField(this.signupNameInput, name);
    await this.helper.fillField(this.signupEmailInput, email);
  }

  async fillRegistrationForm(data: RegistrationData) {
    await this.titleMrRadio.check();
    await this.helper.fillField(this.passwordInput, data.password);
    await this.dayDropdown.selectOption(data.day);
    await this.monthDropdown.selectOption(data.month);
    await this.yearDropdown.selectOption(data.year);
    await this.newsletterCheckbox.check();
    await this.specialOffersCheckbox.check();
    await this.helper.fillField(this.firstNameInput, data.firstName);
    await this.helper.fillField(this.lastNameInput, data.lastName);
    if (data.company) await this.helper.fillField(this.companyInput, data.company);
    await this.helper.fillField(this.addressInput, data.address);
    if (data.address2) await this.helper.fillField(this.address2Input, data.address2);
    await this.countryDropdown.selectOption({ label: data.country });
    await this.helper.fillField(this.stateInput, data.state);
    await this.helper.fillField(this.cityInput, data.city);
    await this.helper.fillField(this.zipcodeInput, data.zipcode);
    await this.helper.fillField(this.mobileNumberInput, data.mobileNumber);
  }

  async assertHeadingIsVisible(heading: string) {
    await expect(this.page.getByRole("heading", { name: heading })).toBeVisible();
  }

  async assertAccountCreatedVisible() {
    await expect(this.accountCreatedHeading).toBeVisible();
  }

  async assertAccountCreatedMessage() {
    await expect(this.accountCreatedMessage).toBeVisible();
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async assertAccountDeletedVisible() {
    await expect(this.accountDeletedHeading).toBeVisible();
  }

  async clickDeleteAccount() {
    await this.page.locator('a[href="/delete_account"]').click();
  }
}
