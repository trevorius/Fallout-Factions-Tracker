import { expect, describe, it } from '@jest/globals';

import { Theme, isValidTheme, getValidTheme } from '@/lib/types/theme';

describe('Theme utilities', () => {
  describe('Theme enum', () => {
    it('should have all expected theme values', () => {
      expect(Theme.LIGHT).toBe('light');
      expect(Theme.DARK).toBe('dark');
      expect(Theme.BLUE).toBe('blue');
    });

    it('should have exactly 3 theme options', () => {
      const themeValues = Object.values(Theme);
      expect(themeValues).toHaveLength(3);
    });

    it('should have unique values', () => {
      const themeValues = Object.values(Theme);
      const uniqueValues = new Set(themeValues);
      expect(uniqueValues.size).toBe(themeValues.length);
    });
  });

  describe('isValidTheme', () => {
    it('should return true for valid theme values', () => {
      expect(isValidTheme('light')).toBe(true);
      expect(isValidTheme('dark')).toBe(true);
      expect(isValidTheme('blue')).toBe(true);
    });

    it('should return false for invalid theme values', () => {
      expect(isValidTheme('invalid')).toBe(false);
      expect(isValidTheme('Light')).toBe(false); // case sensitive
      expect(isValidTheme('DARK')).toBe(false); // case sensitive
      expect(isValidTheme('')).toBe(false);
      expect(isValidTheme('auto')).toBe(false);
      expect(isValidTheme('default')).toBe(false);
    });

    it('should return false for non-string values', () => {
      expect(isValidTheme(null as unknown as string)).toBe(false);
      expect(isValidTheme(undefined as unknown as string)).toBe(false);
      expect(isValidTheme(123 as unknown as string)).toBe(false);
      expect(isValidTheme({} as unknown as string)).toBe(false);
      expect(isValidTheme([] as unknown as string)).toBe(false);
      expect(isValidTheme(true as unknown as string)).toBe(false);
    });

    it('should work as type guard', () => {
      const testValue: string = 'light';
      
      if (isValidTheme(testValue)) {
        // TypeScript should recognize testValue as ThemeName here
        const theme: Theme = testValue;
        expect(theme).toBe('light');
      }
    });
  });

  describe('getValidTheme', () => {
    it('should return valid theme values as-is', () => {
      expect(getValidTheme('light')).toBe('light');
      expect(getValidTheme('dark')).toBe('dark');
      expect(getValidTheme('blue')).toBe('blue');
    });

    it('should return light theme for invalid values', () => {
      expect(getValidTheme('invalid')).toBe('light');
      expect(getValidTheme('Light')).toBe('light');
      expect(getValidTheme('DARK')).toBe('light');
      expect(getValidTheme('')).toBe('light');
      expect(getValidTheme('auto')).toBe('light');
    });

    it('should return light theme for null', () => {
      expect(getValidTheme(null)).toBe('light');
    });

    it('should return light theme for undefined', () => {
      expect(getValidTheme(undefined)).toBe('light');
    });

    it('should handle type coercion gracefully', () => {
      expect(getValidTheme(123 as unknown as string)).toBe('light');
      expect(getValidTheme({} as unknown as string)).toBe('light');
      expect(getValidTheme([] as unknown as string)).toBe('light');
      expect(getValidTheme(true as unknown as string)).toBe('light');
      expect(getValidTheme(false as unknown as string)).toBe('light');
    });

    it('should always return a valid theme', () => {
      const testCases: unknown[] = [
        'light', 'dark', 'blue', 'invalid', null, undefined,
        '', 'random', 123, {}, [], true, false
      ];

      testCases.forEach(testCase => {
        const result = getValidTheme(testCase as string);
        expect(isValidTheme(result)).toBe(true);
      });
    });

    it('should return light as the default fallback', () => {
      // Test multiple invalid cases to ensure consistent fallback
      const invalidCases: unknown[] = [
        null, undefined, '', 'invalid', 'unknown',
        123, {}, [], true, false, NaN, Infinity
      ];

      invalidCases.forEach(testCase => {
        expect(getValidTheme(testCase as string)).toBe(Theme.LIGHT);
      });
    });

    it('should handle edge cases with whitespace', () => {
      expect(getValidTheme(' light ')).toBe('light'); // with spaces
      expect(getValidTheme('\tlight\n')).toBe('light'); // with tabs/newlines
      expect(getValidTheme('light ')).toBe('light'); // trailing space
      expect(getValidTheme(' light')).toBe('light'); // leading space
    });

    it('should be case sensitive', () => {
      // These should all fallback to light
      expect(getValidTheme('Light')).toBe('light');
      expect(getValidTheme('LIGHT')).toBe('light');
      expect(getValidTheme('Dark')).toBe('light');
      expect(getValidTheme('DARK')).toBe('light');
      expect(getValidTheme('Blue')).toBe('light');
      expect(getValidTheme('BLUE')).toBe('light');
    });
  });

  describe('Integration tests', () => {
    it('should work together for validation flow', () => {
      const userInput = 'dark';
      
      // Validate input
      if (isValidTheme(userInput)) {
        expect(getValidTheme(userInput)).toBe(userInput);
      }
    });

    it('should provide safe fallback for invalid input', () => {
      const invalidInput = 'invalid-theme';
      
      // Even without validation, getValidTheme provides safety
      const safeTheme = getValidTheme(invalidInput);
      expect(isValidTheme(safeTheme)).toBe(true);
      expect(safeTheme).toBe('light');
    });

    it('should handle localStorage-like scenarios', () => {
      // Simulate reading from localStorage which might return null
      const storedTheme: string | null = null;
      const theme = getValidTheme(storedTheme);
      
      expect(isValidTheme(theme)).toBe(true);
      expect(theme).toBe('light');
    });
  });
});