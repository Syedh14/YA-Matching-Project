/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: { 
      colors: {
        'primary': '#E2D3D2',
        'secondary': '#8A5752'
    },
  },
  variants: {},
  plugins: [],
}
}