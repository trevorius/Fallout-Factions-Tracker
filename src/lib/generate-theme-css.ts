import { themeConfig } from './theme';

/**
 * Generate CSS custom properties from theme configuration
 * This ensures we have a single source of truth for theme values
 */
export function generateThemeCSS() {
  const themes = Object.entries(themeConfig) as [keyof typeof themeConfig, any][];
  
  let css = `:root {\n`;
  
  // Generate light theme as default (root)
  const lightTheme = themeConfig.light;
  Object.entries(lightTheme).forEach(([key, value]) => {
    const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    css += `  ${cssVar}: ${value};\n`;
  });
  
  css += `  --radius: 0.5rem;\n`;
  css += `}\n\n`;
  
  // Generate other themes as classes
  themes.forEach(([themeName, themeColors]) => {
    if (themeName === 'light') return; // Skip light as it's already in :root
    
    css += `.${themeName} {\n`;
    Object.entries(themeColors).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      css += `  ${cssVar}: ${value};\n`;
    });
    css += `}\n\n`;
  });
  
  return css;
}

/**
 * Get the CSS as a string that can be injected into the page
 */
export function getThemeCSS(): string {
  return generateThemeCSS();
}

/**
 * Inject theme CSS into the document head (client-side)
 */
export function injectThemeCSS() {
  if (typeof document === 'undefined') return;
  
  // Remove existing theme CSS
  const existingStyle = document.getElementById('dynamic-theme-css');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Create and inject new theme CSS
  const style = document.createElement('style');
  style.id = 'dynamic-theme-css';
  style.textContent = generateThemeCSS();
  document.head.appendChild(style);
}

/**
 * Save theme CSS to a file (for build-time generation)
 */
export function saveThemeCSSToFile(filePath: string) {
  if (typeof process === 'undefined') return;
  
  const fs = require('fs');
  const path = require('path');
  
  const css = generateThemeCSS();
  const dir = path.dirname(filePath);
  
  // Ensure directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, css, 'utf8');
  console.log(`✅ Generated theme CSS: ${filePath}`);
}