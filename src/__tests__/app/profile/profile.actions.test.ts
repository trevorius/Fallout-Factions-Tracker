const { expect, describe, it, beforeEach } = require('@jest/globals');

import { updateProfile } from '@/app/profile/profile.actions';
import { auth } from '@/auth';
import { hashPassword } from '@/lib/auth.utils';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Mock dependencies
jest.mock('@/auth');
jest.mock('@/lib/auth.utils');
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Profile Actions', () => {
  const mockAuth = auth as jest.MockedFunction<typeof auth>;
  const mockHashPassword = hashPassword as jest.MockedFunction<typeof hashPassword>;
  const mockRevalidatePath = revalidatePath as jest.MockedFunction<typeof revalidatePath>;

  const mockSession = {
    user: {
      id: 'user-123',
      email: 'user@example.com',
      name: 'Test User',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateProfile', () => {
    describe('Authentication', () => {
      it('should throw error when user is not authenticated', async () => {
        mockAuth.mockResolvedValue(null);

        const result = await updateProfile({ field: 'name', value: 'New Name' });

        expect(result).toEqual({
          success: false,
          error: 'Unauthorized',
        });
        expect(prisma.user.update).not.toHaveBeenCalled();
      });

      it('should throw error when session has no user', async () => {
        mockAuth.mockResolvedValue({} as any);

        const result = await updateProfile({ field: 'name', value: 'New Name' });

        expect(result).toEqual({
          success: false,
          error: 'Unauthorized',
        });
      });
    });

    describe('Name Update', () => {
      it('should successfully update name', async () => {
        mockAuth.mockResolvedValue(mockSession as any);
        const updatedUser = { ...mockSession.user, name: 'New Name' };
        (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

        const result = await updateProfile({ field: 'name', value: 'New Name' });

        expect(result).toEqual({
          success: true,
          data: updatedUser,
        });
        expect(prisma.user.update).toHaveBeenCalledWith({
          where: { id: 'user-123' },
          data: { name: 'New Name' },
        });
        expect(mockRevalidatePath).toHaveBeenCalledWith('/profile');
      });

      it('should handle empty name', async () => {
        mockAuth.mockResolvedValue(mockSession as any);
        const updatedUser = { ...mockSession.user, name: '' };
        (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

        const result = await updateProfile({ field: 'name', value: '' });

        expect(result).toEqual({
          success: true,
          data: updatedUser,
        });
      });
    });

    describe('Email Update', () => {
      it('should successfully update email with valid format', async () => {
        mockAuth.mockResolvedValue(mockSession as any);
        (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
        const updatedUser = { ...mockSession.user, email: 'newemail@example.com' };
        (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

        const result = await updateProfile({ field: 'email', value: 'newemail@example.com' });

        expect(result).toEqual({
          success: true,
          data: updatedUser,
        });
        expect(prisma.user.findFirst).toHaveBeenCalledWith({
          where: {
            email: 'newemail@example.com',
            NOT: { id: 'user-123' },
          },
        });
        expect(prisma.user.update).toHaveBeenCalledWith({
          where: { id: 'user-123' },
          data: { email: 'newemail@example.com' },
        });
      });

      it('should reject invalid email format', async () => {
        mockAuth.mockResolvedValue(mockSession as any);

        const invalidEmails = [
          'invalidemail',
          '@example.com',
          'user@',
          'user@.com',
          'user example@test.com',
          'user@example',
        ];

        for (const email of invalidEmails) {
          const result = await updateProfile({ field: 'email', value: email });
          expect(result).toEqual({
            success: false,
            error: 'Invalid email format',
          });
        }

        expect(prisma.user.update).not.toHaveBeenCalled();
      });

      it('should reject email if already taken', async () => {
        mockAuth.mockResolvedValue(mockSession as any);
        (prisma.user.findFirst as jest.Mock).mockResolvedValue({
          id: 'other-user',
          email: 'taken@example.com',
        });

        const result = await updateProfile({ field: 'email', value: 'taken@example.com' });

        expect(result).toEqual({
          success: false,
          error: 'Email already taken',
        });
        expect(prisma.user.update).not.toHaveBeenCalled();
      });
    });

    describe('Password Update', () => {
      it('should successfully update password with valid format', async () => {
        mockAuth.mockResolvedValue(mockSession as any);
        mockHashPassword.mockResolvedValue({
          hash: 'hashed-password',
          salt: 'salt-value',
        });
        const updatedUser = { ...mockSession.user, password: 'hashed-password' };
        (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

        const result = await updateProfile({ field: 'password', value: 'ValidPassword123' });

        expect(result).toEqual({
          success: true,
          data: updatedUser,
        });
        expect(mockHashPassword).toHaveBeenCalledWith('ValidPassword123');
        expect(prisma.user.update).toHaveBeenCalledWith({
          where: { id: 'user-123' },
          data: {
            password: 'hashed-password',
            salt: 'salt-value',
          },
        });
      });

      it('should reject password shorter than 12 characters', async () => {
        mockAuth.mockResolvedValue(mockSession as any);

        const result = await updateProfile({ field: 'password', value: 'Short1' });

        expect(result).toEqual({
          success: false,
          error: 'Password must be at least 12 characters long',
        });
        expect(mockHashPassword).not.toHaveBeenCalled();
      });

      it('should reject password without lowercase letter', async () => {
        mockAuth.mockResolvedValue(mockSession as any);

        const result = await updateProfile({ field: 'password', value: 'UPPERCASEONLY123' });

        expect(result).toEqual({
          success: false,
          error: 'Password must contain at least one lowercase letter',
        });
      });

      it('should reject password without uppercase letter', async () => {
        mockAuth.mockResolvedValue(mockSession as any);

        const result = await updateProfile({ field: 'password', value: 'lowercaseonly123' });

        expect(result).toEqual({
          success: false,
          error: 'Password must contain at least one uppercase letter',
        });
      });

      it('should accept valid passwords', async () => {
        mockAuth.mockResolvedValue(mockSession as any);
        mockHashPassword.mockResolvedValue({
          hash: 'hashed',
          salt: 'salt',
        });
        (prisma.user.update as jest.Mock).mockResolvedValue({});

        const validPasswords = [
          'ValidPassword123',
          'AnotherGoodPass456',
          'ComplexP@ssw0rd!',
          'LongPasswordWithMixedCase123',
        ];

        for (const password of validPasswords) {
          const result = await updateProfile({ field: 'password', value: password });
          expect(result.success).toBe(true);
        }
      });
    });

    describe('Error Handling', () => {
      it('should handle database errors gracefully', async () => {
        mockAuth.mockResolvedValue(mockSession as any);
        (prisma.user.update as jest.Mock).mockRejectedValue(new Error('Database error'));

        const result = await updateProfile({ field: 'name', value: 'New Name' });

        expect(result).toEqual({
          success: false,
          error: 'Database error',
        });
      });

      it('should handle non-Error exceptions', async () => {
        mockAuth.mockResolvedValue(mockSession as any);
        (prisma.user.update as jest.Mock).mockRejectedValue('String error');

        const result = await updateProfile({ field: 'name', value: 'New Name' });

        expect(result).toEqual({
          success: false,
          error: 'Failed to update profile',
        });
      });

      it('should handle hash password errors', async () => {
        mockAuth.mockResolvedValue(mockSession as any);
        mockHashPassword.mockRejectedValue(new Error('Hashing failed'));

        const result = await updateProfile({ field: 'password', value: 'ValidPassword123' });

        expect(result).toEqual({
          success: false,
          error: 'Hashing failed',
        });
      });
    });

    describe('Revalidation', () => {
      it('should revalidate path on successful update', async () => {
        mockAuth.mockResolvedValue(mockSession as any);
        (prisma.user.update as jest.Mock).mockResolvedValue({});

        await updateProfile({ field: 'name', value: 'New Name' });

        expect(mockRevalidatePath).toHaveBeenCalledWith('/profile');
        expect(mockRevalidatePath).toHaveBeenCalledTimes(1);
      });

      it('should not revalidate path on failed update', async () => {
        mockAuth.mockResolvedValue(mockSession as any);
        (prisma.user.update as jest.Mock).mockRejectedValue(new Error('Update failed'));

        await updateProfile({ field: 'name', value: 'New Name' });

        expect(mockRevalidatePath).not.toHaveBeenCalled();
      });
    });
  });
});