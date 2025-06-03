import { test, expect } from '@playwright/test'

test.describe('SiteClone Wizard', () => {
  test('should display the main form', async ({ page }) => {
    await page.goto('/')

    // Check page title
    await expect(page).toHaveTitle(/SiteClone Wizard/)

    // Check main heading
    const heading = page.locator('h1')
    await expect(heading).toContainText('SiteClone Wizard')

    // Check form elements
    await expect(page.locator('input[type="url"]')).toBeVisible()
    await expect(page.locator('input#brandName')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should validate URL input', async ({ page }) => {
    await page.goto('/')

    const urlInput = page.locator('input[type="url"]')
    const submitButton = page.locator('button[type="submit"]')

    // Try to submit without URL
    await submitButton.click()

    // Check for validation
    const validationMessage = await urlInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    )
    expect(validationMessage).toBeTruthy()
  })

  test('should update brand colors', async ({ page }) => {
    await page.goto('/')

    const primaryColorInput = page.locator('input#primary')
    const colorDisplay = page.locator('span').filter({ hasText: '#3B82F6' })

    // Change primary color
    await primaryColorInput.fill('#FF0000')

    // Check if display updates
    await expect(colorDisplay).toContainText('#FF0000')
  })

  test('should show loading state on submit', async ({ page }) => {
    await page.goto('/')

    // Fill required fields
    await page.locator('input[type="url"]').fill('https://example.com')
    await page.locator('input#brandName').fill('Test Brand')

    // Submit form
    await page.locator('button[type="submit"]').click()

    // Check for loading state
    await expect(page.locator('text=Processing...')).toBeVisible()
  })
})

test.describe('Visual Regression', () => {
  test('should match screenshot of main page', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('main-page.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('should match screenshot of filled form', async ({ page }) => {
    await page.goto('/')

    // Fill form
    await page.locator('input[type="url"]').fill('https://vercel.com')
    await page.locator('input#brandName').fill('MyAwesomeBrand')
    await page.locator('input#tagline').fill('Building the future')

    await expect(page).toHaveScreenshot('filled-form.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })
})
