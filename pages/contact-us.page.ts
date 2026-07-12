import { type Locator, type Page, expect } from "@playwright/test";
import { Helper } from "../utils/helper";
import { PageUrl } from "../utils/labels";
import { BasePage } from "./base.page";

export class ContactUsPage extends BasePage {
  private readonly helper: Helper;

  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageTextarea: Locator;
  readonly fileUploadInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly homeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.helper = new Helper(page);

    this.nameInput = page.locator('[data-qa="name"]');
    this.emailInput = page.locator('[data-qa="email"]');
    this.subjectInput = page.locator('[data-qa="subject"]');
    this.messageTextarea = page.locator('[data-qa="message"]');
    this.fileUploadInput = page.locator('input[name="upload_file"]');
    this.submitButton = page.locator('[data-qa="submit-button"]');
    this.successMessage = page.locator(".status.alert.alert-success");
    this.homeButton = page.locator("#form-section").getByText("Home");
  }

  async openContactUs() {
    await this.page.goto(PageUrl.contactUs);
    await expect(this.page).toHaveURL(new RegExp(PageUrl.contactUs));
  }

  async fillContactForm(name: string, email: string, subject: string, message: string) {
    await this.helper.fillField(this.nameInput, name);
    await this.helper.fillField(this.emailInput, email);
    await this.helper.fillField(this.subjectInput, subject);
    await this.helper.fillField(this.messageTextarea, message);
  }

  async uploadFile(filePath: string) {
    await this.fileUploadInput.setInputFiles(filePath);
  }

  async clickSubmit() {
    this.page.once("dialog", (dialog) => dialog.accept());
    await this.submitButton.click();
  }

  async assertSuccessMessage() {
    await expect(this.successMessage).toBeVisible();
  }

  async clickHome() {
    await this.homeButton.click();
  }
}
