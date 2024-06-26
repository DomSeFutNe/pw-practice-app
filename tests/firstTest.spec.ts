import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:4200/")
        await page.getByText("Forms").click()
        await page.getByText("Form Layouts").click()
})

test("Locator syntax rules", async ({ page }) => {
    // by tag name
    await page.locator("input", {}).first().click()

    // by id
    await page.locator("#inputEmail1", {}).click()

    // by class value
    page.locator(".shape-rectangle", {})

    // by attribute
    page.locator("[placeholder='Email']", {})

    // by entire class value
    page.locator("[class='input-full-width size-medium status-basic shape-rectangle nb-transition']", {})

    // combine different selectors
    page.locator("input[placeholder='Email']", {})

    // by XPath (Not recommended)
    page.locator("//*[@id='inputEmail1']", {})
    
    // by partial text match
    page.locator(":text('Using')", {})

    // by exact text match
    page.locator(":text-is('Using the Grid')", {})    
})

test("User facing locators", async ( { page }) => {
    await page.getByRole("textbox", { name: "Email"}).first().click()
    await page.getByRole("button", { name: "Sign in"}).first().click()

    await page.getByLabel("Email").first().click()

    await page.getByPlaceholder("Jane Doe").click()

    await page.getByText("Using the Grid").click()

    await page.getByTestId("SignIn").click()

    await page.getByTitle("IoT Dashboard").click()
})

test("locating child elements", async ({ page }) => {
    // Compact locator chaining
    await page.locator("nb-card nb-radio :text-is('Option 1')").click()
    // Equivalent to the above but more verbose
    await page.locator("nb-card").locator("nb-radio").locator(":text-is('Option 2')").click()

    // Combine locators with different strategies
    await page.locator("nb-card").getByRole("button", {name: "Sign in"}).first().click()

    // Combine locators with different strategies and selecting by element index (try to avoid this if possible)
    await page.locator("nb-card").nth(3).getByRole("button").click()
    // .first() and .last() should be avoided too as they are not stable
})

test("Locate parent elements", async ({ page }) => {
    // Locate the parent element of a child element where a child of the element contains a specific text.
    await page.locator("nb-card", { hasText: "Using the Grid" }).getByRole("textbox", { name: "Email" }).click()
    // Locate the parent of a child which where located with a locator.
    await page.locator("nb-card", { has: page.locator("#inputEmail1") }).getByRole("textbox", { name: "Password" }).click()

    // Locate the parent of a child element where a child has a specific text which located with a dedicated locator.
    await page.locator("nb-card").filter({ hasText: "Basic form"}).getByRole("textbox", { name: "Email" }).click()
    // Locate the parent of a child element where a child has a specific locator which located with a dedicated locator.
    await page.locator("nb-card").filter({ has: page.locator(".status-danger")}).getByRole("textbox", { name: "Password" }).click()

    // Combine parent locator with child locators.
    await page.locator("nb-card").filter({ has: page.locator("nb-checkbox")}).filter({ hasText: "Sign in"}).getByRole("textbox", { name: "Email" }).click()

    // Locate the parent of a child element where a child has a specific text which located with a dedicated locator.
    // With .locator("..") you can navigate to the parent element of the current locator.
    // This is not recommended as it makes the test less readable.
    await page.locator(":text-is('Using the Grid')").locator("..").getByRole("textbox", { name: "Email" }).click()
})

test("Reuse locators", async ({ page }) => {
    const testEmail = "test@test.com"
    /**
     * Before:
     * await page.locator("nb-card").filter({ hasText: "Basic form"}).getByRole("textbox", { name: "Email" }).fill("test@test.com")
     * await page.locator("nb-card").filter({ hasText: "Basic form"}).getByRole("textbox", { name: "Password" }).fill("Welcome123")
     * await page.locator("nb-card").filter({ hasText: "Basic form"}).getByRole("button", { name: "Submit" }).click()
     */
    const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });

    const emailField = basicForm.getByRole("textbox", { name: "Email" });

    const checkbox = basicForm.locator("nb-checkbox");

    await emailField.fill(testEmail)
    await basicForm.getByRole("textbox", { name: "Password" }).fill("Welcome123")
    await checkbox.click()
    await basicForm.getByRole("button", { name: "Submit" }).click()

    // This is an assertion to check if the email field has the correct value.
    await expect(emailField).toHaveValue(testEmail)
})

test("Extract values", async ({ page }) => {
    // Specific text values
    const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
    const buttonText = await basicForm.getByRole("button").textContent();

    expect(buttonText).toEqual("Submit")

    // All text values
    const allRadioButtonsLabels = await page.locator("nb-radio").allTextContents()
    expect(allRadioButtonsLabels).toContain("Option 1")

    // Input value
    const emailField = basicForm.getByRole("textbox", { name: "Email" })
    await emailField.fill("test@test.com")

    const emailValue = await emailField.inputValue()

    expect(emailValue).toEqual("test@test.com")

    // Value of an attribute
    const emailFieldPlaceholder = await emailField.getAttribute("placeholder")
    expect(emailFieldPlaceholder).toEqual("Email")
})

test("Assertions", async ({ page }) => {
    // General assertions
    const value = 5;
    expect(value).toEqual(5)

    const basicFormButton = page.locator("nb-card").filter({ hasText: "Basic form" }).locator("button");
    const basicFormButtonTextContent = await basicFormButton.textContent()
    expect(basicFormButtonTextContent).toEqual("Submit")

    // Locator assertions
    await expect(basicFormButton).toHaveText("Submit")

    // Soft assertions (continue after failure)
    await expect.soft(basicFormButton).toHaveText("Submit6")
    await basicFormButton.click()
})