import { expect, describe, it, beforeEach } from '@jest/globals';
import { getUserOrganizations } from '@/app/actions/user';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import type { Session } from 'next-auth';
import type { Organization, OrganizationMember } from '@prisma/client';

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
  const mockPrismaOrganizationMember = prisma.organizationMember as unknown as {
    findMany: jest.MockedFunction<typeof prisma.organizationMember.findMany>;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserOrganizations', () => {
    it('should return user organizations when session exists', async () => {
      // Arrange
      const mockSession: Session = {
        user: { 
          id: 'user-1',
          email: 'user@test.com',
          name: 'Test User'
        },
        expires: new Date().toISOString()
      };
      mockAuth.mockResolvedValue(mockSession);

      const mockMemberships = [
        {
          organization: {
            id: 'org-1',
            name: 'Test Organization',
          },
          role: 'MEMBER',
        },
      ];

      const expectedResult = [
        {
          id: 'org-1',
          name: 'Test Organization',
          role: 'MEMBER',
        },
      ];

      mockPrismaOrganizationMember.findMany.mockResolvedValue(mockMemberships as any);

      // Act
      const result = await getUserOrganizations();

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockPrismaOrganizationMember.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
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
      expect(mockPrismaOrganizationMember.findMany).not.toHaveBeenCalled();
    });

    it('should return empty array when user has no organizations', async () => {
      // Arrange
      const mockSession: Session = {
        user: { 
          id: 'user-1',
          email: 'user@test.com',
          name: 'Test User'
        },
        expires: new Date().toISOString()
      };
      mockAuth.mockResolvedValue(mockSession);

      mockPrismaOrganizationMember.findMany.mockResolvedValue([]);

      // Act
      const result = await getUserOrganizations();

      // Assert
      expect(result).toEqual([]);
      expect(mockPrismaOrganizationMember.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
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
      const mockSession: Session = {
        user: { 
          id: 'user-1',
          email: 'user@test.com',
          name: 'Test User'
        },
        expires: new Date().toISOString()
      };
      mockAuth.mockResolvedValue(mockSession);

      mockPrismaOrganizationMember.findMany.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(getUserOrganizations()).rejects.toThrow('Database error');
    });
  });
});