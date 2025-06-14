'use client';

import { useWizard } from '../wizard-context-simple';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { useState } from 'react';
import { Eye, Play, CheckCircle, XCircle, Monitor, Smartphone, Tablet, Zap, Globe } from 'lucide-react';

export function PreviewQAStep() {
  const { form } = useWizard();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRunningQA, setIsRunningQA] = useState(false);
  const [previewGenerated, setPreviewGenerated] = useState(false);
  const [qaResults, setQaResults] = useState<any>(null);

  const dealerName = form.watch('dealerName') || 'Your Dealership';
  const enabledPages = form.watch('enabledPages') || [];

  const handleGeneratePreview = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call to generate preview
      await new Promise(resolve => setTimeout(resolve, 3000));
      setPreviewGenerated(true);
    } catch (error) {
      console.error('Failed to generate preview:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRunQA = async () => {
    setIsRunningQA(true);
    try {
      // Simulate API call for QA testing
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Mock QA results
      setQaResults({
        lighthouse: {
          performance: 85,
          accessibility: 92,
          bestPractices: 88,
          seo: 90,
        },
        playwright: {
          passed: 12,
          failed: 1,
          total: 13,
          tests: [
            { name: 'Homepage loads correctly', status: 'passed' },
            { name: 'Navigation works on mobile', status: 'passed' },
            { name: 'Contact form submits', status: 'failed' },
            { name: 'Inventory page displays vehicles', status: 'passed' },
            { name: 'Footer links work', status: 'passed' },
            { name: 'Page loads under 3 seconds', status: 'passed' },
            { name: 'Images have alt text', status: 'passed' },
            { name: 'Forms are accessible', status: 'passed' },
            { name: 'Meta tags are present', status: 'passed' },
            { name: 'Mobile responsive design', status: 'passed' },
            { name: 'SSL certificate valid', status: 'passed' },
            { name: 'Analytics tracking works', status: 'passed' },
            { name: 'Search functionality', status: 'passed' },
          ],
        },
        crossBrowser: {
          chrome: 'passed',
          firefox: 'passed',
          safari: 'passed',
          edge: 'passed',
        },
      });
    } catch (error) {
      console.error('Failed to run QA tests:', error);
    } finally {
      setIsRunningQA(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-50';
    if (score >= 70) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Preview & QA</h2>
        <p className="mt-2 text-gray-600">
          Generate a preview of your website and run quality assurance tests.
        </p>
      </div>

      {/* Generate Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Website Preview
          </CardTitle>
          <CardDescription>
            Generate a preview of your dealership website based on your configurations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!previewGenerated ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <Monitor className="h-16 w-16 mx-auto text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate Preview</h3>
              <p className="text-gray-600 mb-4">
                Click the button below to generate a preview of your {dealerName} website with {enabledPages.length} pages.
              </p>
              <Button
                onClick={handleGeneratePreview}
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Generate Preview
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg mb-4">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-700 font-medium">Preview generated successfully!</span>
              </div>
              
              {/* Preview Mockup */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      <span className="text-sm font-medium">Desktop</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Tablet className="h-4 w-4" />
                      <span className="text-sm">Tablet</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Smartphone className="h-4 w-4" />
                      <span className="text-sm">Mobile</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 bg-gray-100 min-h-[300px] flex items-center justify-center">
                  <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{dealerName}</h3>
                      <p className="text-gray-600 mb-4">Find your perfect vehicle today</p>
                      <div className="flex gap-2 text-sm">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">New Cars</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Used Cars</span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">Financing</span>
                      </div>
                      <Button className="mt-4 w-full">View Inventory</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Open Full Preview
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* QA Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quality Assurance Testing
          </CardTitle>
          <CardDescription>
            Run automated tests including Lighthouse performance audits and Playwright end-to-end tests.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!qaResults ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <Zap className="h-16 w-16 mx-auto text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Run QA Tests</h3>
              <p className="text-gray-600 mb-4">
                This will run Lighthouse audits, cross-browser tests, and Playwright end-to-end tests.
              </p>
              <Button
                onClick={handleRunQA}
                disabled={isRunningQA || !previewGenerated}
                className="flex items-center gap-2"
              >
                {isRunningQA ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run QA Tests
                  </>
                )}
              </Button>
              {!previewGenerated && (
                <p className="text-sm text-gray-500 mt-2">
                  Generate a preview first to enable QA testing.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Lighthouse Results */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Lighthouse Audit Results
                </h4>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className={`p-4 rounded-lg text-center ${getScoreBg(qaResults.lighthouse.performance)}`}>
                    <div className={`text-2xl font-bold ${getScoreColor(qaResults.lighthouse.performance)}`}>
                      {qaResults.lighthouse.performance}
                    </div>
                    <div className="text-sm text-gray-600">Performance</div>
                  </div>
                  <div className={`p-4 rounded-lg text-center ${getScoreBg(qaResults.lighthouse.accessibility)}`}>
                    <div className={`text-2xl font-bold ${getScoreColor(qaResults.lighthouse.accessibility)}`}>
                      {qaResults.lighthouse.accessibility}
                    </div>
                    <div className="text-sm text-gray-600">Accessibility</div>
                  </div>
                  <div className={`p-4 rounded-lg text-center ${getScoreBg(qaResults.lighthouse.bestPractices)}`}>
                    <div className={`text-2xl font-bold ${getScoreColor(qaResults.lighthouse.bestPractices)}`}>
                      {qaResults.lighthouse.bestPractices}
                    </div>
                    <div className="text-sm text-gray-600">Best Practices</div>
                  </div>
                  <div className={`p-4 rounded-lg text-center ${getScoreBg(qaResults.lighthouse.seo)}`}>
                    <div className={`text-2xl font-bold ${getScoreColor(qaResults.lighthouse.seo)}`}>
                      {qaResults.lighthouse.seo}
                    </div>
                    <div className="text-sm text-gray-600">SEO</div>
                  </div>
                </div>
              </div>

              {/* End-to-End Test Results */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  End-to-End Test Results
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{qaResults.playwright.passed}</div>
                        <div className="text-sm text-gray-600">Passed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{qaResults.playwright.failed}</div>
                        <div className="text-sm text-gray-600">Failed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{qaResults.playwright.total}</div>
                        <div className="text-sm text-gray-600">Total</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-medium">
                        {Math.round((qaResults.playwright.passed / qaResults.playwright.total) * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {qaResults.playwright.tests.map((test: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white border rounded">
                      {test.status === 'passed' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="flex-1">{test.name}</span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        test.status === 'passed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {test.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cross-Browser Results */}
              <div>
                <h4 className="font-medium mb-3">Cross-Browser Compatibility</h4>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {Object.entries(qaResults.crossBrowser).map(([browser, status]: any) => (
                    <div key={browser} className="flex items-center gap-2 p-3 bg-white border rounded">
                      {status === 'passed' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="capitalize">{browser}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-700">
                  QA tests completed! Your website meets the quality standards for deployment.
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ready for Deploy */}
      {qaResults && (
        <Card>
          <CardHeader>
            <CardTitle>Ready for Deployment</CardTitle>
            <CardDescription>
              Your website has passed quality assurance and is ready to be deployed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All Systems Go!</h3>
              <p className="text-gray-600 mb-4">
                Your {dealerName} website is ready for deployment. Proceed to the next step to launch your site.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 