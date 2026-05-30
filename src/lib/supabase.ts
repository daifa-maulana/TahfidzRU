import { createClient } from '@supabase/supabase-js';

const getEnvVar = (key: string) => {
  const value = import.meta.env[key] || (typeof process !== 'undefined' ? process.env[key] : '');
  // Clean up potential "undefined" strings or common accidental prefixes
  if (!value || value === 'undefined' || value === 'null' || value === 'YOUR_SUPABASE_URL' || value === 'YOUR_SUPABASE_ANON_KEY') return '';
  
  // Remove potential quotes if trapped in strings
  let sanitized = value.trim().replace(/^["'](.+)["']$/, '$1');
  
  // Remove trailing slash from URL
  if (key.includes('URL') && sanitized.endsWith('/')) {
    sanitized = sanitized.slice(0, -1);
  }
  
  return sanitized;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

const isPlaceholder = (val: string) => 
  !val || 
  val.includes('your-project') || 
  val.includes('your-anon-key') ||
  val === 'placeholder';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && !isPlaceholder(supabaseUrl) &&
  supabaseAnonKey && !isPlaceholder(supabaseAnonKey)
);

if (!isSupabaseConfigured) {
  console.warn('Supabase credentials missing or using placeholders.');
  console.warn('Current URL:', supabaseUrl || 'MISSING');
  console.warn('Current Key:', supabaseAnonKey ? 'EXISTS (HIDDEN)' : 'MISSING');
  console.warn('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment/secrets.');
}

// Fallback to a valid-looking URL structure if not configured to avoid "Failed to fetch" on malformed URL "undefined"
const finalUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co';
const finalKey = isSupabaseConfigured ? supabaseAnonKey : 'placeholder';

export const supabase = createClient(finalUrl, finalKey);
