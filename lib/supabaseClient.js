import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_url');

// Create the client. Use placeholders if config is missing to avoid crashes.
export const supabase = createClient(
  hasSupabaseConfig ? supabaseUrl : 'https://placeholder-project.supabase.co',
  hasSupabaseConfig ? supabaseAnonKey : 'placeholder-anon-key'
);
