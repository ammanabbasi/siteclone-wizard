const { chromium } = require('playwright')

;(async () => {
  console.log('Testing Playwright...')
  try {
    const browser = await chromium.launch({ headless: true })
    console.log('✓ Browser launched successfully')

    const page = await browser.newPage()
    console.log('✓ Page created')

    await page.goto('https://example.com')
    console.log('✓ Navigated to example.com')

    const title = await page.title()
    console.log('✓ Page title:', title)

    await browser.close()
    console.log('✓ Browser closed')
    console.log('\n✅ Playwright is working correctly!')
  } catch (error) {
    console.error('❌ Playwright error:', error.message)
  }
})()
