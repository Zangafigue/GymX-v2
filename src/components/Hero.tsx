import { ChevronRight, Play, Trophy, Users, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../context/I18nContext';
import { Button } from './ui/Button';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--color-bg-base)]">
      {/* Background with Overlays */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" 
          alt="Gym Background" 
          className="w-full h-full object-cover filter brightness-[0.35] scale-105"
        />
        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-bg-base)] to-[var(--color-bg-base)] opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg-base)] via-transparent to-transparent opacity-80"></div>
        
        {/* Animated accent light */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[var(--color-primary)] opacity-[0.08] blur-[120px] rounded-full animate-pulse"></div>
      </div>

      {/* Content */}
      <div className="container-page relative z-10 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-muted)] border border-[var(--color-primary-border)] mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
              <span className="text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-[0.2em]">
                {t('hero.subtitle')}
              </span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] mb-8 uppercase tracking-tighter italic font-display">
              {t('hero.title_1')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-white to-white opacity-95">
                {t('hero.title_2')}
              </span>
            </h1>
            
            <p className="text-[var(--color-text-secondary)] text-lg md:text-xl max-w-2xl mb-12 leading-relaxed font-medium">
              {t('hero.description')}
            </p>

            <div className="flex flex-wrap gap-5">
              <Button 
                size="lg" 
                className="!px-10 !py-5 shadow-2xl shadow-[var(--color-primary-muted)]"
                iconRight={<ChevronRight size={20} />}
              >
                {t('hero.cta_start')}
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                className="!px-10 !py-5 backdrop-blur-sm"
                icon={<Play size={18} className="fill-current" />}
              >
                {t('hero.cta_classes')}
              </Button>
            </div>

            {/* Mobile Stats */}
            <div className="flex lg:hidden mt-16 gap-8 border-t border-[var(--color-border-subtle)] pt-8">
              <div className="flex flex-col">
                <span className="text-2xl font-bold font-display text-[var(--color-primary)]">50+</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-text-muted)]">{t('stats.trainers')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold font-display text-[var(--color-primary)]">100+</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-text-muted)]">{t('stats.classes')}</span>
              </div>
            </div>
          </motion.div>

          {/* Decorative side element (Desktop) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="hidden lg:block lg:col-span-4 relative"
          >
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-[var(--color-border-subtle)] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
               <img 
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop" 
                alt="Athlete" 
                className="w-full h-full object-cover filter brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-base)] via-transparent to-transparent opacity-60"></div>
              
              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-6 glass-card border-[var(--color-border-strong)] flex items-center gap-4 animate-fade-in-up">
                <div className="w-12 h-12 bg-[var(--color-primary)] rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Trophy size={24} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">{t('hero.elite_standard')}</div>
                  <div className="text-sm font-bold text-white uppercase italic tracking-tight">{t('hero.voted_best')}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar stats — Desktop */}
      <div className="hidden lg:flex absolute bottom-0 left-0 right-0 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] bg-opacity-50 backdrop-blur-xl z-10 px-20 py-8 justify-between items-center">
        <div className="flex gap-16">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-[var(--color-primary)]" />
              <span className="text-3xl font-bold font-display tracking-tight text-white">5000+</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--color-text-muted)]">{t('stats.members')}</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-[var(--color-primary)]" />
              <span className="text-3xl font-bold font-display tracking-tight text-white">100+</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--color-text-muted)]">{t('stats.classes')}</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-[var(--color-primary)]" />
              <span className="text-3xl font-bold font-display tracking-tight text-white">50+</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--color-text-muted)]">{t('stats.trainers')}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--color-bg-base)] bg-gym-gray overflow-hidden">
                <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Member" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)] ml-2">
            {t('hero.join_community').split(' ')[0]} <span className="text-[var(--color-primary)] underline decoration-2 underline-offset-4">{t('hero.join_community').split(' ').slice(1).join(' ')}</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
