import { useState, useCallback, useRef, useEffect } from 'react';
import { projectId, SUPABASE_ANON_KEY } from '../utils/supabase/info';

export interface AddressSuggestion {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types: string[];
}

export interface AddressDetails {
  formatted_address: string;
  street_number?: string;
  route?: string;
  locality?: string;
  administrative_area_level_1?: string;
  administrative_area_level_2?: string;
  postal_code?: string;
  country?: string;
  place_id: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface UseAddressAutocompleteProps {
  onAddressSelect?: (address: AddressDetails) => void;
  debounceMs?: number;
  country?: string;
  types?: string[];
  debugMode?: boolean; // Show API errors and detailed feedback
}

interface UseAddressAutocompleteReturn {
  query: string;
  setQuery: (query: string) => void;
  suggestions: AddressSuggestion[];
  isLoading: boolean;
  error: string | null;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  selectSuggestion: (suggestion: AddressSuggestion) => Promise<void>;
  clearSuggestions: () => void;
  selectedAddress: AddressDetails | null;
  fallbackMode: boolean;
  apiKeyValid: boolean | null;
}

export function useAddressAutocomplete({
  onAddressSelect,
  debounceMs = 300,
  country = 'US',
  types = ['address'],
  debugMode = false
}: UseAddressAutocompleteProps = {}): UseAddressAutocompleteReturn {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressDetails | null>(null);
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null);
  const [fallbackMode] = useState(false);
  
  const debounceRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  // Get server API endpoints
  const getServerUrl = useCallback(() => {
    try {
      return {
        baseUrl: `https://${projectId}.supabase.co/functions/v1/make-server-a24396d5`,
        headers: {
'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      };
    } catch (error) {
      console.error('Failed to get Supabase info:', error);
      return null;
    }
  }, []);

  // Helper function to safely extract error message
  const getErrorMessage = useCallback((errorData: any): string => {
    if (typeof errorData === 'string') {
      return errorData;
    }
    if (errorData && typeof errorData === 'object') {
      if (typeof errorData.error === 'string') {
        return errorData.error;
      }
      if (typeof errorData.message === 'string') {
        return errorData.message;
      }
      if (errorData.error && typeof errorData.error.message === 'string') {
        return errorData.error.message;
      }
    }
    return 'Unknown error occurred';
  }, []);

  // Helper function to check if error is API key related
  const isApiKeyError = useCallback((errorMessage: string): boolean => {
    const apiKeyErrorIndicators = [
      'invalid',
      'denied',
      'api key',
      'key is not',
      'key appears to be',
      'REQUEST_DENIED',
      'INVALID_REQUEST'
    ];
    
    const lowerMessage = errorMessage.toLowerCase();
    return apiKeyErrorIndicators.some(indicator => lowerMessage.includes(indicator));
  }, []);

  // Check if API key is valid
  const checkApiKeyValidity = useCallback(async () => {
    const serverConfig = getServerUrl();
    if (!serverConfig) {
      console.log('useAddressAutocomplete: No server configuration, Google Places required');
      setApiKeyValid(false);
      return;
    }

    try {
      const response = await fetch(
        `${serverConfig.baseUrl}/places/validate-key`,
        {
          headers: serverConfig.headers,
          // Add timeout to prevent hanging
          signal: AbortSignal.timeout ? AbortSignal.timeout(5000) : undefined
        }
      );

      if (response.ok) {
        const validation = await response.json();
        setApiKeyValid(validation.valid);
        
        if (!validation.valid) {
          console.log('useAddressAutocomplete: API key validation failed:', validation.message);
          if (debugMode) {
            setError(`Google Places API: ${validation.message || 'API key not configured'}. Manual address entry is available.`);
          }
        } else {
          console.log('useAddressAutocomplete: API key is valid');
        }
      } else {
        console.log('useAddressAutocomplete: API key validation request failed:', response.status);
        setApiKeyValid(false);
        if (debugMode) {
          setError('Unable to verify Google Places API configuration. Manual address entry is available.');
        }
      }
    } catch (error) {
      console.warn('useAddressAutocomplete: API key validation failed:', error);
      setApiKeyValid(false);
      if (debugMode) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        if (errorMessage.includes('timeout') || errorMessage.includes('AbortError')) {
          setError('Google Places API validation timed out. Manual address entry is available.');
        } else {
          setError('Google Places API not available. Manual address entry is available.');
        }
      }
    }
  }, [getServerUrl, debugMode]);

  // Fetch address suggestions
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    console.log('useAddressAutocomplete: fetchSuggestions called with:', searchQuery);
    
    // If in fallback mode, don't make API calls
    if (apiKeyValid === false) {
      console.log('useAddressAutocomplete: API key invalid; cannot fetch suggestions');
      setSuggestions([]);
      return;
    }

    // Check API key validity on first use
    if (apiKeyValid === null) {
      await checkApiKeyValidity();
      return; // Let the effect re-trigger this function
    }
    
    const serverConfig = getServerUrl();
    if (!serverConfig) {
      console.error('useAddressAutocomplete: Server configuration not available');
      if (debugMode) {
        setError('Google Places API configuration not available.');
      }
      setApiKeyValid(false);
      return;
    }

    if (!searchQuery.trim() || searchQuery.length < 3) {
      console.log('useAddressAutocomplete: Query too short, clearing suggestions');
      setSuggestions([]);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        input: searchQuery,
        country: country,
        types: types.join('|')
      });

      const url = `${serverConfig.baseUrl}/places/autocomplete?${params}`;
      console.log('useAddressAutocomplete: Making request to:', url);

      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
        headers: serverConfig.headers,
      });

      console.log('useAddressAutocomplete: Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('useAddressAutocomplete: API error:', errorData);
        
        const errorMessage = getErrorMessage(errorData);
        
        // Check for API key errors or service unavailable
        if (response.status === 403 || response.status === 503 || 
            errorData.api_key_error || isApiKeyError(errorMessage)) {
          console.log('useAddressAutocomplete: API key issue detected, switching to fallback mode');
          setApiKeyValid(false);
          if (debugMode) {
            setError('Google Places API is not properly configured.');
          }
          setSuggestions([]);
          return;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('useAddressAutocomplete: Response data:', data);
      
      const predictions = data.predictions || [];
      console.log('useAddressAutocomplete: Setting suggestions:', predictions.length, 'items');
      setSuggestions(predictions);
      
      // Mark API key as valid if we get here
      if (apiKeyValid !== true) {
        setApiKeyValid(true);
        setFallbackMode(false);
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          console.log('useAddressAutocomplete: Request was cancelled');
          return; // Request was cancelled, don't update state
        }
        console.error('useAddressAutocomplete: Error:', err);
        
        // Check if this is an API key related error
        if (isApiKeyError(err.message)) {
          setApiKeyValid(false);
          if (debugMode) {
            setError('Google Places API configuration issue.');
          }
        } else {
          if (debugMode) {
            setError(err.message);
          }
        }
      } else {
        console.error('useAddressAutocomplete: Unexpected error:', err);
        if (debugMode) {
          setError('An unexpected error occurred. Manual address entry is available.');
        }
      }
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [getServerUrl, country, types, fallbackMode, apiKeyValid, checkApiKeyValidity, debugMode, getErrorMessage, isApiKeyError]);

  // Fetch detailed address information
  const fetchAddressDetails = useCallback(async (placeId: string): Promise<AddressDetails | null> => {
    const serverConfig = getServerUrl();
    if (!serverConfig) {
      if (debugMode) {
        setError('Server configuration not available');
      }
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        place_id: placeId
      });

      const response = await fetch(
        `${serverConfig.baseUrl}/places/details?${params}`,
        {
          headers: serverConfig.headers,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        const errorMessage = getErrorMessage(errorData);
        
        // Check for API key errors
        if (response.status === 403 || response.status === 503 || 
            errorData.api_key_error || isApiKeyError(errorMessage)) {
          console.log('useAddressAutocomplete: API key issue during details fetch');
          setApiKeyValid(false);
          setFallbackMode(true);
          if (debugMode) {
            setError('Google Places API is not properly configured.');
          }
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.result) {
        const result = data.result;
        
        // Parse address components
        const addressDetails: AddressDetails = {
          formatted_address: result.formatted_address,
          place_id: placeId,
          geometry: result.geometry
        };

        // Extract address components
        if (result.address_components) {
          result.address_components.forEach((component: any) => {
            const types = component.types;
            
            if (types.includes('street_number')) {
              addressDetails.street_number = component.long_name;
            } else if (types.includes('route')) {
              addressDetails.route = component.long_name;
            } else if (types.includes('locality')) {
              addressDetails.locality = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              addressDetails.administrative_area_level_1 = component.short_name;
            } else if (types.includes('administrative_area_level_2')) {
              addressDetails.administrative_area_level_2 = component.long_name;
            } else if (types.includes('postal_code')) {
              addressDetails.postal_code = component.long_name;
            } else if (types.includes('country')) {
              addressDetails.country = component.short_name;
            }
          });
        }

        return addressDetails;
      } else {
        throw new Error('No address details found');
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error('Address details error:', err);
        if (debugMode) {
          setError(err.message);
        }
      } else {
        console.error('Address details unexpected error:', err);
        if (debugMode) {
          setError('An unexpected error occurred');
        }
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getServerUrl, debugMode, getErrorMessage]);

  // Select a suggestion and fetch details
  const selectSuggestion = useCallback(async (suggestion: AddressSuggestion) => {
    setQuery(suggestion.description);
    setSuggestions([]);
    setShowSuggestions(false);

    const addressDetails = await fetchAddressDetails(suggestion.place_id);
    if (addressDetails) {
      setSelectedAddress(addressDetails);
      onAddressSelect?.(addressDetails);
    }
  }, [fetchAddressDetails, onAddressSelect]);

  // Clear suggestions
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setShowSuggestions(false);
    setError(null);
  }, []);

  // Handle query changes with debouncing
  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setSelectedAddress(null);

    setShowSuggestions(true);

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(newQuery);
    }, debounceMs);
  }, [fetchSuggestions, debounceMs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    query,
    setQuery: handleQueryChange,
    suggestions,
    isLoading,
    error,
    showSuggestions,
    setShowSuggestions,
    selectSuggestion,
    clearSuggestions,
    selectedAddress,
    fallbackMode: false,
    apiKeyValid
  };
}