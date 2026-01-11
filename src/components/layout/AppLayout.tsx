import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
type AppLayoutProps = {
  children: React.ReactNode;
  container?: boolean;
};
export function AppLayout({ children, container = true }: AppLayoutProps): JSX.Element {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="relative flex flex-col min-h-screen bg-background">
        <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/95 backdrop-blur px-4">
          <SidebarTrigger />
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle className="relative top-0 right-0" />
          </div>
        </header>
        <main className="flex-1">
          {container ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
              {children}
            </div>
          ) : (
            children
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}