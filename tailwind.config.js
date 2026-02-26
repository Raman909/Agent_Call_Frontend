/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0a0a0a',
                surface: '#121212',
                surfaceHighlight: '#1e1e1e',
                primary: '#7c3aed', // violet-600
                primaryHover: '#6d28d9', // violet-700
                accent: '#10b981', // emerald-500
                textMain: '#f8fafc',
                textMuted: '#94a3b8',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
    