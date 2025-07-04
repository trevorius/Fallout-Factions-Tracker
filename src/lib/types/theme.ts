/**
 * Global theme enumeration for consistent theme management
 * Makes it easy to add new themes in the future
 */
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  BLUE = 'blue', // Game-like Blue & Gold theme
}

/**
 * Type-safe theme values
 */
export type ThemeName = `${Theme}`;

/**
 * Available theme options for UI components
 */
export const THEME_OPTIONS = [
  { value: Theme.LIGHT, label: 'Light', icon: 'Sun' },
  { value: Theme.DARK, label: 'Dark', icon: 'Moon' },
  { value: Theme.BLUE, label: 'Game Mode', icon: 'Gamepad2' },
] as const;

/**
 * Check if a string is a valid theme
 */
export function isValidTheme(theme: string): theme is ThemeName {
  return Object.values(Theme).includes(theme as Theme);
}

/**
 * Get theme with fallback to light
 */
export function getValidTheme(theme: string | null | undefined): ThemeName {
  return theme && isValidTheme(theme) ? theme : Theme.LIGHT;
}

/**
 * Get current theme from client-side DOM detection
 * This is a helper for when theme needs to be detected on the client
 */
export function detectThemeFromDOM(): ThemeName {
  if (typeof window === 'undefined') {
    return Theme.LIGHT;
  }
  
  const htmlElement = document.documentElement;
  if (htmlElement.classList.contains(Theme.DARK)) {
    return Theme.DARK;
  } else if (htmlElement.classList.contains(Theme.BLUE)) {
    return Theme.BLUE;
  } else {
    return Theme.LIGHT;
  }
}