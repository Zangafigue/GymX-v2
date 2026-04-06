import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Camera, 
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Calendar,
  Zap,
  Save
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../context/I18nContext';
import { useToast } from '../../components/ui/Toast';
import { profilesApi, authApi } from '../../lib/api';
import { getErrorMessage } from '../../lib/errors';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const Profile = () => {
  const { user, role } = useAuth();
  const { t, language } = useTranslation();
  const { addToast } = useToast();

  const [saveLoading, setSaveLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [email] = useState(user?.email || '');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    
    try {
      if (!user) return;

      // Update profile in DB
      await profilesApi.update(user.id, { full_name: fullName });
      
      // Update auth metadata
      await authApi.updateUser({
        data: { full_name: fullName }
      });

      addToast({ 
        type: 'success', 
        message: t('profile.save_profile'),
        icon: <CheckCircle2 size={18} />
      });
    } catch (err) {
      addToast({ type: 'error', message: (err as Error).message });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    if (newPassword !== confirmPassword) {
      addToast({ type: 'error', message: t('profile.passwords_mismatch') });
      return;
    }

    if (newPassword.length < 6) {
      addToast({ 
        type: 'error', 
        message: language === 'fr' 
          ? 'Le mot de passe doit contenir au moins 6 caractères.' 
          : 'Password must be at least 6 characters.' 
      });
      return;
    }

    setPasswordLoading(true);
    try {
      // Step 1: Re-authenticate with current password (Phase 1 Requirement)
      await authApi.signIn({
        email: user.email,
        password: currentPassword
      });

      // Step 2: Update with new password
      await authApi.updateUser({
        password: newPassword
      });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      addToast({ 
        type: 'success', 
        message: t('profile.password_success'),
        icon: <CheckCircle2 size={18} />
      });
    } catch (err) {
      addToast({ 
        type: 'error', 
        message: getErrorMessage(err, language) 
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[var(--color-surface-2)] rounded-[2rem] flex items-center justify-center text-[var(--color-primary)] border border-[var(--color-border-subtle)] shadow-xl">
                <User size={32} />
            </div>
            <div>
                <h1 className="text-4xl font-bold uppercase tracking-tight font-display italic leading-none mb-2">
                    {t('profile.profile_title')}
                </h1>
                <p className="text-[var(--color-text-secondary)] font-medium">
                    {t('profile.profile_subtitle')}
                </p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Profile Stats/Info Card */}
        <div className="lg:col-span-1 space-y-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card !p-10 flex flex-col items-center gap-8 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-[var(--color-primary)]" />
                
                <div className="relative group">
                    <div className="w-40 h-40 bg-[var(--color-surface-2)] rounded-full flex items-center justify-center border-4 border-white/5 overflow-hidden group-hover:border-[var(--color-primary)] transition-all duration-500 shadow-2xl">
                        <User size={80} className="text-[var(--color-text-muted)] group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <button className="absolute bottom-2 right-2 w-12 h-12 bg-[var(--color-primary)] text-white rounded-2xl flex items-center justify-center border-4 border-[var(--color-bg-base)] hover:scale-110 transition-all shadow-xl">
                        <Camera size={20} />
                    </button>
                </div>

                <div className="text-center">
                    <h3 className="text-3xl font-bold text-white font-display italic uppercase tracking-tight mb-2">{fullName || 'Fitness Member'}</h3>
                    <div className="flex items-center justify-center gap-3 text-[10px] uppercase font-bold tracking-[0.3em] text-[var(--color-primary)] bg-[var(--color-primary-bg)] px-5 py-2 rounded-full border border-[var(--color-primary-border)] shadow-lg shadow-red-900/10">
                        <Shield size={14} /> {role?.toUpperCase()} MEMBER
                    </div>
                </div>

                <div className="w-full grid gap-4 pt-8 border-t border-[var(--color-border-subtle)]">
                    <div className="flex items-center justify-between p-4 bg-[var(--color-surface-2)] rounded-2xl border border-[var(--color-border-subtle)] group/item hover:border-[var(--color-primary-border)] transition-colors">
                        <div className="flex items-center gap-3">
                            <Mail size={18} className="text-[var(--color-primary)]" />
                            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Email</span>
                        </div>
                        <span className="text-sm font-medium text-white truncate max-w-[150px]">{email}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[var(--color-surface-2)] rounded-2xl border border-[var(--color-border-subtle)] group/item hover:border-[var(--color-primary-border)] transition-colors">
                        <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-[var(--color-primary)]" />
                            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Member Since</span>
                        </div>
                        <span className="text-sm font-medium text-white">{new Date(user?.created_at || '').toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[var(--color-surface-2)] rounded-2xl border border-[var(--color-border-subtle)] group/item hover:border-[var(--color-primary-border)] transition-colors">
                        <div className="flex items-center gap-3">
                            <Zap size={18} className="text-[var(--color-primary)]" />
                            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Status</span>
                        </div>
                        <span className="text-sm font-bold text-[var(--color-success)] tracking-tight">ACTIVE</span>
                    </div>
                </div>
            </motion.div>
        </div>

        {/* Forms Container */}
        <div className="lg:col-span-2 space-y-10">
            {/* Account Info Form */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card !p-0 overflow-hidden"
            >
                <div className="p-8 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3 font-display italic uppercase tracking-tight">
                        <User size={22} className="text-[var(--color-primary)]" /> {t('profile.account_details')}
                    </h3>
                </div>
                <form onSubmit={handleUpdateProfile} className="p-10 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <Input 
                            label="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            prefix={<User size={18} />}
                            placeholder="Enter your full name"
                        />
                        <Input 
                            label="Email Address (Locked)"
                            disabled
                            type="email" 
                            value={email}
                            prefix={<Mail size={18} />}
                        />
                    </div>

                    <div className="flex justify-end pt-6 border-t border-[var(--color-border-subtle)]">
                        <Button 
                            type="submit" 
                            loading={saveLoading}
                            icon={<Save size={18} />}
                            className="!px-12 !rounded-2xl italic font-display uppercase text-sm tracking-widest"
                        >
                            {t('profile.save_profile')}
                        </Button>
                    </div>
                </form>
            </motion.div>

            {/* Password Security Form */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card !p-0 overflow-hidden"
            >
                <div className="p-8 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3 font-display italic uppercase tracking-tight">
                        <Lock size={22} className="text-[var(--color-primary)]" /> {t('profile.security_password')}
                    </h3>
                </div>
                <form onSubmit={handleChangePassword} className="p-10 space-y-10">
                    <div className="grid grid-cols-1 gap-10">
                        <Input 
                            label={language === 'fr' ? "Mot de passe actuel" : "Current Password"}
                            type={showPassword ? "text" : "password"} 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            prefix={<Lock size={18} />}
                            placeholder="••••••••"
                            required
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="relative">
                                <Input 
                                    label={t('profile.new_password')}
                                    type={showPassword ? "text" : "password"} 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    prefix={<Lock size={18} />}
                                    placeholder="••••••••"
                                    required
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-[46px] text-[var(--color-text-muted)] hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <Input 
                                label={t('profile.confirm_password')}
                                type={showPassword ? "text" : "password"} 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                prefix={<Shield size={18} />}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-[var(--color-border-subtle)]">
                        <Button 
                            type="submit"
                            variant="secondary"
                            disabled={!newPassword}
                            loading={passwordLoading}
                            className="!px-12 !rounded-2xl italic font-display uppercase text-sm tracking-widest"
                        >
                            {t('profile.update_password')}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
