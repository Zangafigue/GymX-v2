import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../context/I18nContext';
import { useToast } from '../components/ui/Toast';
import { Input } from './ui/Input';
import { TextArea } from './ui/TextArea';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

const Contact = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      addToast({
        type: 'success',
        message: t('contact.success'),
        icon: <CheckCircle2 size={18} />
      });
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <section id="contact" className="py-32 bg-[var(--color-bg-base)] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[var(--color-bg-subtle)] to-transparent opacity-30"></div>
      
      <div className="container-page relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
            <Badge variant="primary" className="mb-4" dot>
              {t('nav.contact')}
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 uppercase tracking-tight font-display italic leading-[1.1]">
              {t('contact.title')} <br />
              <span className="text-[var(--color-primary)]">{t('contact.journey')}</span>
            </h2>
            <p className="text-[var(--color-text-secondary)] text-lg mb-12 max-w-lg font-medium leading-relaxed">
              {t('contact.subtitle')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              <div className="flex items-center gap-6 p-6 rounded-2xl bg-[var(--color-surface-3)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)] transition-all group">
                <div className="w-14 h-14 bg-[var(--color-bg-base)] rounded-xl flex items-center justify-center text-[var(--color-primary)] shadow-lg group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--color-text-muted)] mb-1">{t('contact.email')}</h4>
                  <p className="text-white font-bold">hello@gymx.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 p-6 rounded-2xl bg-[var(--color-surface-3)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)] transition-all group">
                <div className="w-14 h-14 bg-[var(--color-bg-base)] rounded-xl flex items-center justify-center text-[var(--color-primary)] shadow-lg group-hover:scale-110 transition-transform">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--color-text-muted)] mb-1">{t('contact.phone')}</h4>
                  <p className="text-white font-bold">+1 (555) 123-GYMX</p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-6 rounded-2xl bg-[var(--color-surface-3)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)] transition-all group">
                <div className="w-14 h-14 bg-[var(--color-bg-base)] rounded-xl flex items-center justify-center text-[var(--color-primary)] shadow-lg group-hover:scale-110 transition-transform">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--color-text-muted)] mb-1">{t('contact.location')}</h4>
                  <p className="text-white font-bold">123 Fitness Ave, Health City</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="lg:w-1/2 w-full glass-card p-12 border-[var(--color-border-strong)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-[var(--color-primary)]">
              <MessageSquare size={120} />
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label={t('auth.full_name')}
                  placeholder="John Doe"
                  required
                />
                <Input 
                  label={t('auth.email')}
                  type="email"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <TextArea 
                label={t('contact.message')}
                placeholder="How can we help you achieve your goals?"
                required
              />

              <Button 
                type="submit" 
                loading={loading}
                size="lg"
                fullWidth
                iconRight={<Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                className="mt-4"
              >
                {t('contact.send_btn')}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
