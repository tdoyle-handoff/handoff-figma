import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["index.html", "./src/**/*.{ts,tsx,js,jsx,html}", "./components/**/*.{ts,tsx}"],
  theme: {
    fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui"] },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Screenshot palette tokens
        bg: "#F6F7FB",
        ink: "#111827",
        card: { DEFAULT: "#FFFFFF", foreground: "#111827" },
        line: "#E5E7EB",
        primary: { DEFAULT: "#3B82F6", foreground: "#FFFFFF" },
        success: "#16A34A",
        warn: "#F59E0B",
        danger: "#EF4444",
        muted: { DEFAULT: "#6B7280", foreground: "#6B7280" },
        secondary: { DEFAULT: "#F3F4F6", foreground: "#111827" },
        destructive:{ DEFAULT:"hsl(var(--destructive))", foreground:"hsl(var(--destructive-foreground))" },
        accent:    { DEFAULT:"hsl(var(--accent))", foreground:"hsl(var(--accent-foreground))" },
        popover:   { DEFAULT:"hsl(var(--popover))", foreground:"hsl(var(--popover-foreground))" },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,.06), 0 2px 8px rgba(0,0,0,.05)",
      },
      borderRadius: {
        xl: "0.75rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      gridTemplateColumns: {
        settings: "290px minmax(0,1fr) 340px",
      },
    },
  },
  plugins: [],
};

export default config;

