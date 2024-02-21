/**
 * Admit applicants from an array of emails.
 * 
 * Run: npm start
 */
import { createClient } from "@supabase/supabase-js";

// Read the config.json file
import config from "./config.json" with { type: "json" };

// Extract the supabaseUrl and supabaseKey from the config.json file
const supabaseUrl = config.dev.supabase_url;
const supabaseKey = config.dev.supabase_key;

// Create a new Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Emails to admit
const emailsToAdmit = [];

/**
 * Main function
 *
 * @returns {Promise<void>}
 */
async function main() {
  // Get all users from the database
  const { data: users, error } = await supabase.from("User").select("email");

  // If there's an error, log it and return
  if (error) {
    return console.error("Error fetching users", error);
  }

  // For each email in emailsToAdmit, set the 'isAdmitted' to True
  for (const user of users) {
    const email = user.email;

    if (!emailsToAdmit.includes(email)) {
      return;
    }

    try {
      await supabase
        .from("User")
        .update({ isAdmitted: true })
        .eq("email", email);

      console.log(`Admitted ${user.email}`);
    } catch (error) {
      console.error(`Failed to admit ${user.email} | Error: ${error}`);
    }
  }
}

// Run the main function
await main();
