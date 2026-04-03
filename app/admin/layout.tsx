import "@/app/globals.css";
import { createClient } from "@/utils/supabase/server";
import AdminSidebar from "./components/AdminSidebar";
import { Toaster } from "sonner";

export const metadata = {
  title: "Admin Panel — Aisha Academy",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Login page — no sidebar, full screen
  if (!user) {
    return (
      <html lang="en">
        <body>
          {children}
          <Toaster richColors position="top-right" />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50 flex">
          <AdminSidebar userEmail={user.email || ""} />
          <main className="flex-1 ml-64 min-h-screen overflow-auto">
            {children}
          </main>
        </div>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
