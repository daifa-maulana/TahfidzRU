import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const getEnvVar = (key: string) => {
  const value = import.meta.env[key] || (typeof process !== 'undefined' ? process.env[key] : '');
  if (!value || value === 'undefined' || value === 'null' || value === 'YOUR_SUPABASE_URL' || value === 'YOUR_SUPABASE_ANON_KEY') return '';
  let sanitized = value.trim().replace(/^["'](.+)["']$/, '$1');
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

const finalUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co';
const finalKey = isSupabaseConfigured ? supabaseAnonKey : 'placeholder';

const customStorage = {
  getItem(key: string): string | null {
    const localVal = window.localStorage.getItem(key);
    if (localVal !== null) return localVal;
    return window.sessionStorage.getItem(key);
  },
  setItem(key: string, value: string): void {
    const remember = window.localStorage.getItem('remember_me') === 'true';
    if (remember) {
      window.localStorage.setItem(key, value);
      window.sessionStorage.removeItem(key);
    } else {
      window.sessionStorage.setItem(key, value);
      window.localStorage.removeItem(key);
    }
  },
  removeItem(key: string): void {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  }
};

export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
