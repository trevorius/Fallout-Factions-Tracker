import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import "dotenv/config";

const prisma = new PrismaClient();

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

async function main() {
  // Delete existing data if any
  await prisma.organizationMember.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  // Create SpiderMan super admin
  const salt = generateSalt();
  const hashedPassword = hashPassword(
    process.env.SUPER_ADMIN_PASSWORD || "Blue-House-Red-Car",
    salt
  );

  const spiderMan = await prisma.user.create({
    data: {
      name: process.env.SUPER_ADMIN_NAME || "SpiderMan",
      email: process.env.SUPER_ADMIN_EMAIL || "peter.parker@avengers.com",
      password: hashedPassword,
      salt: salt,
      isSuperAdmin: true,
    },
  });

  console.log("Seed data created successfully!");
  console.log("Super Admin created:", {
    name: spiderMan.name,
    email: spiderMan.email,
    isSuperAdmin: spiderMan.isSuperAdmin,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
