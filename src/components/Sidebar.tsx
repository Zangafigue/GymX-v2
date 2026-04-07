import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  Calendar, 
  User, 
  Settings, 
  Dumbbell, 
  CheckSquare, 
  LogOut,
  TrendingUp,
  Award
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../context/I18nContext';
import LogoutModal from './modals/LogoutModal';

const Sidebar = () => {
  const { role, signOut } = useAuth();
  const { t, language } = useTranslation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const adminItems = [
    { name: t('dashboard.overview'),       path: '/admin',          icon: <LayoutDashboard size={20} /> },
    { name: language === 'fr' ? 'Analytiques' : 'Analytics', path: '/admin/analytics', icon: <TrendingUp size={20} /> },
    { name: t('dashboard.locations'),      path: '/admin/locations', icon: <MapPin size={20} /> },
    { name: t('dashboard.members'),        path: '/admin/users',    icon: <Users size={20} /> },
    { name: language === 'fr' ? 'Entraîneurs' : 'Trainers',  path: '/admin/trainers', icon: <Award size={20} /> },
    { name: t('dashboard.classes_manage'), path: '/admin/classes',  icon: <Calendar size={20} /> },
    { name: t('dashboard.profile'),        path: '/admin/profile',  icon: <User size={20} /> },
    { name: t('dashboard.settings'),       path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const memberItems = [
    { name: t('dashboard.activity'),         path: '/dashboard',           icon: <Dumbbell size={20} /> },
    { name: t('dashboard.bookings_manage'),  path: '/dashboard/bookings',  icon: <CheckSquare size={20} /> },
    { name: t('dashboard.profile'),          path: '/dashboard/profile',   icon: <User size={20} /> },
    { name: t('dashboard.settings'),         path: '/dashboard/settings',  icon: <Settings size={20} /> },
  ];

  const menuItems = role === 'admin' ? adminItems : memberItems;

  return (
    <aside className="hidden lg:flex w-64 bg-[var(--color-bg-subtle)] border-r border-[var(--color-border-subtle)] flex-col h-screen sticky top-0 overflow-y-auto custom-scrollbar z-30">
      <div className="p-6 border-b border-[var(--color-border-subtle)] flex items-center gap-3">
        <div className="w-10 h-10 bg-[var(--color-primary)] rounded-lg flex items-center justify-center shadow-lg shadow-[var(--color-primary-muted)] rotate-3 group-hover:rotate-0 transition-transform">
          <Dumbbell className="text-white" size={24} />
        </div>
        <span className="font-display text-2xl font-bold tracking-tighter italic text-[var(--color-text-primary)]">
          GYM<span className="text-[var(--color-primary)]">X</span>
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin' || item.path === '/dashboard'}
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary-muted)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-3)]'
              }`
            }
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[var(--color-border-subtle)]">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-3)] transition-all group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform text-[var(--color-primary)]" />
          <span className="font-bold text-xs uppercase tracking-widest">
            {t('dashboard.logout')}
          </span>
        </button>
      </div>

      <LogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
        onConfirm={() => signOut()}
      />
    </aside>
  );
};

export default Sidebar;
