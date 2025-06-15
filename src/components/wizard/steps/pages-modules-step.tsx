'use client';

import { useWizard } from '../wizard-context-simple';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { useState } from 'react';
import { FileText, Plus, GripVertical, X, Home, Car, DollarSign, Wrench, Users, Phone, MessageCircle, TrendingUp, Briefcase, Package, Newspaper } from 'lucide-react';

// Mandatory pages from the simplified workflow
const MANDATORY_PAGES = [
  { id: 'home', name: 'Home', icon: Home, description: 'Landing page with hero section and overview' },
  { id: 'inventory', name: 'Inventory', icon: Car, description: 'Vehicle listings and search functionality' },
  { id: 'financing', name: 'Financing', icon: DollarSign, description: 'Loan calculator and financing options' },
  { id: 'services', name: 'Services', icon: Wrench, description: 'Service booking and maintenance info' },
  { id: 'about-us', name: 'About Us', icon: Users, description: 'Company history and team information' },
  { id: 'contact-us', name: 'Contact Us', icon: Phone, description: 'Contact form and location details' },
  { id: 'testimonials', name: 'Testimonials', icon: MessageCircle, description: 'Customer reviews and success stories' },
  { id: 'sell-your-car', name: 'Sell Your Car', icon: TrendingUp, description: 'Vehicle appraisal and trade-in forms' },
  { id: 'blogs', name: 'Blogs', icon: Newspaper, description: 'Articles and dealership news' },
  { id: 'jobs', name: 'Jobs', icon: Briefcase, description: 'Career opportunities and applications' },
  { id: 'shipping', name: 'Shipping', icon: Package, description: 'Delivery options and logistics' },
];

export function PagesModulesStep() {
  const { form } = useWizard();
  const [customPageName, setCustomPageName] = useState('');
  const [customPageUrl, setCustomPageUrl] = useState('');
  
  const enabledPages = form.watch('enabledPages') || [];
  const customPages = form.watch('customPages') || [];
  const navOrder = form.watch('navOrder') || [];

  const handlePageToggle = (pageId: string) => {
    const currentPages = enabledPages;
    const currentNavOrder = navOrder || [];
    
    if (currentPages.includes(pageId)) {
      // Remove page
      const newPages = currentPages.filter((id: string) => id !== pageId);
      const newNavOrder = currentNavOrder.filter((id: string) => id !== pageId);
      form.setValue('enabledPages', newPages);
      form.setValue('navOrder', newNavOrder);
    } else {
      // Add page
      const newPages = [...currentPages, pageId];
      const newNavOrder = [...currentNavOrder, pageId];
      form.setValue('enabledPages', newPages);
      form.setValue('navOrder', newNavOrder);
    }
  };

  const addCustomPage = () => {
    if (customPageName && customPageUrl) {
      const newPage = {
        name: customPageName,
        url: customPageUrl,
        id: customPageUrl.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      };
      
      const newCustomPages = [...customPages, newPage];
      const newNavOrder = [...navOrder, newPage.id];
      
      form.setValue('customPages', newCustomPages);
      form.setValue('navOrder', newNavOrder);
      
      setCustomPageName('');
      setCustomPageUrl('');
    }
  };

  const removeCustomPage = (pageId: string) => {
    const newCustomPages = customPages.filter((page: any) => page.id !== pageId);
    const newNavOrder = navOrder.filter((id: string) => id !== pageId);
    
    form.setValue('customPages', newCustomPages);
    form.setValue('navOrder', newNavOrder);
  };

  const movePageUp = (pageId: string) => {
    const currentOrder = [...navOrder];
    const index = currentOrder.indexOf(pageId);
    if (index > 0) {
      [currentOrder[index], currentOrder[index - 1]] = [currentOrder[index - 1], currentOrder[index]];
      form.setValue('navOrder', currentOrder);
    }
  };

  const movePageDown = (pageId: string) => {
    const currentOrder = [...navOrder];
    const index = currentOrder.indexOf(pageId);
    if (index < currentOrder.length - 1) {
      [currentOrder[index], currentOrder[index + 1]] = [currentOrder[index + 1], currentOrder[index]];
      form.setValue('navOrder', currentOrder);
    }
  };

  const getPageInfo = (pageId: string) => {
    const mandatoryPage = MANDATORY_PAGES.find(page => page.id === pageId);
    if (mandatoryPage) return mandatoryPage;
    
    const customPage = customPages.find((page: any) => page.id === pageId);
    if (customPage) return { ...customPage, icon: FileText };
    
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Pages & Modules</h2>
        <p className="mt-2 text-gray-600">
          Select which pages to include in your dealership website and organize your navigation.
        </p>
      </div>

      {/* Mandatory Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Mandatory Pages
          </CardTitle>
          <CardDescription>
            These are the essential pages every dealership website should have.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {MANDATORY_PAGES.map((page) => {
              const isEnabled = enabledPages.includes(page.id);
              const IconComponent = page.icon;
              
              return (
                <div
                  key={page.id}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    isEnabled
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={page.id}
                      checked={isEnabled}
                      onChange={() => handlePageToggle(page.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <IconComponent className="h-4 w-4 text-gray-600" />
                        <Label htmlFor={page.id} className="font-medium cursor-pointer">
                          {page.name}
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600">{page.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <p className="text-sm text-green-700">
              All mandatory pages are recommended for a complete dealership website experience.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Custom Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Pages</CardTitle>
          <CardDescription>
            Add additional pages specific to your dealership&apos;s needs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Page name (e.g., Special Offers)"
              value={customPageName}
              onChange={(e) => setCustomPageName(e.target.value)}
            />
            <Input
              placeholder="URL slug (e.g., special-offers)"
              value={customPageUrl}
              onChange={(e) => setCustomPageUrl(e.target.value)}
            />
            <Button onClick={addCustomPage} disabled={!customPageName || !customPageUrl}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {customPages.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Custom Pages:</h4>
              {customPages.map((page: any) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="font-medium">{page.name}</p>
                      <p className="text-sm text-gray-600">/{page.url}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomPage(page.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Order */}
      <Card>
        <CardHeader>
          <CardTitle>Navigation Order</CardTitle>
          <CardDescription>
            Drag and drop to reorder how pages appear in your website navigation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {navOrder.length > 0 ? (
            <div className="space-y-2">
              {navOrder.map((pageId: string, index: number) => {
                const pageInfo = getPageInfo(pageId);
                if (!pageInfo) return null;
                
                const IconComponent = pageInfo.icon;
                
                return (
                  <div
                    key={pageId}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                      <span className="text-sm font-medium text-gray-500 w-8">
                        #{index + 1}
                      </span>
                      <IconComponent className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">{pageInfo.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => movePageUp(pageId)}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => movePageDown(pageId)}
                        disabled={index === navOrder.length - 1}
                      >
                        ↓
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No pages selected yet. Choose pages from the sections above.</p>
            </div>
          )}
          
          <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            <p className="text-sm text-blue-700">
              The navigation order determines how pages appear in your website&apos;s main menu.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Page Summary</CardTitle>
          <CardDescription>
            Review your selected pages and navigation structure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {enabledPages.length}
              </div>
              <div className="text-sm text-blue-700">Mandatory Pages</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {customPages.length}
              </div>
              <div className="text-sm text-green-700">Custom Pages</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {navOrder.length}
              </div>
              <div className="text-sm text-purple-700">Total Pages</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 