"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Bell, User, Settings, LogOut } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { getInitials } from "@/lib/utils";
import { MOCK_NOTIFICATIONS } from "@/mock/data";
import { useAuth } from "@/providers/auth-provider";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  variant?: "admin" | "user";
  requiredRole?: "admin" | "user";
}

export default function DashboardLayout({
  children,
  variant = "user",
  requiredRole,
}: DashboardLayoutProps) {
  const router = useRouter();

  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isLoading && requiredRole && user && user.role !== requiredRole) {
      router.replace("/unauthorized");
    }
  }, [requiredRole, user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  const unreadCount = MOCK_NOTIFICATIONS.filter(
    (notification) => !notification.isRead,
  ).length;

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <SidebarProvider>
      <DashboardSidebar variant={variant} />

      <SidebarInset>
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-14 items-center border-b bg-background px-4">
          <SidebarTrigger />

          <Separator orientation="vertical" className="mx-4 h-6" />

          {/* Breadcrumb */}
          <div className="flex-1 min-w-0" id="breadcrumb-slot" />

          <div className="ml-auto flex items-center gap-2">
            <ModeToggle />

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative cursor-pointer"
              onClick={() => router.push("/dashboard/notifications")}
            >
              <Bell className="h-4 w-4" />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full cursor-pointer"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>
                      {user ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-2">
                  <p className="text-sm font-semibold">{user?.name}</p>

                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.role}
                  </p>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-56px)] flex-1 bg-muted/20 p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
