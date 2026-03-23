import type { Config } from "tailwindcss";

const cssColor = (variableName: string) => `rgb(var(${variableName}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: cssColor("--surface"),
          elevated: cssColor("--surface-elevated"),
          muted: cssColor("--surface-muted"),
          border: cssColor("--surface-border"),
          divider: cssColor("--surface-divider"),
        },
        text: {
          primary: cssColor("--text-primary"),
          secondary: cssColor("--text-secondary"),
          muted: cssColor("--text-muted"),
          faint: cssColor("--text-faint"),
        },
        accent: {
          DEFAULT: cssColor("--accent"),
          muted: cssColor("--accent-muted"),
          subtle: cssColor("--accent-subtle"),
          glow: "rgb(var(--accent) / 0.15)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      letterSpacing: {
        tight: "-0.02em",
        relaxed: "0.01em",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
        section: "2rem",
        "section-sm": "1.5rem",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
        xl: "14px",
        "2xl": "16px",
        "3xl": "20px",
      },
      fontSize: {
        "display-xs": ["1.125rem", { lineHeight: "1.35", letterSpacing: "-0.02em", fontWeight: "600" }],
        label: ["0.625rem", { lineHeight: "1.25", letterSpacing: "0.12em", fontWeight: "600" }],
        "body-sm": ["0.8125rem", { lineHeight: "1.55" }],
      },
      boxShadow: {
        "glow-sm": "0 0 12px rgba(41, 181, 232, 0.15)",
        "glow-md": "0 0 24px rgba(41, 181, 232, 0.2)",
        elevated: "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)",
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        nav: "var(--shadow-nav)",
        panel: "var(--shadow-panel)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      backgroundImage: {
        "warm-gradient": "linear-gradient(135deg, rgb(var(--gradient-warm-start)) 0%, rgb(var(--gradient-warm-end)) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
