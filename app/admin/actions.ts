"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function updateEnrollmentStatus(
  id: string,
  status: string,
  table: "online_enrollments" | "physical_enrollments",
  studentEmail?: string,
  studentName?: string,
) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from(table).update({ status }).eq("id", id);
  if (error) return { success: false, error: error.message };

  // Send email notification if confirmed - free via Resend
  if (status === "confirmed" && studentEmail && studentName) {
    try {
      await resend.emails.send({
        from: "Aisha Academy <admissions@aisha-academy.com>",
        to: studentEmail,
        subject: "🎉 Your Enrollment is Confirmed — Aisha Academy",
        html: `
          <div style="font-family: 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
            <div style="background: #7c2d12; padding: 30px; text-align: center;">
              <h1 style="color: #fff; margin: 0; font-size: 22px;">Aisha Academy</h1>
            </div>
            <div style="padding: 36px;">
              <h2 style="color: #1a202c; margin-top: 0;">Assalam-o-Alaikum, ${studentName}!</h2>
              <p style="color: #4a5568;">We are pleased to inform you that your enrollment application has been <strong style="color: #16a34a;">confirmed</strong>.</p>
              <p style="color: #4a5568;">Our team will be in touch shortly with further details about your classes.</p>
              <p style="color: #4a5568; margin-top: 24px;">JazakAllah Khair,<br/><strong>Aisha Academy Team</strong></p>
            </div>
            <div style="background: #f8fafc; padding: 16px; text-align: center; color: #a0aec0; font-size: 13px;">
              © ${new Date().getFullYear()} Aisha Academy. All rights reserved.
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Notification email failed:", emailErr);
    }
  }

  revalidatePath("/admin/enrollments");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateContactStatus(id: string, status: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("contact_inquiries")
    .update({ status })
    .eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/contacts");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteNewsletterSub(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("newsletter").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/newsletter");
  return { success: true };
}
