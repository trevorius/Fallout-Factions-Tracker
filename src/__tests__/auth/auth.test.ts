const { expect, describe, it, beforeEach } = require('@jest/globals');

import { sanitizeUser, verifyPassword } from '@/lib/auth.utils';

// Mock NextAuth
jest.mock('next-auth', () => {
  return jest.fn((config: any) => ({
    handlers: {
      GET: jest.fn(),
      POST: jest.fn(),
    },
    auth: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  }));
});

// Mock PrismaClient
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn(),
    },
  })),
}));

// Mock auth utils
jest.mock('@/lib/auth.utils', () => ({
  sanitizeUser: jest.fn(),
  verifyPassword: jest.fn(),
}));

describe('NextAuth Configuration', () => {
  let mockPrismaUser: any;
  let NextAuth: any;
  let authConfig: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Get the mocked NextAuth
    NextAuth = require('next-auth');
    
    // Import auth.ts to capture the config
    jest.isolateModules(() => {
      require('@/auth');
    });
    
    // Get the config that was passed to NextAuth
    authConfig = NextAuth.mock.calls[0][0];
    
    // Get mocked prisma
    const { PrismaClient } = require('@prisma/client');
    const prismaInstance = new PrismaClient();
    mockPrismaUser = prismaInstance.user;
  });

  describe('Pages Configuration', () => {
    it('should configure custom sign-in page', () => {
      expect(authConfig.pages).toEqual({
        signIn: '/login',
      });
    });
  });

  describe('Session Configuration', () => {
    it('should use JWT strategy', () => {
      expect(authConfig.session).toEqual({
        strategy: 'jwt',
      });
    });

    it('should set trustHost to true', () => {
      expect(authConfig.trustHost).toBe(true);
    });
  });

  describe('Credentials Provider', () => {
    let credentialsProvider: any;

    beforeEach(() => {
      credentialsProvider = authConfig.providers[0];
    });

    it('should configure credentials provider with correct fields', () => {
      expect(credentialsProvider.credentials).toEqual({
        username: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      });
    });

    describe('authorize function', () => {
      it('should throw error when credentials are missing', async () => {
        await expect(credentialsProvider.authorize(null)).rejects.toThrow('Invalid credentials');
        await expect(credentialsProvider.authorize({})).rejects.toThrow('Invalid credentials');
        await expect(credentialsProvider.authorize({ username: 'test' })).rejects.toThrow('Invalid credentials');
        await expect(credentialsProvider.authorize({ password: 'test' })).rejects.toThrow('Invalid credentials');
      });

      it('should throw error when user is not found', async () => {
        mockPrismaUser.findUnique.mockResolvedValue(null);

        await expect(
          credentialsProvider.authorize({
            username: 'test@example.com',
            password: 'password123',
          })
        ).rejects.toThrow('Invalid credentials');

        expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
          where: { email: 'test@example.com' },
        });
      });

      it('should throw error when password is invalid', async () => {
        const mockUser = {
          id: '1',
          email: 'test@example.com',
          password: 'hashedPassword',
          salt: 'salt',
        };

        mockPrismaUser.findUnique.mockResolvedValue(mockUser);
        (verifyPassword as jest.Mock).mockReturnValue(false);

        await expect(
          credentialsProvider.authorize({
            username: 'test@example.com',
            password: 'wrongpassword',
          })
        ).rejects.toThrow('Invalid credentials');

        expect(verifyPassword).toHaveBeenCalledWith('wrongpassword', 'hashedPassword', 'salt');
      });

      it('should return sanitized user when credentials are valid', async () => {
        const mockUser = {
          id: '1',
          email: 'test@example.com',
          password: 'hashedPassword',
          salt: 'salt',
        };

        const sanitizedUser = {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          isSuperAdmin: false,
        };

        mockPrismaUser.findUnique.mockResolvedValue(mockUser);
        (verifyPassword as jest.Mock).mockReturnValue(true);
        (sanitizeUser as jest.Mock).mockReturnValue(sanitizedUser);

        const result = await credentialsProvider.authorize({
          username: 'test@example.com',
          password: 'correctpassword',
        });

        expect(result).toEqual(sanitizedUser);
        expect(sanitizeUser).toHaveBeenCalledWith(mockUser);
      });

      it('should handle generic errors during authentication', async () => {
        mockPrismaUser.findUnique.mockRejectedValue(new Error('Database error'));

        await expect(
          credentialsProvider.authorize({
            username: 'test@example.com',
            password: 'password',
          })
        ).rejects.toThrow('Database error');
      });

      it('should handle non-Error exceptions', async () => {
        mockPrismaUser.findUnique.mockRejectedValue('String error');

        await expect(
          credentialsProvider.authorize({
            username: 'test@example.com',
            password: 'password',
          })
        ).rejects.toThrow('Authentication failed');
      });
    });
  });

  describe('Callbacks', () => {
    describe('jwt callback', () => {
      it('should add user data to token on sign in', async () => {
        const user = {
          id: '123',
          email: 'test@example.com',
          name: 'Test User',
          isSuperAdmin: true,
        };

        const token = { sub: '123' };

        const result = await authConfig.callbacks.jwt({ token, user });

        expect(result).toEqual({
          sub: '123',
          id: '123',
          isSuperAdmin: true,
        });
      });

      it('should return token unchanged when no user is provided', async () => {
        const token = {
          sub: '123',
          id: '123',
          isSuperAdmin: false,
        };

        const result = await authConfig.callbacks.jwt({ token });

        expect(result).toEqual(token);
      });
    });

    describe('session callback', () => {
      it('should add user data from token to session', async () => {
        const session = {
          user: {
            email: 'test@example.com',
            name: 'Test User',
          },
          expires: '2024-01-01',
        };

        const token = {
          sub: '123',
          id: '123',
          isSuperAdmin: true,
        };

        const result = await authConfig.callbacks.session({ session, token });

        expect(result).toEqual({
          user: {
            email: 'test@example.com',
            name: 'Test User',
            id: '123',
            isSuperAdmin: true,
          },
          expires: '2024-01-01',
        });
      });

      it('should return session unchanged when user is not present', async () => {
        const session = {
          expires: '2024-01-01',
        };

        const token = {
          sub: '123',
          id: '123',
          isSuperAdmin: true,
        };

        const result = await authConfig.callbacks.session({ session, token });

        expect(result).toEqual(session);
      });
    });
  });
});