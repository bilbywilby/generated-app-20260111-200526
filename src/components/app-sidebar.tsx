import React from "react";
import { 
  BookOpen, 
  FileSearch, 
  Home, 
  Settings, 
  ShieldCheck, 
  Scale, 
  LayoutDashboard,
  ExternalLink,
  MessageCircleQuestion
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
export function AppSidebar(): JSX.Element {
  const location = useLocation();
  const primaryItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { title: "Home", icon: Home, path: "/" },
  ];
  const toolItems = [
    { title: "Rights Wiki", icon: BookOpen, path: "/wiki" },
    { title: "Forensic Analyzer", icon: FileSearch, path: "/tool" },
  ];
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-display font-bold text-sm leading-none truncate">Keystone Health</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mt-1">Advocate</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {primaryItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild isActive={location.pathname === item.path} tooltip={item.title}>
                  <Link to={item.path}>
                    <item.icon className="h-4 w-4" />
                    <span className="font-semibold">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Advocacy Tools</SidebarGroupLabel>
          <SidebarMenu>
            {toolItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild isActive={location.pathname === item.path} tooltip={item.title}>
                  <Link to={item.path}>
                    <item.icon className="h-4 w-4" />
                    <span className="font-semibold">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Resources</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="PA Statutes">
                <Scale className="h-4 w-4" />
                <span>PA Statutes Database</span>
                <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Support">
                <MessageCircleQuestion className="h-4 w-4" />
                <span>Help & FAQ</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <Settings className="h-4 w-4" />
                <span>Account Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}