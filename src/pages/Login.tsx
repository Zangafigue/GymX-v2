import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, CheckCircle2 } from 'lucide-react';
import { authApi, profilesApi } from '../lib/api';
import { useTranslation } from '../context/I18nContext';
import { useToast } from '../components/ui/Toast';
import { getErrorMessage } from '../lib/errors';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const Login = () => {
  const { t, language } = useTranslation();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authApi.signIn({ email, password });
      if (data.user) {
        // Use central API to fetch profile role
        const profile = await profilesApi.getById(data.user.id);
        
        const targetPath = profile?.role === 'admin' ? '/admin' : '/dashboard';
        
        addToast({ 
          type: 'success', 
          message: t('auth.login_success') || 'Welcome back!',
          icon: <CheckCircle2 size={18} />
        });
        
        navigate(targetPath);
      }
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
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-primary)] opacity-[0.03] blur-[100px] rounded-full"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-primary)] opacity-[0.03] blur-[100px] rounded-full"></div>
      
      <div className="w-full max-w-md glass-card p-10 border border-[var(--color-border-subtle)] animate-fade-in-up relative z-10 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[var(--color-primary)] bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[var(--color-primary)]">
            <LogIn size={32} />
          </div>
          <h2 className="text-3xl font-bold uppercase tracking-tight">
            {t('auth.login_title')} <span className="text-[var(--color-primary)]">X</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm mt-2">
            {t('auth.login_subtitle')}
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <Input 
            label={t('auth.email')}
            type="email" 
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            prefix={<Mail size={18} className="text-[var(--color-text-muted)]" />}
          />

          <Input 
            label={t('auth.password')}
            type="password" 
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            prefix={<Lock size={18} className="text-[var(--color-text-muted)]" />}
          />

          <Button 
            type="submit" 
            loading={loading}
            fullWidth
            size="lg"
            className="mt-4"
          >
            {t('auth.login_btn')}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">
           {t('auth.no_account')}{' '}
           <Link to="/register" className="text-[var(--color-primary)] hover:underline font-bold uppercase tracking-widest text-xs">
            {t('auth.signup_link')}
           </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
