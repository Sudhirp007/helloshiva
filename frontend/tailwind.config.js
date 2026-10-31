/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0B1025",
          midnight: "#171F42",
          white: "#FFFFFF",
          lavenderWhite: "#F5F4FF",
          indigo: "#6366F1",
          violet: "#8067FF",
          softLavender: "#E8E7FF",
          slateBorder: "#252B49",
          borderLight: "#E6E7F0",
          textDark: "#10183A",
          mutedDark: "#626985",
          mutedLight: "#C6C9DC",
        },
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(110deg, #6366F1, #8067FF, #A78BFA)",
        "gradient-dark": "linear-gradient(110deg, #0B1025, #171F42, #29205D)",
        "gradient-light": "linear-gradient(110deg, #FFFFFF, #F5F4FF, #E8E7FF)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
