import {test, expect} from '@playwright/test';
import PageManager from '../page-objects/pageManager';

import { faker }from "@faker-js/faker";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

test("Navigate to form page", async ({ page }) => {
    const pm = new PageManager(page)
    
    await pm.navigateTo().formLayoutsPage();
    await pm.navigateTo().datepickerPage();
    await pm.navigateTo().smartTablePage();
    await pm.navigateTo().toastrPage();
    await pm.navigateTo().tooltipPage();
})

test("Parametrized methods", async ({ page }) => {
    const pm = new PageManager(page)

    const randomFullName = faker.person.fullName();
    const randomEmail = `${randomFullName.replace(/\s/g, ".").toLowerCase()}@test.com`;
    const randomPassword = faker.internet;

    await pm.navigateTo().formLayoutsPage();

    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(randomEmail, randomPassword.password(), "Option 1")
    await page.waitForTimeout(1000)
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
})

test("Datepicker method", async ({ page }) => {
    const pm = new PageManager(page)

    await pm.navigateTo().datepickerPage();
    await pm.onDatepickerPage().selectCommonDatePickerDateFromTody(5)
    await page.waitForTimeout(1000)
    
    await pm.onDatepickerPage().selectDateRangePickerDaysFromToday(3, 10)
    await page.waitForTimeout(1000)
    
})