# Supabase Edge Functions Deployment Guide

This guide will help you deploy your Handoff platform's Edge Functions to make the authentication server available.

## Prerequisites

1. **Supabase Account**: Create an account at [supabase.com](https://supabase.com)
2. **Supabase CLI**: Install the Supabase CLI
3. **Node.js**: Make sure you have Node.js installed

## Step 1: Install Supabase CLI

### On macOS (using Homebrew):
```bash
brew install supabase/tap/supabase
```

### On Windows (using Chocolatey):
```bash
choco install supabase
```

### On Linux or alternative installation:
```bash
npm install -g supabase
```

### Verify installation:
```bash
supabase --version
```

## Step 2: Create or Link Supabase Project

### Option A: Create a New Project
1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - **Name**: "Handoff Real Estate Platform" (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
6. Click "Create new project"
7. Wait for project to be created (takes 2-3 minutes)

### Option B: Use Existing Project
If you already have a Supabase project, note down your project reference ID from the project settings.

## Step 3: Get Project Credentials

Once your project is ready:

1. Go to **Project Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **Project Reference ID** (short alphanumeric string)
   - **anon public key** (starts with `eyJ`)
   - **service_role key** (starts with `eyJ`)

## Step 4: Login to Supabase CLI

```bash
supabase login
```

This will open your browser for authentication.

## Step 5: Link Your Local Project

In your project directory, run:

```bash
supabase link --project-ref YOUR_PROJECT_REFERENCE_ID
```

Replace `YOUR_PROJECT_REFERENCE_ID` with the actual reference ID from Step 3.

If you don't have the reference ID handy:
```bash
supabase projects list
```

## Step 6: Set Up Environment Variables

Create a `.env` file in your project root with:

```env
# Supabase Configuration
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# API Keys (optional but recommended)
GOOGLE_PLACES_API_KEY=your_google_places_api_key
ATTOM_API_KEY=your_attom_api_key

# Google OAuth (if using Google Sign-In)
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=your_google_client_id
SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=your_google_client_secret
```

## Step 7: Set Environment Variables in Supabase

You need to set these environment variables in your Supabase project:

```bash
# Set required Supabase variables
supabase secrets set SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
supabase secrets set SUPABASE_ANON_KEY=your_anon_key_here
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Set optional API keys
supabase secrets set GOOGLE_PLACES_API_KEY=your_google_places_api_key
supabase secrets set ATTOM_API_KEY=your_attom_api_key

# Set Google OAuth keys (if using)
supabase secrets set SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=your_google_client_id
supabase secrets set SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=your_google_client_secret
```

## Step 8: Deploy Edge Functions

Deploy your server function:

```bash
supabase functions deploy server
```

This command will:
- Upload your Edge Function code
- Set up the endpoints
- Make your server available at `https://YOUR_PROJECT_ID.supabase.co/functions/v1/server`

## Step 9: Verify Deployment

Test your deployment by visiting:

```
https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-a24396d5/health
```

You should see a JSON response like:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-01-28T...",
  "server": "handoff-make-server",
  "version": "1.0.0"
}
```

## Step 10: Update Your Local Environment

Update your local `.env` file or `utils/supabase/info.tsx` with your actual project credentials:

```typescript
export const projectId = 'your-actual-project-id';
export const publicAnonKey = 'your-actual-anon-key';
```

## Step 11: Test Authentication

1. Start your local development server
2. Try signing up or signing in
3. The app should now connect to your deployed Edge Functions instead of showing "Server not available"

## Troubleshooting

### Common Issues:

1. **"Failed to deploy"**:
   - Check that you're logged in: `supabase auth status`
   - Verify project linking: `supabase status`
   - Check function code for syntax errors

2. **"Environment variables not set"**:
   - List current secrets: `supabase secrets list`
   - Re-set missing variables using `supabase secrets set`

3. **"404 Not Found" when testing endpoints**:
   - Verify the function name matches: `supabase functions list`
   - Check the URL format
   - Ensure deployment was successful

4. **CORS errors in browser**:
   - The CORS configuration is already set in the code
   - Try clearing browser cache
   - Check browser console for detailed error messages

### Useful Commands:

```bash
# Check deployment status
supabase functions list

# View function logs
supabase functions logs server

# Re-deploy after changes
supabase functions deploy server

# Check current secrets
supabase secrets list

# View project status
supabase status
```

## Next Steps

Once deployed:

1. **Test all features**: Try authentication, property search, ATTOM API calls
2. **Set up monitoring**: Check the Supabase dashboard for function usage
3. **Configure Google OAuth**: If using Google Sign-In, complete the OAuth setup
4. **Add custom domain** (optional): Set up a custom domain for your Edge Functions

## Security Notes

- Never commit `.env` files to version control
- Use environment variables for all sensitive data
- Regularly rotate your API keys
- Monitor function usage in the Supabase dashboard

---

**Need Help?**

- Supabase Documentation: [https://supabase.com/docs](https://supabase.com/docs)
- Edge Functions Guide: [https://supabase.com/docs/guides/functions](https://supabase.com/docs/guides/functions)
- Community Support: [https://github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)