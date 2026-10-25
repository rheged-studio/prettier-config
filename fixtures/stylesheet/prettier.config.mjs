// A consumer's own config: the preset plus its Tailwind v4 entry point (D6).
import preset from "@rheged-studio/prettier-config";

export default { ...preset, tailwindStylesheet: "./app.css" };
