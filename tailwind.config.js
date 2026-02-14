/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: ['class', '[data-theme="dark"]'],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#6366f1',
                    light: '#e0e7ff',
                    glow: 'rgba(99, 102, 241, 0.4)',
                },
                accent: '#a855f7',
            },
            borderRadius: {
                '3xl': '32px',
                '2xl': '24px',
                'xl': '20px',
            },
            boxShadow: {
                'soft': '0 10px 30px -5px rgba(0, 0, 0, 0.04)',
                'intense': '0 30px 60px -12px rgba(0, 0, 0, 0.12)',
                'primary-glow': '0 10px 40px -10px rgba(99, 102, 241, 0.5)',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
