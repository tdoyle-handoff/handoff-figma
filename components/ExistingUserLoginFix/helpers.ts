import { LoginTestResult, UserCredentials } from './types';
import { makeAuthRequest } from '../../utils/networkHelpers';

export const createTestResult = (
  step: string,
  status: LoginTestResult['status'],
  message: string,
  action?: string,
  details?: any
): LoginTestResult => ({
  step,
  status,
  message,
  action,
  details
});

export const testServerConnection = async (): Promise<LoginTestResult> => {
  try {
    await makeAuthRequest('user/health');
    return createTestResult(
      'Server Connection',
      'success',
      'Authentication server is online and ready'
    );
  } catch (error) {
    return createTestResult(
      'Server Connection',
      'error',
      'Authentication server is not available',
      'Server must be deployed for authentication to work',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

export const testSignIn = async (credentials: UserCredentials): Promise<LoginTestResult> => {
  try {
    const signInData = await makeAuthRequest('user/auth/signin', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      })
    });

    if (signInData.success && signInData.profile) {
      return createTestResult(
        'Sign In Attempt',
        'success',
        '✅ Sign in successful! Your account exists and credentials are correct.',
        undefined,
        {
          userId: signInData.profile.id,
          email: signInData.profile.email,
          fullName: signInData.profile.full_name
        }
      );
    } else {
      return createTestResult(
        'Sign In Attempt',
        'error',
        'Sign in failed - server responded but authentication was unsuccessful',
        undefined,
        signInData
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('Invalid email or password')) {
      return createTestResult(
        'Sign In Attempt',
        'error',
        '❌ Invalid credentials - account may not exist',
        'Account might need to be created'
      );
    } else {
      return createTestResult(
        'Sign In Attempt',
        'error',
        `Sign in error: ${errorMessage}`,
        undefined,
        { error: errorMessage }
      );
    }
  }
};

export const createAccount = async (credentials: UserCredentials): Promise<LoginTestResult> => {
  try {
    const signUpData = await makeAuthRequest('user/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        fullName: credentials.fullName
      })
    });

    if (signUpData.success && signUpData.profile) {
      return createTestResult(
        'Account Creation Check',
        'success',
        '🎉 Account created successfully! You can now sign in.',
        undefined,
        {
          userId: signUpData.profile.id,
          email: signUpData.profile.email,
          fullName: signUpData.profile.full_name
        }
      );
    } else {
      return createTestResult(
        'Account Creation Check',
        'error',
        'Account creation failed',
        undefined,
        signUpData
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('already exists') || errorMessage.includes('already registered')) {
      return createTestResult(
        'Account Creation Check',
        'error',
        '⚠️ Account already exists but sign in failed',
        'This suggests a password mismatch. Try resetting your password.',
        { error: errorMessage }
      );
    } else {
      return createTestResult(
        'Account Creation Check',
        'error',
        `Account creation error: ${errorMessage}`,
        undefined,
        { error: errorMessage }
      );
    }
  }
};