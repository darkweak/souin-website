/** @types {import("tailwindcss").Config} */
module.exports = {
  theme: {
    rotate: {
      '30': '30deg',
    },
  },
  content: ['components', 'context', 'pages'].map((folder) => `./${folder}/**/*.{js,ts,jsx,tsx}`),
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
