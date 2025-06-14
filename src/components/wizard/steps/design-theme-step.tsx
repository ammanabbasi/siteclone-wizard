'use client';

import { useWizard } from '../wizard-context-simple';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { useState } from 'react';
import { Palette, Upload, Eye } from 'lucide-react';

const COLOR_PRESETS = [
  {
    name: 'Professional Blue',
    primary: '#1e40af',
    secondary: '#3b82f6',
    accent: '#60a5fa',
    background: '#f8fafc',
  },
  {
    name: 'Luxury Black',
    primary: '#111827',
    secondary: '#374151',
    accent: '#6b7280',
    background: '#f9fafb',
  },
  {
    name: 'Automotive Red',
    primary: '#dc2626',
    secondary: '#ef4444',
    accent: '#f87171',
    background: '#fef2f2',
  },
  {
    name: 'Modern Green',
    primary: '#059669',
    secondary: '#10b981',
    accent: '#34d399',
    background: '#f0fdf4',
  },
];

const TYPOGRAPHY_PRESETS = [
  {
    name: 'Modern Sans',
    headings: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  {
    name: 'Classic Serif',
    headings: 'Playfair Display, serif',
    body: 'Source Sans Pro, sans-serif',
  },
  {
    name: 'Bold Impact',
    headings: 'Montserrat, sans-serif',
    body: 'Open Sans, sans-serif',
  },
];

export function DesignThemeStep() {
  const { form } = useWizard();
  const [selectedColorPreset, setSelectedColorPreset] = useState<number | null>(null);
  const [selectedTypographyPreset, setSelectedTypographyPreset] = useState<number | null>(null);

  const handleColorPresetSelect = (preset: typeof COLOR_PRESETS[0], index: number) => {
    setSelectedColorPreset(index);
    form.setValue('colorPalette', preset);
  };

  const handleTypographyPresetSelect = (preset: typeof TYPOGRAPHY_PRESETS[0], index: number) => {
    setSelectedTypographyPreset(index);
    form.setValue('typography', preset);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Design & Theme</h2>
        <p className="mt-2 text-gray-600">
          Customize the look and feel of your dealership website.
        </p>
      </div>

      {/* Figma Import */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import from Figma
          </CardTitle>
          <CardDescription>
            Have a Figma design? Enter the frame ID to import your custom design.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="figmaFrameId">Figma Frame ID (Optional)</Label>
            <Input
              id="figmaFrameId"
              {...form.register('figmaFrameId')}
              placeholder="e.g., 1234567890:abcdef123456"
            />
            <p className="mt-1 text-sm text-gray-500">
              You can find the frame ID in your Figma URL after sharing your design.
            </p>
          </div>
          <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            <p className="text-sm text-blue-700">
              If you provide a Figma frame ID, it will override the color and typography settings below.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Color Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Theme
          </CardTitle>
          <CardDescription>
            Choose a color scheme that matches your dealership&apos;s brand.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {COLOR_PRESETS.map((preset, index) => (
              <div
                key={preset.name}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedColorPreset === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleColorPresetSelect(preset, index)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{preset.name}</h4>
                  {selectedColorPreset === index && (
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <div className="flex gap-2">
                  <div
                    className="h-8 w-8 rounded"
                    style={{ backgroundColor: preset.primary }}
                    title="Primary"
                  ></div>
                  <div
                    className="h-8 w-8 rounded"
                    style={{ backgroundColor: preset.secondary }}
                    title="Secondary"
                  ></div>
                  <div
                    className="h-8 w-8 rounded"
                    style={{ backgroundColor: preset.accent }}
                    title="Accent"
                  ></div>
                  <div
                    className="h-8 w-8 rounded border"
                    style={{ backgroundColor: preset.background }}
                    title="Background"
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Colors */}
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Custom Colors</h4>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="primaryColor"
                    type="color"
                    className="w-16 h-10 p-1"
                    onChange={(e) => {
                      const currentPalette = form.getValues('colorPalette') || {};
                      form.setValue('colorPalette', {
                        ...currentPalette,
                        primary: e.target.value,
                      });
                      setSelectedColorPreset(null);
                    }}
                  />
                  <Input
                    type="text"
                    placeholder="#1e40af"
                    className="flex-1"
                    onChange={(e) => {
                      const currentPalette = form.getValues('colorPalette') || {};
                      form.setValue('colorPalette', {
                        ...currentPalette,
                        primary: e.target.value,
                      });
                      setSelectedColorPreset(null);
                    }}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="secondaryColor"
                    type="color"
                    className="w-16 h-10 p-1"
                    onChange={(e) => {
                      const currentPalette = form.getValues('colorPalette') || {};
                      form.setValue('colorPalette', {
                        ...currentPalette,
                        secondary: e.target.value,
                      });
                      setSelectedColorPreset(null);
                    }}
                  />
                  <Input
                    type="text"
                    placeholder="#3b82f6"
                    className="flex-1"
                    onChange={(e) => {
                      const currentPalette = form.getValues('colorPalette') || {};
                      form.setValue('colorPalette', {
                        ...currentPalette,
                        secondary: e.target.value,
                      });
                      setSelectedColorPreset(null);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>
            Select fonts that reflect your dealership&apos;s personality.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {TYPOGRAPHY_PRESETS.map((preset, index) => (
              <div
                key={preset.name}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedTypographyPreset === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleTypographyPresetSelect(preset, index)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{preset.name}</h4>
                  {selectedTypographyPreset === index && (
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <div className="space-y-2">
                  <div
                    className="text-lg font-bold"
                    style={{ fontFamily: preset.headings }}
                  >
                    Heading Sample
                  </div>
                  <div
                    className="text-sm text-gray-600"
                    style={{ fontFamily: preset.body }}
                  >
                    Body text sample for your dealership content.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Live Preview
          </CardTitle>
          <CardDescription>
            See how your theme looks on a sample hero section.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="p-8 rounded-lg border-2 border-dashed border-gray-300"
            style={{
              backgroundColor: form.watch('colorPalette')?.background || '#f8fafc',
              color: form.watch('colorPalette')?.primary || '#1e40af',
            }}
          >
            <div className="text-center">
              <h1
                className="text-4xl font-bold mb-4"
                style={{
                  fontFamily: form.watch('typography')?.headings || 'Inter, sans-serif',
                }}
              >
                {form.watch('dealerName') || 'Your Dealership'}
              </h1>
              <p
                className="text-lg mb-6"
                style={{
                  fontFamily: form.watch('typography')?.body || 'Inter, sans-serif',
                  color: form.watch('colorPalette')?.secondary || '#374151',
                }}
              >
                Find your perfect vehicle with our extensive inventory and expert service.
              </p>
              <Button
                style={{
                  backgroundColor: form.watch('colorPalette')?.primary || '#1e40af',
                  borderColor: form.watch('colorPalette')?.primary || '#1e40af',
                }}
              >
                View Inventory
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 