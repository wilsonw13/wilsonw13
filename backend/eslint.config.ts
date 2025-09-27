import { baseConfig } from "../eslint.config.js";
import nodePlugin from "eslint-plugin-node";

export default [
  ...baseConfig, // Apply the shared root configuration
  {
    // Configuration specific to the backend
    files: ["backend/**/*.{ts,tsx}"],
    plugins: {
      node: nodePlugin,
    },
    rules: {
      // Apply recommended Node.js rules
      ...nodePlugin.configs["recommended-module"].rules,

      // Your backend-specific rule overrides can go here
      "node/no-unsupported-features/es-syntax": ["error", { version: ">=22.0.0" }],
    },
  },
];
