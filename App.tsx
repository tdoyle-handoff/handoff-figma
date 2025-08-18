import React, { Suspense } from 'react';
import { useIsMobile } from './components/ui/use-mobile';
import { TaskProvider } from './components/TaskContext';
import { PropertyProvider } from './components/PropertyContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthLoader } from './components/LoadingComponents';
import { PageRenderer } from './components/PageRenderer';
import { AppNotifications } from './components/AppNotifications';
import { DebugModeRenderer } from './components/DebugModeRenderer';

// Authentication and setup components
import { SetupWizard } from './components/SetupWizard';
import { PasswordReset } from './components/PasswordReset';

// Layout components
import DashboardLayout from './components/DashboardLayout';
import MobileLayout from './components/MobileLayout';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useNavigation } from './hooks/useNavigation';
import { usePasswordReset } from './hooks/usePasswordReset';
import { useAppEffects } from './hooks/useAppEffects';

// Utilities
import { getUrlModes } from './utils/urlModes';
import { isPropertySetupComplete } from './utils/setupHelpers';
import { getUserDisplayInfo, getAuthStatusMessage } from './utils/userHelpers';

export default function App() {
  // ALL HOOKS MUST BE CALLED FIRST - BEFORE ANY CONDITIONAL LOGIC OR EARLY RETURNS
  // This ensures the same number of hooks are called on every render
  const isMobile = useIsMobile();
  const auth = useAuth();
  const navigation = useNavigation();
  const passwordReset = usePasswordReset();
  
  // Get URL modes and other derived state AFTER all hooks
  const modes = getUrlModes();
  
  // Get user display information before any conditional rendering
  const setupComplete = isPropertySetupComplete();
  const userDisplayInfo = React.useMemo(() => {
    try {
      return getUserDisplayInfo(auth.isGuestMode, auth.isOfflineMode, auth.setupData, auth.userProfile);
    } catch (error) {
      console.warn('Error getting user display info, using fallback:', error);
      return {
        buyerName: 'User',
        buyerEmail: 'user@handoff.demo',
        displayBadge: auth.isGuestMode ? 'Guest Mode' : null
      };
    }
  }, [auth.isGuestMode, auth.isOfflineMode, auth.setupData, auth.userProfile]);
  
  const authStatusMessage = getAuthStatusMessage(auth.isGuestMode, auth.userProfile);

  // Use custom hook for all effects
  useAppEffects({
    isMobile,
    auth,
    navigation,
    passwordReset,
    modes,
    userDisplayInfo,
    setupComplete
  });

  // NOW WE CAN SAFELY DO CONDITIONAL RENDERING - ALL HOOKS HAVE BEEN CALLED

  // Check for debug modes first
  const debugRenderer = DebugModeRenderer({ modes });
  if (debugRenderer) {
    return debugRenderer;
  }

  // Show password reset page
  if (passwordReset.showPasswordReset && passwordReset.resetToken) {
    return (
      <ErrorBoundary>
        <div className={`setup-wizard-container ${isMobile ? 'mobile-device h-full' : 'h-full'}`}>
          <PasswordReset
            resetToken={passwordReset.resetToken}
            onSuccess={passwordReset.handlePasswordResetSuccess}
            onBackToLogin={passwordReset.handleBackToLogin}
          />
        </div>
      </ErrorBoundary>
    );
  }

  // Show loading state
  if (auth.isLoading) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <AuthLoader />
        </div>
      </ErrorBoundary>
    );
  }

  // Show sign-up/sign-in page
  if (!auth.isAuthenticated) {
    return (
      <ErrorBoundary>
        <div className={`setup-wizard-container ${isMobile ? 'mobile-device h-full' : 'h-full'}`}>
          <SetupWizard 
            onComplete={auth.handleAuthComplete}
            onGoogleSignIn={auth.handleGoogleSignIn}
            authError={auth.authError}
            isLoading={auth.isLoading}
            continueAsGuest={auth.continueAsGuest}
            clearAuthError={auth.clearAuthError}
          />
        </div>
      </ErrorBoundary>
    );
  }

  // Handle sign out with navigation cleanup
  const handleSignOut = () => {
    navigation.clearPersistedNavigation();
    // Clear persisted user display info on manual sign out
    const { clearPersistedUserDisplayInfo } = require('./utils/userHelpers');
    clearPersistedUserDisplayInfo();
    auth.handleSignOut();
  };

  const handleNavigateToDevTools = () => {
    navigation.navigateTo('dev-tools');
  };

  // Render main app
  return (
    <ErrorBoundary>
      <PropertyProvider>
        <TaskProvider userProfile={auth.userProfile}>
          <AppNotifications
            modes={modes}
            authStatusMessage={authStatusMessage}
            isGuestMode={auth.isGuestMode}
            isLoading={auth.isLoading}
            onSignOut={handleSignOut}
            onNavigateToDevTools={handleNavigateToDevTools}
          />

          {isMobile ? (
            <div className="mobile-device h-full min-h-screen bg-background relative">
              <MobileLayout 
                currentPage={navigation.currentPage} 
                onPageChange={navigation.navigateTo}
                setupData={userDisplayInfo}
                onSignOut={handleSignOut}
                isPropertySetupComplete={setupComplete}
              >
                <PageRenderer
                  currentPage={navigation.currentPage}
                  onNavigate={navigation.navigateTo}
                  userProfile={auth.userProfile}
                  setupData={userDisplayInfo}
                  onSignOut={handleSignOut}
                  isPropertySetupComplete={setupComplete}
                />
              </MobileLayout>
            </div>
          ) : (
            <div className="size-full relative">
              <DashboardLayout 
                currentPage={navigation.currentPage} 
                onPageChange={navigation.navigateTo}
                setupData={userDisplayInfo}
                onSignOut={handleSignOut}
                isPropertySetupComplete={setupComplete}
              >
                <PageRenderer
                  currentPage={navigation.currentPage}
                  onNavigate={navigation.navigateTo}
                  userProfile={auth.userProfile}
                  setupData={userDisplayInfo}
                  onSignOut={handleSignOut}
                  isPropertySetupComplete={setupComplete}
                />
              </DashboardLayout>
            </div>
          )}
        </TaskProvider>
      </PropertyProvider>
    </ErrorBoundary>
  );
}