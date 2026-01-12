import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/*.js",
      "pnpm-lock.yaml",
      "coverage/**",
      "eslint.config.mjs",
    ],
  },
