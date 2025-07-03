#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

// Theme configuration for build script
// Note: This is duplicated from theme.ts to avoid TypeScript compilation complexity

// Create a simple theme configuration for build script
// This avoids the complexity of parsing TypeScript enums
const themeConfig = {
  light: {
    // Original Light Theme
    background: '0 0% 100%',
    foreground: '0 0% 3.9%',
    card: '0 0% 100%',
    cardForeground: '0 0% 3.9%',
    popover: '0 0% 100%',
    popoverForeground: '0 0% 3.9%',
    primary: '0 0% 9%',
    primaryForeground: '0 0% 98%',
    secondary: '0 0% 96.1%',
    secondaryForeground: '0 0% 9%',
    muted: '0 0% 96.1%',
    mutedForeground: '0 0% 45.1%',
    accent: '0 0% 96.1%',
    accentForeground: '0 0% 9%',
    destructive: '0 84.2% 60.2%',
    destructiveForeground: '0 0% 98%',
    border: '0 0% 89.8%',
    input: '0 0% 89.8%',
    ring: '0 0% 3.9%',
    sidebarBackground: '0 0% 98%',
    sidebarForeground: '240 5.3% 26.1%',
    sidebarPrimary: '240 5.9% 10%',
    sidebarPrimaryForeground: '0 0% 98%',
    sidebarAccent: '240 4.8% 95.9%',
    sidebarAccentForeground: '240 5.9% 10%',
    sidebarBorder: '220 13% 91%',
    sidebarRing: '217.2 91.2% 59.8%',
    'chart-1': '12 76% 61%',
    'chart-2': '173 58% 39%',
    'chart-3': '197 37% 24%',
    'chart-4': '43 74% 66%',
    'chart-5': '27 87% 67%',
  },
  dark: {
    // Original Dark Theme
    background: '0 0% 3.9%',
    foreground: '0 0% 98%',
    card: '0 0% 3.9%',
    cardForeground: '0 0% 98%',
    popover: '0 0% 3.9%',
    popoverForeground: '0 0% 98%',
    primary: '0 0% 98%',
    primaryForeground: '0 0% 9%',
    secondary: '0 0% 14.9%',
    secondaryForeground: '0 0% 98%',
    muted: '0 0% 14.9%',
    mutedForeground: '0 0% 63.9%',
    accent: '0 0% 14.9%',
    accentForeground: '0 0% 98%',
    destructive: '0 62.8% 30.6%',
    destructiveForeground: '0 0% 98%',
    border: '0 0% 14.9%',
    input: '0 0% 14.9%',
    ring: '0 0% 83.1%',
    sidebarBackground: '240 5.9% 10%',
    sidebarForeground: '240 4.8% 95.9%',
    sidebarPrimary: '224.3 76.3% 48%',
    sidebarPrimaryForeground: '0 0% 100%',
    sidebarAccent: '240 3.7% 15.9%',
    sidebarAccentForeground: '240 4.8% 95.9%',
    sidebarBorder: '240 3.7% 15.9%',
    sidebarRing: '217.2 91.2% 59.8%',
    'chart-1': '220 70% 50%',
    'chart-2': '160 60% 45%',
    'chart-3': '30 80% 55%',
    'chart-4': '280 65% 60%',
    'chart-5': '340 75% 55%',
  },
  blue: {
    // Game-like Blue & Gold Theme
    background: '220 85% 12%',
    foreground: '45 100% 70%',
    card: '220 80% 15%',
    cardForeground: '45 100% 75%',
    popover: '220 80% 15%',
    popoverForeground: '45 100% 75%',
    primary: '45 100% 60%',
    primaryForeground: '220 85% 12%',
    secondary: '220 60% 20%',
    secondaryForeground: '45 90% 80%',
    muted: '220 70% 18%',
    mutedForeground: '45 60% 60%',
    accent: '45 95% 65%',
    accentForeground: '220 85% 12%',
    destructive: '0 84.2% 60.2%',
    destructiveForeground: '0 0% 98%',
    border: '220 50% 25%',
    input: '220 60% 20%',
    ring: '45 100% 70%',
    sidebarBackground: '220 75% 10%',
    sidebarForeground: '45 100% 75%',
    sidebarPrimary: '45 100% 65%',
    sidebarPrimaryForeground: '220 85% 12%',
    sidebarAccent: '220 60% 18%',
    sidebarAccentForeground: '45 100% 75%',
    sidebarBorder: '220 50% 20%',
    sidebarRing: '45 100% 70%',
    'chart-1': '45 100% 65%',
    'chart-2': '200 80% 55%',
    'chart-3': '220 70% 40%',
    'chart-4': '50 90% 60%',
    'chart-5': '240 60% 50%',
  }
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
    if (typeof value === 'string') {
      const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      css += `  ${cssVar}: ${value};\n`;
    }
  });
  
  css += `  --radius: 0.5rem;\n`;
  css += `}\n\n`;
  
  // Generate other themes as classes
  themes.forEach(([themeName, themeColors]) => {
    if (themeName === 'light') return; // Skip light as it's already in :root
    
    css += `.${themeName} {\n`;
    Object.entries(themeColors).forEach(([key, value]) => {
      // Only include string values (skip objects like typography, spacing)
      if (typeof value === 'string') {
        const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
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
const outputPath = path.join(__dirname, '../src/styles/generated-theme.css');
const outputDir = path.dirname(outputPath);

// Ensure directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the CSS file
fs.writeFileSync(outputPath, css, 'utf8');

process.stdout.write('✅ Generated theme CSS: ' + outputPath + '\n');
process.stdout.write('🎨 Themes generated: ' + Object.keys(themeConfig).join(', ') + '\n');