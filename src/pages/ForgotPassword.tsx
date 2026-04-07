/**
 * ForgotPassword.tsx
 * Supabase natively handles password resets via email.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTranslation } from '../context/I18nContext';
import { getErrorMessage } from '../lib/errors';

const ForgotPassword = () => {
  const { language } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // Redirect to ResetPassword page
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(getErrorMessage(err, language));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen pt-32 pb-12 flex flex-col justify-center items-center px-6">
        <div className="w-full max-w-md glass-card p-10 text-center">
          <div className="w-16 h-16 bg-[var(--color-success-bg)] rounded-full flex items-center justify-center text-[var(--color-success)] mx-auto mb-6">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-4">
            {language === 'fr' ? 'Email envoyé !' : 'Email sent!'}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-8">
            {language === 'fr'
              ? `Un lien de réinitialisation a été envoyé à ${email}. Vérifiez votre boîte de réception.`
              : `A reset link was sent to ${email}. Please check your inbox.`}
          </p>
          <Link to="/login" className="btn-primary w-full flex justify-center">
            {language === 'fr' ? 'Retour à la connexion' : 'Back to login'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-12 flex flex-col justify-center items-center px-6">
      <div className="w-full max-w-md glass-card p-10">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          {language === 'fr' ? 'Retour' : 'Back'}
        </Link>

        <div className="mb-10">
          <h2 className="text-3xl font-bold uppercase tracking-tight">
            {language === 'fr' ? 'Mot de passe' : 'Forgot'}{' '}
            <span className="text-[var(--color-primary)]">
              {language === 'fr' ? 'oublié ?' : 'password?'}
            </span>
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm mt-2">
            {language === 'fr'
              ? 'Entrez votre email pour recevoir un lien de réinitialisation.'
              : 'Enter your email to receive a reset link.'}
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
              {language === 'fr' ? 'Adresse email' : 'Email address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="input-base pl-12"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary py-4 mt-2">
            {loading
              ? <Loader2 size={18} className="animate-spin" />
              : (language === 'fr' ? 'Envoyer le lien' : 'Send reset link')
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
