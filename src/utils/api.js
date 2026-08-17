const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const DIRECT_BACKEND_URL = 'http://localhost:5000/api';

export const apiFetch = async (endpoint, options = {}) => {
  const primaryUrl = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(primaryUrl, defaultOptions);
    
    // If response is OK and JSON
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
    }
    
    // If response was HTML or non-JSON (e.g. proxy missed and returned Vite index.html), try direct backend fallback
    if (!endpoint.startsWith('http') && API_BASE_URL.startsWith('/')) {
      const fallbackUrl = `${DIRECT_BACKEND_URL}${endpoint}`;
      const fallbackRes = await fetch(fallbackUrl, defaultOptions);
      if (fallbackRes.ok) {
        return await fallbackRes.json();
      } else {
        const errorData = await fallbackRes.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${fallbackRes.status}`);
      }
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  } catch (err) {
    // Retry with direct backend URL if primary relative URL failed due to network error
    if (!endpoint.startsWith('http') && API_BASE_URL.startsWith('/')) {
      try {
        const fallbackUrl = `${DIRECT_BACKEND_URL}${endpoint}`;
        const fallbackRes = await fetch(fallbackUrl, defaultOptions);
        if (fallbackRes.ok) {
          return await fallbackRes.json();
        }
        const errorData = await fallbackRes.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${fallbackRes.status}`);
      } catch (fallbackErr) {
        throw new Error(fallbackErr.message || err.message);
      }
    }
    throw err;
  }
};

export const streamFetch = async (endpoint, body, onChunk, onDone, onError) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'content') {
              onChunk(data.content);
            } else if (data.type === 'done') {
              onDone();
            } else if (data.type === 'error') {
              onError(data.message);
            }
          } catch (e) {
            console.error('Error parsing SSE line', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Stream fetch error:', error);
    onError('I am having trouble connecting to the server. Please try again or call +256 772 418 707.');
  }
};
