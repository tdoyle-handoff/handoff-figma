import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, authHelpers } from '../utils/supabase/client';
import type { SetupData } from '../utils/authHelpers';
import type { UserProfile, AuthSession } from '../utils/supabase/client';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userProfile: UserProfile | null;
  setupData: SetupData | null;
  authError: string | null;
  isOfflineMode: boolean;
  isGuestMode: boolean;
  isQuestionnaireComplete: boolean;
  showQuestionnairePrompt: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    userProfile: null,
    setupData: null,
    authError: null,
    isOfflineMode: false,
    isGuestMode: false,
    isQuestionnaireComplete: false,
    showQuestionnairePrompt: false,
  });

  const mountedRef = useRef(true);
  const initTimeoutRef = useRef<NodeJS.Timeout>();

  // Simplified auth initialization with timeout fallback
  useEffect(() => {
    let authUnsubscribe: (() => void) | null = null;

    const initializeAuth = async () => {
      try {
        console.log('🔐 Starting simplified auth initialization...');

        // Set a timeout to prevent infinite loading
        initTimeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            console.log('⏰ Auth initialization timeout - falling back to guest mode');
            setAuthState(prev => ({
              ...prev,
              isAuthenticated: false,
              isLoading: false,
              authError: null,
            }));
          }
        }, 3000); // 3 second timeout

        // Check for existing guest session first
        const storedProfile = localStorage.getItem('handoff-user-profile');
        const storedSetupData = localStorage.getItem('handoff-setup-data');
        
        if (storedProfile && storedSetupData) {
          try {
            const profile = JSON.parse(storedProfile);
            const setupData = JSON.parse(storedSetupData);
            
            if (profile.is_guest) {
              console.log('🎭 Restored guest session');
              clearTimeout(initTimeoutRef.current);
              setAuthState(prev => ({
                ...prev,
                isAuthenticated: true,
                userProfile: profile,
                setupData,
                isQuestionnaireComplete: profile.questionnaire_complete || false,
                showQuestionnairePrompt: !(profile.questionnaire_complete || false),
                isOfflineMode: true,
                isGuestMode: true,
                isLoading: false,
                authError: null,
              }));
              return;
            }
          } catch (error) {
            console.warn('Error parsing stored data, continuing...');
            localStorage.removeItem('handoff-user-profile');
            localStorage.removeItem('handoff-setup-data');
          }
        }

        // Try to get current session with simplified approach
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (session && session.user && !error) {
            console.log('✅ Found active session for:', session.user.email);
            
            // Clear timeout since we have a valid session
            clearTimeout(initTimeoutRef.current);
            
            // Create basic profile from session data
            const basicProfile: UserProfile = {
              id: session.user.id,
              email: session.user.email || 'user@example.com',
              full_name: session.user.user_metadata?.full_name || 
                        session.user.user_metadata?.name || 
                        session.user.email?.split('@')[0] || 
                        'User',
              created_at: session.user.created_at,
              questionnaire_complete: session.user.user_metadata?.questionnaire_complete || false,
              initial_setup_complete: session.user.user_metadata?.initial_setup_complete || false,
              property_setup_complete: session.user.user_metadata?.property_setup_complete || false,
            };
            
            setAuthState(prev => ({
              ...prev,
              isAuthenticated: true,
              userProfile: basicProfile,
              setupData: { 
                buyerEmail: basicProfile.email,
                buyerName: basicProfile.full_name,
              },
              isQuestionnaireComplete: basicProfile.questionnaire_complete || false,
              showQuestionnairePrompt: !(basicProfile.questionnaire_complete || false),
              isOfflineMode: false,
              isGuestMode: false,
              isLoading: false,
              authError: null,
            }));

            // Set up auth state change listener (simplified)
            authUnsubscribe = supabase.auth.onAuthStateChange((event, session) => {
              if (!mountedRef.current) return;
              
              if (event === 'SIGNED_OUT' || !session) {
                setAuthState(prev => ({
                  ...prev,
                  isAuthenticated: false,
                  userProfile: null,
                  setupData: null,
                  isOfflineMode: false,
                  isGuestMode: false,
                  isLoading: false,
                  authError: null,
                }));
              }
            }).data.subscription.unsubscribe;

          } else {
            // No session found
            console.log('📝 No active session found');
            clearTimeout(initTimeoutRef.current);
            setAuthState(prev => ({
              ...prev,
              isAuthenticated: false,
              isLoading: false,
              authError: null,
            }));
          }
        } catch (sessionError) {
          console.error('Session check failed:', sessionError);
          clearTimeout(initTimeoutRef.current);
          setAuthState(prev => ({
            ...prev,
            isAuthenticated: false,
            isLoading: false,
            authError: null, // Don't show error, just proceed to login
          }));
        }

      } catch (error) {
        console.error('Auth initialization failed:', error);
        clearTimeout(initTimeoutRef.current);
        if (mountedRef.current) {
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
            authError: null, // Don't show error, just proceed to login
          }));
        }
      }
    };

    initializeAuth();

    return () => {
      mountedRef.current = false;
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      if (authUnsubscribe) {
        authUnsubscribe();
      }
    };
  }, []);

  // Continue as guest (simplified)
  const continueAsGuest = useCallback((data?: SetupData) => {
    if (!mountedRef.current) return;
    
    try {
      console.log('🎭 Starting guest mode');
      
      const guestProfile: UserProfile = {
        id: 'guest-' + Date.now(),
        email: data?.buyerEmail || 'guest@handoff.demo',
        full_name: data?.buyerName || 'Guest User',
        created_at: new Date().toISOString(),
        is_guest: true,
        questionnaire_complete: false,
        initial_setup_complete: false,
        property_setup_complete: false,
      };
      
      const setupData = {
        buyerName: guestProfile.full_name,
        buyerEmail: guestProfile.email,
        ...data,
      };
      
      // Store in localStorage
      localStorage.setItem('handoff-user-profile', JSON.stringify(guestProfile));
      localStorage.setItem('handoff-setup-data', JSON.stringify(setupData));
      
      setAuthState({
        isAuthenticated: true,
        userProfile: guestProfile,
        setupData,
        isOfflineMode: true,
        isGuestMode: true,
        isLoading: false,
        authError: null,
        isQuestionnaireComplete: false,
        showQuestionnairePrompt: true,
      });
      
      console.log('✅ Guest mode activated');
    } catch (error) {
      console.error('Guest mode error:', error);
      if (mountedRef.current) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          authError: 'Failed to start guest mode. Please refresh the page.',
        }));
      }
    }
  }, []);

  // Handle authentication (email/password)
  const handleAuthComplete = useCallback(async (data: SetupData, isSignUp: boolean) => {
    if (!mountedRef.current) return;
    
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, authError: null }));
      
      if (isSignUp) {
        // Sign up
        const { data: authData, error } = await supabase.auth.signUp({
          email: data.buyerEmail,
          password: data.password || '',
          options: {
            data: {
              full_name: data.buyerName,
              buyer_name: data.buyerName,
            },
          },
        });
        
        if (error) throw error;
        
        if (authData.user) {
          console.log('✅ Sign up successful:', authData.user.email);
        }
      } else {
        // Sign in
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: data.buyerEmail,
          password: data.password || '',
        });
        
        if (error) throw error;
        
        if (authData.user) {
          console.log('✅ Sign in successful:', authData.user.email);
        }
      }
      
      // Auth state will be updated by the session change listener
    } catch (error: any) {
      console.error('Auth error:', error);
      if (mountedRef.current) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          authError: error.message || 'Authentication failed',
        }));
      }
    }
  }, []);

  // Handle Google sign-in
  const handleGoogleSignIn = useCallback(async () => {
    if (!mountedRef.current) return;
    
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, authError: null }));
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      
      if (error) throw error;
      
      console.log('🔍 Google sign-in initiated');
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      if (mountedRef.current) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          authError: error.message || 'Google sign-in failed',
        }));
      }
    }
  }, []);

  // Handle sign out
  const handleSignOut = useCallback(async () => {
    try {
      console.log('🔐 Signing out...');
      
      // Clear local state immediately
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        userProfile: null,
        setupData: null,
        authError: null,
        isOfflineMode: false,
        isGuestMode: false,
        isQuestionnaireComplete: false,
        showQuestionnairePrompt: false,
      });

      // Clear localStorage
      const keysToRemove = [
        'handoff-auth-session',
        'handoff-user-profile',
        'handoff-setup-data',
        'handoff-initial-setup-complete',
        'handoff-questionnaire-complete',
      ];
      
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          // Fail silently
        }
      });

      // Sign out from Supabase
      await supabase.auth.signOut();
      
      console.log('✅ Sign out completed');
      
      // Force page reload
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      
    } catch (error) {
      console.error('Sign out error:', error);
      window.location.href = '/';
    }
  }, []);

  const clearAuthError = useCallback(() => {
    if (!mountedRef.current) return;
    setAuthState(prev => ({ ...prev, authError: null }));
  }, []);

  const updateUserProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!authState.userProfile || !mountedRef.current) {
      throw new Error('No user profile to update');
    }

    try {
      if (!authState.isGuestMode) {
        // Update via Supabase
        const updatedProfile = await authHelpers.updateUserProfile(updates);
        if (updatedProfile && mountedRef.current) {
          setAuthState(prev => ({
            ...prev,
            userProfile: updatedProfile,
            setupData: prev.setupData ? {
              ...prev.setupData,
              buyerEmail: updatedProfile.email,
              buyerName: updatedProfile.full_name,
            } : prev.setupData,
          }));
          return updatedProfile;
        }
      } else {
        // Update localStorage for guest mode
        const updatedProfile = { 
          ...authState.userProfile, 
          ...updates, 
          updated_at: new Date().toISOString() 
        };
        
        localStorage.setItem('handoff-user-profile', JSON.stringify(updatedProfile));
        
        if (mountedRef.current) {
          setAuthState(prev => ({
            ...prev,
            userProfile: updatedProfile,
            setupData: prev.setupData ? {
              ...prev.setupData,
              buyerEmail: updatedProfile.email,
              buyerName: updatedProfile.full_name,
            } : prev.setupData,
          }));
        }
        
        return updatedProfile;
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }, [authState.userProfile, authState.isGuestMode]);

  const getAuthStatusMessage = useCallback(() => {
    if (authState.isGuestMode) {
      return 'Guest Mode - Data stored locally';
    } else if (authState.isOfflineMode) {
      return 'Offline Mode - Limited functionality';
    } else if (authState.userProfile) {
      return `Signed in as ${authState.userProfile.full_name}`;
    } else {
      return 'Not authenticated';
    }
  }, [authState.isGuestMode, authState.isOfflineMode, authState.userProfile]);

  return {
    // State
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    userProfile: authState.userProfile,
    setupData: authState.setupData,
    authError: authState.authError,
    isOfflineMode: authState.isOfflineMode,
    isGuestMode: authState.isGuestMode,
    isQuestionnaireComplete: authState.isQuestionnaireComplete,
    showQuestionnairePrompt: authState.showQuestionnairePrompt,
    
    // Methods
    handleAuthComplete,
    handleGoogleSignIn,
    continueAsGuest,
    handleSignOut,
    clearAuthError,
    updateUserProfile,
    getAuthStatusMessage,
  };
}
