import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          base: "#0E1310",
          ink: "#101B14",
          deep: "#07100B",
          terminal: "#45A066",
          glow: "#8FE0A8",
          moss: "#B7B38A",
          fern: "#6A8F5E",
          fog: "#DDE9D6",
        },
      },
      fontFamily: {
        heading: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["Space Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        moss: "0 24px 90px rgba(69, 160, 102, 0.18)",
        glow: "0 0 42px rgba(69, 160, 102, 0.34)",
      },
    },
  },
  plugins: [],
} satisfies Config;
