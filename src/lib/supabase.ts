
import { createClient } from '@supabase/supabase-js';

// In a production environment, these would be environment variables
// For development purposes, we're providing fallback values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

// This check is only for strict verification in production
if (import.meta.env.PROD && (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-supabase-project-url'))) {
  console.error('Missing or default Supabase environment variables in production');
  // We're not throwing an error to allow the app to continue loading
  // Users will see auth features disabled but the rest of the app will work
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type safe user interface
export type User = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
};
