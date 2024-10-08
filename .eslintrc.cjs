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
    ecmaVersion: 12, // 최신 ECMAScript 버전
    sourceType: "module", // ES6 모듈 사용
  },
  ignorePatterns: ["dist/"], // dist 폴더 무시
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
