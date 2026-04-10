import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, CreditCard, Loader2 } from 'lucide-react';
import { useTranslation } from '../../context/I18nContext';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../lib/supabase';

const Subscription = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<'wave' | 'orange_money' | 'stripe'>('wave');
  const plan = location.state?.plan || 'basic';

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: { plan, payment_method: method }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      // Redirect to the mock payment gateway URL
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        message: language === 'fr' 
          ? `Erreur de paiement: ${err.message}` 
          : `Payment error: ${err.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface-1)] border border-[var(--color-border-subtle)] rounded-3xl p-8 md:p-12"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[var(--color-primary-muted)] text-[var(--color-primary)] rounded-full flex items-center justify-center">
            <CreditCard size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold italic uppercase tracking-wider">
              {language === 'fr' ? 'Finaliser votre abonnement' : 'Complete Subscription'}
            </h1>
            <p className="text-[var(--color-text-secondary)]">
              {language === 'fr' ? `Vous avez sélectionné le forfait ` : `You selected the `} 
              <span className="font-bold text-white capitalize">{plan}</span>
            </p>
          </div>
        </div>

        <div className="space-y-6 mb-10">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            {language === 'fr' ? 'Méthode de paiement' : 'Payment Method'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setMethod('wave')}
              className={`p-6 border rounded-2xl flex flex-col gap-2 transition-all ${
                method === 'wave' 
                  ? 'border-[#1b91ff] bg-[#1b91ff]/10' 
                  : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)]'
              }`}
            >
              <div className="font-bold text-lg">Wave Money</div>
              <div className="text-sm text-[var(--color-text-secondary)] text-left">Paiement mobile instantané et sans frais</div>
            </button>

            <button
              onClick={() => setMethod('orange_money')}
              className={`p-6 border rounded-2xl flex flex-col gap-2 transition-all ${
                method === 'orange_money' 
                  ? 'border-[#ff7900] bg-[#ff7900]/10' 
                  : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)]'
              }`}
            >
              <div className="font-bold text-lg">Orange Money</div>
              <div className="text-sm text-[var(--color-text-secondary)] text-left">Paiement sécurisé via Orange</div>
            </button>
          </div>
        </div>

        {!user ? (
          <div className="bg-[var(--color-surface-2)] p-6 rounded-2xl border border-[var(--color-border-subtle)] flex items-start gap-4">
            <ShieldAlert className="text-[var(--color-text-muted)] mt-1" />
            <div>
              <p className="text-[var(--color-text-primary)] font-medium mb-4">
                {language === 'fr' ? 'Connexion requise' : 'Login Required'}
              </p>
              <Button onClick={() => navigate('/login')}>
                {t('nav.login')}
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            onClick={handleSubscribe} 
            disabled={loading} 
            fullWidth 
            size="lg"
            variant="primary"
          >
            {loading ? <Loader2 className="animate-spin" /> : (language === 'fr' ? 'Payer maintenant' : 'Pay Now')}
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default Subscription;
