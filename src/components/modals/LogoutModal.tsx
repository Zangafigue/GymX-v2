import { LogOut } from 'lucide-react';
import { useTranslation } from '../../context/I18nContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="sm"
      showCloseButton={true}
    >
      <div className="relative overflow-hidden pt-4">
        {/* Design Element: Red Glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--color-primary)] opacity-[0.08] blur-[60px] rounded-full" />
        
        <div className="flex flex-col items-center text-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-[var(--color-primary-muted)] border border-[var(--color-primary-border)] rounded-2xl flex items-center justify-center text-[var(--color-primary)] rotate-3 shadow-lg shadow-[var(--color-primary-muted)]">
            <LogOut size={32} />
          </div>

          <div className="space-y-2 px-2">
            <h3 className="text-2xl font-bold uppercase italic font-display text-[var(--color-text-primary)] tracking-tight">
              {t('logout.title_confirm')}
            </h3>
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
              {t('logout.message')}
            </p>
          </div>

          <div className="flex flex-col w-full gap-3 mt-4">
            <Button
              onClick={onConfirm}
              variant="primary"
              size="lg"
              className="w-full !py-4 shadow-xl shadow-[var(--color-primary-muted)] italic font-display"
            >
              {t('logout.confirm_btn')}
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="lg"
              className="w-full !py-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            >
              {t('logout.cancel_btn')}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutModal;
