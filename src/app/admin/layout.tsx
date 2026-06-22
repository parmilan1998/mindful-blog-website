"use client";

import React from "react";
import DashboardLayout from "@/app/dashboard/layout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardLayout variant="admin" requiredRole="admin">
            {children}
        </DashboardLayout>
    );
}
