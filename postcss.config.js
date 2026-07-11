export default {
  plugins: {
    tailwindcss: {},
    // Tailwind v3 emits color utilities as rgb(R G B / A) (CSS Color 4
    // slash syntax), which Safari didn't support until Safari 15 — every
    // bg-*/text-* color silently failed on older iPads, leaving a
    // black-and-white UI. Rewrite to the legacy rgba(R, G, B, A) comma
    // syntax, which every browser (including iOS 11 Safari) understands.
    'postcss-color-functional-notation': { preserve: false },
    autoprefixer: {},
  },
}
