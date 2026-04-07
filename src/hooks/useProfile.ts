/**
 * useProfile.ts — Hook for user profile management
 */

import { useState, useCallback } from 'react';
import { profilesApi, authApi } from '../lib/api';
import { useAuth } from './useAuth';
import { useToast } from '../components/ui/Toast';
import { useTranslation } from '../context/I18nContext';
import { getErrorMessage } from '../lib/errors';
import { supabase } from '../lib/supabase';

export const useProfile = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { language } = useTranslation();
  const [loading, setLoading] = useState(false);

  const updateName = useCallback(async (fullName: string): Promise<boolean> => {
    if (!user) return false;
    setLoading(true);
    try {
      const { error } = await profilesApi.updateName(user.id, fullName);
      if (error) throw error;

      // Sync with Supabase Auth metadata
      await authApi.updateUser({ data: { full_name: fullName } });

      addToast({
        type: 'success',
        message: language === 'fr' ? 'Nom mis à jour !' : 'Name updated!',
      });
      return true;
    } catch (err) {
      addToast({ type: 'error', message: getErrorMessage(err, language) });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, language, addToast]);

  const changePassword = useCallback(async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    if (!user?.email) return false;
    setLoading(true);
    try {
      // Step 1: Verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (signInError) throw new Error(
        language === 'fr' ? 'Mot de passe actuel incorrect.' : 'Current password is incorrect.'
      );

      // Step 2: Update to new password
      const { error } = await authApi.updateUser({ password: newPassword });
      if (error) throw error;

      addToast({
        type: 'success',
        message: language === 'fr' ? 'Mot de passe mis à jour !' : 'Password updated!',
      });
      return true;
    } catch (err) {
      addToast({ type: 'error', message: getErrorMessage(err, language) });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, language, addToast]);

  return { loading, updateName, changePassword };
};
