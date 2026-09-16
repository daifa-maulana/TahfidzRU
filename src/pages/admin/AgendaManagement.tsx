import React, { useState, useEffect, useRef } from 'react';
import { dataService } from '../../services/data';
import { Calendar, Plus, Edit2, Trash2, MapPin, Clock, Loader2, Image, X, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Toast';
import { Modal } from '../../components/Modal';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion } from 'motion/react';
import { cn } from '../../utils/cn';

const toLocalNoon = (dateStr: string) => {
  try {
    if (!dateStr) return new Date();
    const clean = typeof dateStr === 'string' ? dateStr.split('T')[0] : String(dateStr);
    const d = new Date(clean + 'T00:00:00');
    return isNaN(d.getTime()) ? new Date() : d;
  } catch {
    return new Date();
  }
};

export default function AgendaManagement() {
  const [agendas, setAgendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgenda, setEditingAgenda] = useState<any>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [viewingPhoto, setViewingPhoto] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '', 
    description: '', 
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '08:00', 
    location: '', 
    photo_url: '',
    is_active: true
  });

  useEffect(() => { fetchAgendas(); }, []);

  const fetchAgendas = async () => {
    try { 
      // Admin views all agendas (both active & inactive)
      const data = await dataService.getAgenda(false); 
      setAgendas(data); 
    }
    catch { showToast('Gagal memuat agenda', 'error'); }
    finally { setLoading(false); }
  };

  const handleOpenModal = (agenda?: any) => {
    if (agenda) {
      setEditingAgenda(agenda);
      setFormData({
        title: agenda.title, 
        description: agenda.description || '',
        date: agenda.date, 
        time: agenda.time || '08:00',
        location: agenda.location || '', 
        photo_url: agenda.photo_url || '',
        is_active: agenda.is_active !== false
      });
      setPhotoPreview(agenda.photo_url || '');
    } else {
      setEditingAgenda(null);
      setFormData({ 
        title: '', 
        description: '', 
        date: format(new Date(), 'yyyy-MM-dd'), 
        time: '08:00', 
        location: '', 
        photo_url: '',
        is_active: true
      });
      setPhotoPreview('');
    }
    setIsModalOpen(true);
  };

  const handleToggleActive = async (agenda: any) => {
    try {
      const nextActive = agenda.is_active === false ? true : false;
      await dataService.updateAgenda(agenda.id, { is_active: nextActive });
      showToast(nextActive ? 'Agenda ditampilkan di publik' : 'Agenda disembunyikan dari publik', 'info');
      fetchAgendas();
    } catch {
      showToast('Gagal mengubah status agenda', 'error');
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('Ukuran foto maksimal 2 MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPhotoPreview(result);
      setFormData(prev => ({ ...prev, photo_url: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview('');
    setFormData(prev => ({ ...prev, photo_url: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus agenda ini?')) return;
    try { await dataService.deleteAgenda(id); showToast('Agenda dihapus', 'success'); fetchAgendas(); }
    catch { showToast('Gagal menghapus agenda', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { showToast('Judul agenda tidak boleh kosong', 'error'); return; }
    if (!formData.date) { showToast('Tanggal agenda harus diisi', 'error'); return; }
    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      if (editingAgenda) {
        await dataService.updateAgenda(editingAgenda.id, payload);
        showToast('Agenda diperbarui', 'success');
      } else {
        await dataService.createAgenda(payload);
        showToast('Agenda ditambahkan', 'success');
      }
      setIsModalOpen(false);
      fetchAgendas();
    } catch { showToast('Gagal menyimpan agenda', 'error'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-header">Agenda Pesantren</h1>
          <p className="text-sm text-slate-500 mt-0.5">Kelola jadwal kegiatan dan event di Roudhlatul Ulum</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary self-start">
          <Plus size={15} /> Tambah Agenda
        </button>
      </div>

      {loading ? (
        <div className="card p-12 flex flex-col items-center">
          <Loader2 size={24} className="animate-spin text-slate-300 mb-2" />
          <p className="text-sm text-slate-400">Memuat agenda...</p>
        </div>
      ) : agendas.length === 0 ? (
        <div className="card p-12 flex flex-col items-center border-2 border-dashed border-slate-200">
          <Calendar size={40} className="text-slate-200 mb-3" />
          <p className="text-sm font-semibold text-slate-400">Belum ada agenda terjadwal</p>
          <p className="text-xs text-slate-300 mt-1">Tambahkan agenda kegiatan pertama.</p>
          <button onClick={() => handleOpenModal()} className="btn-primary mt-4">
            <Plus size={14} /> Tambah Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agendas.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="card overflow-hidden flex flex-col hover:shadow-md transition-all group">

              {/* Photo Area */}
              {item.photo_url ? (
                <div
                  className="relative h-44 bg-slate-100 overflow-hidden cursor-pointer"
                  onClick={() => setViewingPhoto(item.photo_url)}
                >
                  <img
                    src={item.photo_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  {item.is_active === false && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <EyeOff size={14} /> Disembunyikan (Private)
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-xs font-semibold">Klik untuk perbesar</span>
                  </div>
                </div>
              ) : (
                <div className="h-28 bg-gradient-to-br from-[#1e3a5f]/5 to-[#1e3a5f]/10 flex items-center justify-center relative">
                  <Calendar size={32} className="text-[#1e3a5f]/20" />
                  {item.is_active === false && (
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 border border-amber-200">
                        <EyeOff size={11} /> Disembunyikan
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 bg-[#1e3a5f] text-white rounded-xl flex flex-col items-center justify-center shadow-sm flex-shrink-0">
                      <span className="text-[9px] font-semibold opacity-60 uppercase">
                        {(() => { try { return format(toLocalNoon(item.date), 'MMM', { locale: id }); } catch { return '---'; } })()}
                      </span>
                      <span className="text-lg font-bold leading-none">
                        {(() => { try { return format(toLocalNoon(item.date), 'dd'); } catch { return '--'; } })()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-bold text-slate-800 group-hover:text-[#1e3a5f] transition-colors line-clamp-1">{item.title}</h3>
                      </div>
                      {item.description && (
                        <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1 flex-shrink-0">
                    <button 
                      onClick={() => handleToggleActive(item)}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        item.is_active === false 
                          ? "text-amber-500 hover:bg-amber-50" 
                          : "text-emerald-600 hover:bg-emerald-50"
                      )}
                      title={item.is_active === false ? "Tampilkan di Publik" : "Sembunyikan dari Publik"}
                    >
                      {item.is_active === false ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button onClick={() => handleOpenModal(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#1e3a5f] hover:bg-blue-50 transition-colors"
                      title="Edit Agenda">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Hapus Agenda">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock size={12} />
                      <span>{item.time || 'TBD'} WIB</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
                      <MapPin size={12} className="flex-shrink-0" />
                      <span className="truncate">{item.location || 'Belum ditentukan'}</span>
                    </div>
                  </div>
                  {item.is_active === false ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      Private
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Publik
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setPhotoPreview(''); }}
        title={editingAgenda ? 'Edit Agenda' : 'Tambah Agenda Baru'}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="form-label">Judul Agenda</label>
            <input type="text" required className="input-field" value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Deskripsi / Detail Kegiatan</label>
            <textarea className="input-field min-h-[80px]" value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Tanggal</label>
              <input type="date" required className="input-field" value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Waktu (WIB)</label>
              <input type="time" className="input-field" value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="form-label">Lokasi Kegiatan</label>
            <input type="text" className="input-field" placeholder="Cth: Masjid Pesantren" value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Foto Agenda (Opsional)</label>
            {photoPreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-36">
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={handleRemovePhoto}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black transition-colors">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center cursor-pointer hover:border-slate-400 transition-colors">
                <Image size={24} className="mx-auto text-slate-300 mb-1" />
                <p className="text-xs text-slate-500 font-semibold">Klik untuk unggah foto agenda</p>
                <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG maksimal 2 MB</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>

          <div className="flex items-center gap-2 pt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active !== false}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500"
            />
            <label htmlFor="is_active" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
              Tampilkan di Website Publik (Dapat dilihat umum)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Batal</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : null}
              {editingAgenda ? 'Simpan Perubahan' : 'Tambah Agenda'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Photo Viewer Modal */}
      {viewingPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setViewingPhoto('')}>
          <div className="relative max-w-3xl max-h-[85vh]">
            <img src={viewingPhoto} alt="Full view" className="max-w-full max-h-[85vh] object-contain rounded-2xl" />
            <button onClick={() => setViewingPhoto('')}
              className="absolute -top-3 -right-3 p-2 bg-white text-slate-800 rounded-full shadow-lg hover:bg-slate-100">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => {}} />}
    </div>
  );
}
