import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, User, Globe } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../context/I18nContext';
import { Button } from './ui/Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, role } = useAuth();
  const location = useLocation();
  const { t, language, setLanguage } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), href: '/#hero' },
    { name: t('nav.classes'), href: '/#classes' },
    { name: t('nav.trainers'), href: '/#trainers' },
    { name: t('nav.pricing'), href: '/#pricing' },
    { name: t('nav.contact'), href: '/#contact' },
  ];

  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const shouldBeDark = scrolled || isOpen || isAuthPage;

  return (
    <nav 
      className={`fixed w-full z-[100] transition-all duration-500 ${
        shouldBeDark 
          ? 'bg-[var(--color-bg-base)] bg-opacity-80 backdrop-blur-xl py-4 shadow-2xl border-b border-[var(--color-border-subtle)]' 
          : 'bg-transparent py-8'
      }`}
    >
      <div className="container-page flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center font-display text-2xl font-bold italic text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
            X
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl font-bold tracking-tighter uppercase leading-none">GymX</span>
            <span className="text-[var(--color-primary)] text-[8px] font-bold uppercase tracking-[0.4em] leading-none mt-1">Burkina Faso</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex gap-10">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="relative text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors py-2 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-6 border-l border-[var(--color-border-subtle)] pl-10">
            {/* Language Switcher */}
            <div className="flex items-center gap-3">
              <Globe size={16} className="text-[var(--color-text-muted)]" />
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setLanguage('fr')}
                  className={`text-[10px] font-bold uppercase tracking-widest transition-all ${language === 'fr' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] hover:text-white'}`}
                >
                  FR
                </button>
                <span className="text-[var(--color-border-subtle)] text-[10px]">/</span>
                <button 
                  onClick={() => setLanguage('en')}
                  className={`text-[10px] font-bold uppercase tracking-widest transition-all ${language === 'en' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] hover:text-white'}`}
                >
                  EN
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              {user ? (
                <Button 
                  as={Link}
                  to={role === 'admin' ? '/admin' : '/dashboard'} 
                  variant="primary"
                  size="sm"
                  className="!px-6 !rounded-xl"
                  icon={<User size={14} />}
                >
                  {t('nav.dashboard')}
                </Button>
              ) : (
                <>
                  <Link to="/login" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-[var(--color-primary)] transition-colors pr-2">
                    <LogIn size={16} className="text-[var(--color-primary)]" /> {t('nav.login')}
                  </Link>
                  <Button 
                    as={Link}
                    to="/register" 
                    variant="primary"
                    size="sm"
                    className="!px-8 !rounded-xl italic font-display"
                  >
                    {t('nav.register')}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center gap-4">
            <button 
              className="p-3 bg-[var(--color-surface-3)] rounded-2xl border border-[var(--color-border-subtle)] text-white shadow-xl hover:scale-105 active:scale-95 transition-all" 
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="lg:hidden absolute top-full left-0 w-full bg-[var(--color-bg-base)] border-t border-[var(--color-border-subtle)] overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-12 flex flex-col gap-8">
              {navLinks.map((link, idx) => (
                <motion.a 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-3xl font-display font-bold uppercase tracking-tight hover:text-[var(--color-primary)] transition-colors italic"
                >
                  {link.name}
                </motion.a>
              ))}
              
              <div className="pt-10 mt-4 border-t border-[var(--color-border-subtle)] flex flex-col gap-6">
                <div className="flex items-center justify-between p-4 bg-[var(--color-surface-3)] rounded-2xl border border-[var(--color-border-subtle)]">
                   <div className="flex items-center gap-3">
                     <Globe size={18} className="text-[var(--color-primary)]" />
                     <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Language</span>
                   </div>
                   <div className="flex items-center gap-4">
                    <button onClick={() => { setLanguage('fr'); setIsOpen(false); }} className={`text-xs font-bold ${language === 'fr' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`}>FR</button>
                    <button onClick={() => { setLanguage('en'); setIsOpen(false); }} className={`text-xs font-bold ${language === 'en' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`}>EN</button>
                  </div>
                </div>

                {user ? (
                    <Button 
                        as={Link}
                        to={role === 'admin' ? '/admin' : '/dashboard'} 
                        onClick={() => setIsOpen(false)}
                        size="lg"
                        fullWidth
                    >
                        {t('nav.dashboard')}
                    </Button>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <Button 
                          as={Link}
                          to="/login" 
                          variant="ghost"
                          onClick={() => setIsOpen(false)} 
                          className="!py-5"
                        >
                            {t('nav.login')}
                        </Button>
                        <Button 
                          as={Link}
                          to="/register" 
                          onClick={() => setIsOpen(false)}
                          className="!py-5 italic font-display"
                        >
                            {t('nav.register')}
                        </Button>
                    </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
