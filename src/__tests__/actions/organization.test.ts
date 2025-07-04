const { expect, describe, it, beforeEach } = require('@jest/globals');

import {
  createOrganization,
  deleteOrganization,
  getOrganizations,
  getUserOrganizationRole,
} from '@/app/actions/organization';
import { auth } from '@/auth';
import { createOrFindAccount } from '@/lib/auth/createAccount';
import { prisma } from '@/lib/prisma';

// Mock dependencies
jest.mock('@/auth');
jest.mock('@/lib/auth/createAccount');
jest.mock('@/lib/prisma', () => ({
  prisma: {
    organization: {
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
    organizationMember: {
      create: jest.fn(),
      deleteMany: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

describe('Organization Actions', () => {
  const mockAuth = auth as jest.MockedFunction<typeof auth>;
  const mockCreateOrFindAccount = createOrFindAccount as jest.MockedFunction<typeof createOrFindAccount>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrganization', () => {
    it('should create organization successfully when user is super admin', async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { id: '1', isSuperAdmin: true }
      } as any);

      const mockOrganization = { id: 'org-1', name: 'Test Org' };
      const mockUser = { id: 'user-1', password: 'temp-password' };

      (prisma.organization.create as jest.Mock).mockResolvedValue(mockOrganization);
      mockCreateOrFindAccount.mockResolvedValue(mockUser as any);
      (prisma.organizationMember.create as jest.Mock).mockResolvedValue({});

      const data = {
        name: 'Test Org',
        ownerEmail: 'owner@test.com',
        ownerName: 'Test Owner',
      };

      // Act
      const result = await createOrganization(data);

      // Assert
      expect(result).toEqual({
        organization: mockOrganization,
        ownerEmail: 'owner@test.com',
        temporaryPassword: 'temp-password',
      });

      expect(prisma.organization.create).toHaveBeenCalledWith({
        data: { name: 'Test Org' },
      });

      expect(mockCreateOrFindAccount).toHaveBeenCalledWith('owner@test.com', 'Test Owner');

      expect(prisma.organizationMember.create).toHaveBeenCalledWith({
        data: {
          organizationId: 'org-1',
          userId: 'user-1',
          role: 'OWNER',
        },
      });
    });

    it('should throw error when user is not super admin', async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { id: '1', isSuperAdmin: false }
      } as any);

      const data = {
        name: 'Test Org',
        ownerEmail: 'owner@test.com',
        ownerName: 'Test Owner',
      };

      // Act & Assert
      await expect(createOrganization(data)).rejects.toThrow('Unauthorized');
      expect(prisma.organization.create).not.toHaveBeenCalled();
    });

    it('should throw error when no session exists', async () => {
      // Arrange
      mockAuth.mockResolvedValue(null);

      const data = {
        name: 'Test Org',
        ownerEmail: 'owner@test.com',
        ownerName: 'Test Owner',
      };

      // Act & Assert
      await expect(createOrganization(data)).rejects.toThrow('Unauthorized');
    });

    it('should handle empty password from createOrFindAccount', async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { id: '1', isSuperAdmin: true }
      } as any);

      const mockOrganization = { id: 'org-1', name: 'Test Org' };
      const mockUser = { id: 'user-1', password: null };

      (prisma.organization.create as jest.Mock).mockResolvedValue(mockOrganization);
      mockCreateOrFindAccount.mockResolvedValue(mockUser as any);
      (prisma.organizationMember.create as jest.Mock).mockResolvedValue({});

      const data = {
        name: 'Test Org',
        ownerEmail: 'owner@test.com',
        ownerName: 'Test Owner',
      };

      // Act
      const result = await createOrganization(data);

      // Assert
      expect(result.temporaryPassword).toBe('');
    });
  });

  describe('getOrganizations', () => {
    it('should return organizations when user is super admin', async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { id: '1', isSuperAdmin: true }
      } as any);

      const mockOrganizations = [
        {
          id: 'org-1',
          name: 'Org 1',
          members: [
            {
              user: { id: 'user-1', name: 'User 1', email: 'user1@test.com' },
            },
          ],
        },
      ];

      (prisma.organization.findMany as jest.Mock).mockResolvedValue(mockOrganizations);

      // Act
      const result = await getOrganizations();

      // Assert
      expect(result).toEqual(mockOrganizations);
      expect(prisma.organization.findMany).toHaveBeenCalledWith({
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    });

    it('should throw error when user is not super admin', async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { id: '1', isSuperAdmin: false }
      } as any);

      // Act & Assert
      await expect(getOrganizations()).rejects.toThrow('Unauthorized');
      expect(prisma.organization.findMany).not.toHaveBeenCalled();
    });
  });

  describe('deleteOrganization', () => {
    it('should delete organization successfully when user is super admin', async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { id: '1', isSuperAdmin: true }
      } as any);

      const mockDeletedOrg = { id: 'org-1', name: 'Deleted Org' };

      (prisma.organizationMember.deleteMany as jest.Mock).mockResolvedValue({});
      (prisma.organization.delete as jest.Mock).mockResolvedValue(mockDeletedOrg);

      // Act
      const result = await deleteOrganization('org-1');

      // Assert
      expect(result).toEqual(mockDeletedOrg);
      expect(prisma.organizationMember.deleteMany).toHaveBeenCalledWith({
        where: { organizationId: 'org-1' },
      });
      expect(prisma.organization.delete).toHaveBeenCalledWith({
        where: { id: 'org-1' },
      });
    });

    it('should throw error when user is not super admin', async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { id: '1', isSuperAdmin: false }
      } as any);

      // Act & Assert
      await expect(deleteOrganization('org-1')).rejects.toThrow('Unauthorized');
      expect(prisma.organizationMember.deleteMany).not.toHaveBeenCalled();
    });

    it('should throw error when organization not found', async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { id: '1', isSuperAdmin: true }
      } as any);

      (prisma.organizationMember.deleteMany as jest.Mock).mockRejectedValue(new Error());

      // Act & Assert
      await expect(deleteOrganization('org-1')).rejects.toThrow('Organization not found');
    });
  });

  describe('getUserOrganizationRole', () => {
    it('should return user organization role when session exists', async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { id: 'user-1' }
      } as any);

      const mockRole = { role: 'OWNER' };

      (prisma.organizationMember.findFirst as jest.Mock).mockResolvedValue(mockRole);

      // Act
      const result = await getUserOrganizationRole('org-1', 'user-1');

      // Assert
      expect(result).toEqual(mockRole);
      expect(prisma.organizationMember.findFirst).toHaveBeenCalledWith({
        where: {
          organizationId: 'org-1',
          userId: 'user-1',
        },
        select: {
          role: true,
        },
      });
    });

    it('should return null when no session exists', async () => {
      // Arrange
      mockAuth.mockResolvedValue(null);

      // Act
      const result = await getUserOrganizationRole('org-1', 'user-1');

      // Assert
      expect(result).toBeNull();
      expect(prisma.organizationMember.findFirst).not.toHaveBeenCalled();
    });

    it('should throw error when database operation fails', async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { id: 'user-1' }
      } as any);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (prisma.organizationMember.findFirst as jest.Mock).mockRejectedValue(new Error('DB Error'));

      // Act & Assert
      await expect(getUserOrganizationRole('org-1', 'user-1')).rejects.toThrow('Failed to get user organisation role');
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});
