import { createClient } from '@supabase/supabase-js';

// Environment variables should be exposed using import.meta.env in Vite projects
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase credentials. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are defined in your .env file.',
  );
}

// Create a single instance of the Supabase client to be used across your application
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
