/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#6366f1',
                    light: '#e0e7ff',
                    glow: 'rgba(99, 102, 241, 0.15)',
                },
                sidebar: {
                    light: '#ffffff',
                    dark: '#111827',
                },
                app: {
                    light: '#f8fafc',
                    dark: '#0b0f1a',
                },
                card: {
                    light: '#ffffff',
                    dark: '#1f2937',
                }
            },
            borderRadius: {
                'xl': '28px',
                'lg': '18px',
                'md': '12px',
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'intense': '0 20px 40px -8px rgba(0, 0, 0, 0.1)',
            }
        },
    },
    plugins: [],
}
