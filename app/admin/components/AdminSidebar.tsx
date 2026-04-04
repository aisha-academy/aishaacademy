"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  GraduationCap,
  MessageSquare,
  Mail,
  LogOut,
  ChevronRight,
} from "lucide-react";

import { createClient } from "@/utils/supabase/client";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/enrollments", label: "Enrollments", icon: GraduationCap },
  { href: "/admin/contacts", label: "Contact Inquiries", icon: MessageSquare },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
];

export default function AdminSidebar({ 
  userEmail, 
  isOpen, 
  onClose 
}: { 
  userEmail: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`fixed left-0 top-0 h-full w-64 bg-[#1a0a05] flex flex-col z-50 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10 flex flex-col items-center relative">
          <Link href="/admin" onClick={onClose} className="block transform hover:scale-105 transition-transform duration-200">
            <Image
              src="/images/logo-bg-re.png"
              alt="Aisha Academy Logo"
              width={160}
              height={50}
              priority
              className="w-40 h-auto"
            />
          </Link>
          <p className="text-amber-200/40 text-[10px] uppercase tracking-widest mt-2 font-medium text-center">
            Admin Control Center
          </p>
        </div>


        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/20"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="px-4 py-3 bg-white/5 rounded-xl">
            <p className="text-gray-400 text-xs">Logged in as</p>
            <p className="text-white text-xs font-medium truncate mt-0.5">{userEmail}</p>
          </div>
          <button
            onClick={() => {
              onClose();
              handleLogout();
            }}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
