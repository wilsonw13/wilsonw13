import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettierConfig from "eslint-config-prettier";

export const baseConfig = [
  // Global ignores for all configs
  {
    ignores: [
      "**/node_modules/",
      "**/dist/",
      "**/build/",
      "**/.turbo/",
      "**/.svelte-kit/",
      "eslint.config.ts",
      "**/*.d.ts",
    ],
  },
  // Base config for all files
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  // TypeScript specific configuration
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      ...tsPlugin.configs["recommended"].rules,
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  prettierConfig,
];

export default baseConfig;
