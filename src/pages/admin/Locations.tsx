import { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  Plus, 
  Trash2,
  Edit2,
  Building2,
  Phone,
  MapPin,
  CheckCircle2,
  X,
  Search,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../context/I18nContext';
import { useToast } from '../../components/ui/Toast';
import { useConfirm } from '../../components/ui/ConfirmDialog';
import { locationsApi } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TextArea } from '../../components/ui/TextArea';
import { StatCardSkeleton } from '../../components/ui/Skeleton';
import type { Location, LocationFormData } from '../../types';

const ManageLocations = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { confirm } = useConfirm();

  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState<LocationFormData>({
      name: '',
      city: '',
      address: '',
      phone: ''
  });

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    try {
        const data = await locationsApi.getAll();
        setLocations(data);
    } catch (err) {
        console.error('Error fetching locations:', err);
        addToast({ type: 'error', message: t('errors.fetch_failed') });
    } finally {
        setLoading(false);
    }
  }, [t, addToast]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      setSaveLoading(true);
      try {
          if (editingLocation) {
              await locationsApi.update(editingLocation.id, formData);
          } else {
              await locationsApi.create(formData);
          }
          addToast({ 
            type: 'success', 
            message: t('admin.location_saved'),
            icon: <CheckCircle2 size={18} />
          });
          setIsModalOpen(false);
          fetchLocations();
      } catch (err) {
          addToast({ type: 'error', message: t('errors.unexpected') });
      } finally {
          setSaveLoading(false);
      }
  };

  const deleteLocation = async (id: string, name: string) => {
      const ok = await confirm({
          title: t('footer.locations'),
          message: `${t('admin.confirm_delete_location')} (${name})`,
          variant: 'danger',
          confirmLabel: t('common.delete') || 'Delete'
      });

      if (!ok) return;

      try {
          await locationsApi.delete(id);
          addToast({ 
            type: 'success', 
            message: t('admin.location_deleted'),
            icon: <CheckCircle2 size={18} />
          });
          fetchLocations();
      } catch (err) {
          addToast({ type: 'error', message: t('errors.unexpected') });
      }
  };

  const openModal = (loc: Location | null = null) => {
      if (loc) {
          setEditingLocation(loc);
          setFormData({ name: loc.name, city: loc.city, address: loc.address, phone: loc.phone || '' });
      } else {
          setEditingLocation(null);
          setFormData({ name: '', city: '', address: '', phone: '' });
      }
      setIsModalOpen(true);
  };

  const filteredLocations = useMemo(() => {
    return locations.filter(loc => 
        loc.name.toLowerCase().includes(search.toLowerCase()) || 
        loc.city.toLowerCase().includes(search.toLowerCase())
    );
  }, [locations, search]);

  return (
    <div className="flex flex-col gap-10 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h1 className="text-4xl font-bold mb-3 uppercase tracking-tight font-display italic leading-none">
              {t('admin.locations_title')}
            </h1>
            <p className="text-[var(--color-text-secondary)] font-medium">
              {t('admin.locations_subtitle')}
            </p>
          </div>
          <Button 
            onClick={() => openModal()} 
            iconRight={<Plus size={18} />}
            size="lg"
            className="!rounded-2xl italic font-display"
          >
            {t('admin.new_location_btn')}
          </Button>
        </div>

        <div className="flex flex-col gap-8">
            <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors" size={18} />
                <input 
                    type="text" 
                    placeholder="Search locations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-base pl-12 shadow-xl shadow-black/20"
                />
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredLocations.length > 0 ? filteredLocations.map((loc, idx) => (
                        <motion.div 
                            key={loc.id} 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="glass-card p-10 flex flex-col gap-8 group hover:border-[var(--color-primary-border)] transition-all duration-500 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-[var(--color-primary)] group-hover:scale-110 transition-transform duration-700">
                                <Building2 size={120} />
                            </div>

                            <div className="flex justify-between items-start relative z-10">
                                <div className="w-14 h-14 bg-[var(--color-surface-2)] rounded-2xl flex items-center justify-center border border-[var(--color-border-subtle)] shadow-inner group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-500">
                                    <Building2 size={24} />
                                </div>
                                <div className="flex gap-2 opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openModal(loc)} className="w-10 h-10 rounded-xl bg-[var(--color-bg-base)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-surface-1)] transition-all"><Edit2 size={16} /></button>
                                    <button onClick={() => deleteLocation(loc.id, loc.name)} className="w-10 h-10 rounded-xl bg-[var(--color-bg-base)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-bg)] transition-all"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            
                            <div className="relative z-10">
                                <h4 className="text-2xl font-bold mb-3 text-white font-display italic tracking-tight">{loc.name}</h4>
                                <div className="flex items-center gap-2 text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                                    <MapPin size={14} /> {loc.city}
                                </div>
                                <p className="text-[var(--color-text-secondary)] text-sm font-medium leading-relaxed mb-8 flex items-start gap-3">
                                    <Globe size={16} className="shrink-0 mt-0.5 text-[var(--color-text-muted)]" />
                                    {loc.address}
                                </p>
                                <div className="flex items-center gap-3 text-[var(--color-text-muted)] text-sm font-bold border-t border-[var(--color-border-subtle)] pt-6 group-hover:border-[var(--color-primary-border)] transition-colors">
                                    <Phone size={16} className="text-[var(--color-primary)]" /> 
                                    <span className="tracking-tight">{loc.phone || 'No phone provided'}</span>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full py-24 text-center glass-card border-dashed border-2 border-[var(--color-border-subtle)] bg-transparent">
                            <Building2 size={48} className="mx-auto mb-6 text-[var(--color-text-muted)] opacity-20" />
                            <p className="text-[var(--color-text-secondary)] font-medium text-lg italic">
                                No locations added yet. Start by adding your first gym branch!
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Modal */}
        <AnimatePresence>
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsModalOpen(false)}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg glass-card !p-0 border-[var(--color-border-strong)] shadow-2xl overflow-hidden"
                    >
                        <div className="px-8 py-6 border-b border-[var(--color-border-subtle)] flex justify-between items-center bg-[var(--color-surface-2)]">
                            <h3 className="text-xl font-bold uppercase tracking-tight font-display italic">
                                {editingLocation ? 'Edit Location' : 'New Location'}
                            </h3>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-[var(--color-bg-base)] rounded-xl transition-all text-[var(--color-text-muted)] hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 flex flex-col gap-6">
                            <Input 
                                label="Gym Name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g. GymX Ouaga 2000"
                                prefix={<Building2 size={18} />}
                            />
                            
                            <Input 
                                label="City / Town"
                                required
                                value={formData.city}
                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                                placeholder="e.g. Ouagadougou"
                                prefix={<MapPin size={18} />}
                            />

                            <TextArea 
                                label="Full Address"
                                required
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                placeholder="e.g. Avenue Bassawarga, Section 10"
                            />

                            <Input 
                                label="Phone Number"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                placeholder="e.g. +226 25 30 14 14"
                                prefix={<Phone size={18} />}
                            />

                            <div className="flex gap-4 mt-4 pt-6 border-t border-[var(--color-border-subtle)]">
                                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
                                <Button type="submit" loading={saveLoading} className="flex-[2]">Save Location</Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default ManageLocations;
