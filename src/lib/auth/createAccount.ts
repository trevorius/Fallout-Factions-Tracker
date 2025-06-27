// existing imports...

import "server-only";
import { hashPassword } from "@/lib/auth.utils";
import { prisma } from "../prisma";
import { generatePassword } from "../words";

/**
 * Creates or finds a user and assigns them as an organization owner
 * @param ownerEmail Email of the organization owner
 * @param ownerName Name of the organization owner
 * @returns The user object
 */
export async function createOrFindAccount(
  ownerEmail: string,
  ownerName: string
) {
  // First try to find existing user without selecting password field
  let user: {
    id: string;
    email: string;
    name: string | null;
    password: string | null;
  } | null = await prisma.user.findUnique({
    where: { email: ownerEmail },
    select: { id: true, email: true, name: true, password: true },
  });

  if (user) {
    user.password = null;
  } else {
    const tempPassword = generatePassword();
    const { hash, salt } = await hashPassword(tempPassword);

    user = await prisma.user.create({
      data: {
        email: ownerEmail,
        name: ownerName,
        salt,
        password: hash,
      },
    });
    user.password = tempPassword;
  }

  return user;
}
