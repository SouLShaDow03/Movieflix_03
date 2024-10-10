"use strict";

var withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{html,js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    screens: {
      "max-sm": {
        max: "599px"
      },
      "max-md": {
        min: "959px",
        max: "1023px"
      },
      sm: {
        min: "600px",
        max: "767px"
      },
      md: {
        min: "768px",
        max: "958px"
      },
      lg: {
        min: "1024px"
      }
    },
    extend: {
      boxShadow: {
        "custom-red-bottom-right": "0 35px 25px -25px #ef4444, 20px 10px 35px -15px #ef5350"
      }
    }
  },
  plugins: []
});