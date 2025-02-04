import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kicgyrcswtixiomsfldv.supabase.co"; // Replace with your Supabase URL
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpY2d5cmNzd3RpeGlvbXNmbGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0ODg2MzAsImV4cCI6MjA1MzA2NDYzMH0.oQk_x2q72BNGvRDflj_tTx6rFoJpU2gu3vYOX1B7xYQ"; // Replace with your Supabase public anon key

export const supabase = createClient(supabaseUrl, supabaseKey);
