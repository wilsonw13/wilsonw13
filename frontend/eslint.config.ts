import { baseConfig } from "../eslint.config.js";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import reactRefreshPlugin from "eslint-plugin-react-refresh";

export default [
  ...baseConfig,
  {
    files: ["frontend/src/**/*.{ts,tsx}"], // Glob now more specific to src
    plugins: {
      react: reactPlugin,
      "react-hooks": hooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
      import: importPlugin,
      "react-refresh": reactRefreshPlugin,
    },
    languageOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      // Added: Make ESLint understand your @/* path aliases
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
    rules: {
      ...reactPlugin.configs["recommended"].rules,
      ...hooksPlugin.configs["recommended"].rules,
      ...jsxA11yPlugin.configs["recommended"].rules,
      "react/prop-types": "off",
      "react-refresh/only-export-components": "warn", // Enforce Vite Fast Refresh conventions
    },
  },
];
