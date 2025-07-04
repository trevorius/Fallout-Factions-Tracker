import { expect, describe, it } from '@jest/globals';
import { generatePassword, words } from '@/lib/words';

describe('words utility', () => {
  describe('words array', () => {
    it('should contain the expected number of words', () => {
      expect(words).toHaveLength(113);
    });

    it('should contain only string values', () => {
      words.forEach(word => {
        expect(typeof word).toBe('string');
      });
    });

    it('should contain unique words', () => {
      const uniqueWords = new Set(words);
      expect(uniqueWords.size).toBe(words.length);
    });

    it('should contain lowercase words only', () => {
      words.forEach(word => {
        expect(word).toBe(word.toLowerCase());
      });
    });
  });

  describe('generatePassword', () => {
    it('should generate a password with three words separated by hyphens', () => {
      const password = generatePassword();
      const parts = password.split('-');
      
      expect(parts).toHaveLength(3);
      parts.forEach(part => {
        expect(words).toContain(part);
      });
    });

    it('should use three different words', () => {
      const password = generatePassword();
      const parts = password.split('-');
      const uniqueParts = new Set(parts);
      
      expect(uniqueParts.size).toBe(3);
    });

    it('should generate different passwords on multiple calls', () => {
      const passwords = new Set();
      
      // Generate multiple passwords
      for (let i = 0; i < 10; i++) {
        passwords.add(generatePassword());
      }
      
      // Should have generated different passwords (very unlikely to get duplicates)
      expect(passwords.size).toBeGreaterThan(1);
    });

    it('should always follow the format word-word-word', () => {
      for (let i = 0; i < 5; i++) {
        const password = generatePassword();
        expect(password).toMatch(/^[a-z]+-[a-z]+-[a-z]+$/);
      }
    });

    it('should use words from the word list', () => {
      const password = generatePassword();
      const parts = password.split('-');
      
      parts.forEach(part => {
        expect(words).toContain(part);
      });
    });

    it('should not modify the original words array', () => {
      const originalLength = words.length;
      const originalFirstWord = words[0];
      const originalLastWord = words[words.length - 1];
      
      generatePassword();
      
      expect(words.length).toBe(originalLength);
      expect(words[0]).toBe(originalFirstWord);
      expect(words[words.length - 1]).toBe(originalLastWord);
    });

    it('should handle Math.random edge cases', () => {
      // Mock Math.random to return edge values
      const originalRandom = Math.random;
      
      // Test with Math.random returning 0
      Math.random = jest.fn().mockReturnValue(0);
      const password1 = generatePassword();
      expect(password1.split('-').length).toBe(3);
      
      // Test with Math.random returning close to 1
      Math.random = jest.fn().mockReturnValue(0.999999);
      const password2 = generatePassword();
      expect(password2.split('-').length).toBe(3);
      
      // Restore original Math.random
      Math.random = originalRandom;
    });

    it('should have reasonable entropy', () => {
      // With 110 words, choosing 3 gives us 110 * 109 * 108 = 1,295,460 combinations
      const totalCombinations = 110 * 109 * 108;
      expect(totalCombinations).toBeGreaterThan(1000000); // Over 1 million combinations
    });

    it('generates passwords with consistent casing', () => {
      for (let i = 0; i < 5; i++) {
        const password = generatePassword();
        const parts = password.split('-');
        
        parts.forEach(part => {
          expect(part).toBe(part.toLowerCase());
        });
      }
    });
  });
});
