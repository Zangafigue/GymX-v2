import { Check, Zap, Shield, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../context/I18nContext';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

const plans = [
  {
    nameKey: 'pricing.basic',
    price: '49',
    icon: <Zap size={20} />,
    features: [
      'pricing.features.off_peak',
      'pricing.features.equipment',
      'pricing.features.locker',
      'pricing.features.guest_1'
    ],
    isFeatured: false,
    color: 'var(--color-text-muted)'
  },
  {
    nameKey: 'pricing.premium',
    price: '89',
    icon: <Shield size={20} />,
    features: [
      'pricing.features.access_247',
      'pricing.features.all_classes',
      'pricing.features.pt_session',
      'pricing.features.nutrition',
      'pricing.features.guest_4'
    ],
    isFeatured: true,
    color: 'var(--color-primary)'
  },
  {
    nameKey: 'pricing.elite',
    price: '149',
    icon: <Crown size={20} />,
    features: [
      'pricing.features.access_247', // Combined
      'pricing.features.pt_unlimited',
      'pricing.features.massage',
      'pricing.features.priority',
      'pricing.features.guest_unlimited'
    ],
    isFeatured: false,
    color: '#fbbf24'
  },
];

const Pricing = () => {
  const { t } = useTranslation();

  return (
    <section id="pricing" className="py-32 bg-[var(--color-bg-base)] relative overflow-hidden">
      {/* Decorative center light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[var(--color-primary)] opacity-[0.015] blur-[150px] rounded-full"></div>
      
      <div className="container-page relative z-10 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mb-20"
        >
          <Badge variant="primary" className="mb-4" dot>
            {t('nav.pricing')}
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 uppercase tracking-tight font-display italic">
            {t('pricing.title')} <span className="text-[var(--color-primary)]">{t('pricing.fitness')}</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-16 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            {t('pricing.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {plans.map((plan, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className={`relative p-10 lg:p-12 rounded-[2.5rem] border transition-all duration-500 overflow-hidden flex flex-col h-full ${
                plan.isFeatured 
                  ? 'bg-[var(--color-surface-2)] border-[var(--color-primary-border)] shadow-2xl shadow-[var(--color-primary-muted)] scale-105 z-10 py-16' 
                  : 'bg-[var(--color-bg-subtle)] border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)]'
              }`}
            >
              {/* Card Decoration */}
              <div 
                className="absolute -top-10 -right-10 w-32 h-32 opacity-[0.03] rounded-full"
                style={{ backgroundColor: plan.color }}
              ></div>

              {plan.isFeatured && (
                <div className="absolute top-6 right-10">
                  <Badge variant="primary" dot className="!px-4 !py-1 text-[9px] shadow-lg">
                    {t('pricing.most_popular')}
                  </Badge>
                </div>
              )}

              <div className="text-center mb-10">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] shadow-sm"
                  style={{ color: plan.color }}
                >
                  {plan.icon}
                </div>
                <h3 className="text-xl uppercase font-bold tracking-[0.2em] mb-6 font-display italic opacity-80">{t(plan.nameKey)}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-2xl font-bold text-[var(--color-text-muted)] mr-1">$</span>
                  <span className="text-7xl font-bold font-display tracking-tighter text-white">{plan.price}</span>
                  <span className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-widest ml-1">{t('pricing.per_month')}</span>
                </div>
              </div>

              <div className="flex flex-col gap-5 text-left border-t border-[var(--color-border-subtle)] pt-10 mb-12">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-start gap-4">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.isFeatured ? 'bg-[var(--color-primary-muted)]' : 'bg-[var(--color-surface-3)]'}`}>
                      <Check size={12} className={plan.isFeatured ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-medium text-[var(--color-text-secondary)] leading-tight">{t(feature)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto">
                <Button 
                  variant={plan.isFeatured ? 'primary' : 'secondary'} 
                  fullWidth
                  size="lg"
                  className="!rounded-2xl"
                >
                  {plan.isFeatured ? t('pricing.cta_become_pro') : t('pricing.cta_get_started')}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
