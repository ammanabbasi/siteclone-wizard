'use client';

import { useWizard } from '../wizard-context-simple';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Checkbox } from '../../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
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
    form.setValue('brands', watchedBrands.filter(b => b !== brand));
  };

  const addTool = () => {
    if (newTool && !watchedTools.includes(newTool)) {
      form.setValue('thirdPartyTools', [...watchedTools, newTool]);
      setNewTool('');
    }
  };

  const removeTool = (tool: string) => {
    form.setValue('thirdPartyTools', watchedTools.filter(t => t !== tool));
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
                {...form.register('dealerName')}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Smith Auto Group"
              />
              {form.formState.errors.dealerName && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.dealerName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="dealerSlug">Website URL Slug *</Label>
              <div className="flex">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                  https://
                </span>
                <Input
                  id="dealerSlug"
                  {...form.register('dealerSlug')}
                  placeholder="smith-auto-group"
                  className="rounded-l-none"
                />
                <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                  .dealerscloud.com
                </span>
              </div>
              {form.formState.errors.dealerSlug && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.dealerSlug.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...form.register('email')}
                placeholder="contact@smithauto.com"
              />
              {form.formState.errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                {...form.register('phone')}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="website">Current Website (if any)</Label>
            <Input
              id="website"
              {...form.register('website')}
              placeholder="https://www.smithauto.com"
            />
            {form.formState.errors.website && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.website.message}
              </p>
            )}
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
              {...form.register('address')}
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...form.register('city')}
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
                {...form.register('zipCode')}
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
            What type of vehicles do you sell?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                <Select value={newBrand} onValueChange={setNewBrand}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {CAR_BRANDS.filter(brand => !watchedBrands.includes(brand)).map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={addBrand} disabled={!newBrand}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {watchedBrands.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {watchedBrands.map((brand) => (
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
              checked={form.watch('hasFinancing')}
              onCheckedChange={(checked) => form.setValue('hasFinancing', !!checked)}
            />
            <Label htmlFor="hasFinancing">We offer vehicle financing</Label>
          </div>

          {form.watch('hasFinancing') && (
            <div>
              <Label htmlFor="financingPartner">Financing Partner</Label>
              <Input
                id="financingPartner"
                {...form.register('financingPartner')}
                placeholder="e.g., Wells Fargo, Chase Auto Finance"
              />
            </div>
          )}

          {/* Third-Party Tools */}
          <div>
            <Label>Third-Party Tools & Integrations</Label>
            <div className="mt-2">
              <div className="flex gap-2">
                <Select value={newTool} onValueChange={setNewTool}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a tool" />
                  </SelectTrigger>
                  <SelectContent>
                    {THIRD_PARTY_TOOLS.filter(tool => !watchedTools.includes(tool)).map((tool) => (
                      <SelectItem key={tool} value={tool}>
                        {tool}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={addTool} disabled={!newTool}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {watchedTools.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {watchedTools.map((tool) => (
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