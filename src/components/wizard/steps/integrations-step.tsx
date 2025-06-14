'use client';

import { useWizard } from '../wizard-context-simple';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { useState } from 'react';
import { BarChart3, MessageSquare, Facebook, Search, Settings } from 'lucide-react';

const INTEGRATION_CATEGORIES = [
  {
    id: 'analytics',
    name: 'Analytics & Tracking',
    icon: BarChart3,
    integrations: [
      { id: 'google-analytics', name: 'Google Analytics', description: 'Track website traffic and user behavior' },
      { id: 'gtm', name: 'Google Tag Manager', description: 'Manage marketing and analytics tags' },
      { id: 'hotjar', name: 'Hotjar', description: 'Heatmaps and user session recordings' },
      { id: 'mixpanel', name: 'Mixpanel', description: 'Advanced event tracking and analytics' },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing & Advertising',
    icon: Search,
    integrations: [
      { id: 'facebook-pixel', name: 'Facebook Pixel', description: 'Track conversions for Facebook ads' },
      { id: 'google-ads', name: 'Google Ads', description: 'Conversion tracking for Google advertising' },
      { id: 'mailchimp', name: 'Mailchimp', description: 'Email marketing and newsletters' },
      { id: 'hubspot', name: 'HubSpot', description: 'CRM and marketing automation' },
    ],
  },
  {
    id: 'chat',
    name: 'Chat & Support',
    icon: MessageSquare,
    integrations: [
      { id: 'intercom', name: 'Intercom', description: 'Live chat and customer support' },
      { id: 'zendesk', name: 'Zendesk Chat', description: 'Customer service chat widget' },
      { id: 'drift', name: 'Drift', description: 'Conversational marketing platform' },
      { id: 'crisp', name: 'Crisp', description: 'Modern live chat solution' },
    ],
  },
  {
    id: 'social',
    name: 'Social Media',
    icon: Facebook,
    integrations: [
      { id: 'facebook-page', name: 'Facebook Page Plugin', description: 'Embed Facebook page feed' },
      { id: 'instagram-feed', name: 'Instagram Feed', description: 'Display Instagram posts' },
      { id: 'twitter-timeline', name: 'Twitter Timeline', description: 'Show Twitter feed' },
      { id: 'youtube-channel', name: 'YouTube Channel', description: 'Embed YouTube videos' },
    ],
  },
];

export function IntegrationsStep() {
  const { form } = useWizard();
  const [selectedCategory, setSelectedCategory] = useState('analytics');
  
  const integrations = form.watch('integrations') || {};

  const handleIntegrationToggle = (integrationId: string) => {
    const currentIntegrations = { ...integrations };
    
    if (currentIntegrations[integrationId]) {
      delete currentIntegrations[integrationId];
    } else {
      currentIntegrations[integrationId] = {
        enabled: true,
        config: {},
      };
    }
    
    form.setValue('integrations', currentIntegrations);
  };

  const updateIntegrationConfig = (integrationId: string, key: string, value: string) => {
    const currentIntegrations = { ...integrations };
    
    if (!currentIntegrations[integrationId]) {
      currentIntegrations[integrationId] = {
        enabled: true,
        config: {},
      };
    }
    
    currentIntegrations[integrationId].config[key] = value;
    form.setValue('integrations', currentIntegrations);
  };

  const getConfigFields = (integrationId: string) => {
    const configFields: any = {
      'google-analytics': [
        { key: 'measurementId', label: 'Measurement ID', placeholder: 'G-XXXXXXXXXX', type: 'text' },
      ],
      'gtm': [
        { key: 'containerId', label: 'Container ID', placeholder: 'GTM-XXXXXXX', type: 'text' },
      ],
      'hotjar': [
        { key: 'siteId', label: 'Site ID', placeholder: '12345', type: 'text' },
      ],
      'facebook-pixel': [
        { key: 'pixelId', label: 'Pixel ID', placeholder: '123456789012345', type: 'text' },
      ],
      'google-ads': [
        { key: 'conversionId', label: 'Conversion ID', placeholder: 'AW-123456789', type: 'text' },
      ],
      'mailchimp': [
        { key: 'apiKey', label: 'API Key', placeholder: 'your-api-key', type: 'password' },
        { key: 'listId', label: 'List ID', placeholder: 'list-id', type: 'text' },
      ],
      'intercom': [
        { key: 'appId', label: 'App ID', placeholder: 'your-app-id', type: 'text' },
      ],
      'crisp': [
        { key: 'websiteId', label: 'Website ID', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', type: 'text' },
      ],
    };
    
    return configFields[integrationId] || [];
  };

  const currentCategory = INTEGRATION_CATEGORIES.find(cat => cat.id === selectedCategory);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Integrations</h2>
        <p className="mt-2 text-gray-600">
          Connect your website with marketing, analytics, and customer support tools.
        </p>
      </div>

      {/* Category Navigation */}
      <div className="flex flex-wrap gap-2">
        {INTEGRATION_CATEGORIES.map((category) => {
          const IconComponent = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <IconComponent className="h-4 w-4" />
              {category.name}
            </Button>
          );
        })}
      </div>

      {/* Current Category Integrations */}
      {currentCategory && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <currentCategory.icon className="h-5 w-5" />
              {currentCategory.name}
            </CardTitle>
            <CardDescription>
              Select and configure {currentCategory.name.toLowerCase()} integrations for your website.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentCategory.integrations.map((integration) => {
              const isEnabled = integrations[integration.id]?.enabled;
              const configFields = getConfigFields(integration.id);
              
              return (
                <div key={integration.id} className="space-y-4">
                  <div className="flex items-start gap-3 p-4 border rounded-lg">
                    <Checkbox
                      id={integration.id}
                      checked={isEnabled}
                      onChange={() => handleIntegrationToggle(integration.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor={integration.id} className="font-medium cursor-pointer">
                          {integration.name}
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{integration.description}</p>
                      
                      {isEnabled && configFields.length > 0 && (
                        <div className="space-y-3 pt-3 border-t">
                          <h4 className="text-sm font-medium text-gray-900">Configuration</h4>
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {configFields.map((field: any) => (
                              <div key={field.key}>
                                <Label htmlFor={`${integration.id}-${field.key}`} className="text-sm">
                                  {field.label}
                                </Label>
                                <Input
                                  id={`${integration.id}-${field.key}`}
                                  type={field.type}
                                  placeholder={field.placeholder}
                                  value={integrations[integration.id]?.config?.[field.key] || ''}
                                  onChange={(e) => updateIntegrationConfig(integration.id, field.key, e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Custom Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Custom Integration
          </CardTitle>
          <CardDescription>
            Add custom scripts or tracking codes not covered by the standard integrations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="customHeadScript">Custom Head Scripts</Label>
            <Textarea
              id="customHeadScript"
              placeholder="<!-- Custom scripts to be added to <head> section -->"
              value={integrations.customHead?.script || ''}
              onChange={(e) => updateIntegrationConfig('customHead', 'script', e.target.value)}
              className="mt-1 h-32"
            />
            <p className="mt-1 text-sm text-gray-500">
              Scripts added here will be placed in the &lt;head&gt; section of your website.
            </p>
          </div>
          
          <div>
            <Label htmlFor="customBodyScript">Custom Body Scripts</Label>
            <Textarea
              id="customBodyScript"
              placeholder="<!-- Custom scripts to be added before closing </body> tag -->"
              value={integrations.customBody?.script || ''}
              onChange={(e) => updateIntegrationConfig('customBody', 'script', e.target.value)}
              className="mt-1 h-32"
            />
            <p className="mt-1 text-sm text-gray-500">
              Scripts added here will be placed before the closing &lt;/body&gt; tag.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Integration Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Summary</CardTitle>
          <CardDescription>
            Review your selected integrations and their configurations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {INTEGRATION_CATEGORIES.map((category) => {
              const enabledCount = category.integrations.filter(
                integration => integrations[integration.id]?.enabled
              ).length;
              
              return (
                <div key={category.id} className="text-center p-4 bg-gray-50 rounded-lg">
                  <category.icon className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  <div className="text-lg font-bold text-gray-900">
                    {enabledCount}
                  </div>
                  <div className="text-sm text-gray-600">
                    {category.name}
                  </div>
                </div>
              );
            })}
          </div>
          
          {Object.keys(integrations).length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-3">Enabled Integrations:</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(integrations).map(([key, value]: any) => {
                  if (!value.enabled) return null;
                  
                  const integration = INTEGRATION_CATEGORIES
                    .flatMap(cat => cat.integrations)
                    .find(int => int.id === key);
                  
                  if (!integration && !key.startsWith('custom')) return null;
                  
                  return (
                    <div
                      key={key}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {integration?.name || key}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2 p-4 bg-amber-50 rounded-lg mt-4">
            <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
            <p className="text-sm text-amber-700">
              Integrations will be automatically added to your website without breaking core functionality.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 