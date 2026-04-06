import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Avertissement uniquement en dev, pas en prod
  if (import.meta.env.DEV) {
    console.warn(
      '[Supabase] Credentials manquants. Vérifiez votre fichier .env\n' +
      'Copiez .env.example → .env et remplissez les valeurs.'
    );
  }
}

export const supabase = createClient(
  supabaseUrl ?? '',
  supabaseAnonKey ?? ''
);
