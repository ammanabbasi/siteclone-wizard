// Test enhanced cloning with autotrademark.com
const testEnhancedClone = async () => {
  console.log('Testing enhanced clone functionality...\n')

  const testUrl = 'https://www.autotrademark.com/'
  const brandConfig = {
    name: 'My Cool Cars',
    tagline: 'The best cars in town!',
    colors: {
      primary: '#FF5733', // Orange
      secondary: '#3357FF', // Blue
      accent: '#33FF57', // Green
    },
    typography: {
      fontFamily: 'Poppins',
    },
  }

  console.log(`Testing with: ${testUrl}`)
  console.log('Brand Config:', JSON.stringify(brandConfig, null, 2))

  try {
    const response = await fetch('http://localhost:3000/api/clone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUrl: testUrl, brandConfig }),
    })

    const data = await response.json()

    console.log('\n--- Response ---')
    console.log('Status:', response.status)
    console.log('Success:', data.success)

    if (data.success) {
      console.log('\n✅ Clone successful!')
      console.log('Output ID:', data.outputId)
      console.log('Download URL:', data.downloadUrl)
      console.log('\nStats:')
      console.log(`- HTML Size: ${(data.stats.htmlSize / 1024).toFixed(2)} KB`)
      console.log(`- CSS Rules: ${data.stats.cssRulesExtracted}`)
      console.log(`- Assets: ${data.stats.assetsDownloaded}`)
      console.log(`- Brand Replacements: ${data.stats.brandReplacementsMade}`)

      console.log('\n🚀 You can now:')
      console.log(`1. Download the project: http://localhost:3000${data.downloadUrl}`)
      console.log(`2. Preview files: http://localhost:3000/preview/${data.outputId}`)
      console.log(`3. Launch preview: POST to http://localhost:3000/api/launch/${data.outputId}`)
    } else {
      console.log('\n❌ Clone failed')
      console.log('Error:', data.error)
      if (data.details) {
        console.log('\nDetails:')
        console.log(data.details)
      }
    }
  } catch (error) {
    console.log('\n❌ Request failed')
    console.log('Error:', error.message)
  }
}

// Add delay before running test
setTimeout(() => {
  testEnhancedClone()
    .then(() => console.log('\nTest complete'))
    .catch((err) => console.error('\nTest error:', err))
}, 2000)
