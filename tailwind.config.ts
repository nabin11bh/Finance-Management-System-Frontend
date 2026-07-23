import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0f766e",
          dark: "#115e59",
        },
        pine: "#0b3d3d",
        brass: "#c9a227",
        paper: "#faf9f6",
        ink: "#101828",
        mist: "#e7e5e0",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;