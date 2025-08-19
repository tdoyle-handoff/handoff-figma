import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { CheckCircle, XCircle, AlertTriangle, Info, RefreshCw } from 'lucide-react';
import { projectUrl, publicAnonKey } from '../utils/supabase/info';

interface DebugInfo {
  timestamp: string;
  userAgent: string;
  url: string;
  localStorage: Record<string, any>;
  sessionStorage: Record<string, any>;
  cookies: string;
}

interface ServerResponse {
  status: number;
  statusText?: string;
  data?: any;
  error?: string;
  headers?: Record<string, string>;
  endpoint?: string;
  method?: string;
}

interface TestConfig {
  name: string;
  endpoint: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

export function AuthDebugPanel() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [serverTests, setServerTests] = useState<Record<string, ServerResponse>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const collectDebugInfo = () => {
    const info: DebugInfo = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      localStorage: {},
      sessionStorage: {},
      cookies: document.cookie
    };

    // Safely collect localStorage
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (key.includes('handoff') || key.includes('auth')) {
            try {
              info.localStorage[key] = JSON.parse(value || '');
            } catch {
              info.localStorage[key] = value;
            }
          }
        }
      }
    } catch (error) {
      info.localStorage.error = 'Unable to access localStorage';
    }

    // Safely collect sessionStorage
    try {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          const value = sessionStorage.getItem(key);
          if (key.includes('handoff') || key.includes('auth')) {
            try {
              info.sessionStorage[key] = JSON.parse(value || '');
            } catch {
              info.sessionStorage[key] = value;
            }
          }
        }
      }
    } catch (error) {
      info.sessionStorage.error = 'Unable to access sessionStorage';
    }

    setDebugInfo(info);
  };

  const testServerEndpoint = async (name: string, endpoint: string, options: RequestInit = {}) => {
    const fullUrl = `${projectUrl}/functions/v1/make-server-a24396d5/${endpoint}`;
    
    try {
      console.log(`Testing endpoint: ${name} - ${options.method || 'GET'} ${fullUrl}`);
      
      const response = await fetch(fullUrl, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          ...options.headers,
        },
        body: options.body,
      });

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let data;
      let error;
      let responseText = '';
      
      try {
        responseText = await response.text();
        if (responseText.trim()) {
          data = JSON.parse(responseText);
        } else {
          data = { empty: true };
        }
      } catch (parseError) {
        error = `JSON parse error: ${parseError}`;
        data = { 
          parseError: true, 
          responseText: responseText.substring(0, 200),
          fullResponseLength: responseText.length
        };
      }

      return {
        status: response.status,
        statusText: response.statusText,
        data,
        error,
        headers: responseHeaders,
        endpoint: fullUrl,
        method: options.method || 'GET'
      };
    } catch (error) {
      console.error(`Test failed for ${name}:`, error);
      return {
        status: 0,
        statusText: 'Network Error',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
        endpoint: fullUrl,
        method: options.method || 'GET'
      };
    }
  };

  const runServerTests = async () => {
    setIsLoading(true);
    
    const tests: TestConfig[] = [
      { name: 'Health Check', endpoint: 'health' },
      { name: 'User Health', endpoint: 'user/health' },
      { name: 'User Debug', endpoint: 'user/debug/userid', headers: { 'X-User-ID': 'test-user-id' } },
      { 
        name: 'Auth Signup Test', 
        endpoint: 'user/auth/signup', 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'testpassword123',
          fullName: 'Test User'
        })
      },
      { 
        name: 'Auth Signin Test', 
        endpoint: 'user/auth/signin', 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'testpassword123'
        })
      },
      { name: 'User Profile', endpoint: 'user/profile', headers: { 'X-User-ID': 'test-user-id' } },
      { name: 'Invalid Endpoint', endpoint: 'this/does/not/exist' },
    ];

    const results: Record<string, ServerResponse> = {};
    
    for (const test of tests) {
      console.log(`Running test: ${test.name}`);
      results[test.name] = await testServerEndpoint(test.name, test.endpoint, {
        method: test.method || 'GET',
        headers: test.headers,
        body: test.body
      });
    }

    setServerTests(results);
    setIsLoading(false);
    setLastUpdate(new Date().toISOString());
  };

  useEffect(() => {
    collectDebugInfo();
    runServerTests();
  }, []);

  const getStatusIcon = (status: number) => {
    if (status === 0) return <XCircle className="w-5 h-5 text-red-500" />;
    if (status >= 200 && status < 300) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status >= 400 && status < 500) return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = (status: number) => {
    if (status === 0) return 'destructive';
    if (status >= 200 && status < 300) return 'default';
    if (status >= 400 && status < 500) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Authentication Debug Panel</h1>
        <p className="text-muted-foreground">
          Diagnose authentication and server connection issues
        </p>
        {lastUpdate && (
          <Badge variant="outline">
            Last updated: {new Date(lastUpdate).toLocaleTimeString()}
          </Badge>
        )}
        
        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription>
            This debug panel tests all authentication endpoints and displays detailed response information.
            Use this when experiencing login issues or "JSON parsing" errors.
          </AlertDescription>
        </Alert>
      </div>

      <div className="flex gap-4 justify-center">
        <Button onClick={collectDebugInfo} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Client Info
        </Button>
        <Button onClick={runServerTests} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Test Server
        </Button>
      </div>

      {/* Server Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Server Connection Tests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(serverTests).map(([name, result]) => (
            <div key={name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  <span className="font-medium">{name}</span>
                </div>
                <Badge variant={getStatusColor(result.status) as any}>
                  {result.status === 0 ? 'Failed' : `${result.status} ${result.statusText || ''}`}
                </Badge>
              </div>
              
              {result.endpoint && (
                <div className="text-xs text-muted-foreground font-mono bg-muted rounded px-2 py-1">
                  {result.method} {result.endpoint}
                </div>
              )}
              
              {result.error && (
                <Alert>
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription>{result.error}</AlertDescription>
                </Alert>
              )}
              
              {result.data && (
                <div className="bg-muted rounded-lg p-3">
                  <pre className="text-xs overflow-auto max-h-32">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}
              
              {result.headers && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground">
                    Response Headers
                  </summary>
                  <div className="bg-muted rounded-lg p-2 mt-1">
                    <pre>{JSON.stringify(result.headers, null, 2)}</pre>
                  </div>
                </details>
              )}
              
              <Separator />
            </div>
          ))}
          
          {Object.keys(serverTests).length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No server tests run yet. Click "Test Server" to start.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client Debug Info */}
      {debugInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Client Debug Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Environment</h4>
              <div className="bg-muted rounded-lg p-3 space-y-1">
                <div><strong>URL:</strong> {debugInfo.url}</div>
                <div><strong>User Agent:</strong> {debugInfo.userAgent}</div>
                <div><strong>Timestamp:</strong> {debugInfo.timestamp}</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Local Storage</h4>
              <div className="bg-muted rounded-lg p-3">
                <pre className="text-xs overflow-auto max-h-48">
                  {JSON.stringify(debugInfo.localStorage, null, 2)}
                </pre>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Session Storage</h4>
              <div className="bg-muted rounded-lg p-3">
                <pre className="text-xs overflow-auto max-h-48">
                  {JSON.stringify(debugInfo.sessionStorage, null, 2)}
                </pre>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Cookies</h4>
              <div className="bg-muted rounded-lg p-3">
                <pre className="text-xs overflow-auto max-h-32">
                  {debugInfo.cookies || 'No cookies found'}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            variant="outline" 
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              alert('Storage cleared! Please refresh the page.');
            }}
            className="w-full"
          >
            Clear All Storage
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              const keys = Object.keys(localStorage).filter(key => 
                key.includes('handoff') || key.includes('auth')
              );
              keys.forEach(key => localStorage.removeItem(key));
              alert('Auth storage cleared! Please refresh the page.');
            }}
            className="w-full"
          >
            Clear Auth Storage Only
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              window.location.href = window.location.origin + '/?diagnostic=true';
            }}
            className="w-full"
          >
            Go to Full Diagnostic Mode
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}