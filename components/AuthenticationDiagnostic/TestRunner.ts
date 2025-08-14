import { TestResult, UserTestData } from './types';
import { makeAuthRequest } from '../../utils/networkHelpers';

export class AuthTestRunner {
  private addTestResult: (result: TestResult) => void;

  constructor(addTestResult: (result: TestResult) => void) {
    this.addTestResult = addTestResult;
  }

  async runConnectionTests() {
    this.addTestResult({
      test: 'Server Connection',
      status: 'running',
      message: 'Testing Supabase server connection...',
      timestamp: new Date()
    });

    try {
      const healthData = await makeAuthRequest('health');
      
      if (healthData.success) {
        this.addTestResult({
          test: 'Server Connection',
          status: 'success',
          message: 'Supabase server is accessible',
          details: { version: healthData.version, timestamp: healthData.timestamp },
          timestamp: new Date()
        });
      } else {
        this.addTestResult({
          test: 'Server Connection',
          status: 'error',
          message: 'Server responded but reported unhealthy status',
          details: healthData,
          timestamp: new Date()
        });
      }
    } catch (error) {
      this.addTestResult({
        test: 'Server Connection',
        status: 'error',
        message: error instanceof Error ? error.message : 'Connection failed',
        details: { error: error },
        timestamp: new Date()
      });
    }
  }

  async runAuthenticationTests(userData: UserTestData) {
    if (!userData.email || !userData.password) {
      this.addTestResult({
        test: 'Authentication Test',
        status: 'error',
        message: 'Please provide email and password for testing',
        timestamp: new Date()
      });
      return;
    }

    this.addTestResult({
      test: 'Sign In Test',
      status: 'running',
      message: `Testing sign in for ${userData.email}...`,
      timestamp: new Date()
    });

    try {
      const signInData = await makeAuthRequest('user/auth/signin', {
        method: 'POST',
        body: JSON.stringify({
          email: userData.email,
          password: userData.password
        })
      });

      if (signInData.success && signInData.profile) {
        this.addTestResult({
          test: 'Sign In Test',
          status: 'success',
          message: 'Sign in successful - user account exists and credentials are correct',
          details: {
            userId: signInData.profile.id,
            email: signInData.profile.email,
            fullName: signInData.profile.full_name,
            hasSession: !!signInData.session
          },
          timestamp: new Date()
        });
      } else {
        this.addTestResult({
          test: 'Sign In Test',
          status: 'error',
          message: 'Sign in failed - check credentials or try creating account',
          details: signInData,
          timestamp: new Date()
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('Invalid email or password')) {
        this.addTestResult({
          test: 'Sign In Test',
          status: 'warning',
          message: 'Invalid credentials - account may not exist yet',
          details: { 
            error: errorMessage,
            suggestion: 'Try creating an account with these credentials instead'
          },
          timestamp: new Date()
        });
      } else {
        this.addTestResult({
          test: 'Sign In Test',
          status: 'error',
          message: `Sign in error: ${errorMessage}`,
          details: { error: errorMessage },
          timestamp: new Date()
        });
      }
    }
  }
}