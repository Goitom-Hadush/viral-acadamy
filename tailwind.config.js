import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                // Copper / Bronze palette tuned to the logo
                copper: {
                    50: '#fff7f1',
                    100: '#fcefe2',
                    200: '#f7d8bb',
                    300: '#f0bf90',
                    400: '#e69a53',
                    500: '#b87333',
                    600: '#9b5f2b',
                    700: '#7b481f',
                    800: '#5a3216',
                    900: '#3a1d0c',
                },
                bronze: '#8c5a2e',
                accent: '#d19a5a',
            },
            fontFamily: {
                // Use a clean modern sans for body and a refined serif for headings
                sans: ['Poppins', ...defaultTheme.fontFamily.sans],
                heading: ['Merriweather', ...defaultTheme.fontFamily.serif],
            },
            boxShadow: {
                'copper-glow': '0 10px 40px -12px rgba(184,115,51,0.25)',
                'copper-glow-lg': '0 20px 70px -30px rgba(184,115,51,0.28)'
            }
        },
    },

    plugins: [forms],
};
