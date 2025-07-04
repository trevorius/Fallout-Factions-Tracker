const { expect, describe, it, beforeEach, jest } = require('@jest/globals');

import { renderHook, act } from '@testing-library/react';
import { useToast, toast } from '@/hooks/use-toast';

describe('use-toast', () => {
  beforeEach(() => {
    // Reset toast state between tests by clearing the listeners
    jest.clearAllMocks();
  });

  describe('useToast hook', () => {
    it('should return initial empty toasts array', () => {
      const { result } = renderHook(() => useToast());
      
      expect(result.current.toasts).toEqual([]);
      expect(typeof result.current.toast).toBe('function');
      expect(typeof result.current.dismiss).toBe('function');
    });

    it('should add a toast when toast function is called', () => {
      const { result } = renderHook(() => useToast());
      
      act(() => {
        result.current.toast({
          title: 'Test Toast',
          description: 'This is a test',
        });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]).toMatchObject({
        title: 'Test Toast',
        description: 'This is a test',
        open: true,
      });
      expect(result.current.toasts[0].id).toBeDefined();
    });

    it('should add multiple toasts', () => {
      const { result } = renderHook(() => useToast());
      
      act(() => {
        result.current.toast({ title: 'Toast 1' });
        result.current.toast({ title: 'Toast 2' });
        result.current.toast({ title: 'Toast 3' });
      });

      expect(result.current.toasts).toHaveLength(3);
      expect(result.current.toasts[0].title).toBe('Toast 1');
      expect(result.current.toasts[1].title).toBe('Toast 2');
      expect(result.current.toasts[2].title).toBe('Toast 3');
    });

    it('should dismiss a specific toast', () => {
      const { result } = renderHook(() => useToast());
      
      act(() => {
        result.current.toast({ title: 'Toast 1' });
        result.current.toast({ title: 'Toast 2' });
      });

      const toastId = result.current.toasts[0].id;

      act(() => {
        result.current.dismiss(toastId);
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe('Toast 2');
    });

    it('should dismiss all toasts when dismiss is called without ID', () => {
      const { result } = renderHook(() => useToast());
      
      act(() => {
        result.current.toast({ title: 'Toast 1' });
        result.current.toast({ title: 'Toast 2' });
        result.current.toast({ title: 'Toast 3' });
      });

      act(() => {
        result.current.dismiss();
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('should update an existing toast', () => {
      const { result } = renderHook(() => useToast());
      
      let toastId: string;
      
      act(() => {
        const { id } = result.current.toast({ title: 'Original Title' });
        toastId = id;
      });

      act(() => {
        const toastToUpdate = result.current.toasts.find(t => t.id === toastId);
        if (toastToUpdate && toastToUpdate.update) {
          toastToUpdate.update({
            id: toastId,
            title: 'Updated Title',
            description: 'New description',
          });
        }
      });

      expect(result.current.toasts[0]).toMatchObject({
        title: 'Updated Title',
        description: 'New description',
      });
    });

    it('should handle onOpenChange callback', () => {
      const { result } = renderHook(() => useToast());
      
      act(() => {
        result.current.toast({ title: 'Test Toast' });
      });

      const toast = result.current.toasts[0];

      act(() => {
        if (toast.onOpenChange) {
          toast.onOpenChange(false);
        }
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('should limit toasts to maximum of 1 by default', () => {
      const { result } = renderHook(() => useToast());
      
      act(() => {
        result.current.toast({ title: 'Toast 1' });
        result.current.toast({ title: 'Toast 2' });
      });

      // Should only have the latest toast
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe('Toast 2');
    });

    it('should handle toast with all properties', () => {
      const { result } = renderHook(() => useToast());
      
      const toastProps = {
        title: 'Complete Toast',
        description: 'With all properties',
        action: { altText: 'Undo', onClick: jest.fn() },
        duration: 5000,
        variant: 'destructive' as const,
      };

      act(() => {
        result.current.toast(toastProps);
      });

      expect(result.current.toasts[0]).toMatchObject({
        title: toastProps.title,
        description: toastProps.description,
        duration: toastProps.duration,
        variant: toastProps.variant,
      });
    });
  });

  describe('toast function', () => {
    it('should work independently from hook', () => {
      const { result: result1 } = renderHook(() => useToast());
      const { result: result2 } = renderHook(() => useToast());
      
      act(() => {
        toast({ title: 'Global Toast' });
      });

      // Both hooks should see the same toast
      expect(result1.current.toasts).toHaveLength(1);
      expect(result2.current.toasts).toHaveLength(1);
      expect(result1.current.toasts[0].title).toBe('Global Toast');
      expect(result2.current.toasts[0].title).toBe('Global Toast');
    });

    it('should return toast object with id, dismiss, and update functions', () => {
      let toastResult: any;
      
      act(() => {
        toastResult = toast({ title: 'Test' });
      });

      expect(toastResult).toHaveProperty('id');
      expect(typeof toastResult.id).toBe('string');
      expect(typeof toastResult.dismiss).toBe('function');
      expect(typeof toastResult.update).toBe('function');
    });

    it('should dismiss toast using returned dismiss function', () => {
      const { result } = renderHook(() => useToast());
      let toastResult: any;
      
      act(() => {
        toastResult = toast({ title: 'Test' });
      });

      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        toastResult.dismiss();
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('should update toast using returned update function', () => {
      const { result } = renderHook(() => useToast());
      let toastResult: any;
      
      act(() => {
        toastResult = toast({ title: 'Original' });
      });

      act(() => {
        toastResult.update({
          id: toastResult.id,
          title: 'Updated',
          description: 'New description',
        });
      });

      expect(result.current.toasts[0]).toMatchObject({
        title: 'Updated',
        description: 'New description',
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid toast additions', () => {
      const { result } = renderHook(() => useToast());
      
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.toast({ title: `Toast ${i}` });
        }
      });

      // Should only keep the last toast due to limit
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe('Toast 9');
    });

    it('should generate unique IDs for each toast', () => {
      const { result } = renderHook(() => useToast());
      const ids = new Set();
      
      act(() => {
        for (let i = 0; i < 5; i++) {
          const { id } = result.current.toast({ title: `Toast ${i}` });
          ids.add(id);
        }
      });

      // All IDs should be unique (even though only last toast remains)
      expect(ids.size).toBe(5);
    });

    it('should handle dismiss of non-existent toast ID gracefully', () => {
      const { result } = renderHook(() => useToast());
      
      act(() => {
        result.current.toast({ title: 'Test' });
      });

      expect(() => {
        act(() => {
          result.current.dismiss('non-existent-id');
        });
      }).not.toThrow();

      // Original toast should still be there
      expect(result.current.toasts).toHaveLength(1);
    });
  });
});