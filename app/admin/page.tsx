import { createAdminClient } from "@/utils/supabase/admin";
import {
  GraduationCap,
  MessageSquare,
  Mail,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

async function getStats() {
  console.log("Fetching stats from Supabase (Admin)...");
  const supabase = await createAdminClient();

  // Fetch individual counts and recent items
  const [
    { count: onlineCount },
    { count: physicalCount },
    { count: newContacts },
    { count: newsletterCount },
    { data: recentOnline },
    { data: recentPhysical },
    { data: recentContacts },
  ] = await Promise.all([
    supabase.from("online_enrollments").select("*", { count: "exact", head: true }),
    supabase.from("physical_enrollments").select("*", { count: "exact", head: true }),
    supabase.from("contact_inquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("newsletter").select("*", { count: "exact", head: true }),
    supabase.from("online_enrollments").select("student_name, program, created_at, status").order("created_at", { ascending: false }).limit(5),
    supabase.from("physical_enrollments").select("student_name, program, created_at, status").order("created_at", { ascending: false }).limit(5),
    supabase.from("contact_inquiries").select("name, inquiry_type, created_at, status").order("created_at", { ascending: false }).limit(5),
  ]);

  // Combine and sort recent enrollments from both tables
  const recentEnrollmentsRaw = [...(recentOnline || []), ...(recentPhysical || [])];
  const recentEnrollments = recentEnrollmentsRaw
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  console.log("Stats fetched:", {
    totalEnrollments: (onlineCount || 0) + (physicalCount || 0),
    newContacts: newContacts || 0,
    newsletterCount: newsletterCount || 0,
    recentEnrollmentsCount: recentEnrollments.length,
    recentContactsCount: (recentContacts || []).length,
  });

  return {
    totalEnrollments: (onlineCount || 0) + (physicalCount || 0),
    newContacts: newContacts || 0,
    newsletterCount: newsletterCount || 0,
    recentEnrollments,
    recentContacts: recentContacts || [],
  };
}

export const dynamic = "force-dynamic";




function StatCard({
  title, value, subtitle, icon: Icon, color, href,
}: {
  title: string; value: number; subtitle: string; icon: any; color: string; href: string;
}) {
  return (
    <Link href={href} className="block group">
      <div className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          </div>
          <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function StatusDot({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-400",
    confirmed: "bg-green-400",
    cancelled: "bg-red-400",
    new: "bg-blue-400",
    "in-progress": "bg-orange-400",
    resolved: "bg-green-400",
  };
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${map[status] || "bg-gray-400"} mr-2`} />
  );
}

export default async function AdminDashboard() {
  const { totalEnrollments, newContacts, newsletterCount, recentEnrollments, recentContacts } =
    await getStats();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Total Enrollments"
          value={totalEnrollments}
          subtitle="Online + Physical"
          icon={GraduationCap}
          color="bg-amber-100 text-amber-600"
          href="/admin/enrollments"
        />
        <StatCard
          title="New Inquiries"
          value={newContacts}
          subtitle="Awaiting response"
          icon={MessageSquare}
          color="bg-blue-100 text-blue-600"
          href="/admin/contacts"
        />
        <StatCard
          title="Newsletter Subs"
          value={newsletterCount}
          subtitle="Active subscribers"
          icon={Mail}
          color="bg-green-100 text-green-600"
          href="/admin/newsletter"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <h2 className="font-semibold text-gray-800">Recent Enrollments</h2>
            </div>
            <Link href="/admin/enrollments" className="text-xs text-amber-600 hover:underline font-medium">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentEnrollments.length === 0 ? (
              <p className="p-5 text-sm text-gray-400 text-center">No enrollments yet</p>
            ) : (
              recentEnrollments.map((e: any, i: number) => (
                <div key={i} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{e.student_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{e.program}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <StatusDot status={e.status || "pending"} />
                      {e.status || "pending"}
                    </p>
                    <p className="text-xs text-gray-300 mt-0.5">
                      {new Date(e.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <h2 className="font-semibold text-gray-800">Recent Inquiries</h2>
            </div>
            <Link href="/admin/contacts" className="text-xs text-blue-600 hover:underline font-medium">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentContacts.length === 0 ? (
              <p className="p-5 text-sm text-gray-400 text-center">No inquiries yet</p>
            ) : (
              recentContacts.map((c: any, i: number) => (
                <div key={i} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{c.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.inquiry_type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                      <StatusDot status={c.status || "new"} />
                      {c.status || "new"}
                    </p>
                    <p className="text-xs text-gray-300 mt-0.5">
                      {new Date(c.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
