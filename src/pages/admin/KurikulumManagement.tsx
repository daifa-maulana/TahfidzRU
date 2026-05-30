import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/data';
import { BookMarked, Plus, Edit2, Trash2, Loader2, Search } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Toast';
import { Modal } from '../../components/Modal';
import { motion, AnimatePresence } from 'motion/react';

export default function KurikulumManagement() {
  const [kurikulum, setKurikulum] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast, showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ subject: '', description: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await dataService.getKurikulum();
      setKurikulum(data || []);
    } catch { showToast('Gagal memuat data mata pelajaran', 'error'); }
    finally { setLoading(false); }
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({ subject: item.subject, description: item.description || '' });
    } else {
      setEditingItem(null);
      setFormData({ subject: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus mata pelajaran "${name}"?\n\nPerhatian: Nilai yang terhubung ke mata pelajaran ini juga akan ikut terhapus.`)) return;
    try {
      await dataService.deleteKurikulum(id);
      showToast('Mata pelajaran berhasil dihapus', 'success');
      fetchData();
    } catch { showToast('Gagal menghapus mata pelajaran', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim()) return showToast('Nama mata pelajaran tidak boleh kosong', 'error');
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await dataService.updateKurikulum(editingItem.id, formData);
        showToast('Mata pelajaran berhasil diperbarui', 'success');
      } else {
        await dataService.createKurikulum(formData);
        showToast('Mata pelajaran berhasil ditambahkan', 'success');
      }
      setIsModalOpen(false);
      fetchData();
    } catch { showToast('Gagal menyimpan mata pelajaran', 'error'); }
    finally { setIsSubmitting(false); }
  };

  const filtered = kurikulum.filter(k =>
    k.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-header">Mata Pelajaran (Kurikulum)</h1>
          <p className="text-sm text-slate-500 mt-0.5">Kelola daftar mata pelajaran pesantren</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary self-start">
          <Plus size={16} />
          Tambah Mapel
        </button>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama atau deskripsi mata pelajaran..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="card p-12 flex flex-col items-center justify-center gap-3">
          <Loader2 size={28} className="animate-spin text-slate-300" />
          <p className="text-sm text-slate-400">Memuat data mata pelajaran...</p>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-12 text-center flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
            <BookMarked size={28} className="text-slate-300" />
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1">
            {searchTerm ? 'Mata pelajaran tidak ditemukan' : 'Belum ada mata pelajaran'}
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            {searchTerm ? 'Coba kata kunci lain.' : 'Tambahkan mata pelajaran untuk mulai mengelola nilai akademik santri.'}
          </p>
          {!searchTerm && (
            <button onClick={() => handleOpenModal()} className="btn-primary">
              <Plus size={15} /> Tambah Mapel Pertama
            </button>
          )}
        </motion.div>
      ) : (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookMarked size={16} className="text-slate-400" />
              <h3 className="section-title">Daftar Mata Pelajaran</h3>
            </div>
            <span className="badge-blue">{filtered.length} mapel</span>
          </div>
          <div className="divide-y divide-slate-50">
            <AnimatePresence>
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between px-5 py-4 hover:bg-slate-50/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-[#1e3a5f]/5 text-[#1e3a5f] rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{item.subject}</p>
                      {item.description && (
                        <p className="text-xs text-slate-400 truncate mt-0.5">{item.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(item)}
                      className="p-2 rounded-lg text-slate-400 hover:text-[#1e3a5f] hover:bg-blue-50 transition-colors"
                      title="Edit">
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => handleDelete(item.id, item.subject)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Hapus">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Nama Mata Pelajaran <span className="text-red-400">*</span></label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="Contoh: Fiqih, Nahwu, Al-Qur'an..."
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              autoFocus
            />
          </div>
          <div>
            <label className="form-label">Deskripsi <span className="text-slate-400 font-normal">(opsional)</span></label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Keterangan singkat tentang mata pelajaran ini..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">Batal</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
              {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : null}
              {isSubmitting ? 'Menyimpan...' : editingItem ? 'Simpan Perubahan' : 'Tambah Mapel'}
            </button>
          </div>
        </form>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => {}} />}
    </div>
  );
}
