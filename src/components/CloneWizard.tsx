'use client'

import { useState } from 'react'
import { BrandConfig } from '@/lib/types'

// URL validation helper
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

// Color validation helper
function isValidHexColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color)
}

export default function CloneWizard() {
  console.log('CloneWizard component rendering') // Debug log

  const [targetUrl, setTargetUrl] = useState('')
  const [urlError, setUrlError] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [buildMode, setBuildMode] = useState<'ai' | 'inspiration'>('ai')

  const [brandConfig, setBrandConfig] = useState<BrandConfig>({
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
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [launchStatus, setLaunchStatus] = useState<'idle' | 'launching' | 'running' | 'error'>(
    'idle'
  )
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const validateUrl = (url: string) => {
    if (!url) {
      setUrlError(null)
      return true // URL is optional for AI build
    }
    if (!isValidUrl(url)) {
      setUrlError('Please enter a valid HTTP or HTTPS URL')
      return false
    }
    setUrlError(null)
    return true
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value
    setTargetUrl(newUrl)
    if (newUrl) {
      validateUrl(newUrl)
    } else {
      setUrlError(null)
    }
  }

  const handleAIBuild = async () => {
    setIsProcessing(true)
    setError(null)
    setResult(null)
    setLaunchStatus('idle')
    setPreviewUrl(null)

    try {
      const response = await fetch('/api/ai-build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandConfig }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      if (data.success) {
        setResult(data)
      } else {
        throw new Error(data.error || 'Unknown error occurred')
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Don't proceed if already processing
    if (isProcessing) return

    // If in AI mode, use AI build
    if (buildMode === 'ai' || !targetUrl) {
      handleAIBuild()
      return
    }

    // Validate inputs for inspiration mode
    if (!validateUrl(targetUrl)) return

    if (!brandConfig.name || brandConfig.name.length > 100) {
      setError('Brand name must be between 1 and 100 characters')
      return
    }

    if (
      !isValidHexColor(brandConfig.colors.primary) ||
      !isValidHexColor(brandConfig.colors.secondary) ||
      !isValidHexColor(brandConfig.colors.accent)
    ) {
      setError('Please use valid hex color codes (e.g., #123ABC)')
      return
    }

    setIsProcessing(true)
    setError(null)
    setResult(null)
    setLaunchStatus('idle')
    setPreviewUrl(null)

    // Store the URL value before any async operations
    const urlToClone = targetUrl

    console.log('Submitting form with:', { targetUrl: urlToClone, brandConfig })

    try {
      const response = await fetch('/api/ai-inspire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandConfig,
          inspirationUrl: urlToClone,
        }),
      })

      console.log('Response status:', response.status)

      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      // Set result only if we have success
      if (data.success) {
        setResult(data)
      } else {
        throw new Error(data.error || 'Unknown error occurred')
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleLaunchPreview = async () => {
    if (!result?.outputId) return

    setLaunchStatus('launching')
    setError(null)

    try {
      const response = await fetch(`/api/launch/${result.outputId}`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to launch preview')
      }

      setPreviewUrl(data.url)
      setLaunchStatus('running')

      // Open in new tab after a short delay
      setTimeout(() => {
        window.open(data.url, '_blank')
      }, 2000)
    } catch (error) {
      console.error('Launch error:', error)
      setError(error instanceof Error ? error.message : 'Failed to launch preview')
      setLaunchStatus('error')
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <form onSubmit={handleSubmit} className="rounded-lg bg-white p-8 shadow-lg">
        {/* Build Mode Selection */}
        <div className="mb-8">
          <label className="mb-4 block text-sm font-medium text-gray-700">
            How would you like to build your dealership website?
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setBuildMode('ai')}
              className={`rounded-lg border-2 p-4 text-center transition-all ${
                buildMode === 'ai'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="mb-2 text-2xl">🤖</div>
              <div className="font-semibold">AI Build</div>
              <div className="mt-1 text-sm text-gray-600">
                Let AI create a unique dealership website
              </div>
            </button>
            <button
              type="button"
              onClick={() => setBuildMode('inspiration')}
              className={`rounded-lg border-2 p-4 text-center transition-all ${
                buildMode === 'inspiration'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="mb-2 text-2xl">🌐</div>
              <div className="font-semibold">Use Inspiration</div>
              <div className="mt-1 text-sm text-gray-600">
                Provide a website URL for design inspiration
              </div>
            </button>
          </div>
        </div>

        {/* URL Input (only show for inspiration mode) */}
        {buildMode === 'inspiration' && (
          <div className="mb-8">
            <label htmlFor="url" className="mb-2 block text-sm font-medium text-gray-700">
              Inspiration Website URL (Optional)
            </label>
            <input
              type="url"
              id="url"
              value={targetUrl}
              onChange={handleUrlChange}
              className={`w-full rounded-md border px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                urlError ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://example-dealership.com"
              disabled={isProcessing}
              aria-invalid={!!urlError}
              aria-describedby={urlError ? 'url-error' : undefined}
            />
            {urlError && (
              <p id="url-error" className="mt-1 text-sm text-red-600">
                {urlError}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Enter any car dealership website for design inspiration
            </p>
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="brandName" className="mb-2 block text-sm font-medium text-gray-700">
              Dealership Name
            </label>
            <input
              type="text"
              id="brandName"
              value={brandConfig.name}
              onChange={(e) => setBrandConfig({ ...brandConfig, name: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              required
              disabled={isProcessing}
              maxLength={100}
              aria-label="Brand name"
            />
          </div>

          <div>
            <label htmlFor="tagline" className="mb-2 block text-sm font-medium text-gray-700">
              Tagline
            </label>
            <input
              type="text"
              id="tagline"
              value={brandConfig.tagline}
              onChange={(e) => setBrandConfig({ ...brandConfig, tagline: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              disabled={isProcessing}
              aria-label="Brand tagline"
            />
          </div>
        </div>

        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold">Brand Colors</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="primary" className="mb-2 block text-sm font-medium text-gray-700">
                Primary
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  id="primary"
                  value={brandConfig.colors.primary}
                  onChange={(e) =>
                    setBrandConfig({
                      ...brandConfig,
                      colors: { ...brandConfig.colors, primary: e.target.value },
                    })
                  }
                  className="h-10 w-20 rounded border border-gray-300"
                  disabled={isProcessing}
                  aria-label="Primary brand color"
                />
                <span className="ml-2 text-sm text-gray-600">{brandConfig.colors.primary}</span>
              </div>
            </div>

            <div>
              <label htmlFor="secondary" className="mb-2 block text-sm font-medium text-gray-700">
                Secondary
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  id="secondary"
                  value={brandConfig.colors.secondary}
                  onChange={(e) =>
                    setBrandConfig({
                      ...brandConfig,
                      colors: { ...brandConfig.colors, secondary: e.target.value },
                    })
                  }
                  className="h-10 w-20 rounded border border-gray-300"
                  disabled={isProcessing}
                  aria-label="Secondary brand color"
                />
                <span className="ml-2 text-sm text-gray-600">{brandConfig.colors.secondary}</span>
              </div>
            </div>

            <div>
              <label htmlFor="accent" className="mb-2 block text-sm font-medium text-gray-700">
                Accent
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  id="accent"
                  value={brandConfig.colors.accent}
                  onChange={(e) =>
                    setBrandConfig({
                      ...brandConfig,
                      colors: { ...brandConfig.colors, accent: e.target.value },
                    })
                  }
                  className="h-10 w-20 rounded border border-gray-300"
                  disabled={isProcessing}
                  aria-label="Accent brand color"
                />
                <span className="ml-2 text-sm text-gray-600">{brandConfig.colors.accent}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <label htmlFor="font" className="mb-2 block text-sm font-medium text-gray-700">
            Font Family
          </label>
          <select
            id="font"
            value={brandConfig.typography.fontFamily}
            onChange={(e) =>
              setBrandConfig({
                ...brandConfig,
                typography: { ...brandConfig.typography, fontFamily: e.target.value },
              })
            }
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            disabled={isProcessing}
            aria-label="Font family selection"
          >
            <option value="Inter">Inter</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Lato">Lato</option>
            <option value="Montserrat">Montserrat</option>
            <option value="Poppins">Poppins</option>
          </select>
        </div>

        {/* Advanced Options Toggle */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            {showAdvanced ? '▼' : '▶'} Advanced Options
          </button>
        </div>

        {/* Advanced Options Section */}
        {showAdvanced && (
          <div className="mb-8 space-y-8">
            {/* Contact Information */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Contact Information</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={brandConfig.contact?.phone || ''}
                    onChange={(e) =>
                      setBrandConfig({
                        ...brandConfig,
                        contact: { ...brandConfig.contact, phone: e.target.value },
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={brandConfig.contact?.email || ''}
                    onChange={(e) =>
                      setBrandConfig({
                        ...brandConfig,
                        contact: { ...brandConfig.contact, email: e.target.value },
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="info@yourbrand.com"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="mt-4">
                <h4 className="text-md mb-2 font-medium">Address</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={brandConfig.contact?.address?.street || ''}
                    onChange={(e) =>
                      setBrandConfig({
                        ...brandConfig,
                        contact: {
                          ...brandConfig.contact!,
                          address: { ...brandConfig.contact!.address, street: e.target.value },
                        },
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={brandConfig.contact?.address?.city || ''}
                    onChange={(e) =>
                      setBrandConfig({
                        ...brandConfig,
                        contact: {
                          ...brandConfig.contact!,
                          address: { ...brandConfig.contact!.address, city: e.target.value },
                        },
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={brandConfig.contact?.address?.state || ''}
                    onChange={(e) =>
                      setBrandConfig({
                        ...brandConfig,
                        contact: {
                          ...brandConfig.contact!,
                          address: { ...brandConfig.contact!.address, state: e.target.value },
                        },
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={brandConfig.contact?.address?.zip || ''}
                    onChange={(e) =>
                      setBrandConfig({
                        ...brandConfig,
                        contact: {
                          ...brandConfig.contact!,
                          address: { ...brandConfig.contact!.address, zip: e.target.value },
                        },
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Social Media Links</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  type="url"
                  placeholder="Facebook URL"
                  value={brandConfig.social?.facebook || ''}
                  onChange={(e) =>
                    setBrandConfig({
                      ...brandConfig,
                      social: { ...brandConfig.social, facebook: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="url"
                  placeholder="Instagram URL"
                  value={brandConfig.social?.instagram || ''}
                  onChange={(e) =>
                    setBrandConfig({
                      ...brandConfig,
                      social: { ...brandConfig.social, instagram: e.target.value },
                    })
                  }
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Dealership Information */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Dealership Information</h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="dealerLicense"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Dealer License Number
                  </label>
                  <input
                    type="text"
                    id="dealerLicense"
                    value={brandConfig.dealership?.dealerLicense || ''}
                    onChange={(e) =>
                      setBrandConfig({
                        ...brandConfig,
                        dealership: { ...brandConfig.dealership, dealerLicense: e.target.value },
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="DL-12345"
                  />
                </div>

                {/* Sales Hours */}
                <div>
                  <h4 className="text-md mb-2 font-medium">Sales Hours</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Monday - Friday hours"
                      value={brandConfig.dealership?.salesHours?.weekday || ''}
                      onChange={(e) =>
                        setBrandConfig({
                          ...brandConfig,
                          dealership: {
                            ...brandConfig.dealership,
                            salesHours: {
                              ...brandConfig.dealership?.salesHours,
                              weekday: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Saturday hours"
                      value={brandConfig.dealership?.salesHours?.saturday || ''}
                      onChange={(e) =>
                        setBrandConfig({
                          ...brandConfig,
                          dealership: {
                            ...brandConfig.dealership,
                            salesHours: {
                              ...brandConfig.dealership?.salesHours,
                              saturday: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Inventory Settings */}
                <div>
                  <h4 className="text-md mb-2 font-medium">Inventory Settings</h4>
                  <div className="space-y-2">
                    <select
                      value={brandConfig.dealership?.inventory?.source || 'manual'}
                      onChange={(e) =>
                        setBrandConfig({
                          ...brandConfig,
                          dealership: {
                            ...brandConfig.dealership,
                            inventory: {
                              ...brandConfig.dealership?.inventory,
                              source: e.target.value as any,
                            },
                          },
                        })
                      }
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="manual">Manual Entry</option>
                      <option value="api">API Integration</option>
                      <option value="csv">CSV Upload</option>
                      <option value="xml">XML Feed</option>
                    </select>

                    {brandConfig.dealership?.inventory?.source === 'api' && (
                      <>
                        <input
                          type="url"
                          placeholder="API URL"
                          value={brandConfig.dealership?.inventory?.apiUrl || ''}
                          onChange={(e) =>
                            setBrandConfig({
                              ...brandConfig,
                              dealership: {
                                ...brandConfig.dealership,
                                inventory: {
                                  ...brandConfig.dealership?.inventory,
                                  apiUrl: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="API Key"
                          value={brandConfig.dealership?.inventory?.apiKey || ''}
                          onChange={(e) =>
                            setBrandConfig({
                              ...brandConfig,
                              dealership: {
                                ...brandConfig.dealership,
                                inventory: {
                                  ...brandConfig.dealership?.inventory,
                                  apiKey: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                      </>
                    )}

                    <input
                      type="number"
                      placeholder="Number of placeholder vehicles"
                      value={brandConfig.dealership?.inventory?.placeholderCount || 12}
                      onChange={(e) =>
                        setBrandConfig({
                          ...brandConfig,
                          dealership: {
                            ...brandConfig.dealership,
                            inventory: {
                              ...brandConfig.dealership?.inventory,
                              placeholderCount: parseInt(e.target.value) || 12,
                            },
                          },
                        })
                      }
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="50"
                    />
                  </div>
                </div>

                {/* Financing Partners */}
                <div>
                  <label
                    htmlFor="financingPartners"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Financing Partners (comma separated)
                  </label>
                  <input
                    type="text"
                    id="financingPartners"
                    value={brandConfig.dealership?.financing?.partners?.join(', ') || ''}
                    onChange={(e) =>
                      setBrandConfig({
                        ...brandConfig,
                        dealership: {
                          ...brandConfig.dealership,
                          financing: {
                            ...brandConfig.dealership?.financing,
                            partners: e.target.value
                              .split(',')
                              .map((p) => p.trim())
                              .filter((p) => p),
                          },
                        },
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="Capital One, Chase Auto, Bank of America"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition duration-200 hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          aria-busy={isProcessing}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <svg
                className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : buildMode === 'ai' ? (
            '🤖 Build with AI'
          ) : (
            '🌐 Build from Inspiration'
          )}
        </button>
      </form>

      {error && (
        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-6" role="alert">
          <h3 className="mb-2 text-lg font-semibold text-red-800">Error</h3>
          <p className="text-red-700">{error}</p>
          {error.includes('blocking') && (
            <p className="mt-2 text-sm text-red-600">
              Some websites block automated access. Try a different website or check if the URL is
              correct.
            </p>
          )}
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-red-600 hover:underline">
              Technical Details
            </summary>
            <pre className="mt-2 whitespace-pre-wrap text-xs text-red-600">{error}</pre>
          </details>
        </div>
      )}

      {/* Success Result */}
      {result && result.success && (
        <div className="mt-8 rounded-lg bg-green-50 p-6">
          <h2 className="mb-4 text-2xl font-bold text-green-800">Success!</h2>
          <p className="mb-4 text-green-700">
            Your site has been cloned successfully. Download the generated code below.
          </p>

          {result.stats && (
            <div className="mb-6 text-sm text-gray-600">
              <p>Components extracted: {result.stats.componentsExtracted}</p>
              <p>Text nodes found: {result.stats.textNodesFound}</p>
              <p>Assets downloaded: {result.stats.assetsDownloaded}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            <a
              href={result.downloadUrl}
              className="inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
              download
            >
              Download Project
            </a>

            <button
              onClick={handleLaunchPreview}
              disabled={launchStatus === 'launching'}
              className={`inline-block rounded-lg px-6 py-3 font-semibold transition-colors ${
                launchStatus === 'running'
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : launchStatus === 'launching'
                    ? 'cursor-not-allowed bg-gray-400 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {launchStatus === 'launching' ? (
                <span className="flex items-center">
                  <svg
                    className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Launching...
                </span>
              ) : launchStatus === 'running' ? (
                '🚀 Preview Running'
              ) : (
                '🚀 Launch Preview'
              )}
            </button>

            <a
              href={`/preview/${result.outputId}`}
              className="inline-block rounded-lg bg-gray-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Browse Files
            </a>

            <button
              onClick={() => {
                setResult(null)
                setTargetUrl('')
                setLaunchStatus('idle')
                setPreviewUrl(null)
                setError(null)
                setUrlError(null)
              }}
              className="inline-block rounded-lg bg-gray-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-700"
            >
              Build Another Site
            </button>
          </div>

          {previewUrl && launchStatus === 'running' && (
            <div className="mt-4 rounded-lg bg-purple-100 p-4">
              <p className="text-purple-800">
                <span className="font-semibold">🌐 Preview running at:</span>{' '}
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline"
                >
                  {previewUrl}
                </a>
              </p>
              <p className="mt-1 text-sm text-purple-600">
                The preview should open automatically in a new tab. If not, click the link above.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
