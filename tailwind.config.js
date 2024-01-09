/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    colors: {
      'purple': '#00FF00',
      'white': '#FFFFFF',
      'black': '#000000',
      'yellow': '#FF00FF',
    },
    extend: {
      screens: {
        sm: '320px', // Small screens, such as mobile phones (320px)
        md: '640px', // Medium screens, tablets, etc.
        lg: '1024px', // Large screens, desktops, etc.
        xl: '1280px', // Extra-large screens
      },
    },
  },
  plugins: [],
};
