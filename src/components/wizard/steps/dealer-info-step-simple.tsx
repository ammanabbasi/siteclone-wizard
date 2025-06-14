'use client';

import { useWizard } from '../wizard-context-simple';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Checkbox } from '../../ui/checkbox';
import { Select } from '../../ui/select';
import { Button } from '../../ui/button';
import { generateSlug } from '../../../lib/utils';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const CAR_BRANDS = [
  'Acura', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler',
  'Dodge', 'Ford', 'Genesis', 'GMC', 'Honda', 'Hyundai', 'Infiniti',
  'Jaguar', 'Jeep', 'Kia', 'Land Rover', 'Lexus', 'Lincoln', 'Mazda',
  'Mercedes-Benz', 'MINI', 'Mitsubishi', 'Nissan', 'Porsche', 'Ram',
  'Subaru', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
];

const THIRD_PARTY_TOOLS = [
  'AutoTrader', 'Cars.com', 'CarGurus', 'Edmunds', 'KBB', 'Dealer.com',
  'DealerSocket', 'CDK Global', 'Reynolds and Reynolds', 'ADF/CRM',
  'Inventory Management', 'Lead Management', 'Service Scheduling'
];

export function DealerInfoStep() {
  const { form } = useWizard();
  const [newBrand, setNewBrand] = useState('');
  const [newTool, setNewTool] = useState('');


  const watchedBrands = form.watch('brands') || [];
  const watchedTools = form.watch('thirdPartyTools') || [];

  // Auto-generate slug from dealer name
  const handleNameChange = (value: string) => {
    form.setValue('dealerName', value);
    if (value) {
      form.setValue('dealerSlug', generateSlug(value));
    }
  };

  const addBrand = () => {
    if (newBrand && !watchedBrands.includes(newBrand)) {
      form.setValue('brands', [...watchedBrands, newBrand]);
      setNewBrand('');
    }
  };

  const removeBrand = (brand: string) => {
    form.setValue('brands', watchedBrands.filter((b: string) => b !== brand));
  };

  const addTool = () => {
    if (newTool && !watchedTools.includes(newTool)) {
      form.setValue('thirdPartyTools', [...watchedTools, newTool]);
      setNewTool('');
    }
  };

  const removeTool = (tool: string) => {
    form.setValue('thirdPartyTools', watchedTools.filter((t: string) => t !== tool));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dealer Information</h2>
        <p className="mt-2 text-gray-600">
          Tell us about your dealership so we can customize your website.
        </p>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Enter your dealership&apos;s basic details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="dealerName">Dealership Name *</Label>
              <Input
                id="dealerName"
                value={form.watch('dealerName') || ''}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Smith Auto Group"
              />
            </div>

            <div>
              <Label htmlFor="dealerSlug">Website URL Slug *</Label>
              <div className="flex">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                  https://
                </span>
                <Input
                  id="dealerSlug"
                  value={form.watch('dealerSlug') || ''}
                  onChange={(e) => form.setValue('dealerSlug', e.target.value)}
                  placeholder="smith-auto-group"
                  className="rounded-l-none"
                />
                <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                  .dealerscloud.com
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={form.watch('email') || ''}
                onChange={(e) => form.setValue('email', e.target.value)}
                placeholder="contact@smithauto.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={form.watch('phone') || ''}
                onChange={(e) => form.setValue('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="website">Current Website (if any)</Label>
            <Input
              id="website"
              value={form.watch('website') || ''}
              onChange={(e) => form.setValue('website', e.target.value)}
              placeholder="https://www.smithauto.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
          <CardDescription>
            Where is your dealership located?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              value={form.watch('address') || ''}
              onChange={(e) => form.setValue('address', e.target.value)}
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={form.watch('city') || ''}
                onChange={(e) => form.setValue('city', e.target.value)}
                placeholder="Anytown"
              />
            </div>

            <div>
              <Label htmlFor="state">State</Label>
              <Select 
                id="state"
                value={form.watch('state') || ''}
                onChange={(e) => form.setValue('state', e.target.value)}
              >
                <option value="">Select state</option>
                {US_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={form.watch('zipCode') || ''}
                onChange={(e) => form.setValue('zipCode', e.target.value)}
                placeholder="12345"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Details */}
      <Card>
        <CardHeader>
          <CardTitle>Business Details</CardTitle>
          <CardDescription>
            Tell us about your dealership size and operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="dealerSize">Dealer Size *</Label>
              <Select 
                id="dealerSize"
                value={form.watch('dealerSize') || ''}
                onChange={(e) => form.setValue('dealerSize', e.target.value)}
              >
                <option value="">Select dealer size</option>
                <option value="small">Small (1-50 vehicles in inventory)</option>
                <option value="large">Large (50+ vehicles in inventory)</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="numberOfLocations">Number of Locations *</Label>
              <Input
                id="numberOfLocations"
                type="number"
                min="1"
                value={form.watch('numberOfLocations') || ''}
                onChange={(e) => form.setValue('numberOfLocations', parseInt(e.target.value) || 1)}
                placeholder="1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="businessType">Business Type</Label>
            <Select 
              id="businessType"
              value={form.watch('businessType') || ''}
              onChange={(e) => form.setValue('businessType', e.target.value)}
            >
              <option value="">Select business type</option>
              <option value="new">New Vehicles Only</option>
              <option value="used">Used Vehicles Only</option>
              <option value="both">New & Used Vehicles</option>
            </Select>
          </div>

          {/* Car Brands */}
          <div>
            <Label>Car Brands You Sell</Label>
            <div className="mt-2">
              <div className="flex gap-2">
                <Select value={newBrand} onChange={(e) => setNewBrand(e.target.value)} className="flex-1">
                  <option value="">Select a brand</option>
                  {CAR_BRANDS.filter(brand => !watchedBrands.includes(brand)).map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </Select>
                <Button type="button" onClick={addBrand} disabled={!newBrand}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {watchedBrands.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {watchedBrands.map((brand: string) => (
                    <div
                      key={brand}
                      className="flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-sm"
                    >
                      <span>{brand}</span>
                      <button
                        type="button"
                        onClick={() => removeBrand(brand)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financing & Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Financing & Third-Party Tools</CardTitle>
          <CardDescription>
            Do you offer financing? What tools do you currently use?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasFinancing"
              checked={form.watch('hasFinancing') || false}
              onChange={(e) => form.setValue('hasFinancing', e.target.checked)}
            />
            <Label htmlFor="hasFinancing">We offer vehicle financing</Label>
          </div>

          {form.watch('hasFinancing') && (
            <div>
              <Label htmlFor="financingPartner">Financing Partner</Label>
              <Input
                id="financingPartner"
                value={form.watch('financingPartner') || ''}
                onChange={(e) => form.setValue('financingPartner', e.target.value)}
                placeholder="e.g., Wells Fargo, Chase Auto Finance"
              />
            </div>
          )}

          {/* Third-Party Tools */}
          <div>
            <Label>Third-Party Tools & Integrations</Label>
            <div className="mt-2">
              <div className="flex gap-2">
                <Select value={newTool} onChange={(e) => setNewTool(e.target.value)} className="flex-1">
                  <option value="">Select a tool</option>
                  {THIRD_PARTY_TOOLS.filter(tool => !watchedTools.includes(tool)).map((tool) => (
                    <option key={tool} value={tool}>
                      {tool}
                    </option>
                  ))}
                </Select>
                <Button type="button" onClick={addTool} disabled={!newTool}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {watchedTools.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {watchedTools.map((tool: string) => (
                    <div
                      key={tool}
                      className="flex items-center gap-1 rounded-md bg-green-100 px-2 py-1 text-sm"
                    >
                      <span>{tool}</span>
                      <button
                        type="button"
                        onClick={() => removeTool(tool)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 