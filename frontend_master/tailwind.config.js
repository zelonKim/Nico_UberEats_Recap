const colors = require("tailwindcss/colors");

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        lime: colors.lime,
      },
    },
    screen: {
      xs: "240px",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
