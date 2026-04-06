import { useState } from 'react';
import { 
  Globe, 
  Palette, 
  Bell, 
  ShieldCheck, 
  ChevronRight, 
  Moon, 
  Sun,
  Laptop
} from 'lucide-react';
import { useTranslation } from '../../context/I18nContext';

const AdminSettings = () => {
  const { t, language, setLanguage } = useTranslation();
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');

  const settingsSections = [
    {
      id: 'localization',
      title: t('settings.localization_title') || 'Localization',
      description: t('settings.localization_desc') || 'Manage language and regional preferences.',
      icon: <Globe className="text-blue-500" size={20} />,
      content: (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 bg-gym-black/40 rounded-xl border border-white/5">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">Language</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Select your preferred language</span>
            </div>
            <div className="flex bg-gym-slate p-1 rounded-lg border border-white/5">
              <button 
                onClick={() => setLanguage('fr')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${language === 'fr' ? 'bg-gym-red text-white shadow-lg shadow-red-900/20' : 'text-gray-500 hover:text-white'}`}
              >
                FR
              </button>
              <button 
                onClick={() => setLanguage('en')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${language === 'en' ? 'bg-gym-red text-white shadow-lg shadow-red-900/20' : 'text-gray-500 hover:text-white'}`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'appearance',
      title: t('settings.appearance_title') || 'Appearance',
      description: t('settings.appearance_desc') || 'Customize the look and feel of the platform.',
      icon: <Palette className="text-gym-red" size={20} />,
      content: (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 bg-gym-black/40 rounded-xl border border-white/5">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">Interface Theme</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Toggle between light and dark mode</span>
            </div>
            <div className="flex bg-gym-slate p-1 rounded-lg border border-white/5">
              <button 
                onClick={() => setTheme('light')}
                className={`p-2 rounded-md transition-all ${theme === 'light' ? 'bg-white text-gym-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                <Sun size={16} />
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-md transition-all ${theme === 'dark' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                <Moon size={16} />
              </button>
              <button 
                onClick={() => setTheme('system')}
                className={`p-2 rounded-md transition-all ${theme === 'system' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                <Laptop size={16} />
              </button>
            </div>
          </div>
          <div className="p-4 bg-gym-red/5 rounded-xl border border-gym-red/10">
            <p className="text-[10px] text-gym-red font-bold uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={12} /> Pro Tip
            </p>
            <p className="text-xs text-gray-400 mt-1">Light mode is coming soon with the release of v2.1. Stay tuned for a more customizable experience!</p>
          </div>
        </div>
      )
    },
    {
      id: 'notifications',
      title: t('settings.notifications_title') || 'Notifications',
      description: t('settings.notifications_desc') || 'Configure system alerts and emails.',
      icon: <Bell className="text-yellow-500" size={20} />,
      content: (
        <div className="flex flex-col gap-3">
            {[
                { label: 'Booking Alerts', desc: 'Notify me of new class bookings' },
                { label: 'User Registration', desc: 'Notify when a new member joins' },
                { label: 'System Updates', desc: 'Get major release notifications' }
            ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-4 bg-gym-black/40 rounded-xl border border-white/5 group hover:border-white/10 transition-colors">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-gym-red transition-colors">{item.label}</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">{item.desc}</span>
                    </div>
                    <div className="w-10 h-5 bg-gym-slate rounded-full border border-white/10 relative p-1 cursor-pointer">
                        <div className="w-3 h-3 bg-gray-600 rounded-full transition-all group-hover:translate-x-5 group-active:scale-95" />
                    </div>
                </div>
            ))}
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 uppercase text-white">
            {t('admin.settings_title') || 'System Settings'}
          </h1>
          <p className="text-gray-400">
            {t('admin.settings_subtitle') || 'Configure your personal and administrative preferences.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {settingsSections.map((section) => (
          <div key={section.id} className="glass-card flex flex-col h-fit">
            <div className="p-8 border-b border-white/5 flex items-start gap-4">
              <div className="w-12 h-12 bg-gym-slate rounded-2xl flex items-center justify-center border border-white/5">
                {section.icon}
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-white">{section.title}</h3>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
            </div>
            <div className="p-8">
              {section.content}
            </div>
          </div>
        ))}

        {/* Global Action Card */}
        <div className="glass-card bg-gradient-to-br from-gym-red/10 to-transparent p-8 flex flex-col justify-between border-dashed border-gym-red/20 border-2">
            <div>
                <h3 className="text-2xl font-bold text-white uppercase italic font-oswald mb-2">Advanced Protection</h3>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">Ensure your administrative access is secure. We recommend changing your password every 90 days and enabling two-factor authentication.</p>
            </div>
            <button className="flex items-center justify-between w-full p-4 bg-gym-red/20 rounded-xl border border-gym-red/30 hover:bg-gym-red transition-all group group-active:scale-[0.98]">
                <span className="font-bold text-xs uppercase tracking-widest text-gym-red group-hover:text-white transition-colors">Go to Identity Security</span>
                <ChevronRight className="text-gym-red group-hover:text-white transition-all group-hover:translate-x-1" size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
