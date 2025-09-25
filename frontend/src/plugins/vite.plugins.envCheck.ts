// vite.plugins.envCheck.ts
import type { Plugin } from 'vite'

/**
 * Vite plugin to enforce required environment variables at build time.
 * @param requiredVars - List of required env variable names (e.g., ["VITE_API_BASE_URL"]).
 * @returns Vite plugin configuration
 */
export default function envCheckPlugin(requiredVars: string[] = []): Plugin {
  return {
    name: "env-check",
    configResolved(config) {
      const missing = requiredVars.filter(
        (key: string) => !config.env[key]
      );
      if (missing.length > 0) {
        throw new Error(
          `Missing required environment variables: ${missing.join(", ")}`
        );
      }
    },
  };
}
