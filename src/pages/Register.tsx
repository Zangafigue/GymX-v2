import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, UserPlus, CheckCircle2 } from 'lucide-react';
import { authApi } from '../lib/api';
import { useTranslation } from '../context/I18nContext';
import { useToast } from '../components/ui/Toast';
import { getErrorMessage } from '../lib/errors';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const Register = () => {
  const { t, language } = useTranslation();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: Match
    if (password !== confirmPassword) {
      addToast({ type: 'error', message: t('auth.password_mismatch') || 'Passwords do not match.' });
      return;
    }

    // Validation: Length (Phase 1 Requirement)
    if (password.length < 6) {
      addToast({ 
        type: 'error', 
        message: language === 'fr' 
          ? 'Le mot de passe doit contenir au moins 6 caractères.' 
          : 'Password must be at least 6 characters.' 
      });
      return;
    }

    setLoading(true);

    try {
      await authApi.signUp({ email, password, full_name: fullName });
      addToast({ 
        type: 'success', 
        message: t('auth.register_success') || 'Account created! Please login.',
        icon: <CheckCircle2 size={18} />
      });
      navigate('/login');
    } catch (err) {
      addToast({ 
        type: 'error', 
        message: getErrorMessage(err, language) 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center px-6 bg-[var(--color-bg-base)] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--color-primary)] opacity-[0.03] blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[var(--color-primary)] opacity-[0.03] blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md glass-card p-10 border border-[var(--color-border-subtle)] animate-fade-in-up relative z-10 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[var(--color-primary)] bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[var(--color-primary)]">
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-bold uppercase tracking-tight">
            {t('auth.register_title')} <span className="text-[var(--color-primary)]">X</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm mt-2">
            {t('auth.register_subtitle')}
          </p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <Input 
            label={t('auth.full_name')}
            type="text" 
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            prefix={<UserIcon size={18} className="text-[var(--color-text-muted)]" />}
          />

          <Input 
            label={t('auth.email')}
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            prefix={<Mail size={18} className="text-[var(--color-text-muted)]" />}
          />

          <Input 
            label={t('auth.password')}
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            prefix={<Lock size={18} className="text-[var(--color-text-muted)]" />}
          />

          <Input 
            label={t('auth.confirm_password') || 'Confirm Password'}
            type="password" 
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            prefix={<CheckCircle2 size={18} className="text-[var(--color-text-muted)]" />}
          />

          <Button 
            type="submit" 
            loading={loading}
            fullWidth
            size="lg"
            className="mt-4"
          >
            {t('auth.register_btn')}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">
          {t('auth.have_account')}{' '}
          <Link to="/login" className="text-[var(--color-primary)] hover:underline font-bold uppercase tracking-widest text-xs">
            {t('auth.login_link')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
