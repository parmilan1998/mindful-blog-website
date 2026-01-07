// src/components/layout/BlogSidebarLayout.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Home, FileText, Folder, User, Info, Mail } from "lucide-react";
import Image from "next/image";
import BlogLogo from "../../assets/logo.png";

export default function BlogSidebarLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const isActive = (path: string) => pathname === path;

  const navigation = [
    {
      title: "Main",
      items: [
        { path: "/", icon: Home, label: "Home" },
        { path: "/dashboard/posts", icon: FileText, label: "All Posts" },
        { path: "/dashboard/categories", icon: Folder, label: "Categories" },
        { path: "/dashboard/authors", icon: User, label: "Authors" },
      ],
    },
    {
      title: "About",
      items: [
        { path: "/about", icon: Info, label: "About Us" },
        { path: "/contact", icon: Mail, label: "Contact" },
      ],
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/30 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0 w-60" : "-translate-x-full w-60"
        } md:translate-x-0 md:w-20 xl:w-60`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between py-3 px-4 border-b">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <Image src={BlogLogo} alt="Blog Logo" className="h-10 w-10" />
                <span className="text-xl font-bold text-gray-800 md:hidden xl:block">
                  Mindful
                </span>
              </div>
            </Link>
            <button
              onClick={toggleSidebar}
              className="md:hidden text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Close sidebar"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-3 px-2 thin-scrollbar">
            {navigation.map((section) => (
              <div key={section.title} className="mb-4">
                <p className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase md:hidden xl:block">
                  {section.title}
                </p>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.path}>
                        <Link
                          href={item.path}
                          onClick={() => setIsSidebarOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors group relative ${
                            isActive(item.path)
                              ? "bg-blue-50 text-blue-600 font-medium"
                              : "text-gray-700 hover:bg-gray-100"
                          } md:justify-center xl:justify-start`}
                        >
                          <Icon size={18} className="shrink-0" />
                          <span className="md:hidden xl:block text-sm">
                            {item.label}
                          </span>

                          {/* Tooltip for tablet */}
                          <span className="hidden md:block xl:hidden absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                            {item.label}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center justify-between gap-3 md:justify-center xl:justify-between">
              {/* Brand */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shrink-0">
                  M
                </div>

                <div className="md:hidden xl:block sm:block">
                  <p className="text-sm font-medium text-gray-800">Mindful</p>
                  <p className="text-xs text-gray-500">Blog Dashboard</p>
                </div>
              </div>

              {/* Meta */}
              <span className="md:hidden xl:block sm:block text-xs text-gray-400">
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
