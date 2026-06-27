const { test, expect } = require('@playwright/test');

const pages = [
  { name: 'home', path: '/' },
  { name: 'contact', path: '/contact.html' },
  { name: 'calculator', path: '/bond-calculator.html' },
];

for (const target of pages) {
  test(`${target.name} has a stable visible layout`, async ({ page }, testInfo) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.stack || error.message));
    await page.goto(target.path, { waitUntil: 'networkidle' });

    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    const overflow = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(overflow.content).toBeLessThanOrEqual(overflow.viewport + 1);
    expect(errors).toEqual([]);

    await page.screenshot({
      path: testInfo.outputPath(`${target.name}-full.png`),
      fullPage: true,
    });
  });
}

test('keyboard focus is visible', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skipLink = page.locator('.skip-link');
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeInViewport();
});

test('mobile navigation opens without covering its controls', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Toggle navigation' });
  await toggle.click();
  await expect(page.locator('#navbarResponsive')).toHaveClass(/show/);
  await expect(page.getByRole('link', { name: 'Contact', exact: true })).toBeVisible();
});
