import { expect, test } from "@playwright/test";

test("Drag and drop with iFrames", async ({ page }) => {
    await page.goto("https://www.globalsqa.com/demo-site/draganddrop/")

    await page.locator(".fc-dialog-container").getByRole('button', { name: 'Consent' }).click() 

    const frame = page.frameLocator("[rel-title='Photo Manager'] iframe");

    await frame.locator("li", { hasText: "High Tatras 2" }).dragTo(frame.locator("#trash"))

    await page.waitForTimeout(2000)

    await frame.locator("li", { hasText: "High Tatras 4" }).hover()
    await page.mouse.down()
    await frame.locator("#trash").hover()
    await page.mouse.up()

    await expect(frame.locator("#trash li h5")).toHaveText(["High Tatras 2", "High Tatras 4"])
})