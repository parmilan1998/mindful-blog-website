import {
  Zap,
  LayoutDashboard,
  FileText,
  Bookmark,
  Bell,
  User,
  Settings,
  MessageSquare,
  Clock,
  LogOut,
  PenSquare,
  ChevronDown,
  BarChart3,
  Users,
  Image,
  Mail,
  Activity,
  Tag,
  FolderOpen,
  Shield,
} from "lucide-react";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SITE } from "@/constants";
import { getInitials } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_MENU = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  {
    label: "Content",
    icon: FileText,
    children: [
      { label: "All Posts", href: "/admin/posts" },
      { label: "New Post", href: "/admin/posts/new" },
      { label: "Categories", href: "/admin/categories", icon: FolderOpen },
      { label: "Tags", href: "/admin/tags", icon: Tag },
    ],
  },
  {
    label: "Comments",
    href: "/admin/comments",
    icon: MessageSquare,
    badge: "4",
  },
  { label: "Media Library", href: "/admin/media", icon: Image },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "Activity Logs", href: "/admin/activity", icon: Activity },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const USER_MENU = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "My Posts", href: "/dashboard/posts", icon: FileText },
  { label: "Write Post", href: "/dashboard/posts/new", icon: PenSquare },
  { label: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
  { label: "Comments", href: "/dashboard/comments", icon: MessageSquare },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
    badge: "4",
  },
  { label: "Reading History", href: "/dashboard/history", icon: Clock },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface DashboardSidebarProps {
  variant?: "admin" | "user";
}

export function DashboardSidebar({ variant = "user" }: DashboardSidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const menu = variant === "admin" ? ADMIN_MENU : USER_MENU;

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      {/* Header */}
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-1">
          <Link
            href="/"
            className="flex items-center gap-2 group-data-[collapsible=icon]:hidden"
          >
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm">{SITE.name}</span>
            {variant === "admin" && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                <Shield className="w-2.5 h-2.5 mr-0.5" />
                Admin
              </Badge>
            )}
          </Link>
          {/* <SidebarTrigger className="ml-auto" /> */}
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu.map((item) => {
                if ("children" in item && item.children) {
                  return (
                    <Collapsible
                      key={item.label}
                      defaultOpen
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.label}
                            isActive={item.children.some((c) =>
                              isActive(c.href),
                            )}
                          >
                            <item.icon />
                            <span>{item.label}</span>
                            <ChevronDown className="ml-auto w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.children.map((child) => (
                              <SidebarMenuSubItem key={child.href}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActive(child.href)}
                                >
                                  <Link href={child.href}>{child.label}</Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                const navItem = item as {
                  label: string;
                  href: string;
                  icon: React.ElementType;
                  badge?: string;
                  exact?: boolean;
                };
                return (
                  <SidebarMenuItem key={navItem.href}>
                    <SidebarMenuButton
                      asChild
                      tooltip={navItem.label}
                      isActive={isActive(navItem.href, navItem.exact)}
                    >
                      <Link href={navItem.href}>
                        <navItem.icon />
                        <span>{navItem.label}</span>
                        {navItem.badge && (
                          <Badge
                            variant="secondary"
                            className="ml-auto text-[10px] px-1.5 h-5"
                          >
                            {navItem.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with user profile */}
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="cursor-pointer"
              tooltip={user?.name ?? "User"}
            >
              <Avatar size="sm">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>
                  {user ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-semibold truncate max-w-32">
                  {user?.name}
                </span>
                <span className="text-xs text-muted-foreground capitalize">
                  {user?.role}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign Out"
              onClick={logout}
              className="text-muted-foreground hover:text-danger"
            >
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
