import { useState, useRef, useCallback, useEffect } from "react";
import { apiFetch } from "@/lib/utils";

interface ApiResourceState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetchResource: (path: string | null | undefined, options?: RequestInit) => Promise<void>;
}

/**
 * Internal helper to manage API resource state and fetch logic.
 * @returns API resource state and fetch function.
 */
function useApiResourceState<T = any>(): ApiResourceState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResource = useCallback(async (path: string | null | undefined, options?: RequestInit) => {
    if (path === null || path === undefined) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiFetch<T>(path, options);
      setData(result as T);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchResource };
}

const MINIMUM_DEBOUNCE_DELAY_MS = 300;

interface AutoApiResourceReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetchNow: (newPath?: string | null, newOptions?: RequestInit) => void;
}

/**
 * Automatically refetches when path/options change after a debounce delay.
 *
 * @param path - The API endpoint to fetch. Pass null to prevent fetching.
 * @param options - Fetch options. Should be memoized with useMemo in the calling component.
 * @param delayMs - Debounce delay in milliseconds. Use 0 to disable debouncing.
 * @returns API resource state and manual fetch function.
 */
export function useAutoApiResource<T = any>(
  path: string | null,
  options?: RequestInit,
  delayMs: number = MINIMUM_DEBOUNCE_DELAY_MS,
): AutoApiResourceReturn<T> {
  const { data, loading, error, fetchResource } = useApiResourceState<T>();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const fetchNow = useCallback(
    (newPath: string | null = path, newOptions: RequestInit = options || {}) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      fetchResource(newPath, newOptions);
    },
    [fetchResource, path, options],
  );

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (path === null || path === undefined) {
      return;
    }
    if (delayMs > 0) {
      timeoutRef.current = setTimeout(() => fetchResource(path, options), Math.max(delayMs, MINIMUM_DEBOUNCE_DELAY_MS));
    } else {
      fetchResource(path, options);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [path, options, delayMs, fetchResource]);

  return { data, loading, error, fetchNow };
}

interface ManualApiResourceReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetchNow: (newPath?: string, newOptions?: RequestInit) => Promise<void>;
}

/**
 * Manually fetches data only when its `fetchNow` function is called.
 * Path is fixed after hook call; options can be overridden per fetch.
 *
 * @param path - The API endpoint to fetch. Required.
 * @param options - Default fetch options.
 * @returns API resource state and manual fetch function.
 */
export function useManualApiResource<T = any>(path: string, options?: RequestInit): ManualApiResourceReturn<T> {
  const { data, loading, error, fetchResource } = useApiResourceState<T>();

  const fetchNow = useCallback(
    (newPath: string = path, newOptions: RequestInit = options || {}) => fetchResource(newPath, newOptions),
    [fetchResource, path, options],
  );

  return { data, loading, error, fetchNow };
}
