/**
 * Trainers.tsx — Admin Trainers Management
 *
 * CRUD operations for trainers.
 */

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { useConfirm } from '../../components/ui/ConfirmDialog';
import { useTranslation } from '../../context/I18nContext';
import { getErrorMessage } from '../../lib/errors';
import { trainersApi } from '../../lib/api';

interface Trainer {
  id: string;
  full_name: string;
  bio: string;
  specialties: string[];
  is_active: boolean;
}

const AdminTrainers = () => {
  const { language } = useTranslation();
  const { addToast } = useToast();
  const { confirm } = useConfirm();

  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    specialties: '',
  });

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const data = await trainersApi.getAll();
      setTrainers(data);
    } catch (err) {
      addToast({ type: 'error', message: getErrorMessage(err, language) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, [language]);

  const handleOpenModal = (trainer?: Trainer) => {
    if (trainer) {
      setEditingTrainer(trainer);
      setFormData({
        full_name: trainer.full_name,
        bio: trainer.bio || '',
        specialties: trainer.specialties ? trainer.specialties.join(', ') : '',
      });
    } else {
      setEditingTrainer(null);
      setFormData({ full_name: '', bio: '', specialties: '' });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTrainer(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name) {
       addToast({ type: 'error', message: language === 'fr' ? 'Le nom est requis' : 'Name is required' });
       return;
    }
    setLoading(true);
    try {
      const payload = {
        full_name: formData.full_name,
        bio: formData.bio,
        specialties: formData.specialties.split(',').map(s => s.trim()).filter(Boolean),
      };

      if (editingTrainer) {
        await trainersApi.update(editingTrainer.id, payload);
        addToast({ type: 'success', message: language === 'fr' ? 'Entraîneur mis à jour' : 'Trainer updated' });
      } else {
        await trainersApi.create(payload);
        addToast({ type: 'success', message: language === 'fr' ? 'Entraîneur ajouté' : 'Trainer added' });
      }
      
      handleCloseModal();
      fetchTrainers();
    } catch (err) {
      addToast({ type: 'error', message: getErrorMessage(err, language) });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (trainer: Trainer) => {
    const isConfirmed = await confirm({
      title: language === 'fr' ? 'Supprimer cet entraîneur ?' : 'Delete this trainer?',
      message: language === 'fr' 
        ? `Êtes-vous sûr de vouloir supprimer ${trainer.full_name} ? Cette action est irréversible.`
        : `Are you sure you want to delete ${trainer.full_name}? This action cannot be undone.`,
      confirmLabel: language === 'fr' ? 'Supprimer' : 'Delete',
      variant: 'danger'
    });

    if (isConfirmed) {
      setLoading(true);
      try {
        await trainersApi.delete(trainer.id);
        addToast({ type: 'success', message: language === 'fr' ? 'Entraîneur supprimé' : 'Trainer deleted' });
        fetchTrainers();
      } catch (err) {
        addToast({ type: 'error', message: getErrorMessage(err, language) });
      } finally {
        setLoading(false);
      }
    }
  };

  const columns = [
    {
      key: 'full_name',
      header: language === 'fr' ? 'Nom complet' : 'Full Name',
      sortable: true,
      render: (t: Trainer) => <span className="font-bold">{t.full_name}</span>
    },
    {
      key: 'specialties',
      header: language === 'fr' ? 'Spécialités' : 'Specialties',
      render: (t: Trainer) => (
        <div className="flex flex-wrap gap-2">
           {t.specialties?.slice(0, 3).map((spec, i) => (
             <span key={i} className="px-2 py-1 bg-[var(--color-bg-subtle)] text-[10px] uppercase rounded-full border border-[var(--color-border-subtle)]">
               {spec}
             </span>
           ))}
           {(t.specialties?.length || 0) > 3 && <span className="text-xs text-[var(--color-text-muted)]">+{t.specialties.length - 3}</span>}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (t: Trainer) => (
        <span className={`px-2 py-1 text-[10px] uppercase rounded-full ${t.is_active ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]' : 'bg-[var(--color-error-bg)] text-[var(--color-error)]'}`}>
          {t.is_active ? (language === 'fr' ? 'Actif' : 'Active') : (language === 'fr' ? 'Inactif' : 'Inactive')}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      width: '100px',
      render: (t: Trainer) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleOpenModal(t); }}
            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-3)] rounded-lg transition-colors"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(t); }}
            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-bg)] rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader 
        title={language === 'fr' ? 'Gérer les Entraîneurs' : 'Manage Trainers'}
        subtitle={language === 'fr' ? 'Ajoutez, modifiez ou supprimez des entraîneurs.' : 'Add, edit, or delete trainers.'}
        actions={
          <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
            <Plus size={18} />
            {language === 'fr' ? 'Nouvel Entraîneur' : 'New Trainer'}
          </Button>
        }
      />

      <div className="glass-card overflow-hidden">
        <DataTable
          columns={columns}
          data={trainers}
          loading={loading}
          keyExtractor={(t) => t.id}
          emptyMessage={language === 'fr' ? 'Aucun entraîneur trouvé.' : 'No trainers found.'}
        />
      </div>

      <Modal 
        isOpen={modalOpen} 
        onClose={handleCloseModal}
        title={editingTrainer ? (language === 'fr' ? 'Modifier l\'Entraîneur' : 'Edit Trainer') : (language === 'fr' ? 'Nouvel Entraîneur' : 'New Trainer')}
      >
        <form onSubmit={handleSave} className="flex flex-col gap-6 pt-4">
          <Input
            label={language === 'fr' ? 'Nom complet' : 'Full Name'}
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            placeholder={language === 'fr' ? 'Ex: Sarah Connor' : 'E.g. Sarah Connor'}
            required
            autoFocus
          />
          <Input
            label={language === 'fr' ? 'Biographie courte' : 'Short Bio'}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder={language === 'fr' ? 'Expert en...' : 'Expert in...'}
          />
          <Input
            label={language === 'fr' ? 'Spécialités (séparées par des virgules)' : 'Specialties (comma-separated)'}
            value={formData.specialties}
            onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
            placeholder="Yoga, Pilates, HIIT"
          />
          <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-[var(--color-border-subtle)]">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>
              {language === 'fr' ? 'Annuler' : 'Cancel'}
            </Button>
            <Button type="submit" loading={loading}>
              {language === 'fr' ? 'Enregistrer' : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminTrainers;
