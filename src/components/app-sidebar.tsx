import React from "react";
import {
  BookOpen,
  FileSearch,
  Home,
  ShieldCheck,
  LayoutDashboard,
  CloudCheck,
  TrendingUp,
  MessageCircleQuestion,
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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
export function AppSidebar(): JSX.Element {
  const location = useLocation();
  const primaryItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { title: "Home", icon: Home, path: "/" },
  ];
  const toolItems = [
    { title: "Rights Wiki", icon: BookOpen, path: "/wiki" },
    { title: "Forensic Analyzer", icon: FileSearch, path: "/tool" },
    { title: "Insurance Navigator", icon: TrendingUp, path: "/insurance" },
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
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Help">
                <MessageCircleQuestion className="h-4 w-4" />
                <span>Help & FAQ</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-auto p-2 hover:bg-muted">
              <div className="flex items-center gap-3 w-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">PA</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="text-sm font-bold truncate">PA Advocate</span>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                    <CloudCheck className="h-3 w-3" />
                    <span>Cloud Sync Active</span>
                  </div>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}