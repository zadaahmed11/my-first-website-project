import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bdzdhepkknezyzkbhztk.supabase.co';
const supabaseAnonKey = 'sb_publishable_r5uQUwf3UG0ABsmTXRv33Q_m4SPocTt';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  global: {
   
    headers: {
      'apikey': supabaseAnonKey,
    },
  },
});
