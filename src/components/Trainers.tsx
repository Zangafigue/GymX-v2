import { motion } from 'framer-motion';
import { Globe, ArrowRight, Award, Zap, Star } from 'lucide-react';
import { useTranslation } from '../context/I18nContext';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

const trainers = [
  {
    name: 'Sarah Chen',
    specialtyKey: 'strength',
    experience: '8+ years',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop',
    certifications: ['NASM-CPT', 'CSCS'],
    rating: 4.9
  },
  {
    name: 'Mike Ross',
    specialtyKey: 'hiit',
    experience: '6+ years',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop',
    certifications: ['ACSM-CPT', 'TRX'],
    rating: 4.8
  },
  {
    name: 'Ana Silva',
    specialtyKey: 'yoga',
    experience: '10+ years',
    image: 'https://images.unsplash.com/photo-1518611012118-296072bb5847?q=80&w=2070&auto=format&fit=crop',
    certifications: ['RYT-500', 'Meditation'],
    rating: 5.0
  },
  {
    name: 'Ben Carter',
    specialtyKey: 'crossfit',
    experience: '7+ years',
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fe?q=80&w=1974&auto=format&fit=crop',
    certifications: ['L3 CrossFit', 'Nutritional Advisor'],
    rating: 4.7
  }
];

const Trainers = () => {
  const { t } = useTranslation();

  return (
    <section id="trainers" className="py-32 bg-[var(--color-bg-subtle)] relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[var(--color-bg-base)] to-transparent opacity-50"></div>
      
      <div className="container-page relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <Badge variant="primary" className="mb-4" dot>
              {t('nav.trainers')}
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 uppercase tracking-tight font-display italic">
              {t('trainers.title').split(' ')[0]} <span className="text-[var(--color-primary)]">{t('trainers.title').split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed font-medium">
              {t('trainers.subtitle')}
            </p>
          </div>
          <Button variant="ghost" iconRight={<ArrowRight size={18} />} className="group">
            {t('trainers.all_team')}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trainers.map((trainer, index) => (
            <motion.div 
              key={trainer.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="card group hover:border-[var(--color-primary-border)] transition-all duration-700 bg-[var(--color-bg-base)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img 
                  src={trainer.image} 
                  alt={trainer.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-base)] via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-60"></div>
                
                {/* Float Rating */}
                <div className="absolute top-4 right-4 px-2 py-1 bg-[var(--color-bg-base)] bg-opacity-80 backdrop-blur-md rounded-lg border border-[var(--color-border-subtle)] flex items-center gap-1.5 shadow-lg">
                  <Star size={12} className="text-[var(--color-warning)]" fill="currentColor" />
                  <span className="text-[10px] font-bold text-white">{trainer.rating}</span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-8 group-hover:translate-y-0">
                  <a href="#" className="w-12 h-12 bg-white text-black flex items-center justify-center rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-xl hover:scale-110">
                    <Globe size={20} />
                  </a>
                </div>
              </div>

              <div className="p-8 text-center bg-[var(--color-bg-base)] relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[var(--color-primary)] rounded-lg rotate-45 flex items-center justify-center text-white shadow-lg group-hover:rotate-0 transition-transform">
                  <Zap size={14} className="-rotate-45 group-hover:rotate-0 transition-transform" />
                </div>

                <h3 className="text-xl font-bold uppercase tracking-tight font-display italic mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                  {trainer.name}
                </h3>
                <p className="text-[var(--color-primary)] text-[10px] uppercase font-bold tracking-[0.2em] mb-6">
                  {t(`trainers.specialties.${trainer.specialtyKey}`)}
                </p>
                
                <div className="flex flex-wrap justify-center gap-2">
                  {trainer.certifications.map(cert => (
                    <span key={cert} className="text-[9px] font-bold uppercase tracking-tighter px-2 py-1 bg-[var(--color-surface-3)] text-[var(--color-text-muted)] rounded border border-[var(--color-border-subtle)] flex items-center gap-1">
                      <Award size={10} />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trainers;
