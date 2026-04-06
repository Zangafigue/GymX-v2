import { Link } from 'react-router-dom';
import { Globe, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { useTranslation } from '../context/I18nContext';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-[var(--color-bg-base)] pt-24 pb-12 border-t border-[var(--color-border-subtle)] relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--color-primary)] opacity-[0.02] blur-[100px] rounded-full translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12 mb-20">
          {/* Brand Column */}
          <div className="flex flex-col gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center font-display text-2xl font-bold italic text-white shadow-xl group-hover:scale-110 transition-transform duration-500">
                X
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl font-bold tracking-tighter uppercase leading-none text-white">GymX</span>
                <span className="text-[var(--color-primary)] text-[8px] font-bold uppercase tracking-[0.4em] leading-none mt-1">Burkina Faso</span>
              </div>
            </Link>
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed font-medium">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-xl bg-[var(--color-surface-3)] border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary-border)] hover:bg-[var(--color-bg-base)] transition-all group shadow-sm">
                <Globe size={20} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-10 text-white italic font-display">{t('footer.navigation')}</h4>
            <ul className="flex flex-col gap-5">
              {['home', 'classes', 'trainers', 'pricing'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item === 'home' ? 'hero' : item}`} 
                    className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[var(--color-text-muted)] hover:text-white transition-all"
                  >
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-primary)]" />
                    {t(`nav.${item}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-10 text-white italic font-display">{t('footer.locations')}</h4>
            <ul className="flex flex-col gap-6">
              {(Array.isArray(t('footer.centers', { returnObjects: true })) 
                ? t('footer.centers', { returnObjects: true }) 
                : []).map((center: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <MapPin size={18} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-[var(--color-text-secondary)] leading-tight">{center}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-10 text-white italic font-display">{t('footer.contact')}</h4>
            <ul className="flex flex-col gap-6">
              <li className="group flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-3)] flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all">
                  <Mail size={18} />
                </div>
                <span className="text-sm font-bold tracking-tight text-[var(--color-text-secondary)] group-hover:text-white transition-colors">hello@gymx.com</span>
              </li>
              <li className="group flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-3)] flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all">
                  <Phone size={18} />
                </div>
                <span className="text-sm font-bold tracking-tight text-[var(--color-text-secondary)] group-hover:text-white transition-colors">+226 25 30 14 14</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-[var(--color-border-subtle)] flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} GymX Burkina. {t('footer.rights')}
          </p>
          <div className="flex gap-10">
            <a href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)] hover:text-white transition-colors border-b border-transparent hover:border-[var(--color-primary)] pb-1">
              {t('footer.legal')}
            </a>
            <a href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)] hover:text-white transition-colors border-b border-transparent hover:border-[var(--color-primary)] pb-1">
              {t('footer.privacy')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
