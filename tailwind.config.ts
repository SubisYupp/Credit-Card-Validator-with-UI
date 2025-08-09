import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0c"
      },
      backgroundImage: {
        "radial-gradient": "radial-gradient(60% 60% at 50% 30%, rgba(120,119,198,0.25) 0%, rgba(255,255,255,0) 60%)",
        "conic-gradient": "conic-gradient(from 180deg at 50% 50%, #06b6d4, #a78bfa, #22d3ee, #06b6d4)"
      }
    },
  },
  plugins: [],
};
export default config;
