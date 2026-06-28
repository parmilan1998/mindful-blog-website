"use client";

import { useEffect, useState } from "react";
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
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { authClient } from "@/lib/client";
import { PageLoader } from "@/components/ui/page-loader";

export default function DashboardLayout({ children }: any) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/auth/sign-in");
      router.refresh();
    }
  }, [session, isPending, router]);

  const logout = async () => {
    await authClient.signOut();
    router.replace("/auth/sign-in");
    router.refresh();
  };

  if (isPending) {
    return <PageLoader />;
  }

  if (!session) {
    return null;
  }

  const user = session.user;

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;

  return (
    <SidebarProvider>
      <DashboardSidebar />

      <SidebarInset>
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-14 items-center border-b bg-background px-4">
          <SidebarTrigger />

          <Separator orientation="vertical" className="mx-4 h-6" />

          <div className="flex-1" />

          <div className="ml-auto flex items-center gap-2">
            <ModeToggle />

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard/notifications")}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute right-14 top-2 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar className="h-9 w-9 cursor-pointer">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {getInitials(user?.name || "U")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-2">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.role}</p>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/profile")}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/settings")}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
