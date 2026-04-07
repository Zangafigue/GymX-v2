/**
 * useBookings.ts — Hook for booking management
 * 
 * Centralizes all booking logic, preventing duplication between 
 * Member Dashboard and My Bookings pages.
 */

import { useState, useCallback, useEffect } from 'react';
import { bookingsApi } from '../lib/api';
import { useAuth } from './useAuth';
import { useToast } from '../components/ui/Toast';
import { useConfirm } from '../components/ui/ConfirmDialog';
import { useTranslation } from '../context/I18nContext';
import { getErrorMessage } from '../lib/errors';
import type { Booking } from '../types';

export const useBookings = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { confirm } = useConfirm();
  const { language } = useTranslation();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await bookingsApi.getByUser(user.id);
      setBookings(data || []);
    } catch (err) {
      addToast({
        type: 'error',
        message: getErrorMessage(err, language),
      });
    } finally {
      setLoading(false);
    }
  }, [user, addToast, language]);

  const cancelBooking = useCallback(async (bookingId: string, className: string) => {
    const confirmed = await confirm({
      title: language === 'fr' ? 'Annuler la réservation ?' : 'Cancel booking?',
      message: language === 'fr'
        ? `Voulez-vous annuler votre réservation pour "${className}" ?`
        : `Are you sure you want to cancel your booking for "${className}"?`,
      confirmLabel: language === 'fr' ? 'Oui, annuler' : 'Yes, cancel',
      variant: 'danger',
    });

    if (!confirmed) return;

    setCancelling(bookingId);
    try {
      const { error } = await bookingsApi.cancel(bookingId);
      if (error) throw error;

      setBookings(prev => prev.filter(b => b.id !== bookingId));
      addToast({
        type: 'success',
        message: language === 'fr' ? 'Réservation annulée.' : 'Booking cancelled.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        message: getErrorMessage(err, language),
      });
    } finally {
      setCancelling(null);
    }
  }, [confirm, language, addToast]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    cancelling,
    fetchBookings,
    cancelBooking,
  };
};
