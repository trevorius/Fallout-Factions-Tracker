import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import "dotenv/config";

function hashPassword(password: string, salt: string): string {
  const hash = crypto.createHmac("sha256", salt);
  hash.update(password);
  return hash.digest("hex");
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

export async function seedSuperAdmin(prisma: PrismaClient) {
  console.log("Seeding super admin...");
  const email = process.env.SUPER_ADMIN_EMAIL || "superadmin@fallout.com";
  try {
    const salt = generateSalt();
    const hashedPassword = hashPassword(
      process.env.SUPER_ADMIN_PASSWORD || "password",
      salt
    );

    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: process.env.SUPER_ADMIN_NAME || "Super Admin",
        salt: salt,
        password: hashedPassword,
        isSuperAdmin: true,
      },
    });
    console.log(`  Upserted super admin: ${email}`);
  } catch (e) {
    console.error(`Error seeding Super Admin "${email}":`, e);
  }
  console.log("Super admin seeding finished.");
}
