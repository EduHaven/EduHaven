import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["dist/", "node_modules/"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": "off",
    },
  },
];
