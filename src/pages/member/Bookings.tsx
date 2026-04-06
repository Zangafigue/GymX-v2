import { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  XCircle, 
  FileText,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Inbox
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../context/I18nContext';
import { useToast } from '../../components/ui/Toast';
import { useConfirm } from '../../components/ui/ConfirmDialog';
import { bookingsApi } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatCardSkeleton } from '../../components/ui/Skeleton';
import type { Booking } from '../../types';

const MemberBookings = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { confirm } = useConfirm();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await bookingsApi.getByUser(user.id);
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      addToast({ type: 'error', message: t('errors.fetch_failed') });
    } finally {
      setLoading(false);
    }
  }, [user, t, addToast]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const cancelBooking = async (id: string, title: string) => {
    const ok = await confirm({
      title: t('member.cancel_session'),
      message: `${t('member.cancel_confirm')} (${title})`,
      variant: 'danger',
      confirmLabel: t('common.confirm') || 'Confirm Cancellation'
    });

    if (!ok) return;
    
    try {
      await bookingsApi.delete(id);
      addToast({ 
        type: 'success', 
        message: t('member.cancel_success'),
        icon: <CheckCircle2 size={18} />
      });
      fetchBookings();
    } catch (err) {
      addToast({ type: 'error', message: t('errors.unexpected') });
    }
  };

  const upcomingBookings = useMemo(() => {
    return bookings.filter(b => b.classes);
  }, [bookings]);

  if (loading) return (
    <div className="space-y-8 animate-pulse">
      <div className="h-20 w-1/3 bg-[var(--color-surface-2)] rounded-2xl" />
      <div className="grid gap-6">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[var(--color-primary-bg)] rounded-[2rem] flex items-center justify-center text-[var(--color-primary)] border border-[var(--color-primary-border)] shadow-xl shadow-red-900/10">
                <CalendarIcon size={32} />
            </div>
            <div>
                <h1 className="text-4xl font-bold uppercase tracking-tight font-display italic leading-none mb-2">
                    {t('member.bookings_title')}
                </h1>
                <p className="text-[var(--color-text-secondary)] font-medium">
                    {t('member.bookings_subtitle')}
                </p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
          {upcomingBookings.length > 0 ? (
            <div className="flex flex-col gap-8">
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-primary)] bg-[var(--color-primary-bg)] w-fit px-6 py-2.5 rounded-full border border-[var(--color-primary-border)] shadow-xl shadow-red-900/10 animate-pulse">
                    <TrendingUp size={14} /> {t('member.upcoming_sessions')}
                </div>
                
                <div className="grid gap-6">
                    {upcomingBookings.map((booking, idx) => (
                        <motion.div 
                            key={booking.id} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card group hover:border-[var(--color-primary-border)] transition-all duration-500 !p-0 flex flex-col md:flex-row items-stretch relative overflow-hidden bg-gradient-to-r from-transparent to-white/0 hover:to-white/[0.02]"
                        >
                            {/* Status Vertical Line */}
                            <div className="w-1.5 bg-[var(--color-primary)] shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.5)]" />
                            
                            <div className="flex-1 p-8 flex flex-col md:flex-row items-center gap-10">
                                {/* Class Info */}
                                <div className="flex-1 flex flex-col gap-4">
                                     <div className="flex items-center gap-4">
                                         <Badge variant="outline" className="italic !px-4 !py-1.5 tracking-[0.2em] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-500">
                                            {booking.classes?.type || 'Session'}
                                        </Badge>
                                        <span className="text-[var(--color-text-muted)] text-[10px] font-mono tracking-tighter opacity-40">#{booking.id.slice(0, 8).toUpperCase()}</span>
                                     </div>
                                     <h3 className="text-3xl font-bold text-white group-hover:text-[var(--color-primary)] transition-colors font-display italic uppercase tracking-tight">{booking.classes?.title || 'Unknown Class'}</h3>
                                     <div className="flex flex-wrap items-center gap-6 text-[var(--color-text-secondary)] text-sm font-medium">
                                        <span className="flex items-center gap-2.5"><Clock size={18} className="text-[var(--color-primary)] opacity-80" /> {booking.classes?.day} • {booking.classes?.time}</span>
                                        <span className="flex items-center gap-2.5"><MapPin size={18} className="text-[var(--color-primary)] opacity-80" /> Main Gym Center</span>
                                     </div>
                                </div>

                                {/* Trainer Info */}
                                <div className="hidden lg:flex items-center gap-5 py-2 px-8 border-l border-[var(--color-border-subtle)] group-hover:border-[var(--color-primary-border)] transition-colors">
                                    <div className="w-14 h-14 bg-[var(--color-surface-2)] rounded-[1.25rem] flex items-center justify-center text-[var(--color-primary)] border border-[var(--color-border-subtle)] group-hover:scale-110 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-500 shadow-inner">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] uppercase text-[var(--color-text-muted)] font-bold tracking-[0.3em]">Instructor</span>
                                        <span className="text-base font-bold text-white tracking-tight uppercase italic font-display">{booking.classes?.trainer || 'Instructor'}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto ml-auto">
                                    <Button 
                                        variant="secondary" 
                                        className="!px-6 !rounded-xl group/btn italic font-display uppercase text-xs tracking-widest"
                                        icon={<FileText size={16} />}
                                    >
                                        {t('member.pdf_receipt')}
                                    </Button>
                                    <Button 
                                        variant="ghost"
                                        onClick={() => cancelBooking(booking.id, booking.classes?.title || '')}
                                        className="!px-6 !rounded-xl hover:bg-[var(--color-error)] hover:text-white transition-all duration-300 italic font-display uppercase text-xs tracking-widest"
                                        icon={<XCircle size={16} />}
                                    >
                                        {t('member.cancel_session')}
                                    </Button>
                                </div>
                            </div>

                            {/* Hover Arrow */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-10 group-hover:translate-x-2 transition-all duration-700 hidden md:block">
                                <ChevronRight size={120} strokeWidth={1} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
          ) : (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-32 text-center glass-card border-dashed border-2 border-[var(--color-border-subtle)] flex flex-col items-center gap-8 animate-fade-in bg-transparent"
            >
                <div className="w-24 h-24 bg-[var(--color-surface-2)] rounded-[2.5rem] flex items-center justify-center text-[var(--color-text-muted)] opacity-20 mb-2">
                    <Inbox size={48} />
                </div>
                <div className="max-w-md">
                    <h3 className="text-2xl font-bold text-white mb-4 font-display italic uppercase tracking-tight">
                        {t('member.no_bookings')}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] font-medium text-lg leading-relaxed italic">
                        {t('member.bookings_desc')}
                    </p>
                </div>
                <Button 
                    size="lg" 
                    className="!px-12 !rounded-[2rem] italic font-display shadow-2xl shadow-red-900/20"
                    onClick={() => navigate('/#schedule')}
                >
                    {t('nav.explore_btn')}
                </Button>
            </motion.div>
          )}
      </div>
    </div>
  );
};

export default MemberBookings;
