import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

test.describe("Form layout page", () => {
  test.describe.configure({ retries: 0 });
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
  });

  test("Input fields", async ({ page }) => {
    const usingTheGridEmailInput = page
      .locator("nb-card", { hasText: "Using the Grid" })
      .getByRole("textbox", { name: "Email" });

    await usingTheGridEmailInput.fill("test@test.com");
    await usingTheGridEmailInput.clear();
    await usingTheGridEmailInput.pressSequentially("test2@test.com", {
      delay: 100,
    });

    // Generic assertion
    const inputValue = await usingTheGridEmailInput.inputValue();
    expect(inputValue).toEqual("test2@test.com");

    // Locater specific assertion
    await expect(usingTheGridEmailInput).toHaveValue("test2@test.com");
  });

  test.only("Radio buttons", async ({ page }) => {
    const usingTheGridForm = page.locator("nb-card", {
      hasText: "Using the Grid",
    });

    // await usingTheGridForm.getByLabel("Option 1").check({ force: true })
    await usingTheGridForm
      .getByRole("radio", { name: "Option 2" })
      .check({ force: true });

    const radioStatus = await usingTheGridForm
      .getByRole("radio", { name: "Option 1" })
      .isChecked();

      await expect(usingTheGridForm).toHaveScreenshot();

    // expect(radioStatus).toBeTruthy();

    // await expect(
    //   usingTheGridForm.getByRole("radio", { name: "Option 1" })
    // ).toBeChecked({ checked: true });
  });
});

test("Checkboxes", async ({ page }) => {
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Toastr").click();

  await page
    .getByRole("checkbox", { name: "Hide on click" })
    .uncheck({ force: true });
  await page
    .getByRole("checkbox", { name: "Prevent arising of duplicate toast" })
    .check({ force: true });

  const allBoxes = page.getByRole("checkbox");

  for (const box of await allBoxes.all()) {
    await box.check({ force: true });
    await expect(box).toBeChecked({ checked: true });

    await box.uncheck({ force: true });
    await expect(box).toBeChecked({ checked: false });
  }
});

test("Dropdowns and lists", async ({ page }) => {
  const themeDropdown = page.locator("ngx-header nb-select");
  await themeDropdown.click();

  // page.getByRole("list") -> ul
  // page.getByRole("listitem") -> li

  // const optionList = page.getByRole("list").locator("nb-option")
  const optionList = page.locator("nb-option-list nb-option");
  await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);

  await optionList.filter({ hasText: "Cosmic" }).click();

  const header = page.locator("nb-layout-header");

  await expect(header).toHaveCSS("background-color", "rgb(50, 50, 89)");

  const colors = {
    Light: "rgb(255, 255, 255)",
    Dark: "rgb(34, 43, 69)",
    Cosmic: "rgb(50, 50, 89)",
    Corporate: "rgb(255, 255, 255)",
  };

  for (const color in colors) {
    await themeDropdown.click();

    await optionList.filter({ hasText: color }).click();
    await expect(header).toHaveCSS("background-color", colors[color]);
  }
});

test("Tooltips", async ({ page }) => {
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Tooltip").click();

  const toolTipCards = page.locator("nb-card", {
    hasText: "Tooltip Placements",
  });

  const tooltipButton = toolTipCards.getByRole("button", { name: "Top" });
  await tooltipButton.hover();

  // page.getByRole("tooltip") // Only works if a role tooltip is present

  const tooltip = await page.locator("nb-tooltip").textContent();
  expect(tooltip).toEqual("This is a tooltip");
});

test("Dialog box", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  page.on("dialog", (dialog) => {
    expect(dialog.message()).toEqual("Are you sure you want to delete?");
    dialog.accept();
  });

  await page
    .getByRole("table")
    .locator("tr", { hasText: "mdo@gmail.com" })
    .locator(".nb-trash")
    .click();

  await expect(page.locator("table tr").first()).not.toHaveText(
    "mdo@gmail.com"
  );
});

test("Web tables", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  // 1. Get the row by any test in this row
  const targetRow = page.getByRole("row", { name: "twitter@outlook.com" });
  await targetRow.locator(".nb-edit").click();

  await page.locator("input-editor").getByPlaceholder("Age").clear();
  await page.locator("input-editor").getByPlaceholder("Age").fill("35");
  await page.locator(".nb-checkmark").click();

  // 2. Get the row based on the value in the specific column
  await page.locator(".ng2-smart-pagination-nav").getByText("2").click();
  const targetRowByID = page
    .getByRole("row", { name: "11" })
    .filter({ has: page.locator("td").nth(1).getByText("11") });
  await targetRowByID.locator(".nb-edit").click();

  await page.locator("input-editor").getByPlaceholder("E-Mail").clear();
  await page
    .locator("input-editor")
    .getByPlaceholder("E-Mail")
    .fill("test@test.com");
  await page.locator(".nb-checkmark").click();

  await expect(targetRowByID.locator("td").nth(5)).toHaveText("test@test.com");
});

test("Web tables (2)", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  // Continue from -Web tables-
  // 3. Test filter of the table
  const ages = ["20", "30", "40", "200"];

  for (const age of ages) {
    await page.locator("input-filter").getByPlaceholder("Age").clear();
    await page.locator("input-filter").getByPlaceholder("Age").fill(age);

    await page.waitForTimeout(500);

    if (age === "200") {
      const tBody = page.locator("tbody");
      await expect(tBody).toHaveText("No data found");
    } else {
      const ageRows = page.locator("tbody tr");
      for (const row of await ageRows.all()) {
        const cellValue = await row.locator("td").last().textContent();
        expect(cellValue).toEqual(age);
      }
    }
  }
});

test("Datepicker", async ({ page }) => {
    await page.getByText("Forms").click();    
    await page.getByText("Datepicker").click();   
    
    const datepicker = page.getByPlaceholder("Form Picker");
    await datepicker.click();

    // Change the month and the year
    await page.locator("nb-calendar-view-mode button").click();
    await page.locator("nb-calendar-year-cell").getByText("2024").click();
    await page.locator("nb-calendar-month-cell").getByText("Feb").click();

    const dayOfMonth = page.locator("[class='day-cell ng-star-inserted']");
    // Additional options: { exact: true } is important as the datepicker has a lot of text which contains 1
    await dayOfMonth.getByText("1", { exact: true }).click();

    await expect(datepicker).toHaveValue("Feb 1, 2024")
})

test.skip("Datepicker (With JS Date)", async ({ page }) => {
    await page.getByText("Forms").click();    
    await page.getByText("Datepicker").click();
    
    const datepicker = page.getByPlaceholder("Form Picker");
    await datepicker.click();

    const date = new Date();
    date.setDate(date.getDate() + 5);

    const expectedDate = date.getDate().toString();

    let expectedMonthShort = date.toLocaleString("en", { month: "short" });
    let expectedMonthLong = date.toLocaleString("en", { month: "long" });
    const expectedYear = date.getFullYear().toString();

    const expectedFullDate = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

    let calendarMonthAndYear = await page.locator("nb-calendar-view-mode").textContent();
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`;

    // Switch to months till the expected month
    while(!calendarMonthAndYear.includes(expectedMonthAndYear)) {
        await page.locator("nb-calendar-pageable-navigation [data-name='chevron-right']").click();
        page.waitForTimeout(500);
        calendarMonthAndYear = await page.locator("nb-calendar-view-mode").textContent();    
    }

    const dayOfMonth = page.locator("[class='day-cell ng-star-inserted']");
    await dayOfMonth.getByText(expectedDate, { exact: true }).click();

    await expect(datepicker).toHaveValue(expectedFullDate)
})

test("Slider", async ({ page }) => {
    // Update attributes of the slider
    // const tempGauge = page.locator("[tabtitle='Temperature'] ngx-temperature-dragger circle")
    // await tempGauge.evaluate( node => {
    //     node.setAttribute("cx", "232.630");
    //     node.setAttribute("cy", "232.630");
    // });

    // await tempGauge.click();

    // Mouse movement
    const tempBox = page.locator("[tabtitle='Temperature'] ngx-temperature-dragger")
    await tempBox.scrollIntoViewIfNeeded();

    const box = await tempBox.boundingBox()
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 100, y);
    await page.mouse.move(x + 100, y + 100);
    await page.mouse.up();

    await expect(tempBox).toContainText("30")
})