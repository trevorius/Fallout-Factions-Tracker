import RoleGuardian from "@/app/organizations/[organizationId]/components/RoleGuardian";
import { OrganizationRole } from "@prisma/client";

type AdminLayoutProps = {
  children: React.ReactNode;
  params: { organizationId: string };
};

export default async function AdminLayout({
  children,
  params,
}: AdminLayoutProps) {
  return (
    <RoleGuardian
      routeParams={{ organizationId: params.organizationId }}
      variant="redirect"
      roles={[OrganizationRole.OWNER, OrganizationRole.ADMIN]}
    >
      <div className="p-4">{children}</div>
    </RoleGuardian>
  );
}
