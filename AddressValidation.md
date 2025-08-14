# Address Validation System

This document describes the address validation and autocomplete system implemented in the Handoff real estate platform.

## Overview

The address validation system provides real-time address autocomplete and validation using Google Places API. It includes two main components:

1. **AddressInput** - A simple input component with autocomplete suggestions
2. **AddressForm** - A complete form with autocomplete, manual entry, and validation

## Components

### AddressInput

A lightweight input component that provides real-time address suggestions as the user types.

```tsx
import { AddressInput } from './components/AddressInput';

<AddressInput
  label="Property Address"
  placeholder="Start typing an address..."
  value={address}
  onChange={(addressDetails) => {
    console.log('Selected address:', addressDetails);
  }}
  onInputChange={(value) => {
    console.log('Input value:', value);
  }}
  required={true}
  country="US"
/>
```

**Props:**
- `label?: string` - Input label text
- `placeholder?: string` - Placeholder text
- `value?: string` - Controlled input value
- `onChange?: (address: AddressDetails | null) => void` - Called when address is selected
- `onInputChange?: (value: string) => void` - Called when input value changes
- `error?: string` - Error message to display
- `disabled?: boolean` - Disable the input
- `required?: boolean` - Mark as required field
- `country?: string` - Country code for filtering (default: "US")
- `types?: string[]` - Address types to filter (default: ["address"])
- `className?: string` - Additional CSS classes
- `autoFocus?: boolean` - Auto-focus on mount

### AddressForm

A complete address management component with autocomplete, manual entry, and validation.

```tsx
import { AddressForm } from './components/AddressForm';

<AddressForm
  title="Property Address"
  description="Enter the complete address of the property"
  value={formattedAddress}
  onChange={(address) => {
    console.log('Address updated:', address);
  }}
  allowManualEdit={true}
  required={true}
/>
```

**Props:**
- `title?: string` - Form title
- `description?: string` - Form description
- `value?: FormattedAddress | null` - Current address value
- `onChange?: (address: FormattedAddress | null) => void` - Called when address changes
- `onValidate?: (address: FormattedAddress) => boolean` - Custom validation function
- `allowManualEdit?: boolean` - Allow manual address entry (default: true)
- `required?: boolean` - Mark as required
- `disabled?: boolean` - Disable the form
- `country?: string` - Country code for filtering (default: "US")
- `autoFocus?: boolean` - Auto-focus on mount

### useAddressAutocomplete Hook

A custom hook that manages address autocomplete functionality.

```tsx
import { useAddressAutocomplete } from './hooks/useAddressAutocomplete';

const {
  query,
  setQuery,
  suggestions,
  isLoading,
  error,
  showSuggestions,
  selectSuggestion,
  selectedAddress
} = useAddressAutocomplete({
  onAddressSelect: (address) => {
    console.log('Address selected:', address);
  },
  country: 'US',
  types: ['address']
});
```

## API Setup

### Google Places API Key

The address validation system requires a Google Places API key. Set one of these environment variables:

- `GOOGLE_PLACES_API_KEY`
- `REACT_APP_GOOGLE_PLACES_API_KEY` 
- `VITE_GOOGLE_PLACES_API_KEY`

### Getting an API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Places API" service
4. Create credentials (API key)
5. Restrict the API key to your domain for security
6. Set the environment variable in your project

### API Key Restrictions (Recommended)

For security, restrict your API key to:
- **Application restrictions**: HTTP referrers (websites)
- **Website restrictions**: Add your domain(s)
- **API restrictions**: Only enable "Places API"

## Data Types

### AddressDetails

Raw address data returned from Google Places API:

```typescript
interface AddressDetails {
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
```

### FormattedAddress

Structured address data for application use:

```typescript
interface FormattedAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  formatted: string;
  placeId?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}
```

### AddressSuggestion

Autocomplete suggestion item:

```typescript
interface AddressSuggestion {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types: string[];
}
```

## Features

### Core Features
- Real-time address autocomplete
- Google Places API integration
- Debounced API calls for performance
- Mobile-responsive design
- Keyboard navigation support
- Loading and error states
- Clear button functionality
- Accessibility features

### Advanced Features
- Manual address entry fallback
- Address validation
- Formatted address display
- Edit/save functionality
- Structured data output
- Coordinate extraction
- Country-specific formatting
- Custom validation support

### Error Handling
- Network error handling
- API error messages
- Graceful degradation without API key
- User-friendly error messages
- Retry mechanisms

## Accessibility

The components follow accessibility best practices:
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- High contrast support
- Touch-friendly mobile interface

## Mobile Responsiveness

The components are optimized for mobile devices:
- Touch-friendly tap targets
- Proper font sizes (16px+ to prevent zoom)
- Mobile-specific styling
- Responsive layouts
- Smooth scrolling
- iOS-specific optimizations

## Integration Examples

### Property Setup Screening

The address validation is integrated into the property setup screening process:

```tsx
// In PropertySetupScreening.tsx
{screeningData.hasSpecificProperty && (
  <AddressInput
    label="Property Address (Optional)"
    placeholder="Start typing the property address..."
    value={screeningData.propertyAddress || ''}
    onInputChange={(value) => updateScreeningData({ propertyAddress: value })}
    onChange={(addressDetails) => {
      if (addressDetails) {
        updateScreeningData({ propertyAddress: addressDetails.formatted_address });
      }
    }}
  />
)}
```

### Property Details Form

```tsx
// Example integration in property forms
<AddressForm
  title="Property Address"
  description="Enter the complete address of the property"
  value={propertyAddress}
  onChange={setPropertyAddress}
  onValidate={(address) => {
    // Custom validation logic
    return address.street.length > 0 && address.city.length > 0;
  }}
  required={true}
/>
```

## Performance Considerations

- Debounced API calls (300ms default)
- Request cancellation for fast typing
- Minimal re-renders
- Efficient suggestion filtering
- Lazy loading of components
- Optimized bundle size

## Testing

The components include comprehensive error handling and fallback mechanisms:

1. **Without API Key**: Shows configuration message and allows manual entry
2. **Network Errors**: Displays user-friendly error messages
3. **Invalid Responses**: Handles API errors gracefully
4. **No Results**: Shows appropriate "no results" message
5. **Manual Entry**: Always available as backup option

## Security

- API key should be restricted to your domain
- Client-side API calls are rate-limited by Google
- No sensitive data is stored locally
- HTTPS required for production use
- Input sanitization for XSS prevention

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers
- Graceful degradation without JavaScript