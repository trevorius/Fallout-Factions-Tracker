import type { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import "dotenv/config";

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

export async function seedSuperAdmin(prisma: PrismaClient) {
  console.log("Seeding super admin...");
  const superAdminEmail =
    process.env.SUPER_ADMIN_EMAIL || "peter.parker@avengers.com";

  const existingSuperAdmin = await prisma.user.findUnique({
    where: { email: superAdminEmail },
  });

  if (existingSuperAdmin) {
    console.log("Super admin already exists. Skipping.");
  } else {
    const salt = generateSalt();
    const hashedPassword = hashPassword(
      process.env.SUPER_ADMIN_PASSWORD || "Blue-House-Red-Car",
      salt
    );

    const spiderMan = await prisma.user.create({
      data: {
        name: process.env.SUPER_ADMIN_NAME || "SpiderMan",
        email: superAdminEmail,
        password: hashedPassword,
        salt: salt,
        isSuperAdmin: true,
      },
    });

    console.log("Super Admin created:", {
      name: spiderMan.name,
      email: spiderMan.email,
      isSuperAdmin: spiderMan.isSuperAdmin,
    });
  }
  console.log("Super admin seeding complete.");
}
