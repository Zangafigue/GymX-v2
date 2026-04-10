/**
 * api.ts — Supabase Data Access Layer (Stabilized)
 *
 * All database requests pass through here.
 * Components receive data directly or an exception.
 */

import { supabase } from './supabase';
import type {
  Profile,
  GymClass,
  GymClassFormData,
  Booking,
  Location,
  LocationFormData,
  AuthCredentials,
} from '../types';

// ─── Authentication ──────────────────────────────────────────────────────────

export const authApi = {
  signIn: async ({ email, password }: AuthCredentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  signUp: async ({ email, password, full_name }: AuthCredentials & { full_name: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name },
      },
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  updateUser: async (data: any) => {
    const { data: updated, error } = await supabase.auth.updateUser(data);
    if (error) throw error;
    return updated;
  },
};

// ─── Profiles ────────────────────────────────────────────────────────────────

export const profilesApi = {
  getById: async (userId: string): Promise<Profile> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  getAll: async (): Promise<Profile[]> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  update: async (userId: string, profile: Partial<Profile>): Promise<Profile> => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...profile, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  updateName: async (userId: string, fullName: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    
    return { data, error };
  },
};

// ─── Classes ─────────────────────────────────────────────────────────────────

export const classesApi = {
  /**
   * Fetches all classes with booking counts.
   */
  getAll: async (): Promise<GymClass[]> => {
    const { data, error } = await supabase
      .from('classes')
      .select('*, bookings(id)')
      .order('day')
      .order('time');
    
    if (error) throw error;
    return data || [];
  },

  getByDay: async (day: string): Promise<GymClass[]> => {
    const { data, error } = await supabase
      .from('classes')
      .select('*, bookings(id)')
      .eq('day', day)
      .order('time');
    
    if (error) throw error;
    return data || [];
  },

  create: async (data: GymClassFormData): Promise<GymClass> => {
    const { data: created, error } = await supabase
      .from('classes')
      .insert([data])
      .select()
      .single();
    
    if (error) throw error;
    return created;
  },

  update: async (id: string, data: Partial<GymClassFormData>): Promise<GymClass> => {
    const { data: updated, error } = await supabase
      .from('classes')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('classes').delete().eq('id', id);
    if (error) throw error;
  },
};

// ─── Bookings ────────────────────────────────────────────────────────────────

export const bookingsApi = {
  getByUser: async (userId: string): Promise<Booking[]> => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        created_at,
        class_id,
        classes (
          title,
          trainer,
          day,
          time,
          type,
          capacity
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data as unknown as Booking[]) || [];
  },

  getAll: async (): Promise<Booking[]> => {
    const { data, error } = await supabase
      .from('bookings')
      .select('id, created_at, user_id, class_id')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  checkExisting: async (userId: string, classId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('user_id', userId)
      .eq('class_id', classId)
      .maybeSingle();
    
    if (error) throw error;
    return !!data;
  },

  create: async (_userId: string, classId: string): Promise<Booking> => {
    const { data, error } = await supabase.functions.invoke('create-booking', {
      body: { class_id: classId }
    });
    
    if (error) throw error;
    if (!data.success) throw new Error(data.error);
    return data.booking;
  },

  delete: async (bookingId: string): Promise<void> => {
    const { error } = await supabase.from('bookings').delete().eq('id', bookingId);
    if (error) throw error;
  },

  cancel: async (bookingId: string) => {
    const { data, error } = await supabase.functions.invoke('cancel-booking', {
      body: { booking_id: bookingId }
    });
    
    if (error) throw error;
    if (!data.success) throw new Error(data.error);
    return { data, error: null };
  },
};

// ─── Locations ───────────────────────────────────────────────────────────────

export const locationsApi = {
  getAll: async (): Promise<Location[]> => {
    const { data, error } = await supabase.from('locations').select('*').order('city');
    if (error) throw error;
    return data || [];
  },

  create: async (data: LocationFormData): Promise<Location> => {
    const { data: created, error } = await supabase.from('locations').insert([data]).select().single();
    if (error) throw error;
    return created;
  },

  update: async (id: string, data: Partial<LocationFormData>): Promise<void> => {
    const { error } = await supabase.from('locations').update(data).eq('id', id);
    if (error) throw error;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('locations').delete().eq('id', id);
    if (error) throw error;
  },
};

// ─── Trainers ───────────────────────────────────────────────────────────────

export const trainersApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('trainers')
      .select('*')
      .order('full_name');
    if (error) throw error;
    return data || [];
  },

  create: async (data: any) => {
    const { data: created, error } = await supabase
      .from('trainers')
      .insert([data])
      .select()
      .single();
    if (error) throw error;
    return created;
  },

  update: async (id: string, data: any) => {
    const { error } = await supabase.from('trainers').update(data).eq('id', id);
    if (error) throw error;
  },

  delete: async (id: string) => {
    const { error } = await supabase.from('trainers').delete().eq('id', id);
    if (error) throw error;
  },
};

// ─── Notifications ────────────────────────────────────────────────────────────

export const notificationsApi = {
  getByUser: async (userId: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  markAsRead: async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
    
    if (error) throw error;
  },

  markAllAsRead: async (userId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    
    if (error) throw error;
  },
};
