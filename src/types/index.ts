/**
 * types/index.ts
 * Single source of truth for all GymX application types.
 * Directly corresponds to Supabase tables.
 */

// ─── Authentication & Users ─────────────────────────────────────────────────

export type Role = 'admin' | 'member';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface Profile {
  id: string;            // uuid, foreign key to auth.users
  full_name: string;
  role: Role;
  avatar_url?: string;
  created_at: string;    // ISO 8601
  updated_at?: string;
}

// ─── Gyms & Locations ────────────────────────────────────────────────────────

export interface Location {
  id: string;
  name: string;          // e.g., "GymX Ouaga 2000"
  city: string;          // e.g., "Ouagadougou"
  address: string;
  phone?: string;
  description?: string;
  created_at: string;
}

// ─── Trainers ───────────────────────────────────────────────────────────────

export interface Trainer {
  id: string;
  full_name: string;
  bio?: string;
  photo_url?: string;
  specialties: string[]; // e.g., ["Yoga", "Cardio"]
  location_id?: string;
  created_at: string;
}

// ─── Classes ────────────────────────────────────────────────────────────────

export type ClassType = 'Strength' | 'Yoga' | 'Cardio' | 'Combat' | 'Bootcamp';

export type DayOfWeek =
  | 'Monday' | 'Tuesday' | 'Wednesday'
  | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface GymClass {
  id: string;
  title: string;
  trainer: string;       // Free text for now (Phase 2 → FK to trainers)
  trainer_id?: string;   // Future FK to trainers table
  type: ClassType;
  day: DayOfWeek;
  time: string;          // Format "HH:MM"
  capacity: number;
  location_id?: string;
  description?: string;
  created_at?: string;
  // Computed fields (Supabase joins)
  bookings?: { id: string }[];
  bookings_count?: number;
}

// ─── Bookings ───────────────────────────────────────────────────────────────

export interface Booking {
  id: string;
  user_id: string;
  class_id: string;
  created_at: string;
  // Join with classes
  classes?: Pick<GymClass, 'title' | 'trainer' | 'day' | 'time' | 'type'>;
}

// ─── Forms (no id or timestamps) ───────────────────────────────────────────

export type GymClassFormData = Omit<GymClass, 'id' | 'created_at' | 'bookings' | 'bookings_count'>;
export type LocationFormData = Omit<Location, 'id' | 'created_at'>;
export type TrainerFormData = Omit<Trainer, 'id' | 'created_at'>;

// ─── UI States ──────────────────────────────────────────────────────────────

export interface FeedbackState {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

// ─── Translations ───────────────────────────────────────────────────────────

export type Language = 'fr' | 'en';

export type Theme = 'dark' | 'light' | 'system';
