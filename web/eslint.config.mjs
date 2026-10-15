import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["app/components/Lightbox.tsx"],
    rules: {
      // Enter, exit, and crossfade set state from open/index changes.
      // That timing is the animation; it already shipped this way.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
