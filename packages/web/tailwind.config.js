module.exports = {
  content: ["./app/**/*.tsx"],
  plugins: [require("daisyui")],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        gray: {
          50: "hsl(0, 0%, 98%)",
          100: "hsl(240, 5%, 96%)",
          200: "hsl(240, 6%, 90%)",
          300: "hsl(240, 5%, 84%)",
          400: "hsl(240, 5%, 65%)",
          DEFAULT: "hsl(240, 4%, 46%)",
          600: "hsl(240, 5%, 34%)",
          700: "hsl(240, 5%, 26%)",
          800: "hsl(240, 4%, 16%)",
          900: "hsl(240, 6%, 10%)",
        },
        crimson: {
          DEFAULT: "hsl(341, 67%, 50%)",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui"],
        serif: ["ui-serif", "Georgia"],
        mono: [
          "ui-monospace",
          "Menlo",
          "Monaco",
          "Cascadia Mono",
          "Segoe UI Mono",
          "Roboto Mono",
          "Oxygen Mono",
          "Ubuntu Monospace",
          "Source Code Pro",
          "Fira Mono",
          "Droid Sans Mono",
          "Courier New",
          "monospace",
        ],
        display: ["Oswald"],
        body: ['"Open Sans"'],
      },
    },
  },
  daisyui: {
    base: false,
    // themes: ["dark"],
    themes: [
      {
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          ".tooltip": { "--tooltip-color": "#161616" },
        },
      },
    ],
  },
};
