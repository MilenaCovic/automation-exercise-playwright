import { type Page, type Locator, expect } from '@playwright/test';
import { Helper } from '../utils/helper';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  readonly helper: Helper;

  readonly logo: Locator;
  readonly logoutLink: Locator;
  readonly loggedInAsText: Locator;
  readonly deleteAccountLink: Locator;
  readonly subscribeEmailInput: Locator;
  readonly subscribeButton: Locator;
  readonly subscribeSuccessMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.helper = new Helper(page);

    this.logo = page.locator(".logo.pull-left");
    this.logoutLink = page.locator('a[href="/logout"]');
    this.loggedInAsText = page.locator('li:has-text("Logged in as")');
    this.deleteAccountLink = page.locator('a[href="/delete_account"]');
    this.subscribeEmailInput = page.locator("#susbscribe_email");
    this.subscribeButton = page.locator("#subscribe");
    this.subscribeSuccessMessage = page.getByText(/successfully subscribed/);
  }

  async openHome() {
    await this.page.goto('/');
    await expect(this.logo).toBeVisible();
  }

  async assertUrl(expectedPath: string) {
    await expect(this.page).toHaveURL(new RegExp(expectedPath));
  }

  async assertLogoutVisible() {
    await expect(this.logoutLink).toBeVisible();
  }

  async clickLogout() {
    await this.logoutLink.click();
  }

  async clickDeleteAccount() {
    await this.deleteAccountLink.click();
  }

  async fillSubscriptionEmail(email: string) {
    await this.subscribeEmailInput.scrollIntoViewIfNeeded();
    await this.helper.fillField(this.subscribeEmailInput, email);
  }

  async clickSubscribe() {
    await this.subscribeButton.click();
  }

  async assertSubscribed() {
    await expect(this.subscribeSuccessMessage).toBeVisible();
  }

}
