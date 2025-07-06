module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#28a745',
        'primary-dark': '#1e7e34',
        secondary: '#007bff',
        'secondary-dark': '#0056b3',
        accent: '#fd7e14',
        'accent-dark': '#c66510',
        light: '#f8f9fa',
        dark: '#343a40',
        medium: '#6c757d',
      }
    },
  },
  plugins: [],
};