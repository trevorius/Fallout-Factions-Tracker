const { expect, describe, it } = require('@jest/globals');

import { cn } from '@/lib/utils';

describe('cn utility function', () => {
  it('merges class names correctly', () => {
    const result = cn('base-class', 'additional-class');
    expect(result).toBe('base-class additional-class');
  });

  it('handles conditional class names', () => {
    const condition = true;
    const result = cn('base-class', condition && 'conditional-class');
    expect(result).toBe('base-class conditional-class');
  });

  it('filters out falsy values', () => {
    const result = cn('base-class', false, null, undefined, '', 'valid-class');
    expect(result).toBe('base-class valid-class');
  });

  it('merges tailwind classes with proper override behavior', () => {
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toBe('py-1 px-4');
  });

  it('handles arrays of class names', () => {
    const result = cn(['base-class', 'array-class'], 'additional-class');
    expect(result).toBe('base-class array-class additional-class');
  });

  it('handles objects with boolean values', () => {
    const result = cn({
      'base-class': true,
      'excluded-class': false,
      'included-class': true,
    });
    expect(result).toBe('base-class included-class');
  });

  it('returns empty string for no arguments', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('returns empty string for all falsy arguments', () => {
    const result = cn(false, null, undefined, '');
    expect(result).toBe('');
  });

  it('properly merges complex tailwind utilities', () => {
    const result = cn(
      'bg-red-500 hover:bg-red-600',
      'bg-blue-500 hover:bg-blue-600'
    );
    expect(result).toBe('bg-blue-500 hover:bg-blue-600');
  });

  it('preserves non-conflicting classes', () => {
    const result = cn(
      'text-lg font-bold',
      'bg-blue-500',
      'p-4'
    );
    expect(result).toBe('text-lg font-bold bg-blue-500 p-4');
  });

  it('handles responsive and state variants correctly', () => {
    const result = cn(
      'md:px-4 lg:px-6',
      'md:px-8'
    );
    expect(result).toBe('lg:px-6 md:px-8');
  });

  it('handles nested arrays and objects', () => {
    const result = cn(
      'base',
      ['array-1', ['nested-array']],
      {
        'object-true': true,
        'object-false': false,
      }
    );
    expect(result).toBe('base array-1 nested-array object-true');
  });

  it('handles repeated class names', () => {
    const result = cn('duplicate', 'duplicate', 'unique');
    // cn doesn't deduplicate by design - tailwind-merge handles this differently
    expect(result).toBe('duplicate duplicate unique');
  });

  it('handles number values by converting to string', () => {
    const result = cn('class', 123);
    expect(result).toBe('class 123');
  });

  it('handles mixed input types', () => {
    const result = cn(
      'string-class',
      ['array-class'],
      { 'object-class': true },
      false,
      null,
      undefined,
      ''
    );
    expect(result).toBe('string-class array-class object-class');
  });

  describe('edge cases', () => {
    it('should handle arrays of classes', () => {
      const result = cn(['class1', 'class2'], ['class3', 'class4']);
      expect(result).toBe('class1 class2 class3 class4');
    });

    it('should handle nested arrays', () => {
      const result = cn(['class1', ['class2', 'class3']], 'class4');
      expect(result).toBe('class1 class2 class3 class4');
    });

    it('should handle objects with boolean values', () => {
      const result = cn({
        'active': true,
        'disabled': false,
        'highlighted': true,
      });
      expect(result).toBe('active highlighted');
    });

    it('should handle mixed types', () => {
      const result = cn(
        'static-class',
        ['array-class'],
        { 'object-class': true },
        false,
        null,
        undefined,
        ''
      );
      expect(result).toBe('static-class array-class object-class');
    });

    it('should handle complex nested structures', () => {
      const condition = true;
      const result = cn(
        'base',
        condition && 'conditional',
        {
          'object-true': true,
          'object-false': false,
        },
        ['array1', condition ? 'array2' : ''],
      );
      expect(result).toBe('base conditional object-true array1 array2');
    });

    it('should return empty string for all falsy values', () => {
      const result = cn(false, null, undefined, '', 0, NaN);
      expect(result).toBe('');
    });

    it('should handle numeric values by converting to string', () => {
      const result = cn(123, 456.789);
      expect(result).toBe('123 456.789');
    });

    it('should handle function that returns a class value', () => {
      const getClass = () => 'dynamic-class';
      const result = cn(getClass());
      expect(result).toBe('dynamic-class');
    });

    it('should handle Symbol by converting to string', () => {
      const sym = Symbol('test');
      const result = cn(sym as unknown as string);
      expect(result).toBe('');
    });
  });
});