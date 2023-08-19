/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["plugin:playwright/playwright-test", "next", "plugin:jsx-a11y/recommended", "plugin:prettier/recommended"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  settings: {
    next: {
      rootDir: ["apps/*/", "packages/*/"],
    },
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
      overrides: [
        {
          files: ["playwright/**/*.{tsx,ts}"],
          rules: {
            "no-undef": "off",
          },
        },
      ],
    },
    {
      files: ["playwright/**/*.{js,jsx}"],
      rules: {
        "no-undef": "off",
      },
    },
  ],
};
