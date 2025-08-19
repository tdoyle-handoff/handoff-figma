import { projectUrl, publicAnonKey } from './supabase/info';
import { AUTH_TIMEOUTS } from './authConstants';

// Helper function to safely parse JSON responses
export async function safeParseJson(response: Response): Promise<any> {
  let responseText = '';
  
  try {
    responseText = await response.text();
    console.log('Raw response text (first 300 chars):', responseText.substring(0, 300));
    
    if (!responseText.trim()) {
      console.warn('Empty response received, returning empty object');
      return {};
    }
    
    // Clean the response text by removing any non-JSON content
    const trimmedText = responseText.trim();
    
    // Find JSON content boundaries
    let jsonText = trimmedText;
    let jsonStart = -1;
    let jsonEnd = -1;
    
    // Look for object start
    const objectStart = trimmedText.indexOf('{');
    const arrayStart = trimmedText.indexOf('[');
    
    if (objectStart >= 0 && (arrayStart < 0 || objectStart < arrayStart)) {
      jsonStart = objectStart;
      // Find matching closing brace
      let braceCount = 0;
      for (let i = objectStart; i < trimmedText.length; i++) {
        if (trimmedText[i] === '{') braceCount++;
        if (trimmedText[i] === '}') braceCount--;
        if (braceCount === 0) {
          jsonEnd = i;
          break;
        }
      }
    } else if (arrayStart >= 0) {
      jsonStart = arrayStart;
      // Find matching closing bracket
      let bracketCount = 0;
      for (let i = arrayStart; i < trimmedText.length; i++) {
        if (trimmedText[i] === '[') bracketCount++;
        if (trimmedText[i] === ']') bracketCount--;
        if (bracketCount === 0) {
          jsonEnd = i;
          break;
        }
      }
    }
    
    if (jsonStart >= 0 && jsonEnd >= 0) {
      jsonText = trimmedText.substring(jsonStart, jsonEnd + 1);
      if (jsonStart > 0) {
        console.warn(`Extracted JSON from position ${jsonStart} to ${jsonEnd}, discarded prefix:`, trimmedText.substring(0, jsonStart));
      }
    } else if (!trimmedText.startsWith('{') && !trimmedText.startsWith('[')) {
      console.error('No valid JSON found in response:', trimmedText.substring(0, 100));
      throw new Error(`Server returned non-JSON response: ${trimmedText.substring(0, 50)}...`);
    }
    
    console.log('Parsing JSON text (first 200 chars):', jsonText.substring(0, 200));
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('JSON parsing error:', {
      error: error instanceof Error ? error.message : error,
      responseText: responseText.substring(0, 500),
      responseStatus: response.status,
      responseStatusText: response.statusText,
      contentType: response.headers.get('content-type'),
      responseHeaders: Object.fromEntries(response.headers.entries())
    });
    
    if (error instanceof Error && error.message.includes('position')) {
      throw new Error('Server response contains malformed JSON. This may be a temporary server issue - please try again.');
    }
    
    throw new Error('Invalid server response format - please try again or contact support if the issue persists');
  }
}

// Helper function to make authenticated requests
export async function makeAuthRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
  // Check if server is known to be offline to avoid unnecessary requests
  const isKnownOffline = localStorage.getItem('handoff_server_offline') === 'true';
  
  if (isKnownOffline && !endpoint.includes('health')) {
    // Skip non-health requests if we know server is offline
    throw new Error('Server not available. This is normal for development without deployed Supabase Edge Functions.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AUTH_TIMEOUTS.REQUEST_TIMEOUT);
  const fullUrl = `${projectUrl}/functions/v1/make-server-a24396d5/${endpoint}`;

  try {
    console.log(`Making request to: ${options.method || 'GET'} ${fullUrl}`);
    
    // Only log detailed headers and body for health checks to reduce noise
    if (endpoint.includes('health')) {
      console.log('Request headers:', options.headers);
      if (options.body) {
        console.log('Request body (first 200 chars):', typeof options.body === 'string' ? options.body.substring(0, 200) : options.body);
      }
    }
    
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        'Cache-Control': 'no-cache',
        ...options.headers,
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Clear offline flag if request succeeds
    localStorage.removeItem('handoff_server_offline');

    console.log(`Response received: ${response.status} ${response.statusText}`);
    
    // Only log detailed response info for health checks
    if (endpoint.includes('health')) {
      console.log(`Content-Type: ${response.headers.get('content-type')}`);
      console.log(`Content-Length: ${response.headers.get('content-length')}`);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await safeParseJson(response);
        console.log('Parsed error data:', errorData);
      } catch (parseError) {
        console.error('Failed to parse error response as JSON:', parseError);
        const rawText = await response.text().catch(() => 'Unable to read response text');
        console.error('Raw error response:', rawText.substring(0, 500));
        throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
      }
      
      const errorMessage = errorData.error || errorData.message || `Request failed with status ${response.status}`;
      console.error('Server returned error:', errorData);
      throw new Error(errorMessage);
    }

    const result = await safeParseJson(response);
    console.log('Successfully parsed response:', typeof result, Object.keys(result || {}));
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Mark server as offline for certain types of errors
    if (error instanceof Error && (
      error.message === 'Failed to fetch' ||
      error.name === 'AbortError' ||
      error.message.includes('NetworkError') ||
      error.message.includes('TypeError')
    )) {
      localStorage.setItem('handoff_server_offline', 'true');
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Server may not be deployed or is taking too long to respond.');
    }
    
    // Only log detailed errors for health checks to reduce console noise
    if (endpoint.includes('health')) {
      console.log('Health check failed (this is normal for development):', {
        endpoint,
        error: error instanceof Error ? error.message : error,
        method: options.method || 'GET'
      });
    }
    
    // Provide more helpful error messages for development
    if (error instanceof Error) {
      if (error.message === 'Failed to fetch') {
        const newError = new Error('Server not available. This is normal for development without deployed Supabase Edge Functions.');
        newError.name = 'ServerUnavailableError';
        throw newError;
      }
      
      if (error.name === 'AbortError') {
        const newError = new Error('Request timed out. Server may not be deployed or is taking too long to respond.');
        newError.name = 'TimeoutError';
        throw newError;
      }
    }
    
    throw error;
  }
}