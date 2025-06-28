import RoleGuardian from "@/app/organizations/[organizationId]/components/RoleGuardian";
import { OrganizationRole } from "@prisma/client";

type AdminLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ organizationId: string }>;
};

export default async function AdminLayout({
  children,
  params,
}: AdminLayoutProps) {
  const { organizationId } = await params;

  return (
    <RoleGuardian
      routeParams={{ organizationId }}
      variant="redirect"
      roles={[OrganizationRole.OWNER, OrganizationRole.ADMIN]}
    >
      <div className="p-4">{children}</div>
    </RoleGuardian>
  );
}
