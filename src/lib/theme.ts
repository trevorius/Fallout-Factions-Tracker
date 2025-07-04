/**
 * Shared theme system that reads from CSS custom properties
 * Automatically syncs between HTML (Tailwind) and PDF styling
 */

import { ThemeName, Theme } from "@/lib/types/theme";

// Theme configuration with three themes: Light, Dark, and Blue & Gold
export const themeConfig = {
  [Theme.LIGHT]: {
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

    // Sidebar colors
    sidebarBackground: "0 0% 98%",
    sidebarForeground: "240 5.3% 26.1%",
    sidebarPrimary: "240 5.9% 10%",
    sidebarPrimaryForeground: "0 0% 98%",
    sidebarAccent: "240 4.8% 95.9%",
    sidebarAccentForeground: "240 5.9% 10%",
    sidebarBorder: "220 13% 91%",
    sidebarRing: "217.2 91.2% 59.8%",

    // Charts
    "chart-1": "12 76% 61%",
    "chart-2": "173 58% 39%",
    "chart-3": "197 37% 24%",
    "chart-4": "43 74% 66%",
    "chart-5": "27 87% 67%",
  },
  [Theme.DARK]: {
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

    // Sidebar colors
    sidebarBackground: "240 5.9% 10%",
    sidebarForeground: "240 4.8% 95.9%",
    sidebarPrimary: "224.3 76.3% 48%",
    sidebarPrimaryForeground: "0 0% 100%",
    sidebarAccent: "240 3.7% 15.9%",
    sidebarAccentForeground: "240 4.8% 95.9%",
    sidebarBorder: "240 3.7% 15.9%",
    sidebarRing: "217.2 91.2% 59.8%",

    // Charts
    "chart-1": "220 70% 50%",
    "chart-2": "160 60% 45%",
    "chart-3": "30 80% 55%",
    "chart-4": "280 65% 60%",
    "chart-5": "340 75% 55%",
  },
  [Theme.BLUE]: {
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
    destructive: "0 84.2% 60.2%", // Keep red for destructive
    destructiveForeground: "0 0% 98%",
    border: "213 43% 50%", // Softer blue borders
    input: "213 43% 45%", // Dark blue inputs
    ring: "56 89% 72%", // Gold focus ring

    // Sidebar colors - Blue & Gold theme
    sidebarBackground: "213 43% 32%", // Dark blue sidebar
    sidebarForeground: "56 89% 72%", // Gold sidebar text
    sidebarPrimary: "56 89% 72%", // Gold primary
    sidebarPrimaryForeground: "213 43% 20%", // Dark blue text on gold
    sidebarAccent: "213 43% 40%", // Blue accent
    sidebarAccentForeground: "56 89% 72%", // Gold accent text
    sidebarBorder: "213 43% 45%", // Blue border
    sidebarRing: "56 89% 72%", // Gold focus ring

    // Charts - Blue & Gold variations
    "chart-1": "56 89% 72%", // Gold
    "chart-2": "210 40% 65%", // Lighter blue
    "chart-3": "213 43% 45%", // Medium blue
    "chart-4": "50 90% 80%", // Yellow-gold
    "chart-5": "200 50% 60%", // Cyan-blue
  },

  // Typography
  typography: {
    fontFamily: "var(--font-sans, ui-sans-serif, system-ui, sans-serif)",
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      "2xl": 24,
      "3xl": 30,
      "4xl": 36,
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Spacing (matches Tailwind defaults)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48,
    "3xl": 64,
  },

  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
};

/**
 * Convert HSL string to hex color for PDF compatibility
 * @param hsl HSL string like "0 0% 100%"
 * @returns Hex color string like "#ffffff"
 */
function hslToHex(hsl: string): string {
  const [h, s, l] = hsl.split(" ").map((v, i) => {
    const num = parseFloat(v.replace("%", ""));
    return i === 0 ? num : num / 100;
  });

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * Get theme colors converted to hex for PDF use
 * @param theme Theme name: 'light', 'dark', or 'blue'
 * @returns Object with hex color values
 */
export function getPdfTheme(theme: ThemeName) {
  const colorTheme = themeConfig[theme];

  // Convert all HSL colors to hex (only process string values)
  const colors = Object.entries(colorTheme).reduce((acc, [key, hslValue]) => {
    if (typeof hslValue === "string") {
      acc[key] = hslToHex(hslValue);
    }
    return acc;
  }, {} as Record<string, string>);

  return {
    colors,
    typography: themeConfig.typography,
    spacing: themeConfig.spacing,
    borderRadius: themeConfig.borderRadius,
  };
}

/**
 * Get default theme preference
 */
export function getPreferredTheme(): ThemeName {
  // For server-side PDF generation, default to light
  // You can enhance this to accept theme preference as a parameter
  return Theme.LIGHT;
}

/**
 * Get CSS custom property value in browser environment
 * @param property CSS custom property name (without --)
 * @returns CSS custom property value
 */
export function getCSSCustomProperty(property: string): string {
  if (typeof window === "undefined") return "";

  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${property}`)
    .trim();
}

/**
 * Future enhancement: Live theme detection
 * This function can be enhanced to read actual CSS custom properties from the DOM
 * and convert them in real-time, making the PDF truly reactive to theme changes
 */
export function getLiveTheme() {
  if (typeof window === "undefined") {
    return getPdfTheme(Theme.LIGHT);
  }

  // Detect theme from HTML classes
  const htmlElement = document.documentElement;
  if (htmlElement.classList.contains(Theme.DARK)) {
    return getPdfTheme(Theme.DARK);
  } else if (htmlElement.classList.contains(Theme.BLUE)) {
    return getPdfTheme(Theme.BLUE);
  } else {
    return getPdfTheme(Theme.LIGHT);
  }
}
