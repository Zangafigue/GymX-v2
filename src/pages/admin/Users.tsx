import { useEffect, useState, useMemo } from 'react';
import { profilesApi } from '../../lib/api';
import type { Profile } from '../../types';
import { 
  Users as UsersIcon, 
  Search, 
  Filter, 
  Shield, 
  User, 
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { useTranslation } from '../../context/I18nContext';
import { useToast } from '../../components/ui/Toast';
import { useConfirm } from '../../components/ui/ConfirmDialog';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatCardSkeleton } from '../../components/ui/Skeleton';

const ManageUsers = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'member'>('all');
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { confirm } = useConfirm();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const data = await profilesApi.getAll();
      setProfiles(data);
    } catch (err) {
      console.error('Error fetching profiles:', err);
      addToast({ type: 'error', message: t('errors.fetch_failed') });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (id: string, currentRole: string, fullName: string) => {
    const newRole = currentRole === 'admin' ? 'member' : 'admin';
    const ok = await confirm({
      title: t('admin.confirm_role_change'),
      message: `${t('admin.role_change_msg') || 'Are you sure you want to change the role of'} ${fullName || 'this user'}?`,
      confirmLabel: newRole === 'admin' ? t('admin.make_admin') : t('admin.revoke_admin'),
      variant: newRole === 'admin' ? 'warning' : 'danger'
    });

    if (!ok) return;

    try {
      await profilesApi.update(id, { role: newRole });
      addToast({ type: 'success', message: t('admin.update_success') || 'User role updated!' });
      setProfiles(prev => prev.map(p => p.id === id ? { ...p, role: newRole } : p));
    } catch (err) {
      addToast({ type: 'error', message: t('errors.update_failed') });
    }
  };

  const filteredProfiles = useMemo(() => {
    return profiles.filter(p => {
      const query = search.toLowerCase();
      const matchesSearch = (p.full_name?.toLowerCase() || '').includes(query) || 
                            p.id.toLowerCase().includes(query);
      const matchesRole = filterRole === 'all' || p.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [profiles, search, filterRole]);

  const stats = useMemo(() => {
    const total = profiles.length;
    const admins = profiles.filter(p => p.role === 'admin').length;
    return { total, admins };
  }, [profiles]);

  const columns = [
    {
      header: t('admin.user'),
      accessor: (p: Profile) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[var(--color-bg-base)] rounded-full flex items-center justify-center uppercase font-bold text-[var(--color-primary)] border border-[var(--color-border-subtle)] shadow-sm">
            {p.full_name?.charAt(0) || <User size={18} />}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
              {p.full_name || 'Anonymous User'}
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)] font-mono">{p.id}</span>
          </div>
        </div>
      )
    },
    {
      header: t('admin.joined_date'),
      accessor: (p: Profile) => (
        <span className="text-sm font-medium">
          {new Date(p.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      )
    },
    {
      header: t('admin.status'),
      accessor: (p: Profile) => (
        <Badge variant={p.role === 'admin' ? 'primary' : 'success'} dot>
          {p.role === 'admin' ? t('admin.role_admin') : t('admin.role_member')}
        </Badge>
      )
    },
    {
      header: t('dashboard.actions'),
      align: 'right' as const,
      accessor: (p: Profile) => (
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => handleUpdateRole(p.id, p.role || 'member', p.full_name || '')}
        >
          {p.role === 'admin' ? t('admin.revoke_admin') : t('admin.make_admin')}
        </Button>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-10 lg:p-4">
      <PageHeader 
        title={t('admin.users_title')}
        subtitle={t('admin.users_subtitle')}
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <div className="glass-card p-8 flex flex-col gap-3 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-[var(--color-primary)] opacity-[0.03] rounded-full group-hover:scale-110 transition-transform" />
              <div className="flex justify-between items-start">
                <span className="text-[var(--color-text-secondary)] text-[10px] uppercase font-bold tracking-widest">{t('admin.total_members')}</span>
                <UsersIcon size={16} className="text-[var(--color-text-muted)]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold font-display">{stats.total}</span>
                <TrendingUp size={16} className="text-[var(--color-success)] mb-1" />
              </div>
            </div>
            <div className="glass-card p-8 flex flex-col gap-3 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-[var(--color-warning)] opacity-[0.03] rounded-full group-hover:scale-110 transition-transform" />
              <div className="flex justify-between items-start">
                <span className="text-[var(--color-text-secondary)] text-[10px] uppercase font-bold tracking-widest">{t('admin.active_admins')}</span>
                <Shield size={16} className="text-[var(--color-text-muted)]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold font-display text-[var(--color-primary)]">{stats.admins}</span>
                <UserCheck size={16} className="text-[var(--color-primary)] mb-1" />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Input 
              placeholder={t('admin.search_placeholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              prefix={<Search size={18} className="text-[var(--color-text-muted)]" />}
              containerClassName="!mb-0"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)] flex items-center gap-2 mr-2">
              <Filter size={14} /> {t('filters.role') || 'Role'}:
            </span>
            <select 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="bg-[var(--color-bg-subtle)] border border-[var(--color-border-default)] px-4 py-2.5 rounded-xl text-sm font-medium focus:border-[var(--color-primary)] outline-none text-[var(--color-text-primary)] cursor-pointer hover:bg-[var(--color-surface-3)] transition-colors"
            >
              <option value="all">Tous les rôles</option>
              <option value="admin">Administrateurs</option>
              <option value="member">Membres</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <DataTable 
          columns={columns} 
          data={filteredProfiles} 
          loading={loading}
          emptyMessage={search ? t('admin.no_results_search') || 'No users found matching your search.' : t('admin.no_data')}
        />
      </div>
    </div>
  );
};

export default ManageUsers;
