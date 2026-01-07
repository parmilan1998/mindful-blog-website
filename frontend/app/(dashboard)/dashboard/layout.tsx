import SidebarLayout from "@/components/layout/Sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarLayout />
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header for mobile */}
        <header className="bg-white shadow-sm border-b p-4 md:px-6 block md:hidden">
          <div className="flex items-center gap-4">
            <button
              // onClick={toggleSidebar}
              className="md:hidden text-gray-600 hover:text-gray-900 transition-colors rounded-lg p-1"
              aria-label="Toggle sidebar"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800">Welcome</h2>
          </div>
        </header>

        <main className="flex-1 bg-neutral-50 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
