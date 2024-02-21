/**
 * Export all of the admitted emails from the database into a csv file.
 * 
 * Run: npm start
 */
import { createClient } from "@supabase/supabase-js";

// Read the config.json file
import config from "./config.json" with { type: "json" };

// Open the "admitted.csv" file
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const filePath = path.join(path.dirname(__filename), "admitted.csv");
const file = fs.createWriteStream(filePath, {
  flags: "a",
});

// Extract the supabaseUrl and supabaseKey from the config.json file
const supabaseUrl = config.dev.supabase_url;
const supabaseKey = config.dev.supabase_key;

// Create a new Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Main function
 *
 * @returns {Promise<void>}
 */
async function main() {
  // Get all users from the database (only email, firstName, and lastName)
  const { data: users, error } = await supabase
    .from("User")
    .select("isAdmitted, email, firstName, lastName");

  // If there's an error, log it and return
  if (error) {
    return console.error("Error fetching users", error);
  }

  // Iterate over all users and write the admitted users to the file
  for (const user of users) {
    if (user.isAdmitted) {
      file.write(`${user.email},${user.firstName},${user.lastName}\n`);
    }
  }
}

// Run the main function
await main();

// Close the file
file.end();
