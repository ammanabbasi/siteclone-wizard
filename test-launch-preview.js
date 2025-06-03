// Test launching the preview
const testLaunchPreview = async () => {
  const outputId = '476bf8ad-daf5-4ca7-8c70-8eb27fee81d4'
  console.log(`Launching preview for: ${outputId}\n`)

  try {
    const response = await fetch(`http://localhost:3000/api/launch/${outputId}`, {
      method: 'POST',
    })

    const data = await response.json()

    console.log('Response status:', response.status)
    console.log('Response data:', JSON.stringify(data, null, 2))

    if (response.ok && data.url) {
      console.log('\n✅ Preview launched successfully!')
      console.log(`Preview URL: ${data.url}`)
      console.log('\nThe preview should open in your browser automatically.')
      console.log('If not, manually open:', data.url)
    } else {
      console.log('\n❌ Failed to launch preview')
      console.log('Error:', data.error)
    }
  } catch (error) {
    console.log('\n❌ Request failed')
    console.log('Error:', error.message)
  }
}

testLaunchPreview()
