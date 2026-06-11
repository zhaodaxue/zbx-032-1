/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        rose: {
          50: "#FFF1F3",
          100: "#FFE4E8",
          200: "#FFC9D2",
          300: "#FFA3B3",
          400: "#FF7A8F",
          500: "#E91E63",
          600: "#C2185B",
          700: "#AD1457",
          800: "#880E4F",
          900: "#6A1B4D",
        },
        leaf: {
          50: "#E8F5E9",
          100: "#C8E6C9",
          200: "#A5D6A7",
          300: "#81C784",
          400: "#66BB6A",
          500: "#4CAF50",
          600: "#43A047",
          700: "#388E3C",
          800: "#2E7D32",
          900: "#1B5E20",
        },
        ice: {
          50: "#E1F5FE",
          100: "#B3E5FC",
          200: "#81D4FA",
          300: "#4FC3F7",
          400: "#29B6F6",
          500: "#03A9F4",
          600: "#039BE5",
          700: "#0288D1",
          800: "#0277BD",
          900: "#01579B",
        },
        cream: {
          50: "#FFFBF5",
          100: "#FFF8F0",
          200: "#FFF0E0",
          300: "#FFE4CC",
        },
      },
      fontFamily: {
        display: ['"STSong"', '"华文宋体"', '"SimSun"', "serif"],
        body: ['"Microsoft YaHei"', '"微软雅黑"', "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
