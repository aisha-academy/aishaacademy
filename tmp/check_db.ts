import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import path from "path";

// Load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log("Checking Supabase tables for real data...");

  const tables = [
    "online_enrollments",
    "physical_enrollments",
    "contact_inquiries",
    "newsletter"
  ];

  for (const table of tables) {
    const { data, error, count } = await supabase
      .from(table)
      .select("*", { count: "exact", head: false })
      .limit(1);

    if (error) {
      console.error(`Error fetching from ${table}:`, error.message);
    } else {
      console.log(`Table '${table}' exists. Count: ${count}. Sample data present: ${data.length > 0}`);
      if (data.length > 0) {
        console.log(`Sample columns from ${table}:`, Object.keys(data[0]).join(", "));
      }
    }
    console.log("---");
  }
}

checkDatabase();
