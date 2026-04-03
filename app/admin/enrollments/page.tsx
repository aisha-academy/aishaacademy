import { createAdminClient } from "@/utils/supabase/admin";
import EnrollmentsClient from "./EnrollmentsClient";

export default async function EnrollmentsPage() {
  const supabase = await createAdminClient();

  const [{ data: online }, { data: physical }] = await Promise.all([
    supabase
      .from("online_enrollments")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("physical_enrollments")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Enrollments</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage all student enrollment applications.
        </p>
      </div>
      <EnrollmentsClient
        onlineData={online || []}
        physicalData={physical || []}
      />
    </div>
  );
}
