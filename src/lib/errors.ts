/**
 * errors.ts — Utilitaires de gestion d'erreurs
 *
 * Centralise la transformation des erreurs Supabase/réseau
 * en messages lisibles par l'utilisateur.
 */

import type { PostgrestError } from '@supabase/supabase-js';

/**
 * Codes d'erreur Supabase → messages FR/EN
 */
const SUPABASE_ERROR_MESSAGES: Record<string, { fr: string; en: string }> = {
  'invalid_credentials': {
    fr: 'Email ou mot de passe incorrect.',
    en: 'Invalid email or password.',
  },
  'email_not_confirmed': {
    fr: 'Veuillez confirmer votre email avant de vous connecter.',
    en: 'Please confirm your email before logging in.',
  },
  'user_already_exists': {
    fr: 'Un compte avec cet email existe déjà.',
    en: 'An account with this email already exists.',
  },
  'weak_password': {
    fr: 'Le mot de passe doit contenir au moins 6 caractères.',
    en: 'Password must be at least 6 characters.',
  },
  '23505': { // Duplicate key (PostgreSQL)
    fr: 'Cette entrée existe déjà.',
    en: 'This entry already exists.',
  },
  '42501': { // Insufficient privilege (RLS)
    fr: 'Vous n\'êtes pas autorisé à effectuer cette action.',
    en: 'You are not authorized to perform this action.',
  },
};

/**
 * Extrait un message d'erreur lisible depuis n'importe quelle erreur.
 */
export const getErrorMessage = (
  error: unknown,
  language: 'fr' | 'en' = 'fr'
): string => {
  if (!error) return '';

  // Erreur Supabase Auth
  if (typeof error === 'object' && 'message' in error) {
    const msg = (error as { message: string }).message;

    // Chercher dans notre dictionnaire
    for (const [key, translations] of Object.entries(SUPABASE_ERROR_MESSAGES)) {
      if (msg.toLowerCase().includes(key.toLowerCase())) {
        return translations[language];
      }
    }

    // Code PostgreSQL (erreur DB)
    if ('code' in error) {
      const code = (error as PostgrestError).code;
      if (code && SUPABASE_ERROR_MESSAGES[code]) {
        return SUPABASE_ERROR_MESSAGES[code][language];
      }
    }

    // Message brut si pas de traduction
    return msg;
  }

  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;

  return language === 'fr'
    ? 'Une erreur inattendue est survenue.'
    : 'An unexpected error occurred.';
};

/**
 * Vérifie si c'est une erreur réseau (pas de connexion).
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof TypeError && error.message === 'Failed to fetch') return true;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const msg = (error as { message: string }).message;
    return msg.includes('fetch') || msg.includes('network') || msg.includes('connection');
  }
  return false;
};
