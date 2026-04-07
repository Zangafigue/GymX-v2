/**
 * useClasses.ts — Hook for gym class management
 * 
 * Manages class fetching and reservation logic.
 * Integrates capacity checks and async email confirmations.
 */

import { useState, useCallback, useEffect } from 'react';
import { classesApi, bookingsApi } from '../lib/api';
import { useAuth } from './useAuth';
import { useToast } from '../components/ui/Toast';
import { useTranslation } from '../context/I18nContext';
import { getErrorMessage } from '../lib/errors';
import { sendBookingConfirmation } from '../lib/email';
import type { GymClass } from '../types';

export const useClasses = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { language } = useTranslation();

  const [classes, setClasses] = useState<GymClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await classesApi.getAll();
      setClasses(data || []);
    } catch (err) {
      addToast({
        type: 'error',
        message: getErrorMessage(err, language),
      });
    } finally {
      setLoading(false);
    }
  }, [addToast, language]);

  const bookClass = useCallback(async (classId: string) => {
    if (!user) {
      addToast({
        type: 'info',
        message: language === 'fr'
          ? 'Veuillez vous connecter pour réserver un cours.'
          : 'Please log in to book a class.',
        duration: 5000,
      });
      return false;
    }

    const targetClass = classes.find(c => c.id === classId);
    if (!targetClass) return false;

    // Check capacity
    const currentBookings = targetClass.bookings?.length ?? 0;
    if (currentBookings >= targetClass.capacity) {
      addToast({
        type: 'warning',
        message: language === 'fr' ? 'Ce cours est complet.' : 'This class is full.',
      });
      return false;
    }

    setBookingLoading(classId);
    try {
      // Check if already booked
      const exists = await bookingsApi.checkExisting(user.id, classId);
      if (exists) {
        addToast({
          type: 'info',
          message: language === 'fr'
            ? 'Vous avez déjà réservé ce cours.'
            : 'You have already booked this class.',
        });
        return false;
      }

      // Create booking
      const newBooking = await bookingsApi.create(user.id, classId);
      if (!newBooking) throw new Error('Failed to create booking');

      // Update local state to reflect the new booking
      setClasses(prev => prev.map(c => 
        c.id === classId 
          ? { ...c, bookings: [...(c.bookings || []), { id: newBooking.id }] }
          : c
      ));

      addToast({
        type: 'success',
        message: language === 'fr' 
          ? `"${targetClass.title}" réservé !`
          : `"${targetClass.title}" booked!`,
      });

      // Send email confirmation (async, non-blocking)
      if (user.email) {
        sendBookingConfirmation(
          user.email,
          targetClass.title,
          targetClass.day,
          targetClass.time
        );
      }

      return true;
    } catch (err) {
      addToast({
        type: 'error',
        message: getErrorMessage(err, language),
      });
      return false;
    } finally {
      setBookingLoading(null);
    }
  }, [user, classes, language, addToast]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return {
    classes,
    loading,
    bookingLoading,
    fetchClasses,
    bookClass,
  };
};
