import { test, expect } from '@playwright/test'

test.describe('DealersCloud Site Builder', () => {
  test('should display the main wizard interface', async ({ page }) => {
    await page.goto('/wizard')
    await page.waitForLoadState('networkidle')

    // Check page title
    await expect(page).toHaveTitle(/DealersCloud Site Builder/)

    // Check main heading
    const heading = page.locator('h1')
    await expect(heading).toContainText('DealersCloud Site Builder')

    // Check that the main card is visible (the one with CardContent)
    await expect(page.locator('.rounded-lg.border.bg-card').first()).toBeVisible()
    
    // Check that we're on step 1 - use the h2 element specifically
    await expect(page.locator('h2:has-text("Step 1 of 6")')).toBeVisible()
  })

  test('should show wizard navigation', async ({ page }) => {
    await page.goto('/wizard')
    await page.waitForLoadState('networkidle')

    // Check progress bar exists
    await expect(page.locator('.bg-gradient-to-r').first()).toBeVisible()
    
    // Check that navigation section is present
    await expect(page.locator('.border-t').first()).toBeVisible()
  })

  test('should show auto-save functionality', async ({ page }) => {
    await page.goto('/wizard')
    await page.waitForLoadState('networkidle')

    // Check for auto-save checkbox
    await expect(page.locator('input[type="checkbox"]').first()).toBeVisible()
    
    // Check for save button
    await expect(page.locator('button:has-text("Save")').first()).toBeVisible()
  })

  test('should redirect from root to wizard', async ({ page }) => {
    await page.goto('/')
    
    // Should redirect to /wizard
    await expect(page).toHaveURL(/\/wizard/)
    await expect(page).toHaveTitle(/DealersCloud Site Builder/)
  })

  test('should show sidebar with steps', async ({ page }) => {
    await page.goto('/wizard')
    await page.waitForLoadState('networkidle')

    // Check sidebar is visible
    await expect(page.locator('.w-80').first()).toBeVisible()
    
    // Check for reset button
    await expect(page.locator('button:has-text("Reset")').first()).toBeVisible()
  })
})

test.describe('Visual Regression', () => {
  test.skip('should match screenshot of wizard page', async ({ page }) => {
    await page.goto('/wizard')
    await page.waitForLoadState('networkidle')
    
    // Wait for any animations to complete
    await page.waitForTimeout(1000)

    await expect(page).toHaveScreenshot('wizard-page.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test.skip('should match screenshot of sidebar', async ({ page }) => {
    await page.goto('/wizard')
    await page.waitForLoadState('networkidle')
    
    // Wait for content to load
    await page.waitForTimeout(1000)

    // Screenshot just the sidebar
    const sidebar = page.locator('.w-80').first()
    await expect(sidebar).toHaveScreenshot('wizard-sidebar.png', {
      animations: 'disabled',
    })
  })
})
