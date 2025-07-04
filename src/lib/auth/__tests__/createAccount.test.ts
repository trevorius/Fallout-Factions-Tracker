import { expect, describe, it } from "@jest/globals";

import { prisma } from "@/lib/prisma";

import { hashPassword } from "@/lib/auth.utils";
import { generatePassword } from "../../words";
import { createOrFindAccount } from "../createAccount";

// Mock dependencies
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("@/lib/auth.utils", () => ({
  hashPassword: jest.fn(),
}));

jest.mock("../../words", () => ({
  generatePassword: jest.fn(),
}));

describe("createOrFindAccount", () => {
  const mockEmail = "test@example.com";
  const mockName = "Test User";
  const mockSalt = "mockedSalt123";
  const mockTempPassword = "tempPass123";
  const mockHashedPassword = "hashedPass123";

  beforeEach(() => {
    jest.clearAllMocks();
    (generatePassword as jest.Mock).mockReturnValue(mockTempPassword);
    (hashPassword as jest.Mock).mockResolvedValue({
      hash: mockHashedPassword,
      salt: mockSalt,
    });
  });

  it("should create new user if one does not exist", async () => {
    // Mock user not found
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    // Mock user creation
    const mockUser = {
      id: "1",
      email: mockEmail,
      name: mockName,
      salt: mockSalt,
      password: mockHashedPassword,
    };
    (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

    const result = await createOrFindAccount(mockEmail, mockName);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: mockEmail },
      select: { id: true, email: true, name: true, password: true },
    });
    expect(generatePassword).toHaveBeenCalled();
    expect(hashPassword).toHaveBeenCalledWith(mockTempPassword);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: mockEmail,
        name: mockName,
        salt: mockSalt,
        password: mockHashedPassword,
      },
    });
    expect(result).toEqual({
      ...mockUser,
      password: mockTempPassword, // Should return temp password for new users
    });
  });

  it("should return existing user if one exists", async () => {
    // Mock existing user
    const mockUser = {
      id: "1",
      email: mockEmail,
      name: mockName,
      password: "existingHashedPass",
    };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await createOrFindAccount(mockEmail, mockName);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: mockEmail },
      select: { id: true, email: true, name: true, password: true },
    });
    expect(generatePassword).not.toHaveBeenCalled();
    expect(hashPassword).not.toHaveBeenCalled();
    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(result).toEqual({
      ...mockUser,
      password: null, // Should return null password for existing users
    });
  });
});
