import { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  Plus, 
  Trash2,
  Edit2,
  Clock,
  User,
  LayoutGrid,
  List,
  Search,
  CheckCircle2,
  Calendar as CalendarIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../context/I18nContext';
import { useToast } from '../../components/ui/Toast';
import { useConfirm } from '../../components/ui/ConfirmDialog';
import { classesApi } from '../../lib/api';
import ClassModal from '../../components/ClassModal';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { StatCardSkeleton } from '../../components/ui/Skeleton';
import type { GymClass, GymClassFormData } from '../../types';

const ManageClasses = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { confirm } = useConfirm();

  const [classes, setClasses] = useState<GymClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<GymClass | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [search, setSearch] = useState('');

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    try {
        const data = await classesApi.getAll();
        setClasses(data);
    } catch (err) {
        console.error('Error fetching classes:', err);
        addToast({ type: 'error', message: t('errors.fetch_failed') });
    } finally {
        setLoading(false);
    }
  }, [t, addToast]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const deleteClass = async (id: string, title: string) => {
      const ok = await confirm({
        title: t('admin.edit_class'),
        message: `${t('admin.confirm_delete_class')} (${title})`,
        variant: 'danger',
        confirmLabel: t('common.delete') || 'Delete'
      });

      if (!ok) return;

      try {
          await classesApi.delete(id);
          addToast({ 
            type: 'success', 
            message: t('admin.class_deleted'),
            icon: <CheckCircle2 size={18} />
          });
          fetchClasses();
      } catch (_err) {
          addToast({ type: 'error', message: t('errors.unexpected') });
      }
  };

  const handleSaveClass = async (data: any) => {
      try {
          if (editingClass) {
              await classesApi.update(editingClass.id, data as GymClassFormData);
          } else {
              await classesApi.create(data as GymClassFormData);
          }
          addToast({ 
            type: 'success', 
            message: t('admin.class_saved'),
            icon: <CheckCircle2 size={18} />
          });
          fetchClasses();
      } catch (err) {
          addToast({ type: 'error', message: t('errors.unexpected') });
          throw err;
      }
  };

  const openEditModal = (c: GymClass) => {
      setEditingClass(c);
      setIsModalOpen(true);
  };

  const openCreateModal = () => {
      setEditingClass(null);
      setIsModalOpen(true);
  };

  const filteredClasses = useMemo(() => {
    return classes.filter(c => 
      c.title.toLowerCase().includes(search.toLowerCase()) || 
      c.trainer.toLowerCase().includes(search.toLowerCase())
    );
  }, [classes, search]);

  const columns = [
    {
      header: t('admin.table.title_type'),
      accessor: (c: GymClass) => (
        <div className="flex flex-col">
          <span className="font-bold text-white group-hover:text-[var(--color-primary)] transition-colors">{c.title}</span>
          <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest">{c.type}</span>
        </div>
      )
    },
    {
      header: t('admin.table.day_time'),
      accessor: (c: GymClass) => (
        <div className="flex items-center gap-3 text-[var(--color-text-secondary)]">
          <CalendarIcon size={14} className="text-[var(--color-primary)]" />
          <div className="flex flex-col leading-tight">
            <span className="font-medium text-white">{c.day}</span>
            <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-widest">{c.time}</span>
          </div>
        </div>
      )
    },
    {
      header: t('admin.table.trainer'),
      accessor: (c: GymClass) => (
        <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
          <User size={14} className="text-[var(--color-primary)]" />
          <span className="text-sm font-medium">{c.trainer}</span>
        </div>
      )
    },
    {
      header: t('admin.table.actions'),
      className: 'text-right',
      accessor: (c: GymClass) => (
        <div className="flex items-center justify-end gap-3">
          <button 
            onClick={() => openEditModal(c)} 
            className="w-10 h-10 rounded-xl bg-[var(--color-surface-3)] flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-primary)] hover:text-white transition-all active:scale-95"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => deleteClass(c.id, c.title)} 
            className="w-10 h-10 rounded-xl bg-[var(--color-surface-3)] flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-error)] hover:text-white transition-all active:scale-95"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-4xl font-bold mb-3 uppercase tracking-tight font-display italic">
            {t('admin.classes_title')}
          </h1>
          <p className="text-[var(--color-text-secondary)] font-medium">
            {t('admin.classes_subtitle')}
          </p>
        </div>
        <Button 
          onClick={openCreateModal}
          iconRight={<Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />}
          size="lg"
          className="!rounded-2xl italic font-display"
        >
          {t('admin.new_class_btn')}
        </Button>
      </div>

      <div className="flex flex-col gap-8">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder={t('admin.search_classes_placeholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base pl-12 shadow-xl shadow-black/20"
            />
          </div>
          
          <div className="flex items-center gap-3 p-1.5 bg-[var(--color-surface-3)] rounded-[1.25rem] border border-[var(--color-border-subtle)] shadow-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl transition-all duration-300 ${viewMode === 'grid' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'text-[var(--color-text-muted)] hover:text-white'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-xl transition-all duration-300 ${viewMode === 'list' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'text-[var(--color-text-muted)] hover:text-white'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        ) : viewMode === 'list' ? (
          <div className="glass-card !p-0 overflow-hidden border-[var(--color-border-subtle)]">
            <DataTable 
              columns={columns}
              data={filteredClasses}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClasses.map((c, idx) => (
              <motion.div 
                key={c.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card group hover:border-[var(--color-primary-border)] transition-all duration-500 p-8 flex flex-col gap-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 py-1.5 px-6 bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase italic tracking-[0.2em] shadow-xl rounded-bl-2xl">
                  {c.type}
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-[var(--color-primary)] transition-colors font-display italic uppercase tracking-tight">{c.title}</h3>
                  <div className="flex items-center gap-3 text-[var(--color-text-muted)] text-[10px] font-bold uppercase tracking-widest">
                    <Clock size={14} className="text-[var(--color-primary)]" /> {c.day} • {c.time}
                  </div>
                </div>

                <div className="flex items-center gap-4 py-6 border-t border-b border-[var(--color-border-subtle)] group-hover:border-[var(--color-primary-border)] transition-colors">
                  <div className="w-12 h-12 bg-[var(--color-surface-2)] rounded-2xl flex items-center justify-center text-[var(--color-primary)] border border-[var(--color-border-subtle)] shadow-inner">
                    <User size={22} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase text-[var(--color-text-muted)] font-bold tracking-[0.3em]">Instructor</span>
                    <span className="text-sm font-bold text-white tracking-tight">{c.trainer}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    variant="secondary"
                    className="flex-1 !py-3 !rounded-xl"
                    onClick={() => openEditModal(c)}
                    icon={<Edit2 size={16} />}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="ghost"
                    className="flex-1 !py-3 !rounded-xl hover:bg-[var(--color-error)] hover:text-white"
                    onClick={() => deleteClass(c.id, c.title)}
                    icon={<Trash2 size={16} />}
                  >
                    Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <ClassModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveClass}
        initialData={editingClass}
      />
    </div>
  );
};

export default ManageClasses;
