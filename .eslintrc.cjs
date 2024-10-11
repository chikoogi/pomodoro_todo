module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  ignorePatterns: ["dist/"],
  plugins: ["@typescript-eslint", "prettier"],
  overrides: [
    {
      "files": ["tests/**/*"],
      "env": {
        "jest": true
      }
    }
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "@typescript-eslint/no-unused-vars": "warn",

  },
};
