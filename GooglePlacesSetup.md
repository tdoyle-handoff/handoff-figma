# Google Places API Setup Guide for Handoff

## Step 1: Get Your Google Places API Key

### 1.1 Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click "Create Project" or select an existing project
4. Give your project a name (e.g., "Handoff Real Estate App")

### 1.2 Enable the Places API
1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Places API"
3. Click on "Places API" and click "Enable"
4. Also enable "Places API (New)" if available for better features

### 1.3 Create API Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key (it will look like: `AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
4. Click "Restrict Key" to configure security settings

### 1.4 Configure API Key Restrictions (Recommended)
1. **Application restrictions**: Choose "HTTP referrers (web sites)"
2. **Website restrictions**: Add your domains:
   - `localhost:*` (for development)
   - `127.0.0.1:*` (for development)
   - `*.supabase.co` (for your Supabase backend)
   - Your production domain if you have one

3. **API restrictions**: Select "Restrict key" and choose:
   - Places API
   - Places API (New) if enabled

4. Click "Save"

## Step 2: Configure the API Key in Your Environment

### 2.1 Set the Environment Variable
In your Figma Make project, you need to set the environment variable through the Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to "Settings" > "Edge Functions"
3. In the "Environment Variables" section, add:
   ```
   GOOGLE_PLACES_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   (Replace with your actual API key)

### 2.2 Alternative: Use the Secret Management Tool
Since your app includes the `create_supabase_secret` tool, you should have already used it to set the key. If not, the system will prompt you to add it when you test the API.

## Step 3: Test Your Configuration

### 3.1 Use the Built-in Debug Tool
Your Handoff app includes a comprehensive debug tool. Access it by:

1. Add `?address-debug=true` to your app URL
   - Example: `https://your-app-url.com/?address-debug=true`
2. This will open the Google Places API Debug Tool

### 3.2 What the Debug Tool Tests
The debug tool will automatically test:
- ✅ Server connection health
- ✅ API key format validation
- ✅ Google Places API connectivity
- ✅ Address autocomplete functionality
- ✅ Address details lookup
- ✅ Fallback mode functionality

### 3.3 Testing Results
- **Green checkmarks**: Everything is working correctly
- **Red X marks**: Issues that need to be resolved
- **Detailed error messages**: Specific guidance on what to fix

## Step 4: Common Issues and Solutions

### Issue 1: "The provided API key is invalid"
**Causes:**
- Wrong API key copied
- API key not properly saved in environment variables
- API key has incorrect restrictions

**Solutions:**
1. Double-check the API key in Google Cloud Console
2. Verify the environment variable is set correctly
3. Check API key restrictions aren't too restrictive
4. Wait 5-10 minutes after creating the key (propagation delay)

### Issue 2: "REQUEST_DENIED" errors
**Causes:**
- Places API not enabled in Google Cloud Console
- API key restrictions too strict
- Billing not enabled (Google requires billing for Places API)

**Solutions:**
1. Enable Places API in Google Cloud Console
2. Set up billing account in Google Cloud Console
3. Adjust API key restrictions
4. Ensure your domain is in the allowed referrers list

### Issue 3: "OVER_QUERY_LIMIT" errors
**Causes:**
- Exceeded free tier limits
- No billing account set up

**Solutions:**
1. Set up billing in Google Cloud Console
2. Monitor usage in the APIs dashboard
3. Consider implementing request caching

### Issue 4: API key format errors
**Causes:**
- API key doesn't start with "AIza"
- API key is too short/long
- Extra spaces or characters

**Solutions:**
1. API keys should start with "AIza"
2. Should be at least 30 characters long
3. Remove any extra spaces or characters

## Step 5: Billing Information

### Free Tier
- Google provides $200 free credit monthly
- Places API calls are charged after free credit is used
- Autocomplete: ~$2.83 per 1,000 requests
- Place Details: ~$17 per 1,000 requests

### Cost Management
1. Set up billing alerts in Google Cloud Console
2. Monitor usage regularly
3. Implement request caching if needed
4. Use the fallback mode for non-critical scenarios

## Step 6: Fallback Mode

Your Handoff app includes an intelligent fallback system:

### Automatic Fallback
- If the API key is invalid or missing, the app automatically switches to manual address entry
- Users can still enter addresses manually
- No functionality is lost, just fewer convenience features

### Manual Fallback
- Users can still complete all tasks without the Places API
- Address validation works with basic parsing
- Full transaction management remains functional

## Step 7: Production Considerations

### Security
1. **Never expose API keys in frontend code** - Your app correctly uses server-side requests
2. **Use domain restrictions** - Limit API key usage to your domains
3. **Monitor usage** - Set up alerts for unusual activity

### Performance
1. **Request debouncing** - Your app includes 300ms debounce for autocomplete
2. **Caching** - Consider implementing caching for frequently requested places
3. **Error handling** - Your app gracefully handles all API failures

## Step 8: Testing Checklist

Use this checklist to verify your setup:

- [ ] Google Cloud project created
- [ ] Places API enabled
- [ ] Billing account set up (required)
- [ ] API key created and copied
- [ ] API key restrictions configured
- [ ] Environment variable `GOOGLE_PLACES_API_KEY` set in Supabase
- [ ] Debug tool shows all green checkmarks (`?address-debug=true`)
- [ ] Address autocomplete works in the property setup flow
- [ ] Address details are fetched correctly
- [ ] Fallback mode works when API is disabled

## Support

If you continue to have issues:

1. **Check the debug tool** - Visit `?address-debug=true` for detailed diagnostics
2. **Review server logs** - Check your Supabase Edge Function logs
3. **Verify billing** - Ensure your Google Cloud billing is active
4. **Test API key directly** - Use Google's API explorer to test your key
5. **Check quotas** - Monitor your API usage in Google Cloud Console

The Handoff application is designed to work seamlessly with or without the Google Places API, ensuring your real estate transaction management continues uninterrupted.