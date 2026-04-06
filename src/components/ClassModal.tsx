import React, { useState, useEffect } from 'react';
import { X, Save, Clock, User, Tag, Calendar as CalendarIcon, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../context/I18nContext';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import type { ClassType, DayOfWeek } from '../types';

interface GymClassForm {
  title: string;
  trainer: string;
  type: ClassType | string;
  day: DayOfWeek | string;
  time: string;
  capacity: number;
}

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: GymClassForm) => Promise<void>;
  initialData?: GymClassForm | null;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const TYPES = ['strength', 'yoga', 'cardio', 'combat', 'bootcamp'];

const ClassModal: React.FC<ClassModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<GymClassForm>({
    title: '',
    trainer: '',
    type: 'strength',
    day: 'monday',
    time: '07:00',
    capacity: 20
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        trainer: initialData.trainer || '',
        type: initialData.type?.toLowerCase() || 'strength',
        day: initialData.day?.toLowerCase() || 'monday',
        time: initialData.time || '07:00',
        capacity: initialData.capacity || 20
      });
    } else {
        setFormData({
            title: '',
            trainer: '',
            type: 'strength',
            day: 'monday',
            time: '07:00',
            capacity: 20
        });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API expects capitalized days/types as per existing DB data, but we use lowercase for keys
      const submitData = {
        ...formData,
        day: formData.day.charAt(0).toUpperCase() + formData.day.slice(1),
        type: formData.type.charAt(0).toUpperCase() + formData.type.slice(1),
      };
      await onSave(submitData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) : value
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl glass-card !p-0 border-[var(--color-border-strong)] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-[var(--color-border-subtle)] flex justify-between items-center bg-[var(--color-surface-2)]">
              <h3 className="text-xl font-bold uppercase tracking-tight font-display italic">
                {initialData ? t('admin.edit_class') : t('admin.create_class')}
              </h3>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-[var(--color-bg-base)] rounded-xl transition-all text-[var(--color-text-muted)] hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input 
                  label="Class Title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  prefix={<Tag size={18} />}
                  placeholder="e.g., Morning Yoga"
                />
                <Input 
                  label="Trainer Name"
                  name="trainer"
                  required
                  value={formData.trainer}
                  onChange={handleChange}
                  prefix={<User size={18} />}
                  placeholder="e.g., Ana Silva"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2.5">
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] ml-1">
                    Day
                  </label>
                  <div className="relative group">
                    <CalendarIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors" />
                    <select 
                      name="day"
                      value={formData.day}
                      onChange={handleChange}
                      className="input-base pl-12 appearance-none cursor-pointer"
                    >
                      {DAYS.map(d => (
                          <option key={d} value={d} className="bg-[var(--color-bg-base)]">
                            {t(`schedule.days.${d}`)}
                          </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <Input 
                  label="Time (HH:MM)"
                  name="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                  prefix={<Clock size={18} />}
                  placeholder="07:00"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2.5">
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] ml-1">
                    Type
                  </label>
                  <select 
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="input-base appearance-none cursor-pointer"
                  >
                    {TYPES.map(tKey => (
                        <option key={tKey} value={tKey} className="bg-[var(--color-bg-base)]">
                          {t(`schedule.types.${tKey}`)}
                        </option>
                    ))}
                  </select>
                </div>
                
                <Input 
                  label="Max Capacity"
                  name="capacity"
                  type="number"
                  required
                  value={formData.capacity}
                  onChange={handleChange}
                  prefix={<Hash size={18} />}
                  min="1"
                  max="100"
                />
              </div>

              <div className="flex gap-4 mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  loading={loading}
                  icon={<Save size={18} />}
                  className="flex-[2]"
                >
                  {initialData ? 'Update Class' : 'Create Class'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ClassModal;
