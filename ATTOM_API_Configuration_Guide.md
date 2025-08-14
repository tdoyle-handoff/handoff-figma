# ATTOM API Configuration Tool

## Overview

The ATTOM API Configuration Tool is a comprehensive web-based interface for configuring, testing, and managing ATTOM Data API integrations. This tool provides a user-friendly way to manage API keys, test endpoints, configure parameters, and save configurations for reuse.

## Access Methods

### Direct URL Access

You can access the tool directly by adding URL parameters to your application:

1. **ATTOM API Configuration Tool**: `?attom-api-config=true`
   - Example: `https://your-app.com?attom-api-config=true`

2. **ATTOM Tools Access Page**: `?attom-tools=true`
   - Example: `https://your-app.com?attom-tools=true`
   - Provides a landing page with links to all ATTOM-related tools

### From the Application

1. Go to **Developer Tools** (`?dev=true`)
2. Click on **ATTOM API Configuration** from the demo pages
3. Or navigate to the **ATTOM API** tab in Developer Tools

## Features

### 1. API Key Configuration

- **Test API Keys**: Validate your ATTOM API key before using it
- **Key Management**: Securely configure and manage your API key
- **Status Indicators**: Visual feedback on key validity and functionality
- **Quick Fill**: Use provided sample keys for testing

### 2. Endpoint Testing

- **Multiple Endpoints**: Support for all major ATTOM API endpoints:
  - Basic Profile (`/property/basicprofile`)
  - Property Detail (`/property/detail`) 
  - Property Valuation (`/property/valuation`)
  - Expanded Profile (`/property/expandedprofile`)

- **Parameter Configuration**: 
  - Dynamic form generation based on endpoint requirements
  - Required/optional field validation
  - Sample data filling for quick testing

- **Real-time Testing**: 
  - Test API calls with live parameter configuration
  - View complete request/response data
  - Error handling and debugging information

### 3. Configuration Management

- **Save Configurations**: Save parameter sets with custom names
- **Load Configurations**: Quickly reload saved parameter combinations
- **Export/Import**: Backup and share configurations as JSON files
- **Configuration History**: Track and manage multiple saved setups

### 4. Advanced Features

- **Response Analysis**: Detailed response inspection with JSON formatting
- **URL Generation**: See the exact URLs being called
- **Header Inspection**: View request and response headers
- **Error Diagnostics**: Comprehensive error reporting and suggestions

## How to Use

### Step 1: Configure Your API Key

1. Go to the **API Key** tab
2. Enter your ATTOM API key (or use "Use Provided Key" for testing)
3. Click **Test Key** to validate the key
4. Ensure you see a green success message

### Step 2: Test an Endpoint

1. Switch to the **Endpoint Testing** tab
2. Select an endpoint from the dropdown (e.g., "Basic Profile")
3. Fill in the required parameters:
   - **Street Address**: e.g., "586 Franklin Ave"
   - **City, State**: e.g., "Brooklyn, NY"
4. Click **Fill Sample** to use sample data
5. Click **Test API Call** to execute the request

### Step 3: Save Your Configuration

1. After successful testing, enter a name in the "Configuration name" field
2. Click **Save** to store the configuration
3. Access saved configurations from the **Saved Configs** tab

### Step 4: Advanced Management

1. Use the **Advanced** tab to:
   - Export all configurations for backup
   - Import configurations from another setup
   - Clear all saved configurations (with confirmation)

## Endpoint Details

### Basic Profile
- **Purpose**: Get basic property information
- **Required Parameters**: Street address, City/State
- **Returns**: Property details, lot size, building information

### Property Detail  
- **Purpose**: Get detailed property information
- **Required Parameters**: Street address, City/State
- **Returns**: Rooms, features, property history

### Property Valuation
- **Purpose**: Get property valuation and market data
- **Required Parameters**: Street address, City/State  
- **Returns**: Property values, market analysis

### Expanded Profile
- **Purpose**: Get comprehensive property data
- **Required Parameters**: Street address, City/State
- **Returns**: All available property information

## Sample Addresses for Testing

Use these addresses to test the ATTOM API endpoints:

- **586 Franklin Ave, Brooklyn, NY**
- **1600 Pennsylvania Avenue, Washington, DC**
- **350 5th Ave, New York, NY**

## Troubleshooting

### Common Issues

1. **401 Authentication Error**
   - Ensure your API key is correctly entered
   - Test the key using the API Key tab
   - Check that the key is active and has proper permissions

2. **No Data Returned**
   - Verify the address format is correct
   - Try using the sample addresses provided
   - Check that the property exists in the ATTOM database

3. **Timeout Errors**
   - Check your internet connection
   - The ATTOM API servers may be experiencing high load
   - Try again after a few minutes

### Getting Help

If you encounter issues:

1. Check the response details in the test results
2. Review the URL being called for correctness
3. Verify all required parameters are filled
4. Use the sample data to ensure the endpoint is working

## Environment Configuration

For production use, ensure you configure the ATTOM API key in your environment:

1. Go to your Supabase project dashboard
2. Navigate to Settings → Edge Functions → Environment Variables
3. Add: `ATTOM_API_KEY` with your production key value
4. Redeploy your edge functions

## Security Notes

- Never expose API keys in client-side code
- Use environment variables for API key storage
- The configuration tool masks API keys for security
- Configurations are stored locally in your browser

## Integration with Main Application

The configuration tool is designed to work seamlessly with your main application's ATTOM API integration. Any configurations and API keys tested here can be used directly in your property management workflows.