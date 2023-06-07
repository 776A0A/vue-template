import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
    theme: { extend: {} },
    plugins: [
        plugin(({ addComponents, addUtilities }) => {
            addUtilities({
                '.content-visibility-auto': { 'content-visibility': 'auto' },
            })

            addComponents({
                '.center-flex': {
                    display: 'flex',
                    'justify-content': 'center',
                    'align-items': 'center',
                },
                '.center-abs': {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate3d(-50%, -50%, 0)',
                },
                '.center-x-abs': {
                    position: 'absolute',
                    left: '50%',
                    transform: 'translate3d(-50%, 0, 0)',
                },
                '.center-y-abs': {
                    position: 'absolute',
                    top: '50%',
                    transform: 'translate3d(0, -50%, 0)',
                },
                '.full': {
                    width: '100%',
                    height: '100%',
                },
                '.fullscreen': {
                    width: '100%',
                    height: '100%',
                    display: 'fixed',
                },
            })
        }),
    ],
}
