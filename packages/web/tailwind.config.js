module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  theme: {
    colors: {},
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.875rem",
      "3xl": "2.25rem",
      "4xl": "3rem",
      "5xl": "3.75rem",
      "6xl": "4.5rem",
      "7xl": "6rem",
      "8xl": "8rem",
      "9xl": "10.5rem",
    },
    fontFamily: {
      sans: ["ui-sans-serif", "system-ui"],
      serif: ["ui-serif", "Georgia"],
      mono: ["ui-monospace", "SFMono-Regular"],
      display: ["Oswald"],
      body: ['"Open Sans"'],
    },
  },
  daisyui: {
    base: false,
  },
};
