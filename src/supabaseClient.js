import { createClient } from "@supabase/supabase-js";

// Clé "anon" Supabase — publique par conception, faite pour être embarquée
// côté client. La sécurité est assurée côté base (RLS + fonctions RPC
// security definer), pas en cachant cette clé.
const SUPABASE_URL = "https://vvyzxlyioqhtaqztrjbd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2eXp4bHlpb3FodGFxenRyamJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMzk5NDcsImV4cCI6MjA5ODgxNTk0N30.2qjgALEm518jGID0sJlW7PUHs_RrtoJ9b5vU-ROb-TQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
