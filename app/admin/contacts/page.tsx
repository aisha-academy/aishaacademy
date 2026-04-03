import { createAdminClient } from "@/utils/supabase/admin";
import ContactsClient from "./ContactsClient";

export default async function ContactsPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("contact_inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Contact Inquiries</h1>
        <p className="text-gray-500 text-sm mt-1">
          View and manage all contact form submissions.
        </p>
      </div>
      <ContactsClient data={data || []} />
    </div>
  );
}
