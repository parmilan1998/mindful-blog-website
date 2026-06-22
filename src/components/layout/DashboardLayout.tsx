// import {
//   SidebarProvider,
//   SidebarInset,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import { Separator } from "@/components/ui/separator";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Bell, User, Settings, LogOut } from "lucide-react";
// import { DashboardSidebar } from "./DashboardSidebar";
// import { ModeToggle } from "@/components/mode-toggle";
// import { getInitials } from "@/lib/utils";
// import { MOCK_NOTIFICATIONS } from "@/mock/data";
// import { useAuth } from "@/providers/auth-provider";
// import { usePathname, useRouter } from "next/navigation";

// interface DashboardLayoutProps {
//   variant?: "admin" | "user";
//   requiredRole?: string;
// }

// export function DashboardLayout({
//   variant = "user",
//   requiredRole,
// }: DashboardLayoutProps) {
//   const { user, isAuthenticated, isLoading, logout } = useAuth();
//   const pathName = usePathname();
//   const router = useRouter();

//   const navigate = (href: string) => {
//     router.push(href);
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/auth/login" state={{ from: location }} replace />;
//   }

//   if (requiredRole === "admin" && user?.role !== "admin") {
//     return <Navigate to="/dashboard" replace />;
//   }

//   const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;

//   const handleLogout = async () => {
//     await logout();
//     navigate("/");
//   };

//   return (
//     <SidebarProvider>
//       <DashboardSidebar variant={variant} />
//       <SidebarInset>
//         {/* Top bar */}
//         <header className="flex h-14 items-center gap-4 border-b px-4 sticky top-0 z-10 glass">
//           <SidebarTrigger />
//           <Separator orientation="vertical" className="h-4" />

//           {/* Breadcrumb rendered by child pages */}
//           <div className="flex-1 min-w-0" id="breadcrumb-slot" />

//           <div className="flex items-center gap-2 ml-auto">
//             <ModeToggle />

//             {/* Notifications */}
//             <Button
//               variant="ghost"
//               size="icon"
//               className="relative"
//               onClick={() => navigate("/dashboard/notifications")}
//             >
//               <Bell className="w-4 h-4" />
//               {unreadCount > 0 && (
//                 <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
//                   {unreadCount}
//                 </span>
//               )}
//             </Button>

//             {/* Profile */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="icon" className="rounded-full">
//                   <Avatar size="sm">
//                     <AvatarImage src={user?.avatar} alt={user?.name} />
//                     <AvatarFallback>
//                       {user ? getInitials(user.name) : "U"}
//                     </AvatarFallback>
//                   </Avatar>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-52">
//                 <div className="px-2 py-1.5">
//                   <p className="font-semibold text-sm">{user?.name}</p>
//                   <p className="text-xs text-muted-foreground capitalize">
//                     {user?.role}
//                   </p>
//                 </div>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem
//                   onClick={() => navigate("/dashboard/profile")}
//                 >
//                   <User className="w-4 h-4" /> Profile
//                 </DropdownMenuItem>
//                 <DropdownMenuItem
//                   onClick={() => navigate("/dashboard/settings")}
//                 >
//                   <Settings className="w-4 h-4" /> Settings
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem
//                   className="text-danger focus:text-danger"
//                   onClick={handleLogout}
//                 >
//                   <LogOut className="w-4 h-4" /> Sign Out
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </header>

//         {/* Page content */}
//         <div className="flex-1 p-4 md:p-6 dashboard-bg min-h-[calc(100vh-3.5rem)]">
//           {/* <Outlet /> */}
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }
