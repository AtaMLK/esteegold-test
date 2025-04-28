/* eslint-disable import/no-anonymous-default-export */
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        gold: "#FED50B",
        silver: "#E5E4E2",
        roseGold: "##B76E79",
        darkgreen: {
          100: "#d9ece6", // Lightest shade
          200: "#b3d9cc",
          300: "#8cc6b3",
          400: "#66b399",
          500: "#40826D", // Original color
          600: "#367159",
          700: "#2c6046",
          800: "#234f33",
          900: "#193f26", // Darkest shade
        },
        lightgreen: {
          100: "#f0faed", // Lightest shade
          200: "#e0f5db",
          300: "#d1f0c8",
          400: "#c0e6b2", // Original color
          500: "#a3d599",
          600: "#86c57f",
          700: "#6ab466",
          800: "#4d944c",
          900: "#327433", // Darkest shade
        },
        gray: {
          100: "#f7f8f5",
          200: "#e9ebe2",
          300: "#dadccb",
          400: "#cfd2b6", // Original color
          500: "#b1b596",
          600: "#949776",
          700: "#767958",
          800: "#595a3b",
          900: "#3d3c1f",
        },
        card: {
          DEFAULT: "#40826D",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--darkgreen))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
    fontFamily: {
      dreamFont: ["DreamAvenue", "sans-serif"],
      monoFont: ["MonoSpace"],
      railWayFont: ["Railway", "sans-serif"],
    },
  },
  plugins: [require("tailwindcss-animate")],
};
