export default {
  plugins: {
    '@tailwindcss/postcss': {},
    // For iOS safari 15 TailwindCSS color/transparency support (color-mix)
    '@csstools/postcss-color-mix-function': {},
    autoprefixer: {},
  },
}
