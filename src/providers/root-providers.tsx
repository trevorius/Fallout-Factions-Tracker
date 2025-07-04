'use client';

import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Toaster } from "@/components/ui/toaster";
import { OrganizationProvider } from "@/providers/organization.provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { SessionProvider } from "next-auth/react";

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <OrganizationProvider>
          <SidebarProvider>
            <div className="flex h-full w-full">
              <AppSidebar />
              <main className="flex flex-col flex-1 min-h-0 w-full">
                <div className="h-14 border-b px-6 flex items-center shrink-0 justify-between">
                  <SidebarTrigger />
                  <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <ThemeToggle />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8">{children}</div>
              </main>
            </div>
          </SidebarProvider>
        </OrganizationProvider>
      </SessionProvider>
      <Toaster />
    </ThemeProvider>
  );
}