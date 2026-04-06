import { useState } from 'react';
import { 
  Palette, 
  Bell, 
  ChevronRight, 
  Moon, 
  Sun,
  Laptop,
  Smartphone
} from 'lucide-react';
import { useTranslation } from '../../context/I18nContext';

const MemberSettings = () => {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');

  const settingsSections = [
    {
      id: 'appearance',
      title: t('settings.appearance_title') || 'Appearance',
      description: t('settings.appearance_desc') || 'Personalize your dashboard experience.',
      icon: <Palette className="text-gym-red" size={20} />,
      content: (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 bg-gym-black/40 rounded-xl border border-white/5">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">Interface Theme</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Select your visual style</span>
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
        </div>
      )
    },
    {
      id: 'notifications',
      title: t('settings.notifications_title') || 'Personal Alerts',
      description: t('settings.notifications_desc') || 'Stay updated with your bookings and gym news.',
      icon: <Bell className="text-yellow-500" size={20} />,
      content: (
        <div className="flex flex-col gap-3">
            {[
                { label: 'Booking Reminders', desc: 'Alerts 2 hours before your classes' },
                { label: 'Schedule Changes', desc: 'Notify if a trainer changes or cancels' },
                { label: 'Promotions', desc: 'Elite membership offers and gym news' }
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
            {t('member.settings_title') || 'User Preferences'}
          </h1>
          <p className="text-gray-400">
            {t('member.settings_subtitle') || 'Customize your experience on our platform.'}
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
        <div className="glass-card bg-gradient-to-br from-gym-red/5 to-transparent p-8 flex flex-col justify-between border border-white/5 shadow-2xl">
            <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-gym-slate border border-white/10 rounded-xl flex items-center justify-center">
                    <Smartphone className="text-gym-red" size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white uppercase italic font-oswald mb-1">Mobile App</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Book classes on the go with our upcoming mobile app. Get exclusive features and faster access.</p>
                </div>
            </div>
            <button className="flex items-center justify-between w-full p-4 mt-8 bg-white/5 rounded-xl border border-white/10 hover:bg-gym-red hover:border-gym-red transition-all group group-active:scale-[0.98]">
                <span className="font-bold text-[10px] uppercase tracking-widest text-white group-hover:text-white transition-colors">Notify me when it launches</span>
                <ChevronRight className="text-gray-500 group-hover:text-white transition-all group-hover:translate-x-1" size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default MemberSettings;
