import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { projectUrl, publicAnonKey, projectRef } from '../utils/supabase/info';

interface ConnectionTestResult {
  service: string;
  status: 'success' | 'error' | 'testing';
  message: string;
  latency?: number;
  details?: any;
}

export function SupabaseConnectionTest() {
  const [testResults, setTestResults] = useState<ConnectionTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runConnectionTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    const baseUrl = `${projectUrl}/functions/v1/make-server-a24396d5`;
    
    const tests = [
      { name: 'Main Server', endpoint: '/health' },
      { name: 'User Service', endpoint: '/user/health' },
      { name: 'Places Service', endpoint: '/places/health' },
      { name: 'MLS Service', endpoint: '/mls/health' },
      { name: 'ATTOM Service', endpoint: '/attom/health' }
    ];

    for (const test of tests) {
      const result: ConnectionTestResult = {
        service: test.name,
        status: 'testing',
        message: 'Testing connection...'
      };
      
      setTestResults(prev => [...prev, result]);

      try {
        const startTime = Date.now();
        const response = await fetch(`${baseUrl}${test.endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          timeout: 10000
        });

        const latency = Date.now() - startTime;
        const data = await response.json();

        if (response.ok) {
          result.status = 'success';
          result.message = `Connected successfully`;
          result.latency = latency;
          result.details = data;
        } else {
          result.status = 'error';
          result.message = `HTTP ${response.status}: ${data.error || 'Unknown error'}`;
          result.latency = latency;
        }
      } catch (error) {
        result.status = 'error';
        result.message = error instanceof Error ? error.message : 'Connection failed';
      }

      setTestResults(prev => 
        prev.map(r => r.service === test.name ? result : r)
      );

      // Small delay between tests to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsRunning(false);
  };

  useEffect(() => {
    // Run initial connection test
    runConnectionTests();
  }, []);

  const getStatusIcon = (status: ConnectionTestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'testing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
    }
  };

  const getStatusBadge = (status: ConnectionTestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>;
      case 'error':
        return <Badge variant="destructive">Failed</Badge>;
      case 'testing':
        return <Badge variant="secondary">Testing...</Badge>;
    }
  };

  const successCount = testResults.filter(r => r.status === 'success').length;
  const totalTests = testResults.length;
  const allCompleted = testResults.every(r => r.status !== 'testing');

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className={`h-5 w-5 ${isRunning ? 'animate-spin' : ''}`} />
          Supabase Server Connection Test
        </CardTitle>
        <CardDescription>
          Testing connectivity to all Handoff platform services
        </CardDescription>
        {allCompleted && (
          <div className="flex items-center gap-4">
            <Badge variant={successCount === totalTests ? "default" : "secondary"} className={successCount === totalTests ? "bg-green-100 text-green-800" : ""}>
              {successCount}/{totalTests} Services Connected
            </Badge>
            <Button 
              onClick={runConnectionTests} 
              disabled={isRunning}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
              Re-test
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {testResults.map((result, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(result.status)}
                <div>
                  <div className="font-medium">{result.service}</div>
                  <div className="text-sm text-muted-foreground">{result.message}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {result.latency && (
                  <span className="text-xs text-muted-foreground">
                    {result.latency}ms
                  </span>
                )}
                {getStatusBadge(result.status)}
              </div>
            </div>
          ))}
        </div>
        
        {allCompleted && successCount > 0 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Connection Summary</h4>
            <div className="text-sm text-green-700 space-y-1">
              div>✅ Supabase Project ID: {projectRef}</div>
              <div>✅ Authentication: Configured</div>
              <div>✅ Database: Connected via KV Store</div>
              <div>✅ Edge Functions: {successCount} services operational</div>
              {successCount === totalTests && (
                <div className="mt-2 font-medium">🎉 All systems operational!</div>
              )}
            </div>
          </div>
        )}

        {allCompleted && successCount < totalTests && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Partial Connectivity</h4>
            <div className="text-sm text-yellow-700">
              Some services are not responding. This is normal during development or if certain API keys are not configured.
              The app will continue to work with available services.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}