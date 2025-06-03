export default function HowItWorks() {
  return (
    <div className="mb-8 rounded-lg bg-blue-50 p-6">
      <h2 className="mb-4 text-2xl font-bold text-blue-900">How It Works</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="mb-2 text-3xl">🌐</div>
          <h3 className="mb-1 font-semibold text-blue-800">Get Inspired</h3>
          <p className="text-sm text-gray-600">
            Enter any car dealership website URL as inspiration
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="mb-2 text-3xl">🤖</div>
          <h3 className="mb-1 font-semibold text-blue-800">AI Generates</h3>
          <p className="text-sm text-gray-600">
            AI creates a unique dealership site with your branding
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="mb-2 text-3xl">🚗</div>
          <h3 className="mb-1 font-semibold text-blue-800">Customize</h3>
          <p className="text-sm text-gray-600">
            Add your inventory, financing partners, and services
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="mb-2 text-3xl">🚀</div>
          <h3 className="mb-1 font-semibold text-blue-800">Launch</h3>
          <p className="text-sm text-gray-600">
            Preview and download your complete dealership website
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-green-100 p-3">
        <p className="text-sm text-green-800">
          <span className="font-semibold">✨ Features:</span> Inventory management • Financing
          calculator • Trade-in forms • Service scheduling • Customer reviews • Mobile responsive •
          SEO optimized
        </p>
      </div>
    </div>
  )
}
