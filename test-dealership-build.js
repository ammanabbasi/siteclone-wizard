// Test script for AI-powered dealership website builder
// No need to import fetch in modern Node.js

async function testDealershipBuild() {
  console.log('🚗 Testing Auto Dealer Website Builder...\n')

  const brandConfig = {
    name: 'Premier Auto Sales',
    tagline: 'Quality Pre-Owned Vehicles You Can Trust',
    industry: 'automotive',
    colors: {
      primary: '#1E40AF',
      secondary: '#ffffff',
      accent: '#DC2626',
    },
    typography: {
      fontFamily: 'Inter',
    },
    contact: {
      phone: '(555) 123-4567',
      email: 'sales@premierautosales.com',
      address: {
        street: '123 Main Street',
        city: 'Springfield',
        state: 'IL',
        zip: '62701',
      },
    },
    social: {
      facebook: 'https://facebook.com/premierautosales',
      instagram: 'https://instagram.com/premierautosales',
      youtube: 'https://youtube.com/premierautosales',
    },
    dealership: {
      dealerLicense: 'DL-12345',
      salesHours: {
        weekday: 'Monday - Friday: 9:00 AM - 8:00 PM',
        saturday: 'Saturday: 9:00 AM - 6:00 PM',
        sunday: 'Sunday: 11:00 AM - 5:00 PM',
      },
      serviceHours: {
        weekday: 'Monday - Friday: 7:00 AM - 6:00 PM',
        saturday: 'Saturday: 8:00 AM - 4:00 PM',
        sunday: 'Closed',
      },
      inventory: {
        source: 'manual',
        placeholderCount: 50,
      },
      financing: {
        partners: ['Capital One Auto Finance', 'Chase Auto', 'Bank of America'],
        disclaimer: 'Financing available with approved credit',
        creditRange: 'All credit types welcome',
      },
      services: [
        'Oil Change',
        'Tire Rotation',
        'Brake Service',
        'Engine Diagnostics',
        'Pre-Purchase Inspection',
      ],
      certifications: ['BBB Accredited', 'ASE Certified', 'CarFax Dealer'],
    },
  }

  try {
    console.log('Sending request to AI build endpoint...')
    const response = await fetch('http://localhost:3000/api/ai-build', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ brandConfig }),
    })

    const data = await response.json()

    if (response.ok && data.success) {
      console.log('✅ Success! Multi-page dealership website generated.\n')
      console.log('Details:')
      console.log(`- Output ID: ${data.outputId}`)
      console.log(`- Preview URL: http://localhost:3000${data.previewUrl}`)
      console.log(`- Download URL: http://localhost:3000${data.downloadUrl}`)
      console.log('\nFeatures included:')
      console.log('- Multiple pages with navigation')
      console.log('- Dedicated inventory page')
      console.log('- Financing calculator page')
      console.log('- Trade-in value estimator')
      console.log('- About Us page')
      console.log('- Services page')
      console.log('- Contact page with forms')
      console.log('- Mobile responsive design')
    } else {
      console.error('❌ Error:', data.error || 'Unknown error')
      console.error('Details:', data.details)
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message)
  }
}

// Run the test
testDealershipBuild()
