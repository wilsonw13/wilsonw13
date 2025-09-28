import { baseConfig } from "../eslint.config.js";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
// @ts-expect-error: eslint-plugin-jsx-a11y has no default export in types, but works at runtime
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import reactRefreshPlugin from "eslint-plugin-react-refresh";

export default [
  ...baseConfig,
  {
    files: ["frontend/src/**/*.{ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": hooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
      import: importPlugin,
      "react-refresh": reactRefreshPlugin,
    },
    languageOptions: {
      parserOptions: {
        project: "./frontend/tsconfig.json",
      },
      ecmaFeatures: {
        jsx: true,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
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
      "react-refresh/only-export-components": "warn",
    },
  },
];
