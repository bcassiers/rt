/** @type {import("prettier").Config} */
module.exports = {
  plugins: ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
  printWidth: 160,
  trailingComma: "all",
  importOrderSeparation: true,
  importOrder: ["<THIRD_PARTY_MODULES>", "^(?!.*[.]css$)@monwbi/.*", "^~/(.*)$", "^[./]", "^(?!.*[.]css$)[./]", "./*[.]css$"],
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ["classProperties", "typescript", "jsx"],
};
