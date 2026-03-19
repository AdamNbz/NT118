/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        rose: {
          500: '#F73658',
        },
      },
      fontFamily: {
        montserrat: ["Montserrat_400Regular"],
        poppins: ["Poppins_400Regular"],
        libreCaslon: ["LibreCaslonText_700Bold"],
      },
    },
  },
  plugins: [],
};
