/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    darkMode: ['class', '[data-theme="dark"]'],
    theme: {
        extend: {
            colors: {
                accent: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                },
            },
            fontFamily: {
                serif: ['"Georgia"', '"Noto Serif TC"', 'serif'],
                sans: ['"Inter"', '"Noto Sans TC"', 'sans-serif'],
                mono: ['"JetBrains Mono"', '"Courier New"', 'monospace'],
                reading: ['var(--reader-font-family)', 'serif'],
            },
            fontSize: {
                'reading': 'var(--reader-font-size, 17px)',
            },
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: 'none',
                        color: 'var(--text-primary)',
                        a: { color: 'var(--accent)' },
                    },
                },
            },
        },
    },
    plugins: [],
}
