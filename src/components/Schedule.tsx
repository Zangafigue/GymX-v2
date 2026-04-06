import { useState, useEffect, useCallback, useMemo } from 'react';
import { Clock, User as UserIcon, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../context/I18nContext';
import { useToast } from '../components/ui/Toast';
import { getErrorMessage } from '../lib/errors';
import { useConfirm } from '../components/ui/ConfirmDialog';
import { classesApi, bookingsApi } from '../lib/api';
import { sendBookingConfirmation } from '../lib/email';
import type { GymClass } from '../types';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { StatCardSkeleton } from './ui/Skeleton';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const classTypes = ['all', 'strength', 'yoga', 'cardio', 'combat', 'bootcamp'];

const Schedule = () => {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const { addToast } = useToast();
  const { confirm } = useConfirm();
  const navigate = useNavigate();

  const [activeDay, setActiveDay] = useState('monday');
  const [activeType, setActiveType] = useState('all');
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await classesApi.getAll();
      setClasses(data);
    } catch (err) {
      console.error('Error fetching classes:', err);
      addToast({ type: 'error', message: t('errors.fetch_failed') });
    } finally {
      setLoading(false);
    }
  }, [t, addToast]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleBooking = async (classId: string, classTitle: string) => {
    if (!user) {
      addToast({ type: 'error', message: t('schedule.login_required') });
      navigate('/login');
      return;
    }

    const targetClass = classes.find(c => c.id === classId);
    if (!targetClass) return;

    if ((targetClass.bookings?.length || 0) >= targetClass.capacity) {
      addToast({ type: 'error', message: t('schedule.full') });
      return;
    }

    const ok = await confirm({
      title: t('schedule.book_now'),
      message: `${t('bookings.confirm_msg') || 'Do you want to book this class:'} ${classTitle}?`,
      confirmLabel: t('schedule.book_now')
    });

    if (!ok) return;

    setBookingLoading(classId);
    try {
      const alreadyBooked = await bookingsApi.checkExisting(user.id, classId);

      if (alreadyBooked) {
        addToast({ type: 'warning', message: t('schedule.already_booked') });
        return;
      }

      await bookingsApi.create(user.id, classId);

      // Send Confirmation Email (Mocked)
      await sendBookingConfirmation(user.email!, classTitle, t(`schedule.days.${targetClass.day.toLowerCase()}`), targetClass.time);

      addToast({ 
        type: 'success', 
        message: t('schedule.booking_success'),
        icon: <CheckCircle2 size={18} />
      });
      
      fetchClasses();
    } catch (err) {
      addToast({ 
        type: 'error', 
        message: getErrorMessage(err, language) 
      });
    } finally {
      setBookingLoading(null);
    }
  };

  const filteredClasses = useMemo(() => {
    return classes.filter(c => {
      const dayMatch = c.day.toLowerCase() === activeDay.toLowerCase();
      const typeMatch = activeType === 'all' || c.type.toLowerCase() === activeType.toLowerCase();
      return dayMatch && typeMatch;
    });
  }, [classes, activeDay, activeType]);

  return (
    <section id="schedule" className="py-32 bg-[var(--color-bg-base)] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[var(--color-bg-subtle)] to-transparent opacity-50"></div>
      
      <div className="container-page relative z-10">
        <div className="text-center mb-20">
          <Badge variant="primary" className="mb-4">
            {t('nav.classes')}
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 uppercase tracking-tight font-display italic">
            {t('schedule.title')} <span className="text-[var(--color-primary)]">{t('schedule.classes')}</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            {t('schedule.subtitle')}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-10 items-center mb-20 animate-fade-in">
            {/* Day Selectors */}
            <div className="flex flex-wrap justify-center gap-3 p-2 bg-[var(--color-surface-3)] rounded-[2rem] border border-[var(--color-border-subtle)] backdrop-blur-md">
                {days.map((day) => (
                    <button
                      key={day}
                      onClick={() => setActiveDay(day)}
                      className={`px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[11px] transition-all duration-500 whitespace-nowrap ${
                          activeDay === day 
                          ? 'bg-[var(--color-primary)] text-white shadow-xl shadow-[var(--color-primary-muted)] scale-105' 
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-base)]'
                      }`}
                    >
                      {t(`schedule.days.${day}`)}
                    </button>
                ))}
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap justify-center gap-8">
                {classTypes.map((type) => (
                    <button
                        key={type}
                        onClick={() => setActiveType(type)}
                        className={`group relative text-[11px] uppercase font-bold tracking-[0.2em] py-2 transition-all duration-300 ${
                            activeType === type 
                                ? 'text-[var(--color-primary)]' 
                                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                        }`}
                    >
                        {type === 'all' ? t('schedule.all_types') : t(`schedule.types.${type}`)}
                        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary)] transition-transform duration-500 origin-left ${
                          activeType === type ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
                        }`}></span>
                    </button>
                ))}
            </div>
        </div>

        {/* Schedule List */}
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="grid gap-6">
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeDay}-${activeType}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="grid gap-6"
              >
                {filteredClasses.length > 0 ? filteredClasses.map((item) => {
                  const isFull = (item.bookings?.length || 0) >= item.capacity;
                  return (
                    <div 
                      key={item.id} 
                      className="glass-card p-8 flex flex-col lg:flex-row items-center justify-between gap-8 group hover:border-[var(--color-primary-border)] transition-all duration-500 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="flex items-center gap-8 w-full lg:w-auto">
                        <div className="w-20 h-20 bg-[var(--color-bg-base)] rounded-2xl flex flex-col items-center justify-center border border-[var(--color-border-subtle)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-500 shadow-lg">
                          <Clock size={20} className="mb-1 opacity-60" />
                          <span className="font-display text-xl font-bold tracking-tight">{item.time}</span>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <h4 className="text-2xl font-bold uppercase tracking-tight font-display italic text-white group-hover:text-[var(--color-primary)] transition-colors">
                              {item.title}
                            </h4>
                            <Badge variant="outline" className="text-[9px]">
                              {item.type}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-6 text-[10px] uppercase font-bold tracking-[0.15em] text-[var(--color-text-muted)]">
                            <span className="flex items-center gap-2">
                              <UserIcon size={14} className="text-[var(--color-primary)]" />
                              <span className="text-[var(--color-text-secondary)]">{item.trainer}</span>
                            </span>
                            <span className={`flex items-center gap-2 ${isFull ? 'text-[var(--color-error)]' : 'text-[var(--color-success)]'}`}>
                              <Calendar size={14} />
                              {item.bookings?.length || 0} / {item.capacity} {t('dashboard.members')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-[var(--color-border-subtle)] pt-6 lg:pt-0">
                        {isFull && (
                           <div className="flex items-center gap-2 text-[var(--color-error)] text-[10px] font-bold uppercase tracking-widest">
                            <AlertCircle size={14} />
                            {t('schedule.full')}
                           </div>
                        )}
                        <Button 
                          onClick={() => handleBooking(item.id, item.title)}
                          loading={bookingLoading === item.id}
                          disabled={isFull}
                          variant={isFull ? 'secondary' : 'primary'}
                          className="min-w-[140px] !rounded-xl"
                        >
                          {isFull ? t('schedule.full') : t('schedule.book_now')}
                        </Button>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-center py-24 glass-card rounded-[3rem] border-dashed border-2 border-[var(--color-border-subtle)] bg-transparent">
                    <Calendar size={48} className="mx-auto mb-6 text-[var(--color-text-muted)] opacity-20" />
                    <p className="text-[var(--color-text-secondary)] font-medium text-lg italic">
                      {t('schedule.no_classes')}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <div className="mt-16 text-center text-[var(--color-text-muted)] text-[10px] uppercase font-bold tracking-[0.2em] italic opacity-60">
          * {t('schedule.notice') || 'Schedule subject to change. Members get priority booking.'}
        </div>
      </div>
    </section>
  );
};

export default Schedule;
