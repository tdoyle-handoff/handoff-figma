import React from 'react';
import { UrlModes } from '../utils/urlModes';
import { ErrorBoundary } from './ErrorBoundary';

// Import all debug components
import { AuthDebugPanel } from './AuthDebugPanel';
import { AddressDebugTest } from './AddressDebugTest';
import { AddressDemo } from './AddressDemo';
import { AddressValidationDemo } from './AddressValidationDemo';
import { AttomDebugTool } from './AttomDebugTool';
import { AttomApiTestTool } from './AttomApiTestTool';
import { AttomApiAdminPanel } from './AttomApiAdminPanel';
import { AttomAdminDiagnostic } from './AttomAdminDiagnostic';
import { AttomApiKeyValidator } from './AttomApiKeyValidator';
import { AttomSearchDiagnostic } from './AttomSearchDiagnostic';
import { AttomApiFixSummary } from './AttomApiFixSummary';
import { AttomEndpointAccessDiagnostic } from './AttomEndpointAccessDiagnostic';
import { AttomOfficialApiTester } from './AttomOfficialApiTester';
import { AttomApiKeySetup } from './AttomApiKeySetup';
import { PropertyFieldMapping } from './PropertyFieldMapping';
import { ApiKeyManager } from './ApiKeyManager';
import { DevTools } from './DevTools';

interface DebugModeRendererProps {
  modes: UrlModes;
}

export function DebugModeRenderer({ modes }: DebugModeRendererProps): React.ReactElement | null {
  if (modes.isDevMode) {
    console.log('App.tsx - Rendering DevTools');
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <DevTools />
        </div>
      </ErrorBoundary>
    );
  }

  if (modes.isApiKeyManagerMode) {
    console.log('App.tsx - Rendering ApiKeyManager');
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <ApiKeyManager />
        </div>
      </ErrorBoundary>
    );
  }

  if (modes.isPropertyFieldMappingMode) {
    console.log('App.tsx - Rendering PropertyFieldMapping');
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <PropertyFieldMapping />
        </div>
      </ErrorBoundary>
    );
  }

  if (modes.isAttomApiKeySetupMode) {
    console.log('App.tsx - Rendering AttomApiKeySetup');
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <AttomApiKeySetup />
        </div>
      </ErrorBoundary>
    );
  }

  if (modes.isAttomOfficialTesterMode) {
    console.log('App.tsx - Rendering AttomOfficialApiTester');
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <AttomOfficialApiTester />
        </div>
      </ErrorBoundary>
    );
  }

  if (modes.isAttomEndpointAccessMode) {
    console.log('App.tsx - Rendering AttomEndpointAccessDiagnostic');
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <AttomEndpointAccessDiagnostic />
        </div>
      </ErrorBoundary>
    );
  }

  if (modes.isAttomApiFixSummaryMode) {
    console.log('App.tsx - Rendering AttomApiFixSummary');
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <AttomApiFixSummary />
        </div>
      </ErrorBoundary>
    );
  }

  if (modes.isAttomSearchDiagnosticMode) {
    console.log('App.tsx - Rendering AttomSearchDiagnostic');
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <AttomSearchDiagnostic />
        </div>
      </ErrorBoundary>
    );
  }

  if (modes.isApiKeyValidatorMode) {
    console.log('App.tsx - Rendering AttomApiKeyValidator');
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <AttomApiKeyValidator />
        </div>
      </ErrorBoundary>
    );
  }

  if (modes.isAttomAdminDiagnosticMode) {
    console.log('App.tsx - Rendering AttomAdminDiagnostic');
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <AttomAdminDiagnostic />
        </div>
      </ErrorBoundary>
    );
  }

  if (modes.isAttomAdminMode) {
    console.log('App.tsx - Rendering AttomApiAdminPanel');
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <AttomApiAdminPanel />
        </div>
      </ErrorBoundary>
    );
  }

  if (modes.isAttomTestMode) {
    console.log('App.tsx - Rendering AttomApiTestTool');
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <AttomApiTestTool />
        </div>
      </ErrorBoundary>
    );
  }

  if (modes.isAttomDebugMode) {
    console.log('App.tsx - Rendering AttomDebugTool');
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <AttomDebugTool />
        </div>
      </ErrorBoundary>
    );
  }

  if (modes.isAddressValidationDemoMode) {
    console.log('App.tsx - Rendering AddressValidationDemo');
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <AddressValidationDemo />
        </div>
      </ErrorBoundary>
    );
  }

  if (modes.isAddressDemoMode) {
    console.log('App.tsx - Rendering AddressDemo');
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <AddressDemo />
        </div>
      </ErrorBoundary>
    );
  }

  if (modes.isAddressDebugMode) {
    console.log('App.tsx - Rendering AddressDebugTest');
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <AddressDebugTest />
        </div>
      </ErrorBoundary>
    );
  }

  if (modes.isAuthDebugMode) {
    console.log('App.tsx - Rendering AuthDebugPanel');
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <AuthDebugPanel />
        </div>
      </ErrorBoundary>
    );
  }

  return null;
}