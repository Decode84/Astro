module.exports = {
    content: [
        './src/**/*.{html,js,ejs}'
    ],
    theme: {
        extend: {},
        fontFamily: {
            nunito: ['nunito', 'sans-serif']
        }
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography')
    ]
}
