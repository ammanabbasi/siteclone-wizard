import CloneWizard from '@/components/CloneWizard'
import HowItWorks from '@/components/HowItWorks'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-gray-900">Auto Dealer Website Builder</h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            AI-Powered Website Generator for Independent Used Car Dealerships
          </p>
          <p className="text-md mx-auto mt-4 max-w-3xl text-gray-500">
            Transform any car dealership website into your own custom site with AI-generated
            content, inventory management, financing options, and complete branding customization
          </p>
        </div>

        <HowItWorks />

        <CloneWizard />
      </div>
    </main>
  )
}
