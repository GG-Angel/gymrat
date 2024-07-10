/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F73558",   // red
        secondary: "#1D1D1F", // black
        gray: {
          DEFAULT: "#6A6A6A", // 25%
          100: "#BABABA",     // 50%
          200: "#E7E7E7"      // 75%
        },
        white: {
          DEFAULT: "#FFFFFF", // absolute
          100: "#F5F5F7"      // 90%
        },
        yellow: {
          DEFAULT: "#EEBD3F"
        },
        purple: {
          DEFAULT: "#B873D8"
        },
        red: {
          DEFAULT: "#F95976"
        }
      },
      fontSize: {
        "ch1": ["33.92px", {
          lineHeight: "40px",
          letterSpacing: "-0.678px",
        }],
        "ch2": ["24px", {
          lineHeight: "26px",
          letterSpacing: "-0.48px",
        }],
        "csub": ["16.97px", {
          lineHeight: "22px",
          letterSpacing: "-0.339px"
        }],
        "cbody": ["12px", {
          lineHeight: "15px",
          letterSpacing: "-0.24px"
        }],
        "ctri": ["10px", {
          // lineHeight: "normal",
          letterSpacing: "-0.3px"
        }]
      },
      fontFamily: {
        gultralight: ["Geist-UltraLight", "sans-serif"],
        glight: ["Geist-Light", "sans-serif"],
        gthin: ["Geist-Thin", "sans-serif"],
        gregular: ["Geist-Regular", "sans-serif"],
        gmedium: ["Geist-Medium", "sans-serif"],
        gsemibold: ["Geist-SemiBold", "sans-serif"],
        gbold: ["Geist-Bold", "sans-serif"],
        gblack: ["Geist-Black", "sans-serif"],
        gultrablack: ["Geist-UltraBlack", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"]
      },
    },
  },
  plugins: [],
}

