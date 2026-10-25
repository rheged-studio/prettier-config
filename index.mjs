/**
 * The estate's shared Prettier preset, published as
 * `@rheged-studio/prettier-config`.
 *
 * Every formatting option is pinned to Prettier's own default (R-2934 D1), so
 * adopting the preset reformats nothing, and a change to a Prettier default
 * only reaches the estate through a deliberate preset release.
 * `infrastructure/tests/preset.test.ts` fails when a pin drifts from the
 * installed Prettier's default or a new formatting option appears.
 */

/**
 * @type {import("prettier").Config}
 */
export default {
  arrowParens: "always",
  bracketSameLine: false,
  bracketSpacing: true,
  embeddedLanguageFormatting: "auto",
  endOfLine: "lf",
  experimentalOperatorPosition: "end",
  experimentalTernaries: false,
  htmlWhitespaceSensitivity: "css",
  jsxSingleQuote: false,
  objectWrap: "preserve",
  printWidth: 80,
  proseWrap: "preserve",
  quoteProps: "as-needed",
  semi: true,
  singleAttributePerLine: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  useTabs: false,
  vueIndentScriptAndStyle: false,
};
