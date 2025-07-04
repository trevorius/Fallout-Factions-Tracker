"use client";

import { OrganizationSwitcher } from "@/components/organization/organization-switcher";
import { useOrganization } from "@/providers/organization.provider";
import { OrganizationRole } from "@prisma/client";
import {
  Building2,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  Swords,
  Tags,
  User,
  Users,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.isSuperAdmin;
  const { organizationState, organizationRoleState } = useOrganization();
  const [organizationRole] = organizationRoleState;
  const [organization] = organizationState;
  
  const t = useTranslations();
  const tNav = useTranslations('navigation');
  const tSuper = useTranslations('superAdmin');
  const tAdmin = useTranslations('admin');
  const tCrew = useTranslations('crew');
  const tCommon = useTranslations('common');

  const ownerShow = organizationRole?.toString() === OrganizationRole.OWNER;
  const adminShow =
    organizationRole?.toString() === OrganizationRole.ADMIN || ownerShow;
  const userShow =
    organizationRole?.toString() === OrganizationRole.USER || adminShow;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const OrganizationNavigation = [
    {
      name: tNav('dashboard'),
      href: `/organizations/${organization?.id}`,
      icon: LayoutDashboard,
      show: session?.user,
    },
    {
      name: tNav('users'),
      href: `/organizations/${organization?.id}/users`,
      icon: Users,
      show: userShow,
    },
    {
      name: tCrew('crews'),
      href: `/organizations/${organization?.id}/crews`,
      icon: Shield,
      show: userShow,
    },
  ];

  const adminNavigation = {
    name: tAdmin('title'),
    icon: Settings,
    show: adminShow,
    subItems: [
      {
        name: tAdmin('templateManagement'),
        href: `/organizations/${organization?.id}/admin/templates`,
        show: adminShow,
      },
    ],
  };

  const SuperAdminNavigation = [
    {
      name: tSuper('dashboard'),
      href: "/superadmin",
      icon: LayoutDashboard,
      show: session?.user,
    },
    {
      name: tSuper('organizations'),
      href: "/superadmin/organization",
      icon: Building2,
      show: session?.user?.isSuperAdmin,
    },
    {
      name: tSuper('factions'),
      href: "/superadmin/factions",
      icon: Swords,
      show: session?.user?.isSuperAdmin,
    },
    {
      name: tSuper('unitClasses'),
      href: "/superadmin/unit-classes",
      icon: Users,
      show: session?.user?.isSuperAdmin,
    },
    {
      name: tSuper('weapons'),
      href: "/superadmin/standard-weapons",
      icon: Swords,
      show: session?.user?.isSuperAdmin,
    },
  ];

  const traitsAndPerks = {
    name: tSuper('traitsAndPerks'),
    icon: Tags,
    show: session?.user?.isSuperAdmin,
    subItems: [
      {
        name: tSuper('weaponTraits'),
        href: "/superadmin/traits",
        show: session?.user?.isSuperAdmin,
      },
      {
        name: tSuper('criticalEffects'),
        href: "/superadmin/critical-effects",
        show: session?.user?.isSuperAdmin,
      },
      {
        name: tSuper('perks'),
        href: "/superadmin/perks",
        show: session?.user?.isSuperAdmin,
      },

      {
        name: tSuper('weaponTypes'),
        href: "/superadmin/weapon-types",
        show: session?.user?.isSuperAdmin,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-6 flex flex-col group-data-[collapsible=icon]:px-2">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold group-data-[collapsible=icon]:overflow-hidden"
        >
          {process.env.NEXT_PUBLIC_APP_NAME}
        </Link>
        {session?.user && (
          <div className="group-data-[collapsible=icon]:hidden">
            <OrganizationSwitcher />
          </div>
        )}
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {isSuperAdmin && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>{tSuper('title')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {SuperAdminNavigation.filter((item) => item.show).map(
                    (item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <SidebarMenuItem key={item.name}>
                          <SidebarMenuButton asChild isActive={isActive}>
                            <Link
                              href={item.href}
                              className="flex items-center gap-3"
                            >
                              <Icon className="h-4 w-4" />
                              <span>{item.name}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    }
                  )}
                  {traitsAndPerks.show && (
                    <SidebarMenuItem>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem
                          value="traits-perks"
                          className="border-b-0"
                        >
                          <SidebarMenuButton
                            asChild
                            className="w-full justify-between hover:no-underline p-0"
                          >
                            <AccordionTrigger className="w-full justify-between p-3">
                              <div className="flex items-center gap-3">
                                <traitsAndPerks.icon className="h-4 w-4" />
                                <span>{traitsAndPerks.name}</span>
                              </div>
                            </AccordionTrigger>
                          </SidebarMenuButton>
                          <AccordionContent className="p-0 pl-7">
                            <SidebarMenu>
                              {traitsAndPerks.subItems
                                .filter((item) => item.show)
                                .map((item) => {
                                  const isActive = pathname === item.href;
                                  return (
                                    <SidebarMenuItem key={item.name}>
                                      <SidebarMenuButton
                                        asChild
                                        isActive={isActive}
                                      >
                                        <Link
                                          href={item.href}
                                          className="flex items-center gap-3"
                                        >
                                          <span>{item.name}</span>
                                        </Link>
                                      </SidebarMenuButton>
                                    </SidebarMenuItem>
                                  );
                                })}
                            </SidebarMenu>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
              <SidebarSeparator />
            </SidebarGroup>
          </>
        )}
        {organization && (
          <SidebarGroup>
            <SidebarGroupLabel>{tNav('organization')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {OrganizationNavigation.filter((item) => item.show).map(
                  (item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link
                            href={item.href}
                            className="flex items-center gap-3"
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  }
                )}
                {adminNavigation.show && (
                  <SidebarMenuItem>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="admin" className="border-b-0">
                        <SidebarMenuButton
                          asChild
                          className="w-full justify-between hover:no-underline p-0"
                        >
                          <AccordionTrigger className="w-full justify-between p-3">
                            <div className="flex items-center gap-3">
                              <adminNavigation.icon className="h-4 w-4" />
                              <span>{adminNavigation.name}</span>
                            </div>
                          </AccordionTrigger>
                        </SidebarMenuButton>
                        <AccordionContent className="p-0 pl-7">
                          <SidebarMenu>
                            {adminNavigation.subItems
                              .filter((item) => item.show)
                              .map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                  <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton
                                      asChild
                                      isActive={isActive}
                                    >
                                      <Link
                                        href={item.href}
                                        className="flex items-center gap-3"
                                      >
                                        <span>{item.name}</span>
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                );
                              })}
                          </SidebarMenu>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
            <SidebarSeparator />
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarSeparator />
      {session?.user && (
        <SidebarFooter
          className="px-6 flex flex-col gap-4 group-data-[collapsible=icon]:px-2"
          data-testid="sidebar-footer"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="w-full justify-start">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {getInitials(session?.user?.name ?? "Unknown User")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">
                      {session?.user?.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {session?.user?.email}
                    </span>
                  </div>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="w-4 h-4 mr-2" />
                  {tCommon('profile')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="w-4 h-4 mr-2" />
                {tCommon('signOut')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
