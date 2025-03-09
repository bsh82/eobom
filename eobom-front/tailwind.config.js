/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/global.css"], // global.css 포함
  theme: {
    extend: {},
    fontFamily: {
      pre: ['Pretendard'],
      jal: ['Jalpullineun Day'],
    },
  },
  plugins: [],
};
