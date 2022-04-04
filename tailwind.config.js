module.exports = {
  content: [
    './src/**/*.{html,js,ejs}'
  ],
  theme: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}
