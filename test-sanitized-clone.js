// Test the enhanced cloning with content sanitization
const testSanitizedClone = async () => {
  const baseUrl = 'http://localhost:3000'

  const testConfig = {
    targetUrl: 'https://www.autotrademark.com/',
    brandConfig: {
      name: 'MyBrand Auto Sales',
      tagline: 'Your trusted automotive partner',
      colors: {
        primary: '#2563EB', // Blue
        secondary: '#DC2626', // Red
        accent: '#10B981', // Green
      },
      typography: {
        fontFamily: 'Poppins',
      },
      contact: {
        phone: '(555) 123-4567',
        email: 'info@mybrandauto.com',
        address: {
          street: '123 Main Street',
          city: 'Springfield',
          state: 'IL',
          zip: '62701',
        },
      },
      social: {
        facebook: 'https://facebook.com/mybrandauto',
        twitter: 'https://twitter.com/mybrandauto',
        instagram: 'https://instagram.com/mybrandauto',
        linkedin: 'https://linkedin.com/company/mybrandauto',
      },
      content: {
        heroTitle: 'Welcome to MyBrand Auto Sales',
        heroSubtitle: 'Find your perfect vehicle today!',
      },
    },
  }

  console.log('🧹 Testing Enhanced Clone with Content Sanitization\n')
  console.log('Target:', testConfig.targetUrl)
  console.log('Brand:', testConfig.brandConfig.name)
  console.log('Contact:', testConfig.brandConfig.contact.phone)
  console.log(
    'Address:',
    `${testConfig.brandConfig.contact.address.street}, ${testConfig.brandConfig.contact.address.city}`
  )

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
    console.log('\n📌 IMPORTANT: The cloned site should now show:')
    console.log('- Your brand name instead of "Auto Trademark"')
    console.log('- Your phone number (555) 123-4567')
    console.log('- Your address in Springfield, IL')
    console.log('- Placeholder images instead of car inventory')
    console.log('- No proprietary videos or content')
  } catch (error) {
    console.error('\n❌ Error:', error.message)
  }
}

// Run the test
testSanitizedClone().catch(console.error)
