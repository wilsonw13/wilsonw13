import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Hook to detect if the current viewport is mobile-sized.
 * @returns Boolean indicating if the viewport is mobile-sized (< 768px).
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = (): void => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
