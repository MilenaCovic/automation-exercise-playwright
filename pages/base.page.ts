import { type Page } from "@playwright/test";
import { Button } from "../utils/labels";

export class BasePage {
  constructor(protected readonly page: Page) {}

  async clickButton(button: Button) {
    await this.page.getByRole("button", { name: button }).click();
  }
}
