import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./providers/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Tokens sourced from DESIGN-notion.md. CSS variables hold literal hex
      // values so opacity modifiers (bg-primary/50) won't work — use the
      // dedicated tint tokens (e.g. --muted, --accent) instead.
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        canvas: "var(--canvas)",
        "canvas-soft": "var(--canvas-soft)",
        ink: {
          DEFAULT: "var(--ink)",
          secondary: "var(--ink-secondary)",
          muted: "var(--ink-muted)",
          faint: "var(--ink-faint)",
        },
        hairline: "var(--hairline)",
        hero: "var(--hero)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          active: "var(--primary-active)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
          sky: "var(--accent-sky)",
          purple: "var(--accent-purple)",
          "purple-deep": "var(--accent-purple-deep)",
          pink: "var(--accent-pink)",
          orange: "var(--accent-orange)",
          "orange-deep": "var(--accent-orange-deep)",
          teal: "var(--accent-teal)",
          green: "var(--accent-green)",
          brown: "var(--accent-brown)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
      },
      // Literal Notion radius scale — not derived via calc() so each step
      // matches the front-matter `rounded:` tokens exactly.
      borderRadius: {
        xs: "4px",
        sm: "5px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        "level-1": "var(--shadow-level-1)",
        "level-2": "var(--shadow-level-2)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "-apple-system", "system-ui", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
      },
      // Notion type scale — use as text-display-1, text-heading-2, etc.
      fontSize: {
        "display-1": ["64px", { lineHeight: "1.0", letterSpacing: "-2.125px", fontWeight: "700" }],
        "display-2": ["54px", { lineHeight: "1.04", letterSpacing: "-1.875px", fontWeight: "700" }],
        "heading-1": ["40px", { lineHeight: "1.1", letterSpacing: "-1px", fontWeight: "700" }],
        "heading-2": ["26px", { lineHeight: "1.23", letterSpacing: "-0.625px", fontWeight: "700" }],
        "heading-3": ["22px", { lineHeight: "1.27", letterSpacing: "-0.25px", fontWeight: "700" }],
        title: ["20px", { lineHeight: "1.4", letterSpacing: "-0.125px", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "1.5", letterSpacing: "0", fontWeight: "400" }],
        "body-sm": ["15px", { lineHeight: "1.33", letterSpacing: "0", fontWeight: "400" }],
        button: ["16px", { lineHeight: "1.5", letterSpacing: "0", fontWeight: "500" }],
        caption: ["14px", { lineHeight: "1.43", letterSpacing: "0", fontWeight: "400" }],
        eyebrow: ["12px", { lineHeight: "1.33", letterSpacing: "0.125px", fontWeight: "600" }],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
