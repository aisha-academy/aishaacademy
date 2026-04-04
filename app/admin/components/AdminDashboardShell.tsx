"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AdminDashboardShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <AdminSidebar
        userEmail={userEmail}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Mobile Header */}
      <header className="lg:hidden h-16 bg-[#1a0a05] text-white px-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/images/logo-bg-re.png"
            alt="Aisha Academy Logo"
            width={120}
            height={38}
            className="w-24 h-auto"
          />
        </Link>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 lg:ml-64 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
