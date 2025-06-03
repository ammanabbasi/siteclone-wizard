// Full test flow for enhanced SiteClone Wizard
const chalk = require('chalk') // For colored output

// Add chalk fallback if not installed
const log = {
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  info: (msg) => console.log(`ℹ️  ${msg}`),
  warning: (msg) => console.log(`⚠️  ${msg}`),
}

const testFullFlow = async () => {
  const baseUrl = 'http://localhost:3001' // Updated port

  // Test configuration
  const testConfig = {
    targetUrl: 'https://www.autotrademark.com/',
    brandConfig: {
      name: 'Dream Cars Pro',
      tagline: 'Your dream car awaits!',
      colors: {
        primary: '#FF6B6B', // Red
        secondary: '#4ECDC4', // Teal
        accent: '#FFE66D', // Yellow
      },
      typography: {
        fontFamily: 'Montserrat',
      },
    },
  }

  log.info('Starting full test flow...\n')
  log.info(`Target URL: ${testConfig.targetUrl}`)
  log.info(`Brand Name: ${testConfig.brandConfig.name}`)
  log.info(
    `Colors: Primary=${testConfig.brandConfig.colors.primary}, Secondary=${testConfig.brandConfig.colors.secondary}, Accent=${testConfig.brandConfig.colors.accent}`
  )
  log.info(`Font: ${testConfig.brandConfig.typography.fontFamily}\n`)

  try {
    // Step 1: Test API availability
    log.info('Step 1: Testing API availability...')
    const healthCheck = await fetch(baseUrl)
    if (healthCheck.ok) {
      log.success('API is running')
    }

    // Step 2: Clone the website
    log.info('\nStep 2: Cloning website...')
    const cloneResponse = await fetch(`${baseUrl}/api/clone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testConfig),
    })

    const cloneData = await cloneResponse.json()

    if (!cloneResponse.ok || !cloneData.success) {
      log.error(`Clone failed: ${cloneData.error}`)
      if (cloneData.details) {
        console.log('\nError details:', cloneData.details)
      }
      return
    }

    log.success('Website cloned successfully!')
    console.log(`Output ID: ${cloneData.outputId}`)
    console.log('\nClone Statistics:')
    console.log(`- HTML Size: ${(cloneData.stats.htmlSize / 1024).toFixed(2)} KB`)
    console.log(`- CSS Rules: ${cloneData.stats.cssRulesExtracted}`)
    console.log(`- Assets Downloaded: ${cloneData.stats.assetsDownloaded}`)
    console.log(`- Brand Replacements: ${cloneData.stats.brandReplacementsMade}`)

    // Step 3: Wait a moment before launching
    log.info('\nStep 3: Preparing to launch preview...')
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Step 4: Launch preview
    log.info('Step 4: Launching preview server...')
    const launchResponse = await fetch(`${baseUrl}/api/launch/${cloneData.outputId}`, {
      method: 'POST',
    })

    const launchData = await launchResponse.json()

    if (!launchResponse.ok || !launchData.success) {
      log.error(`Launch failed: ${launchData.error}`)
      return
    }

    log.success('Preview launched successfully!')
    console.log(`Preview URL: ${launchData.url}`)
    console.log(`Port: ${launchData.port}`)

    // Step 5: Test preview availability
    log.info('\nStep 5: Testing preview server...')
    await new Promise((resolve) => setTimeout(resolve, 3000)) // Give it time to start

    try {
      const previewCheck = await fetch(launchData.url)
      if (previewCheck.ok) {
        log.success('Preview server is running and accessible')
      } else {
        log.warning(`Preview returned status ${previewCheck.status}`)
      }
    } catch (error) {
      log.warning('Preview server may still be starting up')
    }

    // Summary
    console.log('\n' + '='.repeat(50))
    log.success('Test completed successfully!\n')
    console.log('🎉 Summary:')
    console.log(`1. Clone ID: ${cloneData.outputId}`)
    console.log(`2. Download URL: ${baseUrl}${cloneData.downloadUrl}`)
    console.log(`3. Preview URL: ${launchData.url}`)
    console.log(`4. File Browser: ${baseUrl}/preview/${cloneData.outputId}`)
    console.log('\n💡 Next steps:')
    console.log('- Open the preview URL in your browser to see the cloned site')
    console.log('- Check if brand colors and fonts are applied correctly')
    console.log('- Verify that "Auto Trademark" is replaced with "Dream Cars Pro"')
    console.log('- Download the project ZIP to inspect the generated code')
  } catch (error) {
    log.error(`Test failed: ${error.message}`)
    console.error('\nFull error:', error)
  }
}

// Run the test
console.log('🚀 Enhanced SiteClone Wizard - Full Test Flow\n')
testFullFlow()
  .then(() => console.log('\n✨ Test flow completed'))
  .catch((err) => console.error('\n💥 Test error:', err))
