import kontentAiConfig from "@kontent-ai/eslint-config";
import kontentAiReactConfig from "@kontent-ai/eslint-config/react";
import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  {
    ignores: [".next/**", "out/**", "node_modules/**", "next-env.d.ts"],
  },
  {
    files: [
      "src/app/**/*.{ts,tsx}",
      "src/components/**/*.{ts,tsx}",
      "src/hooks/**/*.{ts,tsx}",
      "src/icons/**/*.{ts,tsx}",
      "src/lib/**/*.{ts,tsx}",
      "src/utils/**/*.{ts,tsx}",
      "src/proxy.ts",
    ],
    // next runs first so kontent-ai's typescript-eslint parser overrides next's
    // babel parser for our .ts/.tsx files; we still pick up @next/next/* rules.
    extends: [nextCoreWebVitals, kontentAiConfig, kontentAiReactConfig],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      "react/jsx-max-props-per-line": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "react/jsx-wrap-multilines": "off",
      // eslint-config-next ships newer react/react-hooks plugins than
      // kontent-ai/eslint-config; these strict additions aren't App-Router
      // specific, so we keep them off to match the rest of the project.
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react/no-unescaped-entities": "off",
    },
  },
]);
