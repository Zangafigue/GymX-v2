/**
 * Analytics.tsx — Admin Analytics Dashboard
 *
 * Displays:
 * - Bookings by day (last 7 days) — LineChart
 * - Class distribution by type — PieChart
 * - Top 5 most booked classes — BarChart
 */

import { useEffect, useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { supabase } from '../../lib/supabase';
import { StatCardSkeleton } from '../../components/ui/Skeleton';
import { useTranslation } from '../../context/I18nContext';

const COLORS = ['#FF3131', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7'];

const AdminAnalytics = () => {
  const { language } = useTranslation();
  const [bookingsByDay, setBookingsByDay] = useState<{ day: string; count: number }[]>([]);
  const [classByType, setClassByType] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Bookings from the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: bookings } = await supabase
        .from('bookings')
        .select('created_at')
        .gte('created_at', sevenDaysAgo.toISOString());

      // Group by day
      const byDay: Record<string, number> = {};
      const locale = language === 'fr' ? 'fr-FR' : 'en-US';
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toLocaleDateString(locale, { weekday: 'short', day: 'numeric' });
      });

      days.forEach(d => { byDay[d] = 0; });

      (bookings || []).forEach(b => {
        const day = new Date(b.created_at).toLocaleDateString(locale, { weekday: 'short', day: 'numeric' });
        if (byDay[day] !== undefined) byDay[day]++;
      });

      setBookingsByDay(Object.entries(byDay).map(([day, count]) => ({ day, count })));

      // Classes by type
      const { data: classes } = await supabase
        .from('classes')
        .select('type, bookings(id)');

      const typeCount: Record<string, number> = {};
      (classes || []).forEach((c: { type: string; bookings?: unknown[] }) => {
        typeCount[c.type] = (typeCount[c.type] || 0) + (c.bookings?.length || 0);
      });

      setClassByType(
        Object.entries(typeCount)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
      );

    } finally {
      setLoading(false);
    }
  };

  const getDayFormat = (day: string) => {
      return day;
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-4xl font-bold uppercase text-[var(--color-text-primary)] mb-2">
          Analytics <span className="text-[var(--color-primary)]">Gym</span>
        </h1>
        <p className="text-[var(--color-text-secondary)]">
            {language === 'fr' ? "Vue d'ensemble des performances de la salle." : "Overview of the gym's performance."}
        </p>
      </div>

      {/* Bookings Chart */}
      <div className="glass-card p-8">
        <h3 className="text-xl font-bold uppercase mb-6">
            {language === 'fr' ? 'Réservations — 7 derniers jours' : 'Bookings — Last 7 days'}
        </h3>
        {loading ? <div className="h-64 animate-shimmer rounded-xl bg-[var(--color-surface-2)]" /> : (
          <ResponsiveContainer width="100%" height={256}>
            <LineChart data={bookingsByDay}>
              <XAxis dataKey="day" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--color-bg-subtle)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: '8px',
                  color: 'var(--color-text-primary)',
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-primary)', r: 4 }}
                name={language === 'fr' ? 'Réservations' : 'Bookings'}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Breakdown by Type and Top Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold uppercase mb-6">
              {language === 'fr' ? 'Réservations par type de cours' : 'Bookings by class type'}
          </h3>
          {loading ? <div className="h-64 animate-shimmer rounded-xl bg-[var(--color-surface-2)]" /> : (
            <ResponsiveContainer width="100%" height={256}>
              <PieChart>
                <Pie
                  data={classByType}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: 'var(--color-text-muted)' }}
                >
                  {classByType.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-bg-subtle)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass-card p-8">
          <h3 className="text-xl font-bold uppercase mb-6">
              {language === 'fr' ? 'Cours les plus réservés' : 'Most booked classes'}
          </h3>
          {loading ? <div className="h-64 animate-shimmer rounded-xl bg-[var(--color-surface-2)]" /> : (
            <ResponsiveContainer width="100%" height={256}>
              <BarChart data={classByType.slice(0, 5)} layout="vertical">
                <XAxis type="number" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} width={90} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-bg-subtle)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" fill="var(--color-primary)" radius={[0, 4, 4, 0]} name={language === 'fr' ? 'Réservations' : 'Bookings'} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
