#!/usr/bin/env node

const path = require("path");
const fs = require("fs");

// Theme configuration for build script
// Note: This is duplicated from theme.ts to avoid TypeScript compilation complexity

// Create a simple theme configuration for build script
// This avoids the complexity of parsing TypeScript enums
const themeConfig = {
  light: {
    // Original Light Theme
    background: "0 0% 100%",
    foreground: "0 0% 3.9%",
    card: "0 0% 100%",
    cardForeground: "0 0% 3.9%",
    popover: "0 0% 100%",
    popoverForeground: "0 0% 3.9%",
    primary: "0 0% 9%",
    primaryForeground: "0 0% 98%",
    secondary: "0 0% 96.1%",
    secondaryForeground: "0 0% 9%",
    muted: "0 0% 96.1%",
    mutedForeground: "0 0% 45.1%",
    accent: "0 0% 96.1%",
    accentForeground: "0 0% 9%",
    destructive: "0 84.2% 60.2%",
    destructiveForeground: "0 0% 98%",
    border: "0 0% 89.8%",
    input: "0 0% 89.8%",
    ring: "0 0% 3.9%",
    sidebarBackground: "0 0% 98%",
    sidebarForeground: "240 5.3% 26.1%",
    sidebarPrimary: "240 5.9% 10%",
    sidebarPrimaryForeground: "0 0% 98%",
    sidebarAccent: "240 4.8% 95.9%",
    sidebarAccentForeground: "240 5.9% 10%",
    sidebarBorder: "220 13% 91%",
    sidebarRing: "217.2 91.2% 59.8%",
    "chart-1": "12 76% 61%",
    "chart-2": "173 58% 39%",
    "chart-3": "197 37% 24%",
    "chart-4": "43 74% 66%",
    "chart-5": "27 87% 67%",
  },
  dark: {
    // Original Dark Theme
    background: "0 0% 3.9%",
    foreground: "0 0% 98%",
    card: "0 0% 3.9%",
    cardForeground: "0 0% 98%",
    popover: "0 0% 3.9%",
    popoverForeground: "0 0% 98%",
    primary: "0 0% 98%",
    primaryForeground: "0 0% 9%",
    secondary: "0 0% 14.9%",
    secondaryForeground: "0 0% 98%",
    muted: "0 0% 14.9%",
    mutedForeground: "0 0% 63.9%",
    accent: "0 0% 14.9%",
    accentForeground: "0 0% 98%",
    destructive: "0 62.8% 30.6%",
    destructiveForeground: "0 0% 98%",
    border: "0 0% 14.9%",
    input: "0 0% 14.9%",
    ring: "0 0% 83.1%",
    sidebarBackground: "240 5.9% 10%",
    sidebarForeground: "240 4.8% 95.9%",
    sidebarPrimary: "224.3 76.3% 48%",
    sidebarPrimaryForeground: "0 0% 100%",
    sidebarAccent: "240 3.7% 15.9%",
    sidebarAccentForeground: "240 4.8% 95.9%",
    sidebarBorder: "240 3.7% 15.9%",
    sidebarRing: "217.2 91.2% 59.8%",
    "chart-1": "220 70% 50%",
    "chart-2": "160 60% 45%",
    "chart-3": "30 80% 55%",
    "chart-4": "280 65% 60%",
    "chart-5": "340 75% 55%",
  },
  blue: {
    // Game-like Blue & Gold Theme - Updated Palette
    background: "210 40% 53%", // Main background
    foreground: "56 89% 72%", // Gold text
    card: "213 43% 37%", // Cards
    cardForeground: "56 89% 72%", // Gold text on cards
    popover: "213 43% 37%", // Popover same as card
    popoverForeground: "56 89% 72%",
    primary: "56 89% 72%", // Gold for primary elements
    primaryForeground: "213 43% 20%", // Darker blue text on gold
    secondary: "213 43% 45%", // Muted blue for secondary
    secondaryForeground: "56 89% 72%", // Gold
    muted: "213 43% 42%", // Muted blue
    mutedForeground: "56 89% 85%", // Lighter, muted gold
    accent: "56 89% 72%", // Gold accent
    accentForeground: "213 43% 20%", // Darker blue on accent
    destructive: "0 84.2% 60.2%",
    destructiveForeground: "0 0% 98%",
    border: "213 43% 50%", // Softer blue borders
    input: "213 43% 45%", // Dark blue inputs
    ring: "56 89% 72%", // Gold focus ring
    sidebarBackground: "213 43% 32%", // Dark blue sidebar
    sidebarForeground: "56 89% 72%", // Gold sidebar text
    sidebarPrimary: "56 89% 72%", // Gold primary
    sidebarPrimaryForeground: "213 43% 20%", // Dark blue text on gold
    sidebarAccent: "213 43% 40%", // Blue accent
    sidebarAccentForeground: "56 89% 72%", // Gold accent text
    sidebarBorder: "213 43% 45%", // Blue border
    sidebarRing: "56 89% 72%", // Gold focus ring
    "chart-1": "56 89% 72%", // Gold
    "chart-2": "210 40% 65%", // Lighter blue
    "chart-3": "213 43% 45%", // Medium blue
    "chart-4": "50 90% 80%", // Yellow-gold
    "chart-5": "200 50% 60%", // Cyan-blue
  },
};

/**
 * Generate CSS custom properties from theme configuration
 */
function generateThemeCSS() {
  const themes = Object.entries(themeConfig);

  let css = `:root {\n`;

  // Generate light theme as default (root)
  const lightTheme = themeConfig.light;
  Object.entries(lightTheme).forEach(([key, value]) => {
    // Only include string values (skip objects like typography, spacing)
    if (typeof value === "string") {
      const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      css += `  ${cssVar}: ${value};\n`;
    }
  });

  css += `  --radius: 0.5rem;\n`;
  css += `}\n\n`;

  // Generate other themes as classes
  themes.forEach(([themeName, themeColors]) => {
    if (themeName === "light") return; // Skip light as it's already in :root

    css += `.${themeName} {\n`;
    Object.entries(themeColors).forEach(([key, value]) => {
      // Only include string values (skip objects like typography, spacing)
      if (typeof value === "string") {
        const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
        css += `  ${cssVar}: ${value};\n`;
      }
    });
    css += `}\n\n`;
  });

  return css;
}

// Generate the CSS
const css = generateThemeCSS();

// Write to file
const outputPath = path.join(__dirname, "../src/styles/generated-theme.css");
const outputDir = path.dirname(outputPath);

// Ensure directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the CSS file
fs.writeFileSync(outputPath, css, "utf8");

process.stdout.write("✅ Generated theme CSS: " + outputPath + "\n");
process.stdout.write(
  "🎨 Themes generated: " + Object.keys(themeConfig).join(", ") + "\n"
);
