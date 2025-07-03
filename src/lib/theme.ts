/**
 * Shared theme system that reads from CSS custom properties
 * Automatically syncs between HTML (Tailwind) and PDF styling
 */

// Theme configuration that matches your CSS custom properties
export const themeConfig = {
  light: {
    // Game-like Blue & Gold Theme
    background: '220 85% 12%',      // Deep blue background
    foreground: '45 100% 70%',      // Gold text
    card: '220 80% 15%',            // Slightly lighter blue for cards
    cardForeground: '45 100% 75%',  // Bright gold for card text
    popover: '220 80% 15%',         // Same as card
    popoverForeground: '45 100% 75%',
    primary: '45 100% 60%',         // Rich gold for primary elements
    primaryForeground: '220 85% 12%', // Dark blue text on gold
    secondary: '220 60% 20%',       // Muted blue for secondary
    secondaryForeground: '45 90% 80%', // Light gold
    muted: '220 70% 18%',           // Muted blue
    mutedForeground: '45 60% 60%',  // Muted gold
    accent: '45 95% 65%',           // Bright gold accent
    accentForeground: '220 85% 12%', // Dark blue on accent
    destructive: '0 84.2% 60.2%',   // Keep red for destructive
    destructiveForeground: '0 0% 98%',
    border: '220 50% 25%',          // Blue-gray borders
    input: '220 60% 20%',           // Dark blue inputs
    ring: '45 100% 70%',            // Gold focus ring
    
    // Sidebar colors - Blue & Gold theme
    sidebarBackground: '220 75% 10%',   // Dark blue sidebar
    sidebarForeground: '45 100% 75%',   // Gold sidebar text
    sidebarPrimary: '45 100% 65%',      // Gold primary
    sidebarBorder: '220 50% 20%',       // Blue border
    
    // Charts - Blue & Gold variations
    chart1: '45 100% 65%',    // Gold
    chart2: '200 80% 55%',    // Light blue
    chart3: '220 70% 40%',    // Medium blue
    chart4: '50 90% 60%',     // Yellow-gold
    chart5: '240 60% 50%',    // Purple-blue
  },
  dark: {
    // Dark Blue & Gold Theme (darker variant)
    background: '220 90% 8%',       // Even darker blue
    foreground: '45 100% 85%',      // Brighter gold text
    card: '220 85% 10%',            // Dark blue cards
    cardForeground: '45 100% 80%',  // Bright gold card text
    popover: '220 85% 10%',         // Same as card
    popoverForeground: '45 100% 80%',
    primary: '45 100% 70%',         // Brighter gold primary
    primaryForeground: '220 90% 8%', // Very dark blue text on gold
    secondary: '220 70% 15%',       // Darker muted blue
    secondaryForeground: '45 95% 85%', // Bright light gold
    muted: '220 80% 12%',           // Dark muted blue
    mutedForeground: '45 70% 70%',  // Muted bright gold
    accent: '45 100% 75%',          // Very bright gold accent
    accentForeground: '220 90% 8%', // Very dark blue on accent
    destructive: '0 62.8% 30.6%',   // Keep red for destructive
    destructiveForeground: '0 0% 98%',
    border: '220 60% 20%',          // Lighter blue borders for dark mode
    input: '220 70% 15%',           // Dark blue inputs
    ring: '45 100% 80%',            // Bright gold focus ring
    
    // Sidebar colors
    sidebarBackground: '240 5.9% 10%',
    sidebarForeground: '240 4.8% 95.9%',
    sidebarPrimary: '224.3 76.3% 48%',
    sidebarBorder: '240 3.7% 15.9%',
    
    // Charts
    chart1: '220 70% 50%',
    chart2: '160 60% 45%',
    chart3: '30 80% 55%',
    chart4: '280 65% 60%',
    chart5: '340 75% 55%',
  },
  
  // Typography
  typography: {
    fontFamily: 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)',
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
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
    '2xl': 48,
    '3xl': 64,
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
  const [h, s, l] = hsl.split(' ').map((v, i) => {
    const num = parseFloat(v.replace('%', ''));
    return i === 0 ? num : num / 100;
  });
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  
  let r = 0, g = 0, b = 0;
  
  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Get theme colors converted to hex for PDF use
 * @param isDark Whether to use dark theme
 * @returns Object with hex color values
 */
export function getPdfTheme(isDark = false) {
  const colorTheme = isDark ? themeConfig.dark : themeConfig.light;
  
  // Convert all HSL colors to hex
  const colors = Object.entries(colorTheme).reduce((acc, [key, hslValue]) => {
    acc[key] = hslToHex(hslValue);
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
 * Detect if user prefers dark mode (for PDF generation)
 * In a real implementation, you might pass this from the client
 */
export function getPreferredTheme(): 'light' | 'dark' {
  // For server-side PDF generation, default to light
  // You can enhance this to accept theme preference as a parameter
  return 'light';
}

/**
 * Get CSS custom property value in browser environment
 * @param property CSS custom property name (without --)
 * @returns CSS custom property value
 */
export function getCSSCustomProperty(property: string): string {
  if (typeof window === 'undefined') return '';
  
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
  if (typeof window === 'undefined') {
    return getPdfTheme();
  }
  
  // Example of reading live theme values (could be enhanced)
  const isDark = document.documentElement.classList.contains('dark');
  return getPdfTheme(isDark);
}