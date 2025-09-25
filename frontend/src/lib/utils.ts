import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// =====================
// UI Utilities
// =====================

/**
 * Utility for merging Tailwind and clsx class names.
 * @param inputs - Class names, arrays, or objects.
 * @returns The merged class name string.
 */
export function cn(...inputs: Parameters<typeof clsx>): string {
  return twMerge(clsx(inputs));
}

// =====================
// Environment Constants
// =====================

/**
 * The base URL for API requests, from Vite environment variables.
 */
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

// =====================
// Cookie Utilities
// =====================

/**
 * Set a secure cookie (Strict, Secure, Path=/).
 * @param name - Cookie name.
 * @param value - Cookie value.
 * @param maxAgeSeconds - Max age in seconds (use -1 to delete).
 */
export function setCookie(name: string, value: string, maxAgeSeconds: number): void {
  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAgeSeconds}; Secure; SameSite=Strict`;
}

/**
 * Get a cookie value by name.
 * @param name - Cookie name.
 * @returns Cookie value or null if not found.
 */
export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

// =====================
// PKCE & Crypto Utilities
// =====================

/**
 * Generate a random string for PKCE or other uses.
 * @param length - Length of the string.
 * @returns Random string.
 */
export function generateRandomString(length: number = 64): string {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let result = "";
  const values = window.crypto.getRandomValues(new Uint8Array(length));
  for (let i = 0; i < length; i++) {
    result += charset[values[i] % charset.length];
  }
  return result;
}

/**
 * Base64-url encode a buffer (for PKCE).
 * @param buffer - The buffer to encode.
 * @returns Base64-url encoded string.
 */
export function base64urlencode(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Create a PKCE code challenge from a code verifier.
 * @param verifier - The code verifier string.
 * @returns The code challenge string.
 */
export async function pkceChallengeFromVerifier(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return base64urlencode(digest);
}

// =====================
// API Utilities
// =====================

/**
 * Authenticated API fetch helper.
 * - Adds Bearer token from cookie.
 * - Automatically stringifies a JS object body.
 * - Throws an error for non-ok HTTP responses.
 *
 * @param path - API endpoint path (e.g., "/users").
 * @param options - Fetch options (method, headers, body, etc).
 * @returns A promise that resolves to the parsed JSON response body.
 */
export async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<T | Response> {
  const token = getCookie("access_token");

  // Define default headers
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Safely get headers as Record<string, string>
  const requestHeaders = options.headers as Record<string, string> | undefined;

  // Automatically stringify body if it's an object and Content-Type is JSON
  const contentType = requestHeaders?.["Content-Type"] || defaultHeaders["Content-Type"];
  const isJson = contentType === "application/json";
  if (options.body && typeof options.body === "object" && isJson) {
    options.body = JSON.stringify(options.body);
  }

  // Perform the fetch request
  const response = await fetch(API_BASE_URL + path, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });

  // Check for HTTP errors
  if (!response.ok) {
    const errorBody = await response.text(); // Get error details from body
    throw new Error(`HTTP error ${response.status}: ${errorBody}`);
  }

  // Parse and return JSON body, or return the response for non-JSON content
  const responseContentType = response.headers.get("content-type");
  if (responseContentType && responseContentType.includes("application/json")) {
    return response.json() as Promise<T>;
  }

  return response; // Return the raw response for other content types (e.g., file downloads)
}
