import { useState } from 'react';
import { makeAuthRequest } from '../utils/networkHelpers';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import type { TestResult } from '../components/auth-test/TestResultsList';

interface AuthTestData {
  email: string;
  password: string;
  fullName: string;
}

export function useAuthTestRunner() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentUserSession, setCurrentUserSession] = useState<any>(null);

  const addTestResult = (test: string, status: 'pending' | 'success' | 'error', message: string, data?: any) => {
    setTestResults(prev => {
      const existing = prev.find(r => r.test === test);
      const newResult: TestResult = { test, status, message, data };
      
      if (existing) {
        return prev.map(r => r.test === test ? newResult : r);
      } else {
        return [...prev, newResult];
      }
    });
  };

  const runHealthCheck = async () => {
    addTestResult('health', 'pending', 'Checking server health...');
    
    // Clear offline flag to allow fresh check
    localStorage.removeItem('handoff_server_offline');
    
    try {
      const result = await makeAuthRequest('health');
      addTestResult('health', 'success', 'Server is healthy', result);
      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      if (errorMsg.includes('Server not available') || errorMsg.includes('Failed to fetch')) {
        addTestResult('health', 'error', 'Server not available (normal for development without deployed Edge Functions)');
      } else {
        addTestResult('health', 'error', `Health check failed: ${errorMsg}`);
      }
      return false;
    }
  };

  const runUserHealthCheck = async () => {
    addTestResult('user-health', 'pending', 'Checking user service health...');
    
    try {
      const result = await makeAuthRequest('user/health');
      addTestResult('user-health', 'success', 'User service is healthy', result);
      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      if (errorMsg.includes('Server not available') || errorMsg.includes('Failed to fetch')) {
        addTestResult('user-health', 'error', 'User service not available (normal for development without deployed Edge Functions)');
      } else {
        addTestResult('user-health', 'error', `User service health check failed: ${errorMsg}`);
      }
      return false;
    }
  };

  const runSignUpTest = async (authData: AuthTestData) => {
    addTestResult('signup', 'pending', 'Testing user sign up...');
    
    try {
      const result = await makeAuthRequest('user/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: authData.email,
          password: authData.password,
          fullName: authData.fullName
        })
      });
      
      if (result.success) {
        addTestResult('signup', 'success', 'User sign up successful', result);
        setCurrentUserSession({ profile: result.profile, session: result.session });
        return result;
      } else {
        addTestResult('signup', 'error', result.error || 'Sign up failed');
        return null;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      if (errorMsg.includes('already exists')) {
        addTestResult('signup', 'error', 'User already exists - this is expected for repeated tests');
        return null;
      }
      addTestResult('signup', 'error', `Sign up failed: ${errorMsg}`);
      return null;
    }
  };

  const runSignInTest = async (authData: AuthTestData) => {
    addTestResult('signin', 'pending', 'Testing user sign in...');
    
    try {
      const result = await makeAuthRequest('user/auth/signin', {
        method: 'POST',
        body: JSON.stringify({
          email: authData.email,
          password: authData.password
        })
      });
      
      if (result.success) {
        addTestResult('signin', 'success', 'User sign in successful', result);
        setCurrentUserSession({ profile: result.profile, session: result.session });
        return result;
      } else {
        addTestResult('signin', 'error', result.error || 'Sign in failed');
        return null;
      }
    } catch (error) {
      addTestResult('signin', 'error', `Sign in failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  };

  const runProfileTest = async (userId?: string, sessionToken?: string) => {
    addTestResult('profile', 'pending', 'Testing profile retrieval...');
    
    try {
      const headers: Record<string, string> = {};
      
      if (userId) {
        headers['X-User-ID'] = userId;
      }
      
      if (sessionToken) {
        headers['Authorization'] = `Bearer ${sessionToken}`;
      }

      const result = await makeAuthRequest('user/profile', {
        method: 'GET',
        headers
      });
      
      if (result.success) {
        addTestResult('profile', 'success', 'Profile retrieval successful', result);
        return result;
      } else {
        addTestResult('profile', 'error', result.error || 'Profile retrieval failed');
        return null;
      }
    } catch (error) {
      addTestResult('profile', 'error', `Profile retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  };

  const runSessionVerificationTest = async (sessionToken?: string) => {
    addTestResult('verify', 'pending', 'Testing session verification...');
    
    try {
      const result = await makeAuthRequest('user/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${sessionToken || publicAnonKey}`
        }
      });
      
      if (result.success) {
        addTestResult('verify', 'success', 'Session verification successful', result);
        return result;
      } else {
        addTestResult('verify', 'error', result.error || 'Session verification failed');
        return null;
      }
    } catch (error) {
      addTestResult('verify', 'error', `Session verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  };

  const runFullTest = async (authData: AuthTestData) => {
    setIsRunning(true);
    setTestResults([]);
    setCurrentUserSession(null);

    try {
      // Step 1: Health checks
      const healthOk = await runHealthCheck();
      if (!healthOk) {
        setIsRunning(false);
        return;
      }

      const userHealthOk = await runUserHealthCheck();
      if (!userHealthOk) {
        setIsRunning(false);
        return;
      }

      // Step 2: Try sign in first
      const signInResult = await runSignInTest(authData);
      
      let authResult = signInResult;
      
      // Step 3: If sign in fails, try sign up
      if (!signInResult) {
        authResult = await runSignUpTest(authData);
      }

      // Step 4: If we have a user session, test profile and verification
      if (authResult && authResult.profile) {
        await runProfileTest(authResult.profile.id, authResult.session?.access_token);
        
        if (authResult.session?.access_token) {
          await runSessionVerificationTest(authResult.session.access_token);
        }
      }

    } catch (error) {
      console.error('Test suite error:', error);
      addTestResult('general', 'error', `Test suite error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const clearTests = () => {
    setTestResults([]);
    setCurrentUserSession(null);
  };

  return {
    testResults,
    isRunning,
    currentUserSession,
    runFullTest,
    clearTests,
  };
}