module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    requireConfigFile: false,
  },
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'next',
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@next/next/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    "react/react-in-jsx-scope": "off",
  }
};
