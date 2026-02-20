"use server";

import { Resend } from "resend";
import { createClient } from "@/utils/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const adminEmail =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL || "info@aisha-academy.com";

function generateEmailHtml(
  title: string,
  details: { label: string; value: string }[],
  footer?: string,
) {
  const rows = details
    .map(
      (detail) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #edf2f7; color: #4a5568; font-weight: 600; width: 35%;">${detail.label}</td>
      <td style="padding: 12px; border-bottom: 1px solid #edf2f7; color: #2d3748;">${detail.value || "N/A"}</td>
    </tr>
  `,
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      </head>
      <body style="background-color: #f7fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 40px 0;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
                <!-- Header -->
                <tr>
                  <td style="background-color: #7c2d12; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Aisha Academy</h1>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="color: #1a202c; margin-top: 0; margin-bottom: 24px; border-bottom: 2px solid #7c2d12; padding-bottom: 10px; display: inline-block;">${title}</h2>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                      ${rows}
                    </table>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 20px; text-align: center; color: #718096; font-size: 14px;">
                    ${footer || "This is an automated notification from Aisha Academy Website."}
                  </td>
                </tr>
              </table>
              <div style="margin-top: 20px; text-align: center; color: #a0aec0; font-size: 12px;">
                &copy; ${new Date().getFullYear()} Aisha Academy. All rights reserved.
              </div>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export async function sendEnrollmentEmail(formData: FormData) {
  const studentName = formData.get("studentName") as string;
  const age = formData.get("age") as string;
  const gender = formData.get("gender") as string;
  const parentName = formData.get("parentName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const city = formData.get("city") as string;
  const course = formData.get("course") as string;
  const preferredDays = formData.get("preferredDays") as string;
  const preferredTime = formData.get("preferredTime") as string;
  const message = formData.get("message") as string;
  const learningMode = formData.get("learningMode") as string;

  try {
    // 1. Save to Supabase
    const supabase = await createClient();
    const { error: dbError } = await supabase.from("enrollments").insert([
      {
        student_name: studentName,
        age: parseInt(age),
        gender,
        parent_name: parentName,
        email,
        phone,
        city,
        course,
        preferred_days: preferredDays,
        preferred_time: preferredTime,
        message,
        learning_mode: learningMode,
      },
    ]);

    if (dbError) {
      console.error("Database Error:", dbError);
    }

    // 2. Send Email
    console.log("Attempting to send email via Resend to:", adminEmail);
    const { data, error } = await resend.emails.send({
      from: "Aisha Academy <info@aisha-academy.com>",
      to: [adminEmail],
      replyTo: email,
      subject: `New Enrollment Application: ${studentName}`,
      html: generateEmailHtml(
        "New Enrollment Received",
        [
          { label: "Student Name", value: studentName },
          { label: "Age", value: age },
          { label: "Gender", value: gender },
          { label: "Learning Mode", value: learningMode },
          { label: "Parent Name", value: parentName },
          { label: "Email", value: email },
          { label: "Phone", value: phone },
          { label: "City", value: city },
          { label: "Program", value: course },
          { label: "Preferred Days", value: preferredDays },
          { label: "Preferred Time", value: preferredTime },
          {
            label: "Message",
            value: message || "No additional notes provided.",
          },
        ],
        "Sent from Aisha Academy Website",
      ),
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, error: error.message };
    }

    console.log("Resend Success:", data);
    return { success: true, data };
  } catch (err) {
    console.error("Action Catch Error:", err);
    return { success: false, error: "Failed to process application" };
  }
}

export async function sendContactEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const inquiry = formData.get("inquiry") as string;
  const message = formData.get("message") as string;

  try {
    // 1. Save to Supabase
    const supabase = await createClient();
    const { error: dbError } = await supabase.from("contact_inquiries").insert([
      {
        name,
        email,
        phone,
        inquiry_type: inquiry,
        message,
      },
    ]);

    if (dbError) {
      console.error("Database Error:", dbError);
    }

    // 2. Send Email
    console.log("Attempting to send contact email to:", adminEmail);
    const { data, error } = await resend.emails.send({
      from: "Aisha Academy <info@aisha-academy.com>",
      to: [adminEmail],
      replyTo: email,
      subject: `New Contact Inquiry: ${inquiry} from ${name}`,
      html: generateEmailHtml(
        "New Contact Inquiry",
        [
          { label: "Name", value: name },
          { label: "Email", value: email },
          { label: "Phone", value: phone },
          { label: "Inquiry Type", value: inquiry },
          { label: "Message", value: message },
        ],
        "Sent from Aisha Academy Website",
      ),
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, error: error.message };
    }

    console.log("Resend Success:", data);
    return { success: true, data };
  } catch (err) {
    console.error("Action Catch Error:", err);
    return { success: false, error: "Failed to send inquiry" };
  }
}
