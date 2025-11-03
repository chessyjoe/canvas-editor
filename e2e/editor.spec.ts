
import { test, expect } from '@playwright/test';

test('editor', async ({ page }) => {
  await page.goto('/editor');

  await page.getByRole('button', { name: 'Add Text' }).click();
  await page.getByRole('button', { name: 'Add Rectangle' }).click();

  await page.locator('li:has-text("text")').click();
  await expect(page.locator('aside:has-text("Properties")')).toBeVisible();
  await page.getByLabel('Text:').fill('Hello, Playwright!');
  await page.getByLabel('Font Size:').fill('32');

  await page.locator('li:has-text("rect")').click();
  await expect(page.locator('aside:has-text("Properties")')).toBeVisible();
  await page.getByLabel('Width:').fill('200');
  await page.getByLabel('Height:').fill('150');
  await page.getByLabel('Color:').fill('#ff0000');

  await expect(page.getByLabel('Text:')).toHaveValue('Hello, Playwright!');
});
