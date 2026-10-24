import { fileURLToPath } from "node:url";

/**
 * The estate's shared Prettier preset, published as
 * `@rheged-studio/prettier-config`.
 *
 * Every formatting option is pinned to Prettier's own default (R-2934 D1), so
 * adopting the preset reformats nothing, and a change to a Prettier default
 * only reaches the estate through a deliberate release.
 * `infrastructure/tests/preset.test.ts` fails when a pin drifts from the
 * installed Prettier's default or a new formatting option appears.
 *
 * The Astro and Tailwind CSS plugins are built in (D2, D8). They are this
 * package's own dependencies, resolved to absolute paths here rather than by
 * name, so consumers never install them and Prettier never looks for them in
 * the consumer's `node_modules` (D13). Tailwind must be the last plugin.
 */

/**
 * Resolves a plugin from this package, not from the consumer.
 * @param {string} name The plugin's package name.
 * @returns {string} The absolute path of the plugin's entry point.
 */
function resolvePlugin(name) {
  return fileURLToPath(import.meta.resolve(name));
}

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
  overrides: [{ files: "*.astro", options: { parser: "astro" } }],
  plugins: [
    resolvePlugin("prettier-plugin-astro"),
    resolvePlugin("prettier-plugin-tailwindcss"),
  ],
  printWidth: 80,
  proseWrap: "preserve",
  quoteProps: "as-needed",
  semi: true,
  singleAttributePerLine: false,
  singleQuote: false,
  tabWidth: 2,
  // Class sorting inside these helpers' arguments (D6); each consumer sets
  // `tailwindStylesheet` for its own Tailwind v4 entry point.
  tailwindFunctions: ["cn", "clsx"],
  trailingComma: "all",
  useTabs: false,
  vueIndentScriptAndStyle: false,
};
