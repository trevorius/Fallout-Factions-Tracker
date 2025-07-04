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
import type { Session } from 'next-auth';
import type { User, Organization, OrganizationMember } from '@prisma/client';

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
const mockAuth = jest.mocked(auth);
const mockCreateOrFindAccount = createOrFindAccount as jest.MockedFunction<typeof createOrFindAccount>;

// Create typed mock helpers
const mockPrismaOrganization = {
  create: prisma.organization.create as jest.MockedFunction<typeof prisma.organization.create>,
  findMany: prisma.organization.findMany as jest.MockedFunction<typeof prisma.organization.findMany>,
  delete: prisma.organization.delete as jest.MockedFunction<typeof prisma.organization.delete>,
};

const mockPrismaOrganizationMember = {
  create: prisma.organizationMember.create as jest.MockedFunction<typeof prisma.organizationMember.create>,
  deleteMany: prisma.organizationMember.deleteMany as jest.MockedFunction<typeof prisma.organizationMember.deleteMany>,
  findFirst: prisma.organizationMember.findFirst as jest.MockedFunction<typeof prisma.organizationMember.findFirst>,
};

describe('Organization Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrganization', () => {
    it('should create organization successfully when user is super admin', async () => {
      // Arrange
      const mockSession: Session = {
        user: { 
          id: '1', 
          email: 'admin@test.com',
          name: 'Admin',
          isSuperAdmin: true 
        },
        expires: new Date().toISOString()
      };
      mockAuth.mockResolvedValue(mockSession);

      const mockOrganization: Organization = { 
        id: 'org-1', 
        name: 'Test Org',
        description: 'Test Organization Description',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const mockUser: User = { 
        id: 'user-1', 
        email: 'owner@test.com',
        name: 'Test Owner',
        password: 'temp-password',
        salt: 'salt',
        isSuperAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockMember: OrganizationMember = {
        id: 'member-1',
        organizationId: 'org-1',
        userId: 'user-1',
        role: 'OWNER',
        canPostMessages: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrismaOrganization.create.mockResolvedValue(mockOrganization);
      mockCreateOrFindAccount.mockResolvedValue(mockUser);
      mockPrismaOrganizationMember.create.mockResolvedValue(mockMember);

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

      expect(mockPrismaOrganization.create).toHaveBeenCalledWith({
        data: { name: 'Test Org' },
      });

      expect(mockCreateOrFindAccount).toHaveBeenCalledWith('owner@test.com', 'Test Owner');

      expect(mockPrismaOrganizationMember.create).toHaveBeenCalledWith({
        data: {
          organizationId: 'org-1',
          userId: 'user-1',
          role: 'OWNER',
        },
      });
    });

    it('should throw error when user is not super admin', async () => {
      // Arrange
      const mockSession: Session = {
        user: { 
          id: '1', 
          email: 'user@test.com',
          name: 'User',
          isSuperAdmin: false 
        },
        expires: new Date().toISOString()
      };
      mockAuth.mockResolvedValue(mockSession);

      const data = {
        name: 'Test Org',
        ownerEmail: 'owner@test.com',
        ownerName: 'Test Owner',
      };

      // Act & Assert
      await expect(createOrganization(data)).rejects.toThrow('Unauthorized');
      expect(mockPrismaOrganization.create).not.toHaveBeenCalled();
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
      const mockSession: Session = {
        user: { 
          id: '1', 
          email: 'admin@test.com',
          name: 'Admin',
          isSuperAdmin: true 
        },
        expires: new Date().toISOString()
      };
      mockAuth.mockResolvedValue(mockSession);

      const mockOrganization: Organization = { 
        id: 'org-1', 
        name: 'Test Org',
        description: 'Test Organization Description',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const mockUser: User = { 
        id: 'user-1', 
        email: 'owner@test.com',
        name: 'Test Owner',
        password: '',
        salt: 'salt',
        isSuperAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockMember: OrganizationMember = {
        id: 'member-1',
        organizationId: 'org-1',
        userId: 'user-1',
        role: 'OWNER',
        canPostMessages: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrismaOrganization.create.mockResolvedValue(mockOrganization);
      mockCreateOrFindAccount.mockResolvedValue(mockUser);
      mockPrismaOrganizationMember.create.mockResolvedValue(mockMember);

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
      const mockSession: Session = {
        user: { 
          id: '1', 
          email: 'admin@test.com',
          name: 'Admin',
          isSuperAdmin: true 
        },
        expires: new Date().toISOString()
      };
      mockAuth.mockResolvedValue(mockSession);

      type OrganizationWithMembers = Organization & {
        members: (OrganizationMember & {
          user: Pick<User, 'id' | 'name' | 'email'>;
        })[];
      };

      const mockOrganizations: OrganizationWithMembers[] = [
        {
          id: 'org-1',
          name: 'Org 1',
          description: 'Organization 1 Description',
          createdAt: new Date(),
          updatedAt: new Date(),
          members: [
            {
              id: 'member-1',
              organizationId: 'org-1',
              userId: 'user-1',
              role: 'OWNER',
              canPostMessages: true,
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

      mockPrismaOrganization.findMany.mockResolvedValue(mockOrganizations);

      // Act
      const result = await getOrganizations();

      // Assert
      expect(result).toEqual(mockOrganizations);
      expect(mockPrismaOrganization.findMany).toHaveBeenCalledWith({
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
      const mockSession: Session = {
        user: { 
          id: '1', 
          email: 'user@test.com',
          name: 'User',
          isSuperAdmin: false 
        },
        expires: new Date().toISOString()
      };
      mockAuth.mockResolvedValue(mockSession);

      // Act & Assert
      await expect(getOrganizations()).rejects.toThrow('Unauthorized');
      expect(mockPrismaOrganization.findMany).not.toHaveBeenCalled();
    });
  });

  describe('deleteOrganization', () => {
    it('should delete organization successfully when user is super admin', async () => {
      // Arrange
      const mockSession: Session = {
        user: { 
          id: '1', 
          email: 'admin@test.com',
          name: 'Admin',
          isSuperAdmin: true 
        },
        expires: new Date().toISOString()
      };
      mockAuth.mockResolvedValue(mockSession);

      const mockDeletedOrg: Organization = { 
        id: 'org-1', 
        name: 'Deleted Org',
        description: 'Deleted Organization Description',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrismaOrganizationMember.deleteMany.mockResolvedValue({ count: 1 });
      mockPrismaOrganization.delete.mockResolvedValue(mockDeletedOrg);

      // Act
      const result = await deleteOrganization('org-1');

      // Assert
      expect(result).toEqual(mockDeletedOrg);
      expect(mockPrismaOrganizationMember.deleteMany).toHaveBeenCalledWith({
        where: { organizationId: 'org-1' },
      });
      expect(mockPrismaOrganization.delete).toHaveBeenCalledWith({
        where: { id: 'org-1' },
      });
    });

    it('should throw error when user is not super admin', async () => {
      // Arrange
      const mockSession: Session = {
        user: { 
          id: '1', 
          email: 'user@test.com',
          name: 'User',
          isSuperAdmin: false 
        },
        expires: new Date().toISOString()
      };
      mockAuth.mockResolvedValue(mockSession);

      // Act & Assert
      await expect(deleteOrganization('org-1')).rejects.toThrow('Unauthorized');
      expect(mockPrismaOrganizationMember.deleteMany).not.toHaveBeenCalled();
    });

    it('should throw error when organization not found', async () => {
      // Arrange
      const mockSession: Session = {
        user: { 
          id: '1', 
          email: 'admin@test.com',
          name: 'Admin',
          isSuperAdmin: true 
        },
        expires: new Date().toISOString()
      };
      mockAuth.mockResolvedValue(mockSession);

      mockPrismaOrganizationMember.deleteMany.mockRejectedValue(new Error());

      // Act & Assert
      await expect(deleteOrganization('org-1')).rejects.toThrow('Organization not found');
    });
  });

  describe('getUserOrganizationRole', () => {
    it('should return user organization role when session exists', async () => {
      // Arrange
      const mockSession: Session = {
        user: { 
          id: 'user-1',
          email: 'user@test.com',
          name: 'User',
          isSuperAdmin: false
        },
        expires: new Date().toISOString()
      };
      mockAuth.mockResolvedValue(mockSession);

      mockPrismaOrganizationMember.findFirst.mockResolvedValue({ role: 'OWNER' });

      // Act
      const result = await getUserOrganizationRole('org-1', 'user-1');

      // Assert
      expect(result).toEqual({ role: 'OWNER' });
      expect(mockPrismaOrganizationMember.findFirst).toHaveBeenCalledWith({
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
      expect(mockPrismaOrganizationMember.findFirst).not.toHaveBeenCalled();
    });

    it('should throw error when database operation fails', async () => {
      // Arrange
      const mockSession: Session = {
        user: { 
          id: 'user-1',
          email: 'user@test.com',
          name: 'User',
          isSuperAdmin: false
        },
        expires: new Date().toISOString()
      };
      mockAuth.mockResolvedValue(mockSession);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockPrismaOrganizationMember.findFirst.mockRejectedValue(new Error('DB Error'));

      // Act & Assert
      await expect(getUserOrganizationRole('org-1', 'user-1')).rejects.toThrow('Failed to get user organisation role');
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});
