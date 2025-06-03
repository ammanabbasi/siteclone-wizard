// Test the fixed enhanced cloning with better JSX conversion
const testFixedGenerator = async () => {
  const baseUrl = 'http://localhost:3000'

  const testConfig = {
    targetUrl: 'https://www.autotrademark.com/',
    brandConfig: {
      name: 'Premium Auto Gallery',
      tagline: 'Your trusted auto marketplace',
      colors: {
        primary: '#2563EB', // Blue
        secondary: '#EF4444', // Red
        accent: '#10B981', // Green
      },
      typography: {
        fontFamily: 'Roboto',
      },
    },
  }

  console.log('🔧 Testing FIXED Enhanced Clone with JSX Conversion\n')
  console.log('Target:', testConfig.targetUrl)
  console.log('Brand:', testConfig.brandConfig.name)
  console.log('Colors: Blue/Red/Green')
  console.log('Font:', testConfig.brandConfig.typography.fontFamily)

  try {
    // Clone the website
    console.log('\n📋 Step 1: Cloning website...')
    const cloneResponse = await fetch(`${baseUrl}/api/clone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testConfig),
    })

    const cloneData = await cloneResponse.json()

    if (!cloneResponse.ok) {
      throw new Error(cloneData.error || 'Clone failed')
    }

    console.log('✅ Clone successful!')
    console.log('Output ID:', cloneData.outputId)
    console.log('Download URL:', cloneData.downloadUrl)

    // Wait a bit for file system
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Launch preview
    console.log('\n🚀 Step 2: Launching preview...')
    const launchResponse = await fetch(`${baseUrl}/api/launch/${cloneData.outputId}`, {
      method: 'POST',
    })

    const launchData = await launchResponse.json()

    if (!launchResponse.ok) {
      throw new Error(launchData.error || 'Launch failed')
    }

    console.log('✅ Preview launched!')
    console.log('Preview URL:', launchData.url)
    console.log('\n🎉 Success! The preview should open in your browser.')
    console.log('\nIf not, open:', launchData.url)

    // Display download info
    console.log('\n📥 Download Information:')
    console.log(`Download URL: http://localhost:3000${cloneData.downloadUrl}`)
    console.log(`Output directory: output/${cloneData.outputId}`)
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    if (error.stack) {
      console.error('\nStack trace:', error.stack)
    }
  }
}

// Run the test
testFixedGenerator().catch(console.error)
