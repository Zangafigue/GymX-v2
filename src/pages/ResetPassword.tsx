/**
 * ResetPassword.tsx
 * Page vers laquelle Supabase redirige après le clic sur le lien email.
 * Supabase injecte automatiquement la session de l'utilisateur via le hash URL.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTranslation } from '../context/I18nContext';
import { useToast } from '../components/ui/Toast';
import { getErrorMessage } from '../lib/errors';

const ResetPassword = () => {
  const { language } = useTranslation();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  // Supabase sends a PASSWORD_RECOVERY event when the user
  // arrives from the email link. Wait for this event before showing the form.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
      }
    });

    // Timeout fallback just in case the event was already fired
    const timer = setTimeout(() => setReady(true), 1500);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError(language === 'fr'
        ? 'Le mot de passe doit contenir au moins 6 caractères.'
        : 'Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(language === 'fr'
        ? 'Les mots de passe ne correspondent pas.'
        : "Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      addToast({
        type: 'success',
        message: language === 'fr'
          ? 'Mot de passe réinitialisé avec succès !'
          : 'Password reset successfully!',
      });

      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err, language));
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-base)]">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-[var(--color-primary)] mx-auto mb-4" />
          <p className="text-[var(--color-text-secondary)] text-sm">
            {language === 'fr' ? 'Vérification du lien...' : 'Verifying link...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-12 flex flex-col justify-center items-center px-6">
      <div className="w-full max-w-md glass-card p-10">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold uppercase tracking-tight">
            {language === 'fr' ? 'Nouveau' : 'New'}{' '}
            <span className="text-[var(--color-primary)]">
              {language === 'fr' ? 'mot de passe' : 'Password'}
            </span>
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm mt-2">
            {language === 'fr'
              ? 'Choisissez un mot de passe sécurisé.'
              : 'Choose a secure password.'}
          </p>
        </div>

        {error && (
          <div className="bg-[var(--color-error-bg)] border border-[var(--color-error-border)] text-[var(--color-error)] p-4 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-label text-[var(--color-text-secondary)]">
              {language === 'fr' ? 'Nouveau mot de passe' : 'New password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="input-base pl-12 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-label text-[var(--color-text-secondary)]">
              {language === 'fr' ? 'Confirmer le mot de passe' : 'Confirm password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="input-base pl-12"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary py-4 mt-2">
            {loading
              ? <Loader2 size={18} className="animate-spin" />
              : (language === 'fr' ? 'Réinitialiser le mot de passe' : 'Reset password')
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
