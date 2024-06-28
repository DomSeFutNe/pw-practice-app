import { expect } from "@playwright/test";
import { Page } from "playwright";
import HelperBase from "./helperBase";

class DatepickerPage extends HelperBase {
  constructor(page: Page) {
    super(page)
  }

  async selectCommonDatePickerDateFromTody(numberOfDaysFromToday: number) {
    const datepicker = this.page.getByPlaceholder("Form Picker");
    await datepicker.click();

    const expectedFullDate = await this.selectDateInTheCalendar(
      numberOfDaysFromToday
    );

    await expect(datepicker).toHaveValue(expectedFullDate);
  }

  async selectDateRangePickerDaysFromToday(startDaysFromToday: number, endDaysFromToday: number) {
    const datepicker = this.page.getByPlaceholder("Range Picker");
    await datepicker.click();

    const expectedStartDate = await this.selectDateInTheCalendar(startDaysFromToday);
    const expectedEndDate = await this.selectDateInTheCalendar(
        endDaysFromToday
    );

    const expectedFullDate = `${expectedStartDate} - ${expectedEndDate}`;

    await expect(datepicker).toHaveValue(expectedFullDate);
  }

  private async selectDateInTheCalendar(numberOfDaysFromToday: number) {
    const date = new Date();
    date.setDate(date.getDate() + numberOfDaysFromToday);

    const expectedDate = date.getDate().toString();

    let expectedMonthShort = date.toLocaleString("en", { month: "short" });
    let expectedMonthLong = date.toLocaleString("en", { month: "long" });
    const expectedYear = date.getFullYear().toString();

    const expectedFullDate = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

    let calendarMonthAndYear = await this.page
      .locator("nb-calendar-view-mode")
      .textContent();
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`;

    // Switch to months till the expected month
    while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
      await this.page
        .locator("nb-calendar-pageable-navigation [data-name='chevron-right']")
        .click();
      this.page.waitForTimeout(200);
      calendarMonthAndYear = await this.page
        .locator("nb-calendar-view-mode")
        .textContent();
    }
    await this.page.locator(".day-cell.ng-star-inserted:not(.bounding-month)").getByText(expectedDate, { exact: true }).click();

    return expectedFullDate;
  }
}

export default DatepickerPage;
