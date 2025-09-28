import { baseConfig } from "../eslint.config.js";
// @ts-ignore
import nodePlugin from "eslint-plugin-node";

export default [
  ...baseConfig,
  {
    files: ["backend/src/**/*.{ts,tsx}"],
    plugins: {
      node: nodePlugin,
    },
    languageOptions: {
      parserOptions: {
        project: "./backend/tsconfig.json",
      },
    },
    rules: {
      ...nodePlugin.configs["recommended-module"].rules,

      "node/no-unsupported-features/es-syntax": ["error", { version: ">=22.0.0" }],
    },
  },
];
