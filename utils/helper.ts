import { Page, Locator } from '@playwright/test';

export class Helper {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForVisible(locator: Locator, timeout = 10000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async fillField(locator: Locator, value: string) {
    await locator.clear();
    await locator.fill(value);
  }

  async getText(locator: Locator) {
    return (await locator.textContent())?.trim() ?? '';
  }

  static generateRandomEmail() {
    const randomStr = Math.random().toString(36).substring(2, 10);
    return `testuser_${randomStr}@example.com`;
  }
}
