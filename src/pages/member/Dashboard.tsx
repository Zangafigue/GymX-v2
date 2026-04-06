import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../context/I18nContext';
import { useToast } from '../../components/ui/Toast';
import { useConfirm } from '../../components/ui/ConfirmDialog';
import { bookingsApi, profilesApi } from '../../lib/api';
import type { Booking } from '../../types';
import { 
  Calendar, 
  User as UserIcon, 
  Settings as SettingsIcon, 
  Clock, 
  ChevronRight, 
  XCircle,
  TrendingUp,
  Star
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { StatCardSkeleton } from '../../components/ui/Skeleton';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { PageHeader } from '../../components/ui/PageHeader';
import { Input } from '../../components/ui/Input';

const MemberDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { confirm } = useConfirm();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.user_metadata?.full_name || '');
  const [updatingName, setUpdatingName] = useState(false);

  const fetchMyBookings = useCallback(async () => {
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
    if (user) {
      fetchMyBookings();
      setNewName(user.user_metadata?.full_name || '');
    }
  }, [user, fetchMyBookings]);

  const handleUpdateName = async () => {
    if (!user || !newName.trim()) return;
    
    setUpdatingName(true);
    try {
      await profilesApi.update(user.id, { full_name: newName });
      addToast({ type: 'success', message: t('profile.update_success') || 'Profile updated!' });
      setIsEditingName(false);
      // Optional: reload user via the provider if not reactive
    } catch (err) {
      addToast({ type: 'error', message: t('errors.update_failed') });
    } finally {
      setUpdatingName(false);
    }
  };

  const handleCancelBooking = async (id: string, classTitle: string) => {
    const ok = await confirm({
      title: t('dashboard.cancel') + ' ' + classTitle,
      message: t('bookings.cancel_confirm') || 'Are you sure you want to cancel this booking?',
      confirmLabel: t('dashboard.cancel'),
      variant: 'danger'
    });

    if (!ok) return;
    
    try {
      await bookingsApi.delete(id);
      addToast({ type: 'success', message: t('bookings.cancel_success') || 'Booking cancelled.' });
      fetchMyBookings();
    } catch (err) {
      addToast({ type: 'error', message: t('errors.delete_failed') });
    }
  };

  const columns = [
    {
      header: t('dashboard.class'),
      accessor: (b: any) => (
        <span className="font-bold text-[var(--color-text-primary)]">{b.classes?.title || 'Unknown Class'}</span>
      )
    },
    {
      header: t('dashboard.day_time'),
      accessor: (b: any) => (
        <div className="flex flex-col">
          <span className="font-medium">{b.classes?.day || '-'}</span>
          <span className="text-[var(--color-primary)] text-[10px] font-bold uppercase">{b.classes?.time || '-'}</span>
        </div>
      )
    },
    {
      header: t('dashboard.trainer'),
      accessor: (b: any) => b.classes?.trainer || t('common.pending')
    },
    {
      header: t('dashboard.actions'),
      align: 'right' as const,
      accessor: (b: any) => (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            handleCancelBooking(b.id, b.classes?.title || '');
          }}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-error)]"
          icon={<XCircle size={14} />}
        >
          {t('dashboard.cancel')}
        </Button>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-10 lg:p-4">
      <PageHeader 
        title={`${t('dashboard.member')} PORTAL`}
        subtitle={`${t('dashboard.welcome')} back, ${user?.user_metadata?.full_name || user?.email}!`}
        actions={
          <Button 
            variant="primary" 
            as={Link}
            to="/dashboard/bookings" 
            icon={<Calendar size={18} />}
          >
            {t('dashboard.bookings_manage')}
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Stats & Table */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <div className="glass-card p-8 flex flex-col gap-3 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-[var(--color-primary)] opacity-[0.03] rounded-full group-hover:scale-110 transition-transform" />
                  <span className="text-[var(--color-text-secondary)] text-[10px] uppercase font-bold tracking-widest">{t('dashboard.total_bookings')}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold font-display">{bookings.length}</span>
                    <TrendingUp size={16} className="text-[var(--color-success)] mb-1" />
                  </div>
                </div>
                <div className="glass-card p-8 flex flex-col gap-3 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-[var(--color-success)] opacity-[0.03] rounded-full group-hover:scale-110 transition-transform" />
                  <span className="text-[var(--color-text-secondary)] text-[10px] uppercase font-bold tracking-widest">{t('dashboard.completed')}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold font-display text-[var(--color-primary)]">0</span>
                  </div>
                </div>
                <div className="glass-card p-8 flex flex-col gap-3 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-[var(--color-info)] opacity-[0.03] rounded-full group-hover:scale-110 transition-transform" />
                  <span className="text-[var(--color-text-secondary)] text-[10px] uppercase font-bold tracking-widest">{t('dashboard.next_class')}</span>
                  <span className="text-sm font-bold font-display truncate uppercase tracking-tight">
                    {bookings[0]?.classes?.title || 'None Scheduled'}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Bookings Table */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold uppercase tracking-tight font-display mb-1">
              {t('dashboard.upcoming_classes')}
            </h3>
            <DataTable 
              columns={columns} 
              data={bookings} 
              loading={loading}
              emptyMessage={t('bookings.no_data') || 'No upcoming classes. Ready to start?'}
            />
          </div>
        </div>

        {/* Right Column: Profile & Upsell */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="glass-card p-8">
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-[var(--color-bg-base)] rounded-full flex items-center justify-center border-2 border-[var(--color-primary)] p-1 shadow-xl">
                  <UserIcon size={48} className="text-[var(--color-text-muted)]" />
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-[var(--color-success)] border-4 border-[var(--color-bg-subtle)] rounded-full" />
              </div>
              <div className="text-center w-full">
                {isEditingName ? (
                  <div className="flex flex-col gap-4 mt-2">
                    <Input 
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder={t('profile.full_name')}
                      autoFocus
                    />
                    <div className="flex justify-center gap-3">
                      <Button variant="primary" size="sm" onClick={handleUpdateName} loading={updatingName}>
                        Save
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setIsEditingName(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h4 className="font-bold text-xl uppercase tracking-tight mb-1">{user?.user_metadata?.full_name || 'Fitness Member'}</h4>
                    <Badge variant="primary" dot>{t('member.active') || 'Member'}</Badge>
                    <p className="text-[var(--color-text-muted)] text-[10px] uppercase font-bold tracking-widest mt-4">
                      {t('member.since') || 'Member since'} {new Date(user?.created_at || '').toLocaleDateString()}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link 
                to="/dashboard/profile"
                className="flex items-center justify-between p-4 bg-[var(--color-surface-3)] rounded-xl hover:bg-[var(--color-border-subtle)] transition-all group overflow-hidden relative"
              >
                <div className="flex items-center gap-3 z-10">
                  <UserIcon size={18} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
                  <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]">
                    {t('dashboard.edit_profile')}
                  </span>
                </div>
                <ChevronRight size={16} className="text-[var(--color-border-strong)]" />
              </Link>
              
              <Link 
                to="/dashboard/bookings"
                className="flex items-center justify-between p-4 bg-[var(--color-surface-3)] rounded-xl hover:bg-[var(--color-border-subtle)] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
                  <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]">
                    {t('dashboard.booking_history')}
                  </span>
                </div>
                <ChevronRight size={16} className="text-[var(--color-border-strong)]" />
              </Link>
              
              <Link 
                to="/dashboard/settings"
                className="flex items-center justify-between p-4 bg-[var(--color-surface-3)] rounded-xl hover:bg-[var(--color-border-subtle)] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <SettingsIcon size={18} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
                  <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]">
                    {t('dashboard.settings')}
                  </span>
                </div>
                <ChevronRight size={16} className="text-[var(--color-border-strong)]" />
              </Link>
            </div>
          </div>

          <div className="glass-card p-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--gymx-red-800)] border-none shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
              <Star size={80} strokeWidth={1} />
            </div>
            <h4 className="font-display text-2xl font-bold uppercase mb-2 text-white italic tracking-tighter">
              {t('dashboard.upgrade_elite')}
            </h4>
            <p className="text-xs font-medium text-white text-opacity-80 mb-8 leading-relaxed">
              {t('dashboard.upgrade_desc')}
            </p>
            <Button 
              disabled
              title="Coming in Phase 3"
              className="w-full !bg-white !text-[var(--color-primary)] !opacity-50 !cursor-not-allowed"
              size="lg"
            >
              {t('dashboard.go_elite')} — Coming Soon
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
