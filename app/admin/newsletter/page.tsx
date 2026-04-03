import { createAdminClient } from "@/utils/supabase/admin";
import NewsletterClient from "./NewsletterClient";

export default async function NewsletterPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("newsletter")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your newsletter subscribers list.
        </p>
      </div>
      <NewsletterClient data={data || []} />
    </div>
  );
}
