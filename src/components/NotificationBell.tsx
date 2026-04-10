import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { notificationsApi } from '../lib/api';
import { useTranslation } from '../context/I18nContext';
import { useToast } from './ui/Toast';
import { Button } from './ui/Button';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

const NotificationBell = () => {
  const { user } = useAuth();
  const { language } = useTranslation();
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const data = await notificationsApi.getByUser(user.id);
      setNotifications(data as Notification[]);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Refresh every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to update notification' });
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    try {
      await notificationsApi.markAllAsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to update notifications' });
    }
  };

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-white hover:bg-opacity-5 transition-colors"
      >
        <Bell size={20} className={unreadCount > 0 ? 'text-[var(--color-primary)]' : 'text-gray-400'} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--color-primary)] text-white text-[10px] flex items-center justify-center rounded-full font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-80 md:w-96 bg-[var(--color-surface-1)] border border-[var(--color-border-subtle)] rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-widest">
                {language === 'fr' ? 'Notifications' : 'Notifications'}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-[var(--color-primary)] hover:underline font-bold"
                >
                  {language === 'fr' ? 'Tout marquer lu' : 'Mark all as read'}
                </button>
              )}
            </div>

            <div className="max-h-[70vh] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-[var(--color-text-muted)] text-sm">
                  {language === 'fr' ? 'Aucune notification' : 'No notifications'}
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-[var(--color-border-subtle)] last:border-0 transition-colors ${
                      notif.is_read ? 'opacity-60' : 'bg-white bg-opacity-[0.02]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-grow">
                        <p className="text-sm font-bold text-white mb-1">{notif.title}</p>
                        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-[var(--color-text-muted)] mt-2 block">
                          {new Date(notif.created_at).toLocaleString()}
                        </span>
                      </div>
                      {!notif.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="p-1 hover:bg-white hover:bg-opacity-10 rounded text-[var(--color-primary)]"
                          title="Mark as read"
                        >
                          <Check size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
