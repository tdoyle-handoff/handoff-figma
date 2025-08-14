import React, { useRef, useEffect, useState } from 'react';
import { MapPin, Search, X, CheckCircle2, Edit3, AlertTriangle, Home } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { useAddressAutocomplete, AddressDetails, AddressSuggestion } from '../hooks/useAddressAutocomplete';
import { useIsMobile } from './ui/use-mobile';

// ATTOM-compatible address structure
export interface AttomAddressComponents {
  address1: string; // Street number and name (e.g., "123 Main Street")
  address2: string; // City, State ZIP (e.g., "New York, NY 10001")
  street_number?: string;
  street_name?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  formatted_address: string;
  is_valid: boolean;
  validation_errors: string[];
}

interface AddressInputEnhancedProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (address: AttomAddressComponents | null) => void;
  onInputChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  country?: string;
  types?: string[];
  className?: string;
  id?: string;
  autoFocus?: boolean;
  debugMode?: boolean;
  showBreakdown?: boolean; // Show the address component breakdown
  validateForAttom?: boolean; // Enable ATTOM-specific validation
}

export function AddressInputEnhanced({
  label = "Property Address",
  placeholder = "Start typing a property address...",
  value = "",
  onChange,
  onInputChange,
  error,
  disabled = false,
  required = false,
  country = "US",
  types = ["address"],
  className = "",
  id,
  autoFocus = false,
  debugMode = false,
  showBreakdown = true,
  validateForAttom = true
}: AddressInputEnhancedProps) {
  const isMobile = useIsMobile();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const [inputFocused, setInputFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSelecting, setIsSelecting] = useState(false);
  const [attomComponents, setAttomComponents] = useState<AttomAddressComponents | null>(null);

  const {
    query,
    setQuery,
    suggestions,
    isLoading,
    error: apiError,
    showSuggestions,
    setShowSuggestions,
    selectSuggestion,
    clearSuggestions,
    selectedAddress,
    fallbackMode,
    apiKeyValid
  } = useAddressAutocomplete({
    onAddressSelect: (addressDetails) => {
      if (addressDetails) {
        const components = parseAddressForAttom(addressDetails);
        setAttomComponents(components);
        onChange?.(components);
      } else {
        setAttomComponents(null);
        onChange?.(null);
      }
    },
    country,
    types,
    debugMode
  });

  // Parse Google Places address details into ATTOM-compatible format
  const parseAddressForAttom = (addressDetails: AddressDetails): AttomAddressComponents => {
    const components = addressDetails.address_components || [];
    const geometry = addressDetails.geometry;
    
    let street_number = '';
    let street_name = '';
    let city = '';
    let state = '';
    let zip_code = '';
    
    // Extract components from Google Places response
    components.forEach(component => {
      const types = component.types;
      
      if (types.includes('street_number')) {
        street_number = component.long_name;
      } else if (types.includes('route')) {
        street_name = component.long_name;
      } else if (types.includes('locality')) {
        city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        state = component.short_name; // Use short name for state (e.g., "NY" not "New York")
      } else if (types.includes('postal_code')) {
        zip_code = component.long_name;
      }
    });

    // Construct ATTOM-compatible address parts
    const address1 = `${street_number} ${street_name}`.trim();
    const address2 = `${city}, ${state} ${zip_code}`.trim();
    
    // Validate the address components
    const validation_errors: string[] = [];
    
    if (!street_number) validation_errors.push('Street number is missing');
    if (!street_name) validation_errors.push('Street name is missing');
    if (!city) validation_errors.push('City is missing');
    if (!state) validation_errors.push('State is missing');
    if (!zip_code) validation_errors.push('ZIP code is missing');
    
    // Additional ATTOM-specific validations
    if (validateForAttom) {
      if (state && state.length !== 2) {
        validation_errors.push('State must be 2-letter abbreviation');
      }
      if (zip_code && !/^\d{5}(-\d{4})?$/.test(zip_code)) {
        validation_errors.push('ZIP code must be 5 digits or ZIP+4 format');
      }
      if (address1.length < 3) {
        validation_errors.push('Street address too short');
      }
    }

    return {
      address1,
      address2,
      street_number,
      street_name,
      city,
      state,
      zip_code,
      formatted_address: addressDetails.formatted_address,
      is_valid: validation_errors.length === 0,
      validation_errors
    };
  };

  // Parse manual address input (fallback mode)
  const parseManualAddress = (inputValue: string): AttomAddressComponents => {
    const validation_errors: string[] = [];
    
    // Try to parse the manually entered address
    const normalized = inputValue.trim().replace(/\s+/g, ' ');
    
    // Strategy 1: Comma-separated format
    const parts = normalized.split(',').map(part => part.trim());
    
    let address1 = '';
    let address2 = '';
    let street_number = '';
    let street_name = '';
    let city = '';
    let state = '';
    let zip_code = '';
    
    if (parts.length >= 3) {
      // Format: "123 Main St, New York, NY 10001"
      address1 = parts[0];
      city = parts[1];
      
      // Parse state and ZIP from last part
      const stateZipMatch = parts[2].match(/^([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/);
      if (stateZipMatch) {
        state = stateZipMatch[1];
        zip_code = stateZipMatch[2];
      } else {
        validation_errors.push('Could not parse state and ZIP code from "' + parts[2] + '"');
      }
      
      // Parse street number and name from address1
      const streetMatch = address1.match(/^(\d+)\s+(.+)$/);
      if (streetMatch) {
        street_number = streetMatch[1];
        street_name = streetMatch[2];
      } else {
        validation_errors.push('Could not parse street number and name from "' + address1 + '"');
      }
      
      address2 = `${city}, ${state} ${zip_code}`.trim();
      
    } else if (parts.length === 2) {
      // Format: "123 Main St, New York NY 10001"
      address1 = parts[0];
      const cityStateZip = parts[1];
      
      // Try to parse city, state, and ZIP
      const cityStateZipMatch = cityStateZip.match(/^(.+?)\s+([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/);
      if (cityStateZipMatch) {
        city = cityStateZipMatch[1];
        state = cityStateZipMatch[2];
        zip_code = cityStateZipMatch[3];
        address2 = `${city}, ${state} ${zip_code}`;
      } else {
        validation_errors.push('Could not parse city, state, and ZIP from "' + cityStateZip + '"');
        address2 = cityStateZip;
      }
      
      // Parse street number and name
      const streetMatch = address1.match(/^(\d+)\s+(.+)$/);
      if (streetMatch) {
        street_number = streetMatch[1];
        street_name = streetMatch[2];
      } else {
        validation_errors.push('Could not parse street number and name from "' + address1 + '"');
      }
      
    } else {
      validation_errors.push('Address format not recognized');
      address1 = normalized;
      address2 = '';
    }

    // Additional validation
    if (!street_number) validation_errors.push('Street number is required');
    if (!street_name) validation_errors.push('Street name is required');
    if (!city) validation_errors.push('City is required');
    if (!state) validation_errors.push('State is required');
    if (!zip_code) validation_errors.push('ZIP code is required');
    
    if (validateForAttom) {
      if (state && state.length !== 2) {
        validation_errors.push('State must be 2-letter abbreviation');
      }
      if (zip_code && !/^\d{5}(-\d{4})?$/.test(zip_code)) {
        validation_errors.push('ZIP code must be 5 digits or ZIP+4 format');
      }
    }

    return {
      address1,
      address2,
      street_number,
      street_name,
      city,
      state,
      zip_code,
      formatted_address: normalized,
      is_valid: validation_errors.length === 0,
      validation_errors
    };
  };

  // Sync external value with internal query
  useEffect(() => {
    if (value !== query && !isSelecting) {
      setQuery(value);
      
      // If in fallback mode and we have a value, parse it
      if (fallbackMode && value.trim()) {
        const components = parseManualAddress(value);
        setAttomComponents(components);
        onChange?.(components);
      }
    }
  }, [value, query, setQuery, isSelecting, fallbackMode, onChange]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onInputChange?.(newValue);
    setSelectedIndex(-1);
    
    // If in fallback mode, parse the address as the user types
    if (fallbackMode && newValue.trim()) {
      const components = parseManualAddress(newValue);
      setAttomComponents(components);
      onChange?.(components);
    } else if (!newValue.trim()) {
      setAttomComponents(null);
      onChange?.(null);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    setInputFocused(true);
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Handle input blur
  const handleInputBlur = (e: React.FocusEvent) => {
    setInputFocused(false);
    
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && suggestionsRef.current?.contains(relatedTarget)) {
      return;
    }
    
    setTimeout(() => {
      if (!isSelecting) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = async (suggestion: AddressSuggestion, index: number) => {
    if (isSelecting) return;
    
    setIsSelecting(true);
    setSelectedIndex(index);
    setShowSuggestions(false);
    
    try {
      await selectSuggestion(suggestion);
    } catch (error) {
      console.error('Error selecting address:', error);
    } finally {
      setIsSelecting(false);
      setSelectedIndex(-1);
    }
  };

  // Handle clear button
  const handleClear = () => {
    setQuery('');
    onInputChange?.('');
    onChange?.(null);
    setAttomComponents(null);
    clearSuggestions();
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Escape') {
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedIndex], selectedIndex);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Auto-focus if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const displayError = error || (debugMode && apiError);
  const showClearButton = query.length > 0 && !disabled;
  const hasValidAddress = attomComponents?.is_valid || false;
  const hasValidationErrors = attomComponents && attomComponents.validation_errors.length > 0;

  return (
    <div ref={containerRef} className={`relative w-full space-y-3 ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <Label 
            htmlFor={id}
            className={`flex items-center gap-2 ${required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}`}
          >
            <Home className="w-4 h-4" />
            {label}
          </Label>
          {fallbackMode && (
            <Badge variant="secondary" className="text-xs">
              <Edit3 className="w-3 h-3 mr-1" />
              Manual Entry
            </Badge>
          )}
        </div>
      )}

      <div className="relative">
        {/* Search icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
          {hasValidAddress ? (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          ) : hasValidationErrors ? (
            <AlertTriangle className="w-4 h-4 text-orange-500" />
          ) : fallbackMode ? (
            <Edit3 className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Search className="w-4 h-4 text-muted-foreground" />
          )}
        </div>

        {/* Input field */}
        <Input
          ref={inputRef}
          id={id}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={fallbackMode ? "Enter address manually" : placeholder}
          disabled={disabled}
          className={`
            pl-10 ${showClearButton ? 'pr-10' : 'pr-4'}
            ${isMobile ? 'mobile-input' : ''}
            ${displayError || hasValidationErrors ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${hasValidAddress ? 'border-green-500 bg-green-50' : ''}
            transition-colors duration-200
          `}
          autoComplete="off"
          role="combobox"
          aria-expanded={showSuggestions}
          aria-haspopup="listbox"
          aria-describedby={displayError ? `${id}-error` : undefined}
          aria-activedescendant={selectedIndex >= 0 ? `${id}-option-${selectedIndex}` : undefined}
        />

        {/* Clear button */}
        {showClearButton && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 hover:bg-gray-100 z-10"
            tabIndex={-1}
          >
            <X className="w-3 h-3" />
          </Button>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>



      {/* Error messages */}
      {(error || (debugMode && apiError)) && (
        <p id={`${id}-error`} className="text-sm text-red-600">
          {error || apiError}
        </p>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50"
          role="listbox"
          aria-label="Address suggestions"
        >

          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.place_id}
              id={`${id}-option-${index}`}
              className={`
                w-full px-4 py-3 text-left cursor-pointer border-b border-gray-100 last:border-b-0
                transition-all duration-150
                ${index === selectedIndex ? 'bg-blue-50 border-blue-200 shadow-sm' : 'hover:bg-gray-50'}
                ${isMobile ? 'mobile-button touch-target' : ''}
              `}
              onClick={() => handleSuggestionSelect(suggestion, index)}
              onMouseEnter={() => setSelectedIndex(index)}
              role="option"
              aria-selected={index === selectedIndex}
              tabIndex={-1}
            >
              <div className="flex items-start gap-3">
                <MapPin className={`w-4 h-4 mt-0.5 flex-shrink-0 ${index === selectedIndex ? 'text-blue-500' : 'text-muted-foreground'}`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate ${index === selectedIndex ? 'text-blue-900' : 'text-gray-900'}`}>
                    {suggestion.structured_formatting.main_text}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {suggestion.structured_formatting.secondary_text}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && !isLoading && query.length >= 3 && suggestions.length === 0 && (!apiError || debugMode) && !fallbackMode && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="px-4 py-6 text-center">
            <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <div className="text-sm text-gray-600 mb-1">No addresses found</div>

          </div>
        </div>
      )}


    </div>
  );
}

// Helper component for displaying ATTOM-formatted address
export function AttomFormattedAddress({ address }: { address: AttomAddressComponents }) {
  return (
    <div className="space-y-2">
      <div className="font-medium">{address.formatted_address}</div>
      <div className="text-sm text-muted-foreground space-y-1">
        <div><strong>Line 1:</strong> {address.address1}</div>
        <div><strong>Line 2:</strong> {address.address2}</div>
        {address.is_valid ? (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            ATTOM Compatible
          </Badge>
        ) : (
          <Badge variant="destructive">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Validation Issues
          </Badge>
        )}
      </div>
    </div>
  );
}