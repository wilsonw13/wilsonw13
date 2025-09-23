const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const API_KEY = import.meta.env.VITE_API_KEY as string | undefined;

export const apiFetch = async (path: string, options: RequestInit = {}) => {
  return fetch(API_BASE_URL + path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      // ...(API_KEY ? { 'Authorization': `Bearer ${API_KEY}` } : {}), // Auth disabled for now
      'Content-Type': 'application/json',
    },
  });
}

// Health Check API
export const healthCheck = async () => {
  const response = await apiFetch("/health-check");
  if (!response.ok) throw new Error(`Error: ${response.status}`);
  return response.json();
}