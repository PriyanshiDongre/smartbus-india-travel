
import { createClient } from '@supabase/supabase-js';

// These values should be replaced with your actual Supabase project details
// The project ID you provided is: dvkcojgmmpniazheityr
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dvkcojgmmpniazheityr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2a2NvamdtbXBuaWF6aGVpdHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MTM5MjQsImV4cCI6MjA2MTQ4OTkyNH0.NG6sKc26ZFegKUsYI3gxzdwYvRZkj0NDiu55eF1TESE';

// This check is only for strict verification in production
if (import.meta.env.PROD && (!supabaseAnonKey || supabaseAnonKey === '')) {
  console.error('Missing Supabase anon key in production');
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
