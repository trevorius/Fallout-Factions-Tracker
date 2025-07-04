import { expect, describe, it, beforeEach } from '@jest/globals';

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

// Type the mocked functions
const mockAuth = auth as jest.MockedFunction<typeof auth>;
const mockCreateOrFindAccount = createOrFindAccount as jest.MockedFunction<typeof createOrFindAccount>;
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Organization Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrganization', () => {
    it('should create organization successfully when user is super admin', async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { 
          id: '1', 
          email: 'admin@test.com',
          name: 'Admin',
          isSuperAdmin: true 
        },
        expires: new Date().toISOString()
      });

      const mockOrganization = { 
        id: 'org-1', 
        name: 'Test Org',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const mockUser = { 
        id: 'user-1', 
        email: 'owner@test.com',
        name: 'Test Owner',
        password: 'temp-password',
        salt: 'salt',
        isSuperAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.organization.create.mockResolvedValue(mockOrganization);
      mockCreateOrFindAccount.mockResolvedValue(mockUser);
      mockPrisma.organizationMember.create.mockResolvedValue({
        id: 'member-1',
        organizationId: 'org-1',
        userId: 'user-1',
        role: 'OWNER',
        createdAt: new Date(),
        updatedAt: new Date()
      });

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

      expect(mockPrisma.organization.create).toHaveBeenCalledWith({
        data: { name: 'Test Org' },
      });

      expect(mockCreateOrFindAccount).toHaveBeenCalledWith('owner@test.com', 'Test Owner');

      expect(mockPrisma.organizationMember.create).toHaveBeenCalledWith({
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
        user: { 
          id: '1', 
          email: 'user@test.com',
          name: 'User',
          isSuperAdmin: false 
        },
        expires: new Date().toISOString()
      });

      const data = {
        name: 'Test Org',
        ownerEmail: 'owner@test.com',
        ownerName: 'Test Owner',
      };

      // Act & Assert
      await expect(createOrganization(data)).rejects.toThrow('Unauthorized');
      expect(mockPrisma.organization.create).not.toHaveBeenCalled();
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
        user: { 
          id: '1', 
          email: 'admin@test.com',
          name: 'Admin',
          isSuperAdmin: true 
        },
        expires: new Date().toISOString()
      });

      const mockOrganization = { 
        id: 'org-1', 
        name: 'Test Org',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const mockUser = { 
        id: 'user-1', 
        email: 'owner@test.com',
        name: 'Test Owner',
        password: null,
        salt: 'salt',
        isSuperAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.organization.create.mockResolvedValue(mockOrganization);
      mockCreateOrFindAccount.mockResolvedValue(mockUser);
      mockPrisma.organizationMember.create.mockResolvedValue({
        id: 'member-1',
        organizationId: 'org-1',
        userId: 'user-1',
        role: 'OWNER',
        createdAt: new Date(),
        updatedAt: new Date()
      });

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
        user: { 
          id: '1', 
          email: 'admin@test.com',
          name: 'Admin',
          isSuperAdmin: true 
        },
        expires: new Date().toISOString()
      });

      const mockOrganizations = [
        {
          id: 'org-1',
          name: 'Org 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          members: [
            {
              id: 'member-1',
              organizationId: 'org-1',
              userId: 'user-1',
              role: 'OWNER' as const,
              createdAt: new Date(),
              updatedAt: new Date(),
              user: { 
                id: 'user-1', 
                name: 'User 1', 
                email: 'user1@test.com' 
              },
            },
          ],
        },
      ];

      mockPrisma.organization.findMany.mockResolvedValue(mockOrganizations);

      // Act
      const result = await getOrganizations();

      // Assert
      expect(result).toEqual(mockOrganizations);
      expect(mockPrisma.organization.findMany).toHaveBeenCalledWith({
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
        user: { 
          id: '1', 
          email: 'user@test.com',
          name: 'User',
          isSuperAdmin: false 
        },
        expires: new Date().toISOString()
      });

      // Act & Assert
      await expect(getOrganizations()).rejects.toThrow('Unauthorized');
      expect(mockPrisma.organization.findMany).not.toHaveBeenCalled();
    });
  });

  describe('deleteOrganization', () => {
    it('should delete organization successfully when user is super admin', async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { 
          id: '1', 
          email: 'admin@test.com',
          name: 'Admin',
          isSuperAdmin: true 
        },
        expires: new Date().toISOString()
      });

      const mockDeletedOrg = { 
        id: 'org-1', 
        name: 'Deleted Org',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.organizationMember.deleteMany.mockResolvedValue({ count: 1 });
      mockPrisma.organization.delete.mockResolvedValue(mockDeletedOrg);

      // Act
      const result = await deleteOrganization('org-1');

      // Assert
      expect(result).toEqual(mockDeletedOrg);
      expect(mockPrisma.organizationMember.deleteMany).toHaveBeenCalledWith({
        where: { organizationId: 'org-1' },
      });
      expect(mockPrisma.organization.delete).toHaveBeenCalledWith({
        where: { id: 'org-1' },
      });
    });

    it('should throw error when user is not super admin', async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { 
          id: '1', 
          email: 'user@test.com',
          name: 'User',
          isSuperAdmin: false 
        },
        expires: new Date().toISOString()
      });

      // Act & Assert
      await expect(deleteOrganization('org-1')).rejects.toThrow('Unauthorized');
      expect(mockPrisma.organizationMember.deleteMany).not.toHaveBeenCalled();
    });

    it('should throw error when organization not found', async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { 
          id: '1', 
          email: 'admin@test.com',
          name: 'Admin',
          isSuperAdmin: true 
        },
        expires: new Date().toISOString()
      });

      mockPrisma.organizationMember.deleteMany.mockRejectedValue(new Error());

      // Act & Assert
      await expect(deleteOrganization('org-1')).rejects.toThrow('Organization not found');
    });
  });

  describe('getUserOrganizationRole', () => {
    it('should return user organization role when session exists', async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { 
          id: 'user-1',
          email: 'user@test.com',
          name: 'User'
        },
        expires: new Date().toISOString()
      });

      const mockRole = { role: 'OWNER' as const };

      mockPrisma.organizationMember.findFirst.mockResolvedValue({
        id: 'member-1',
        organizationId: 'org-1',
        userId: 'user-1',
        role: 'OWNER',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Act
      const result = await getUserOrganizationRole('org-1', 'user-1');

      // Assert
      expect(result).toEqual({ role: 'OWNER' });
      expect(mockPrisma.organizationMember.findFirst).toHaveBeenCalledWith({
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
      expect(mockPrisma.organizationMember.findFirst).not.toHaveBeenCalled();
    });

    it('should throw error when database operation fails', async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { 
          id: 'user-1',
          email: 'user@test.com',
          name: 'User'
        },
        expires: new Date().toISOString()
      });

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockPrisma.organizationMember.findFirst.mockRejectedValue(new Error('DB Error'));

      // Act & Assert
      await expect(getUserOrganizationRole('org-1', 'user-1')).rejects.toThrow('Failed to get user organisation role');
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});
