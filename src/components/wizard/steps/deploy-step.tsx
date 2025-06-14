'use client';

import { useWizard } from '../wizard-context-simple';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { useState } from 'react';
import { Rocket, Globe, CheckCircle, AlertTriangle, Server, MessageSquare, ExternalLink, Copy } from 'lucide-react';

export function DeployStep() {
  const { form } = useWizard();
  const [deploymentTarget, setDeploymentTarget] = useState('uat');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'completed' | 'failed'>('idle');
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([]);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);

  const dealerName = form.watch('dealerName') || 'Your Dealership';
  const dealerSlug = form.watch('dealerSlug') || 'your-dealership';

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeploymentStatus('deploying');
    setDeploymentLogs([]);

    const steps = [
      'Preparing deployment package...',
      'Building website assets...',
      'Optimizing images and resources...',
      'Generating static pages...',
      'Uploading to S3 bucket...',
      'Configuring CloudFront distribution...',
      'Setting up SSL certificate...',
      'Running smoke tests...',
      'Invalidating CDN cache...',
      'Deployment completed successfully!',
    ];

    try {
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDeploymentLogs(prev => [...prev, steps[i]]);
      }

      const baseUrl = deploymentTarget === 'uat' 
        ? `https://uat-${dealerSlug}.autodealershub.com`
        : `https://www.${dealerSlug}.com`;
        
      setDeploymentUrl(baseUrl);
      setDeploymentStatus('completed');
    } catch (error) {
      setDeploymentStatus('failed');
      setDeploymentLogs(prev => [...prev, 'Deployment failed: ' + (error as Error).message]);
    } finally {
      setIsDeploying(false);
    }
  };

  const copyUrl = () => {
    if (deploymentUrl) {
      navigator.clipboard.writeText(deploymentUrl);
    }
  };

  const sendSlackNotification = () => {
    // This would send a Slack notification in a real implementation
    alert('Slack notification sent to the team!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Deploy Your Website</h2>
        <p className="mt-2 text-gray-600">
          Deploy your {dealerName} website to UAT for testing or directly to production.
        </p>
      </div>

      {/* Deployment Target */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Deployment Target
          </CardTitle>
          <CardDescription>
            Choose where to deploy your website: UAT for testing or Production for live launch.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                deploymentTarget === 'uat'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setDeploymentTarget('uat')}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`h-4 w-4 rounded-full border-2 ${
                  deploymentTarget === 'uat' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                }`}>
                  {deploymentTarget === 'uat' && <div className="h-2 w-2 bg-white rounded-full m-0.5"></div>}
                </div>
                <h3 className="font-medium">UAT Environment</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Deploy to a testing environment for client review and final approval.
              </p>
              <div className="text-sm">
                <div className="font-medium text-gray-900">URL:</div>
                <div className="text-blue-600">https://uat-{dealerSlug}.autodealershub.com</div>
              </div>
            </div>

            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                deploymentTarget === 'production'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setDeploymentTarget('production')}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`h-4 w-4 rounded-full border-2 ${
                  deploymentTarget === 'production' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                }`}>
                  {deploymentTarget === 'production' && <div className="h-2 w-2 bg-white rounded-full m-0.5"></div>}
                </div>
                <h3 className="font-medium">Production Environment</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Deploy directly to the live production environment.
              </p>
              <div className="text-sm">
                <div className="font-medium text-gray-900">URL:</div>
                <div className="text-green-600">https://www.{dealerSlug}.com</div>
              </div>
            </div>
          </div>

          {deploymentTarget === 'production' && (
            <div className="flex items-center gap-2 p-4 bg-amber-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <div className="text-amber-700">
                <div className="font-medium">Production Deployment Warning</div>
                <div className="text-sm">
                  This will deploy directly to the live website. Consider using UAT first for testing.
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deployment Process */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Deployment Process
          </CardTitle>
          <CardDescription>
            Start the deployment process to launch your website.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {deploymentStatus === 'idle' && (
            <div className="text-center py-8">
              <div className="mb-4">
                <Rocket className="h-16 w-16 mx-auto text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready for Launch</h3>
              <p className="text-gray-600 mb-4">
                Your {dealerName} website is ready to be deployed to {deploymentTarget === 'uat' ? 'UAT' : 'Production'}.
              </p>
              <Button
                onClick={handleDeploy}
                disabled={isDeploying}
                className="flex items-center gap-2"
              >
                <Rocket className="h-4 w-4" />
                Deploy to {deploymentTarget === 'uat' ? 'UAT' : 'Production'}
              </Button>
            </div>
          )}

          {deploymentStatus === 'deploying' && (
            <div>
              <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg mb-4">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-blue-700 font-medium">Deployment in progress...</span>
              </div>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
                {deploymentLogs.map((log, index) => (
                  <div key={index} className="mb-1">
                    [{new Date().toLocaleTimeString()}] {log}
                  </div>
                ))}
                <div className="animate-pulse">_</div>
              </div>
            </div>
          )}

          {deploymentStatus === 'completed' && (
            <div>
              <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg mb-4">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-700 font-medium">Deployment completed successfully!</span>
              </div>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto mb-4">
                {deploymentLogs.map((log, index) => (
                  <div key={index} className="mb-1">
                    [{new Date().toLocaleTimeString()}] {log}
                  </div>
                ))}
              </div>

              {/* Success Actions */}
              <div className="space-y-4">
                <div className="p-4 bg-white border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">Website URL</h4>
                      <p className="text-sm text-gray-600">Your website is now live at:</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={copyUrl}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Globe className="h-4 w-4 text-gray-600" />
                    <code className="flex-1 text-blue-600">{deploymentUrl}</code>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={deploymentUrl || undefined} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Button variant="outline" onClick={sendSlackNotification} className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Send Slack Notification
                  </Button>
                  
                  <Button variant="outline" asChild>
                    <a href={deploymentUrl || undefined} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Open Website
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {deploymentStatus === 'failed' && (
            <div>
              <div className="flex items-center gap-2 p-4 bg-red-50 rounded-lg mb-4">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-red-700 font-medium">Deployment failed!</span>
              </div>
              
              <div className="bg-gray-900 text-red-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto mb-4">
                {deploymentLogs.map((log, index) => (
                  <div key={index} className="mb-1">
                    [{new Date().toLocaleTimeString()}] {log}
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Button onClick={handleDeploy} variant="outline">
                  <Rocket className="h-4 w-4 mr-2" />
                  Retry Deployment
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Post-Deployment Actions */}
      {deploymentStatus === 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle>Post-Deployment Checklist</CardTitle>
            <CardDescription>
              Complete these final steps to ensure everything is working correctly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white border rounded">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="flex-1">Website deployed successfully</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white border rounded">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="flex-1">SSL certificate configured</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white border rounded">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="flex-1">CDN cache invalidated</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white border rounded">
                <div className="h-4 w-4 rounded border-2 border-gray-300"></div>
                <span className="flex-1 text-gray-600">Verify all pages load correctly</span>
                <Button variant="ghost" size="sm" asChild>
                  <a href={deploymentUrl || undefined} target="_blank" rel="noopener noreferrer">
                    Check
                  </a>
                </Button>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white border rounded">
                <div className="h-4 w-4 rounded border-2 border-gray-300"></div>
                <span className="flex-1 text-gray-600">Test contact forms and functionality</span>
                <Button variant="ghost" size="sm" asChild>
                  <a href={`${deploymentUrl}/contact-us`} target="_blank" rel="noopener noreferrer">
                    Test
                  </a>
                </Button>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white border rounded">
                <div className="h-4 w-4 rounded border-2 border-gray-300"></div>
                <span className="flex-1 text-gray-600">Confirm analytics and integrations</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Next Steps</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Share the {deploymentTarget === 'uat' ? 'UAT' : 'live'} URL with stakeholders</li>
                <li>• Monitor website performance and user feedback</li>
                <li>• Set up ongoing maintenance and content updates</li>
                {deploymentTarget === 'uat' && <li>• Schedule production deployment after approval</li>}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 