#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

// Import the theme configuration
const themePath = path.join(__dirname, '../src/lib/theme.ts');
const themeContent = fs.readFileSync(themePath, 'utf8');

// Extract theme configuration using regex (simple approach)
// In a more complex setup, you'd use proper TypeScript compilation
const themeConfigMatch = themeContent.match(/export const themeConfig = ({[\s\S]*?});/);
if (!themeConfigMatch) {
  console.error('❌ Could not find themeConfig in theme.ts');
  process.exit(1);
}

// Evaluate the theme config (be careful with eval in production)
const configString = themeConfigMatch[1];
const themeConfig = eval(`(${configString})`);

/**
 * Generate CSS custom properties from theme configuration
 */
function generateThemeCSS() {
  const themes = Object.entries(themeConfig);
  
  let css = `:root {\n`;
  
  // Generate light theme as default (root) 
  const lightTheme = themeConfig['light'];
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