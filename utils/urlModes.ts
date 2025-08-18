export interface UrlModes {
  isDevMode: boolean;
  isAuthDebugMode: boolean;
  isAddressDebugMode: boolean;
  isAddressDemoMode: boolean;
  isAddressValidationDemoMode: boolean;
  isAttomDebugMode: boolean;
  isAttomTestMode: boolean;
  isAttomAdminMode: boolean;
  isAttomAdminDiagnosticMode: boolean;
  isApiKeyValidatorMode: boolean;
  isAttomSearchDiagnosticMode: boolean;
  isAttomApiFixSummaryMode: boolean;
  isAttomEndpointAccessMode: boolean;
  isAttomOfficialTesterMode: boolean;
  isAttomApiKeySetupMode: boolean;
  isPropertyFieldMappingMode: boolean;
  isApiKeyManagerMode: boolean;
}

export function getUrlModes(): UrlModes {
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    isDevMode: urlParams.get('dev') === 'true',
    isAuthDebugMode: urlParams.get('auth-debug') === 'true',
    isAddressDebugMode: urlParams.get('address-debug') === 'true',
    isAddressDemoMode: urlParams.get('address-demo') === 'true',
    isAddressValidationDemoMode: urlParams.get('address-validation-demo') === 'true',
    isAttomDebugMode: urlParams.get('attom-debug') === 'true',
    isAttomTestMode: urlParams.get('attom-test') === 'true',
    isAttomAdminMode: urlParams.get('attom-admin') === 'true',
    isAttomAdminDiagnosticMode: urlParams.get('attom-admin-diagnostic') === 'true',
    isApiKeyValidatorMode: urlParams.get('api-key-validator') === 'true',
    isAttomSearchDiagnosticMode: urlParams.get('attom-search-diagnostic') === 'true',
    isAttomApiFixSummaryMode: urlParams.get('attom-api-fix-summary') === 'true',
    isAttomEndpointAccessMode: urlParams.get('attom-endpoint-access') === 'true',
    isAttomOfficialTesterMode: urlParams.get('attom-official-tester') === 'true',
    isAttomApiKeySetupMode: urlParams.get('attom-api-key-setup') === 'true',
    isPropertyFieldMappingMode: urlParams.get('property-field-mapping') === 'true',
    isApiKeyManagerMode: urlParams.get('api-key-manager') === 'true',
  };
}

export function logUrlModes(modes: UrlModes): void {
  const activeModes = Object.entries(modes)
    .filter(([key, value]) => value === true)
    .map(([key, value]) => key);
    
  if (activeModes.length > 0) {
    console.log('🚀 Active URL modes:', activeModes);
    console.log('📋 Current URL modes state:', modes);
  }
}