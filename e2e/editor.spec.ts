
import { test, expect } from '@playwright/test';

test('editor', async ({ page }) => {
  await page.goto('/editor');

  // Add shapes
  await page.getByRole('button', { name: 'Add Text' }).click();
  await page.getByRole('button', { name: 'Add Rectangle' }).click();
  await page.getByRole('button', { name: 'Add Ellipse' }).click();
  await page.getByRole('button', { name: 'Add Line' }).click();
  await page.getByRole('button', { name: 'Add Polygon' }).click();

  // Select and modify text
  await page.locator('li:has-text("Text")').click();
  await expect(page.locator('aside:has-text("Properties")')).toBeVisible();

  // Select and modify rectangle
  await page.locator('li:has-text("Rectangle")').click({ modifiers: ['Shift'] });

  // Group
  await page.getByRole('button', { name: 'Group' }).click();
  await expect(page.locator('li:has-text("New Group")')).toBeVisible();

  // Ungroup
  await page.getByRole('button', { name: 'Ungroup' }).click();
  await expect(page.locator('li:has-text("New Group")')).not.toBeVisible();

  // Select all
  await page.locator('li:has-text("Text")').click();
  await page.locator('li:has-text("Rectangle")').click({ modifiers: ['Shift'] });
  await page.locator('li:has-text("Ellipse")').click({ modifiers: ['Shift'] });
  await page.locator('li:has-text("Line")').click({ modifiers: ['Shift'] });
  await page.locator('li:has-text("Polygon")').click({ modifiers: ['Shift'] });

  // Duplicate
  await page.getByRole('button', { name: 'Duplicate' }).click();
  await expect(page.locator('li:has-text("Text (copy)")')).toBeVisible();

  // Merge
  await page.getByRole('button', { name: 'Merge' }).click();
  await expect(page.locator('li:has-text("Merged Group")')).toBeVisible();

  // Delete
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.locator('li:has-text("Merged Group")')).not.toBeVisible();
});
