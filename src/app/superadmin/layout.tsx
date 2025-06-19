import { redirect } from "next/navigation";
import { userIsSuperAdmin } from "@/lib/auth.utils";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await userIsSuperAdmin())) {
    redirect("/unauthorized");
  }

  return <main className="flex-1 p-8">{children}</main>;
}
