// Test the fixed enhanced cloning
const testFixedClone = async () => {
  const baseUrl = 'http://localhost:3001'

  const testConfig = {
    targetUrl: 'https://www.autotrademark.com/',
    brandConfig: {
      name: 'Elite Auto Gallery',
      tagline: 'Premium cars for discerning buyers',
      colors: {
        primary: '#1E40AF', // Blue
        secondary: '#DC2626', // Red
        accent: '#10B981', // Green
      },
      typography: {
        fontFamily: 'Roboto',
      },
    },
  }

  console.log('🔧 Testing FIXED Enhanced Clone\n')
  console.log('Target:', testConfig.targetUrl)
  console.log('Brand:', testConfig.brandConfig.name)
  console.log('Colors: Blue/Red/Green')
  console.log('Font:', testConfig.brandConfig.typography.fontFamily)

  try {
    // Clone the website
    console.log('\n📋 Cloning...')
    const cloneResponse = await fetch(`${baseUrl}/api/clone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testConfig),
    })

    const cloneData = await cloneResponse.json()

    if (!cloneResponse.ok || !cloneData.success) {
      console.error(`❌ Clone failed: ${cloneData.error}`)
      return
    }

    console.log('✅ Cloned!')
    console.log(`ID: ${cloneData.outputId}`)
    console.log(
      `Stats: ${cloneData.stats.assetsDownloaded} assets, ${cloneData.stats.brandReplacementsMade} replacements`
    )

    // Wait and launch
    console.log('\n⏳ Waiting...')
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log('🚀 Launching preview...')
    const launchResponse = await fetch(`${baseUrl}/api/launch/${cloneData.outputId}`, {
      method: 'POST',
    })

    const launchData = await launchResponse.json()

    if (!launchResponse.ok || !launchData.success) {
      console.error(`❌ Launch failed: ${launchData.error}`)
      return
    }

    console.log('✅ Launched!')
    console.log(`\n🌐 Preview: ${launchData.url}`)
    console.log(`📦 Download: ${baseUrl}${cloneData.downloadUrl}`)
    console.log('\n✨ Check for:')
    console.log('- "Auto Trademark" → "Elite Auto Gallery"')
    console.log('- Blue headers and buttons')
    console.log('- Red footer')
    console.log('- Green accent links')
    console.log('- Roboto font')
  } catch (error) {
    console.error(`❌ Error: ${error.message}`)
  }
}

testFixedClone()
