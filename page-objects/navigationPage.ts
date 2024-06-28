import { Page } from "@playwright/test";
import HelperBase from "./helperBase";

class NavigationPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async formLayoutsPage() {
    await this.selectGroupMenuItem("Forms");
    await this.page.getByText("Form Layouts").click();
  }

  async datepickerPage() {
    await this.selectGroupMenuItem("Forms");
    await this.page.getByText("Datepicker").click();
  }

  async smartTablePage() {
    await this.selectGroupMenuItem("Tables & Data");
    await this.page.getByText("Smart Table").click();
  }

  async toastrPage() {
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.page.getByText("Toastr").click();
  }

  async tooltipPage() {
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.page.getByText("Tooltip").click();
  }

  private async selectGroupMenuItem(groupItemTitle: string) {
    const groupItemMenu = this.page.getByTitle(groupItemTitle);
    const expandedState = await groupItemMenu.getAttribute("aria-expanded");
    if (expandedState === "false") {
      await groupItemMenu.click();
    }
    await this.waitForNumberOfSeconds(1);
  }
}

export default NavigationPage;
