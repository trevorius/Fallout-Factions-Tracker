const { expect, describe, it, beforeEach } = require('@jest/globals');

import { getUserOrganizations } from '@/app/actions/user';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// Mock dependencies
jest.mock('@/auth');
jest.mock('@/lib/prisma', () => ({
  prisma: {
    organizationMember: {
      findMany: jest.fn(),
    },
  },
}));

describe('User Actions', () => {
  const mockAuth = auth as jest.MockedFunction<typeof auth>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserOrganizations', () => {
    it('should return user organizations with roles when user is authenticated', async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { id: 'user-1' }
      } as any);

      const mockMemberships = [
        {
          organization: {
            id: 'org-1',
            name: 'Organization 1',
          },
          role: 'OWNER',
        },
        {
          organization: {
            id: 'org-2',
            name: 'Organization 2',
          },
          role: 'USER',
        },
      ];

      (prisma.organizationMember.findMany as jest.Mock).mockResolvedValue(mockMemberships);

      // Act
      const result = await getUserOrganizations();

      // Assert
      expect(result).toEqual([
        {
          id: 'org-1',
          name: 'Organization 1',
          role: 'OWNER',
        },
        {
          id: 'org-2',
          name: 'Organization 2',
          role: 'USER',
        },
      ]);

      expect(prisma.organizationMember.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
        },
        select: {
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
          role: true,
        },
      });
    });

    it('should return empty array when no session exists', async () => {
      // Arrange
      mockAuth.mockResolvedValue(null);

      // Act
      const result = await getUserOrganizations();

      // Assert
      expect(result).toEqual([]);
      expect(prisma.organizationMember.findMany).not.toHaveBeenCalled();
    });

    it('should return empty array when user is not in session', async () => {
      // Arrange
      mockAuth.mockResolvedValue({} as any);

      // Act
      const result = await getUserOrganizations();

      // Assert
      expect(result).toEqual([]);
      expect(prisma.organizationMember.findMany).not.toHaveBeenCalled();
    });

    it('should return empty array when user has no organizations', async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { id: 'user-1' }
      } as any);

      (prisma.organizationMember.findMany as jest.Mock).mockResolvedValue([]);

      // Act
      const result = await getUserOrganizations();

      // Assert
      expect(result).toEqual([]);
      expect(prisma.organizationMember.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
        },
        select: {
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
          role: true,
        },
      });
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { id: 'user-1' }
      } as any);

      (prisma.organizationMember.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(getUserOrganizations()).rejects.toThrow('Database error');
    });
  });
});