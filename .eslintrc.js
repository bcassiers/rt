/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["next", "plugin:jsx-a11y/recommended"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  settings: {
    "import/resolver": {
      typescript: true,
      node: true,
    },
  },
  rules: {
    "no-process-env": ["error"],
    "@typescript-eslint/consistent-type-imports": "error",
    "import/no-cycle": ["error"],
    "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],
    "react/self-closing-comp": ["error", { component: true, html: true }],
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: ["plugin:@typescript-eslint/recommended"],
      plugins: ["@typescript-eslint"],
      parser: "@typescript-eslint/parser",
    },
  ],
};
