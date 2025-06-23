import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      layout: {
        dividerWeight: "1px", 
        disabledOpacity: 0.45, 
        fontSize: {
          tiny: "0.75rem",   // 12px
          small: "0.875rem", // 14px
          medium: "0.9375rem", // 15px
          large: "1.125rem", // 18px
        },
        lineHeight: {
          tiny: "1rem", 
          small: "1.25rem", 
          medium: "1.5rem", 
          large: "1.75rem", 
        },
        radius: {
          small: "6px", 
          medium: "8px", 
          large: "12px", 
        },
        borderWidth: {
          small: "1px", 
          medium: "1px", 
          large: "2px", 
        },
      },
      themes: {
        light: {
          colors: {
            "background": {
              "DEFAULT": "#FFFFFF"
            },
            "content1": {
              "DEFAULT": "#FFFFFF",
              "foreground": "#222222"
            },
            "content2": {
              "DEFAULT": "#F0F0F0",
              "foreground": "#333333"
            },
            "content3": {
              "DEFAULT": "#E6E6E6",
              "foreground": "#3f3f46"
            },
            "content4": {
              "DEFAULT": "#d4d4d8",
              "foreground": "#52525b"
            },
            "divider": {
              "DEFAULT": "rgba(17, 17, 17, 0.15)"
            },
            "focus": {
              "DEFAULT": "#005640"
            },
            "foreground": {
              "50": "#fafafa",
              "100": "#f4f4f5",
              "200": "#e4e4e7",
              "300": "#d4d4d8",
              "400": "#a1a1aa",
              "500": "#71717a",
              "600": "#52525b",
              "700": "#3f3f46",
              "800": "#27272a",
              "900": "#18181b",
              "DEFAULT": "#222222"
            },
            "overlay": {
              "DEFAULT": "#000000"
            },
            "danger": {
              "50": "#fee7ef",
              "100": "#fdd0df",
              "200": "#faa0bf",
              "300": "#f871a0",
              "400": "#f54180",
              "500": "#f31260",
              "600": "#c20e4d",
              "700": "#920b3a",
              "800": "#610726",
              "900": "#310413",
              "DEFAULT": "#f31260",
              "foreground": "#ffffff"
            },
            "default": {
              "50": "#fafafa",
              "100": "#f4f4f5",
              "200": "#e4e4e7",
              "300": "#d4d4d8",
              "400": "#a1a1aa",
              "500": "#71717a",
              "600": "#52525b",
              "700": "#3f3f46",
              "800": "#27272a",
              "900": "#18181b",
              "DEFAULT": "#d4d4d8",
              "foreground": "#000"
            },
            "primary": {
              "50": "#e6f4f1",
              "100": "#cce9e3",
              "200": "#99d3c7",
              "300": "#66bdab",
              "400": "#33a78f",
              "500": "#005640",
              "600": "#004d3a",
              "700": "#003a2b",
              "800": "#00261d",
              "900": "#00130e",
              "DEFAULT": "#005640",
              "foreground": "#fff"
            },
            "secondary": {
              "50": "#e6f2f5",
              "100": "#cce5eb",
              "200": "#99cbd7",
              "300": "#66b1c3",
              "400": "#3397af",
              "500": "#004D66",
              "600": "#00455c",
              "700": "#003445",
              "800": "#00222e",
              "900": "#001117",
              "DEFAULT": "#004D66",
              "foreground": "#fff"
            },
            "success": {
              "50": "#e6f4f1",
              "100": "#cce9e3",
              "200": "#99d3c7",
              "300": "#66bdab",
              "400": "#33a78f",
              "500": "#007754",
              "600": "#006b4a",
              "700": "#005037",
              "800": "#003625",
              "900": "#001b12",
              "DEFAULT": "#007754",
              "foreground": "#fff"
            },
            "warning": {
              "50": "#fefce8",
              "100": "#fef9c3",
              "200": "#fef08a",
              "300": "#fde047",
              "400": "#facc15",
              "500": "#eab308",
              "600": "#ca8a04",
              "700": "#a16207",
              "800": "#854d0e",
              "900": "#713f12",
              "DEFAULT": "#eab308",
              "foreground": "#000"
            },
            "info": {
              "50": "#e6f2f5",
              "100": "#cce5eb",
              "200": "#99cbd7",
              "300": "#66b1c3",
              "400": "#3397af",
              "500": "#004D66",
              "600": "#00455c",
              "700": "#003445",
              "800": "#00222e",
              "900": "#001117",
              "DEFAULT": "#004D66",
              "foreground": "#fff"
            }
          }
        },
        dark: {
          colors: {
            "background": {
              "DEFAULT": "#000000"
            },
            "content1": {
              "DEFAULT": "#18181b",
              "foreground": "#fafafa"
            },
            "content2": {
              "DEFAULT": "#27272a",
              "foreground": "#f4f4f5"
            },
            "content3": {
              "DEFAULT": "#3f3f46",
              "foreground": "#e4e4e7"
            },
            "content4": {
              "DEFAULT": "#52525b",
              "foreground": "#d4d4d8"
            },
            "divider": {
              "DEFAULT": "rgba(255, 255, 255, 0.15)"
            },
            "focus": {
              "DEFAULT": "#005640"
            },
            "foreground": {
              "50": "#18181b",
              "100": "#27272a",
              "200": "#3f3f46",
              "300": "#52525b",
              "400": "#71717a",
              "500": "#a1a1aa",
              "600": "#d4d4d8",
              "700": "#e4e4e7",
              "800": "#f4f4f5",
              "900": "#fafafa",
              "DEFAULT": "#ECEDEE"
            },
            "overlay": {
              "DEFAULT": "#000000"
            },
            "danger": {
              "50": "#310413",
              "100": "#610726",
              "200": "#920b3a",
              "300": "#c20e4d",
              "400": "#f31260",
              "500": "#f54180",
              "600": "#f871a0",
              "700": "#faa0bf",
              "800": "#fdd0df",
              "900": "#fee7ef",
              "DEFAULT": "#f31260",
              "foreground": "#ffffff"
            },
            "default": {
              "50": "#18181b",
              "100": "#27272a",
              "200": "#3f3f46",
              "300": "#52525b",
              "400": "#71717a",
              "500": "#a1a1aa",
              "600": "#d4d4d8",
              "700": "#e4e4e7",
              "800": "#f4f4f5",
              "900": "#fafafa",
              "DEFAULT": "#3f3f46",
              "foreground": "#fff"
            },
            "primary": {
              "50": "#00130e",
              "100": "#00261d",
              "200": "#003a2b",
              "300": "#004d3a",
              "400": "#005640",
              "500": "#33a78f",
              "600": "#66bdab",
              "700": "#99d3c7",
              "800": "#cce9e3",
              "900": "#e6f4f1",
              "DEFAULT": "#005640",
              "foreground": "#fff"
            },
            "secondary": {
              "50": "#e6f2f5",
              "100": "#cce5eb",
              "200": "#99cbd7",
              "300": "#66b1c3",
              "400": "#3397af",
              "500": "#004D66",
              "600": "#00455c",
              "700": "#003445",
              "800": "#00222e",
              "900": "#001117",
              "DEFAULT": "#004D66",
              "foreground": "#fff"
            },
            "success": {
              "50": "#001b12",
              "100": "#003625",
              "200": "#005037",
              "300": "#006b4a",
              "400": "#007754",
              "500": "#33a78f",
              "600": "#66bdab",
              "700": "#99d3c7",
              "800": "#cce9e3",
              "900": "#e6f4f1",
              "DEFAULT": "#007754",
              "foreground": "#fff"
            },
            "warning": {
              "50": "#fefce8",
              "100": "#fef9c3",
              "200": "#fef08a",
              "300": "#fde047",
              "400": "#facc15",
              "500": "#eab308",
              "600": "#ca8a04",
              "700": "#a16207",
              "800": "#854d0e",
              "900": "#713f12",
              "DEFAULT": "#eab308",
              "foreground": "#000"
            },
            "info": {
              "50": "#e6f2f5",
              "100": "#cce5eb",
              "200": "#99cbd7",
              "300": "#66b1c3",
              "400": "#3397af",
              "500": "#004D66",
              "600": "#00455c",
              "700": "#003445",
              "800": "#00222e",
              "900": "#001117",
              "DEFAULT": "#004D66",
              "foreground": "#fff"
            }
          }
        }
      }
    })
  ]
}
