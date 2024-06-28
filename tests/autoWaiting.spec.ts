import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }, testInfo) => {
  await page.goto("http://uitestingplayground.com/ajax");
  await page.getByText("Button Triggering AJAX Request").click();
  // Adding 2 seconds to the default timeout for each test.
  testInfo.setTimeout(testInfo.timeout + 2000);
});

test("Auto waiting", async ({ page }) => {
  const successButton = page.locator(".bg-success");

  // Wait default timeout
  // await successButton.click()

  // Wait for the element to be attached to the DOM. Maximum default timeout.
  // const text = await successButton.textContent()

  // Do not wait for the element and execute directly.
  // const text = await successButton.allTextContents()

  // Manuel waiting for the element to be attached to the DOM.
  // await successButton.waitFor({ state: "attached" })
  // const text = await successButton.allTextContents()
  // expect(text).toContain("Data loaded with AJAX get request.")

  // Wait for timeout 5 seconds
  // await expect(successButton).toHaveText("Data loaded with AJAX get request.")

  // Override timeout
  await expect(successButton).toHaveText("Data loaded with AJAX get request.", {
    timeout: 30000,
  });
});

test.skip("Alternative waits", async ({ page }) => {
  const successButton = page.locator(".bg-success");

  // __ wait for element
  // await page.waitForSelector(".bg-success")

  // __ wait for particular response
  // await page.waitForResponse("http://uitestingplayground.com/ajaxdata")

  // __ wait for network calls to be completed (Not recommended)
  // If the network stuck, the test will stuck too.
  await page.waitForLoadState("networkidle");

  const text = await successButton.allTextContents();
  expect(text).toContain("Data loaded with AJAX get request.");
});

test.skip("Timeouts", async ({ page }) => {
    // Override the timeout for this test.
    // test.setTimeout(10000);

    // This test will be slow. timeout = 3x default timeout
    // test.slow()

    const successButton = page.locator(".bg-success");

    // Override timeout for action will be ignored as test timeout is less than action timeout.
    await successButton.click();
});
