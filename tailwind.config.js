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
                // Success Life logo palette: deep green, fresh green, and clean neutrals
                copper: {
                    50: '#f1f8f1',
                    100: '#e1efe2',
                    200: '#c3dec5',
                    300: '#98c49b',
                    400: '#68a96c',
                    500: '#36823b',
                    600: '#17621d',
                    700: '#004101',
                    800: '#003501',
                    900: '#002801',
                },
                bronze: '#17621d',
                accent: '#68a96c',
            },
            fontFamily: {
                // Use a clean modern sans for body and a refined serif for headings
                sans: ['Poppins', ...defaultTheme.fontFamily.sans],
                heading: ['Merriweather', ...defaultTheme.fontFamily.serif],
            },
            boxShadow: {
                'copper-glow': '0 10px 40px -12px rgba(0,65,1,0.18)',
                'copper-glow-lg': '0 20px 70px -30px rgba(0,65,1,0.22)'
            }
        },
    },

    plugins: [forms],
};
