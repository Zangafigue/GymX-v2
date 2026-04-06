import { useEffect, useState, useCallback } from 'react';
import { 
  Users, 
  Calendar as CalendarIcon, 
  Plus, 
  TrendingUp, 
  Edit2,
  Trash2,
  CheckCircle2,
  ArrowUpRight,
  Activity,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../context/I18nContext';
import { useToast } from '../../components/ui/Toast';
import { useConfirm } from '../../components/ui/ConfirmDialog';
import { profilesApi, classesApi, bookingsApi } from '../../lib/api';
import ClassModal from '../../components/ClassModal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatCardSkeleton } from '../../components/ui/Skeleton';
import type { Profile, GymClass, GymClassFormData } from '../../types';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { confirm } = useConfirm();

  const [members, setMembers] = useState<Profile[]>([]);
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<GymClass | null>(null);
  const [stats, setStats] = useState({
      totalMembers: 0,
      totalClasses: 0,
      totalBookings: 0
  });

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    try {
        const [membersData, classesData, bookingsData] = await Promise.all([
            profilesApi.getAll(),
            classesApi.getAll(),
            bookingsApi.getAll()
        ]);

        setMembers(membersData.slice(0, 5)); // Only show top 5 for dashboard
        setClasses(classesData.slice(0, 5));
        
        setStats({
            totalMembers: membersData.length,
            totalClasses: classesData.length,
            totalBookings: bookingsData.length
        });
    } catch (err) {
        console.error('Error fetching admin data:', err);
        addToast({ type: 'error', message: t('errors.fetch_failed') });
    } finally {
        setLoading(false);
    }
  }, [t, addToast]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const deleteClass = async (id: string, title: string) => {
      const ok = await confirm({
        title: t('admin.classes_mgmt'),
        message: `${t('admin.confirm_delete_class')} (${title})`,
        variant: 'danger',
        confirmLabel: t('common.delete') || 'Delete'
      });

      if (!ok) return;

      try {
          await classesApi.delete(id);
          addToast({ 
            type: 'success', 
            message: t('admin.class_deleted'),
            icon: <CheckCircle2 size={18} />
          });
          fetchAdminData();
      } catch (err) {
          addToast({ type: 'error', message: t('errors.unexpected') });
      }
  };

  const handleSaveClass = async (data: any) => {
      try {
          if (editingClass) {
              await classesApi.update(editingClass.id, data as GymClassFormData);
          } else {
              await classesApi.create(data as GymClassFormData);
          }
          addToast({ 
            type: 'success', 
            message: t('admin.class_saved'),
            icon: <CheckCircle2 size={18} />
          });
          fetchAdminData();
          setIsModalOpen(false);
      } catch (err) {
          addToast({ type: 'error', message: t('errors.unexpected') });
          throw err;
      }
  };

  if (loading && !isModalOpen) return (
      <div className="space-y-10 animate-pulse">
          <div className="h-20 w-1/3 bg-[var(--color-surface-2)] rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              <div className="h-64 bg-[var(--color-surface-2)] rounded-3xl" />
              <div className="h-64 bg-[var(--color-surface-2)] rounded-3xl" />
          </div>
      </div>
  );

  return (
    <div className="flex flex-col gap-12 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h1 className="text-4xl font-bold mb-3 uppercase tracking-tight font-display italic leading-none">
                {t('admin.overview_title')}
            </h1>
            <p className="text-[var(--color-text-secondary)] font-medium">
                {t('admin.overview_subtitle')}
            </p>
          </div>
          <Button 
            onClick={() => { setEditingClass(null); setIsModalOpen(true); }}
            iconRight={<Plus size={18} />}
            size="lg"
            className="!rounded-2xl italic font-display"
          >
            {t('admin.new_class_btn')}
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card !p-8 flex items-center gap-6 group hover:border-[var(--color-primary-border)] transition-all duration-500"
                >
                    <div className="w-14 h-14 bg-[var(--color-primary-bg)] rounded-2xl flex items-center justify-center text-[var(--color-primary)] border border-[var(--color-primary-border)] group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-red-900/10">
                        <Users size={24} />
                    </div>
                    <div>
                        <span className="text-[var(--color-text-muted)] text-[10px] uppercase font-bold tracking-[0.3em] mb-1 block">
                            {t('admin.total_members')}
                        </span>
                        <div className="flex items-baseline gap-2">
                            <h4 className="text-3xl font-bold font-display italic text-white tracking-tighter">{stats.totalMembers}</h4>
                            <span className="text-[var(--color-success)] text-[10px] font-bold flex items-center gap-0.5">
                                <ArrowUpRight size={12} /> +12%
                            </span>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card !p-8 flex items-center gap-6 group hover:border-[var(--color-info-border)] transition-all duration-500"
                >
                    <div className="w-14 h-14 bg-[var(--color-info-bg)] rounded-2xl flex items-center justify-center text-[var(--color-info)] border border-[var(--color-info-border)] group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-blue-900/10">
                        <CalendarIcon size={24} />
                    </div>
                    <div>
                        <span className="text-[var(--color-text-muted)] text-[10px] uppercase font-bold tracking-[0.3em] mb-1 block">
                            {t('admin.total_classes')}
                        </span>
                        <h4 className="text-3xl font-bold font-display italic text-white tracking-tighter">{stats.totalClasses}</h4>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card !p-8 flex items-center gap-6 group hover:border-[var(--color-success-border)] transition-all duration-500"
                >
                    <div className="w-14 h-14 bg-[var(--color-success-bg)] rounded-2xl flex items-center justify-center text-[var(--color-success)] border border-[var(--color-success-border)] group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-green-900/10">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <span className="text-[var(--color-text-muted)] text-[10px] uppercase font-bold tracking-[0.3em] mb-1 block">
                            {t('admin.total_bookings')}
                        </span>
                        <div className="flex items-baseline gap-2">
                            <h4 className="text-3xl font-bold font-display italic text-white tracking-tighter">{stats.totalBookings}</h4>
                            <span className="text-[var(--color-success)] text-[10px] font-bold flex items-center gap-0.5">
                                <Activity size={12} /> Live
                            </span>
                        </div>
                    </div>
                </motion.div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {/* Recent Members Section */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card !p-0 overflow-hidden border-[var(--color-border-subtle)]"
            >
                <div className="p-8 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] flex justify-between items-center group/title">
                    <h3 className="font-display text-xl font-bold uppercase italic tracking-tight group-hover:text-[var(--color-primary)] transition-colors">
                        {t('admin.members_list')}
                    </h3>
                    <ChevronRight size={20} className="text-[var(--color-text-muted)] group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <tbody className="text-sm">
                            {members.map((m, idx) => (
                                <tr key={m.id} className={`border-b border-[var(--color-border-subtle)] last:border-0 hover:bg-white/[0.02] transition-colors group ${idx % 2 === 0 ? '' : 'bg-white/[0.01]'}`}>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[var(--color-surface-3)] rounded-2xl flex items-center justify-center uppercase font-bold text-[var(--color-primary)] border border-[var(--color-border-subtle)] group-hover:border-[var(--color-primary-border)] transition-all">
                                                {m.full_name?.charAt(0) || '?'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-white group-hover:text-[var(--color-primary)] transition-colors tracking-tight">{m.full_name || 'Anonymous'}</span>
                                                <span className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold">{new Date(m.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <Badge variant={m.role === 'admin' ? 'default' : 'secondary'} className="italic !px-3 font-display text-[9px] tracking-widest">
                                            {m.role?.toUpperCase()}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Upcoming Classes Section */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass-card !p-0 overflow-hidden border-[var(--color-border-subtle)]"
            >
                <div className="p-8 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] flex justify-between items-center group/title">
                    <h3 className="font-display text-xl font-bold uppercase italic tracking-tight group-hover:text-[var(--color-primary)] transition-colors">
                        {t('admin.classes_mgmt')}
                    </h3>
                    <ChevronRight size={20} className="text-[var(--color-text-muted)] group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <tbody className="text-sm">
                            {classes.map((c, idx) => (
                                <tr key={c.id} className={`border-b border-[var(--color-border-subtle)] last:border-0 hover:bg-white/[0.02] transition-colors group ${idx % 2 === 0 ? '' : 'bg-white/[0.01]'}`}>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white group-hover:text-[var(--color-primary)] transition-colors tracking-tight">{c.title}</span>
                                            <span className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-[0.2em] font-bold">{c.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col leading-tight">
                                            <span className="text-xs font-bold text-white uppercase italic">{c.day}</span>
                                            <span className="text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-widest">{c.time}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                              onClick={() => { setEditingClass(c); setIsModalOpen(true); }} 
                                              className="w-10 h-10 rounded-xl bg-[var(--color-surface-3)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-primary)] transition-all"
                                            >
                                              <Edit2 size={16} />
                                            </button>
                                            <button 
                                              onClick={() => deleteClass(c.id, c.title)} 
                                              className="w-10 h-10 rounded-xl bg-[var(--color-surface-3)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-error)] transition-all"
                                            >
                                              <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>

      <ClassModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveClass}
        initialData={editingClass}
      />
    </div>
  );
};

export default AdminDashboard;
