import { Dumbbell, Heart, Zap, User as UserIcon, Timer, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../context/I18nContext';
import { Badge } from './ui/Badge';

const classTypes = [
  {
    icon: <Dumbbell size={28} />,
    titleKey: 'classes.strength_title',
    descKey: 'classes.strength_desc',
    duration: '60 min',
    level: 'All Levels',
    color: 'var(--color-primary)'
  },
  {
    icon: <Zap size={28} />,
    titleKey: 'classes.hiit_title',
    descKey: 'classes.hiit_desc',
    duration: '45 min',
    level: 'Intermediate',
    color: '#fbbf24'
  },
  {
    icon: <Heart size={28} />,
    titleKey: 'classes.yoga_title',
    descKey: 'classes.yoga_desc',
    duration: '50 min',
    level: 'Beginner',
    color: '#22c55e'
  },
  {
    icon: <UserIcon size={28} />,
    titleKey: 'classes.personal_title',
    descKey: 'classes.personal_desc',
    duration: '60 min',
    level: 'Custom',
    color: '#3b82f6'
  },
];

const Classes = () => {
  const { t } = useTranslation();

  return (
    <section id="classes" className="py-32 bg-[var(--color-bg-base)] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[var(--color-primary)] opacity-[0.02] blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="container-page relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <Badge variant="primary" className="mb-4" dot>
              {t('nav.classes')}
            </Badge>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 uppercase tracking-tight font-display italic">
            {t('classes.premium_title').split(' ')[0]} <span className="text-[var(--color-primary)]">{t('classes.premium_title').split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            {t('classes.subtitle') || 'Explore our elite training programs led by world-class certified professionals.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {classTypes.map((cls, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -12 }}
              className="glass-card group p-10 flex flex-col gap-6 hover:border-[var(--color-primary-border)] transition-all duration-500 overflow-hidden relative"
            >
              {/* Card top decoration */}
              <div 
                className="absolute top-0 right-0 w-24 h-24 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-bl-[100px]"
                style={{ backgroundColor: cls.color }}
              ></div>

              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl shadow-transparent group-hover:shadow-[var(--color-primary-muted)]"
                style={{ 
                  backgroundColor: 'var(--color-bg-base)', 
                  color: cls.color,
                  border: `1px solid var(--color-border-subtle)`
                }}
              >
                {cls.icon}
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-bold uppercase tracking-tight font-display italic group-hover:text-[var(--color-primary)] transition-colors">
                  {t(cls.titleKey) || cls.titleKey.split('.')[1].replace('_title', '').replace('_', ' ')}
                </h3>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed font-medium line-clamp-3">
                  {t(cls.descKey) || 'Transform your body and mind with our expert-led sessions.'}
                </p>
              </div>
              
              <div className="mt-auto pt-8 flex flex-col gap-4">
                <div className="h-px bg-gradient-to-r from-[var(--color-border-subtle)] via-transparent to-transparent"></div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)] transition-colors">
                    <Timer size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{cls.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[var(--color-primary)] opacity-80">
                    <Star size={10} fill="currentColor" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{cls.level}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Classes;
