// Simple test flow for enhanced SiteClone Wizard
const testSimpleFlow = async () => {
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

  console.log('🚀 Testing Enhanced SiteClone Wizard\n')
  console.log('Configuration:')
  console.log(`- URL: ${testConfig.targetUrl}`)
  console.log(`- Brand: ${testConfig.brandConfig.name}`)
  console.log(`- Tagline: ${testConfig.brandConfig.tagline}`)
  console.log(`- Colors: Red, Teal, Yellow`)
  console.log(`- Font: ${testConfig.brandConfig.typography.fontFamily}\n`)

  try {
    // Clone the website
    console.log('📋 Cloning website...')
    const cloneResponse = await fetch(`${baseUrl}/api/clone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testConfig),
    })

    const cloneData = await cloneResponse.json()

    if (!cloneResponse.ok || !cloneData.success) {
      console.error(`❌ Clone failed: ${cloneData.error}`)
      if (cloneData.details) {
        console.log('\nError details:', cloneData.details)
      }
      return
    }

    console.log('✅ Website cloned successfully!')
    console.log(`\nClone ID: ${cloneData.outputId}`)
    console.log('\nStatistics:')
    console.log(`- HTML: ${(cloneData.stats.htmlSize / 1024).toFixed(2)} KB`)
    console.log(`- CSS Rules: ${cloneData.stats.cssRulesExtracted}`)
    console.log(`- Assets: ${cloneData.stats.assetsDownloaded}`)
    console.log(`- Brand Replacements: ${cloneData.stats.brandReplacementsMade}`)

    // Wait before launching
    console.log('\n⏳ Waiting 2 seconds...')
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Launch preview
    console.log('\n🚀 Launching preview...')
    const launchResponse = await fetch(`${baseUrl}/api/launch/${cloneData.outputId}`, {
      method: 'POST',
    })

    const launchData = await launchResponse.json()

    if (!launchResponse.ok || !launchData.success) {
      console.error(`❌ Launch failed: ${launchData.error}`)
      return
    }

    console.log('✅ Preview launched!')
    console.log(`\nPreview URL: ${launchData.url}`)

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('🎉 SUCCESS! Your cloned site is ready\n')
    console.log('📦 Download ZIP:')
    console.log(`   ${baseUrl}${cloneData.downloadUrl}\n`)
    console.log('🌐 Preview Site:')
    console.log(`   ${launchData.url}\n`)
    console.log('📁 Browse Files:')
    console.log(`   ${baseUrl}/preview/${cloneData.outputId}\n`)
    console.log('✨ What to check:')
    console.log('   - "Auto Trademark" → "Dream Cars Pro"')
    console.log('   - Red primary color on headers/buttons')
    console.log('   - Teal secondary color on footer')
    console.log('   - Yellow accent color on links')
    console.log('   - Montserrat font throughout')
    console.log('='.repeat(60))
  } catch (error) {
    console.error(`\n❌ Test failed: ${error.message}`)
  }
}

// Run the test
testSimpleFlow()
