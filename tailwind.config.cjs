/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0a0b14', // Very deep dark blue/black
                surface: '#12141c',    // Slightly lighter
                primary: '#6366f1',    // Indigo-500
                'primary-dark': '#4f46e5', // Indigo-600
                'input-bg': '#131520', // Input background
                'input-border': '#2d303e',
            }
        },
    },
    plugins: [],
}
