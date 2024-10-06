module.exports = {
  env: {
    browser: true, // 브라우저 환경
    es2021: true, // 최신 ECMAScript 2021 문법 사용
    node: true,
  },
  extends: [
    "eslint:recommended", // ESLint 추천 규칙 사용
    "plugin:prettier/recommended", // Prettier 규칙 적용
  ],
  parserOptions: {
    ecmaVersion: 12, // 최신 ECMAScript 버전
    sourceType: "module", // ES6 모듈 사용
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
  ignorePatterns: ["dist/"], // dist 폴더 무시
  plugins: ["prettier"],
  overrides: [
    {
      "files": ["tests/**/*"],
      "env": {
        "jest": true
      }
    }
  ]
};
