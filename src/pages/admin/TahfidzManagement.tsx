import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/data';
import { BookOpen, UserCircle, Plus, ChevronDown, CheckCircle2, History, Edit2, Trash2, Loader2, Info } from 'lucide-react';
import { cn } from '../../utils/cn';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Toast';
import { Modal } from '../../components/Modal';
import { motion } from 'motion/react';

export default function TahfidzManagement() {
  const [santri, setSantri] = useState<any[]>([]);
  const [selectedSantri, setSelectedSantri] = useState<string>('');
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast, showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<any>(null);

  const [formData, setFormData] = useState({
    surah: '', from_ayat: '', to_ayat: '',
    type: 'Setoran Baru', fluency: 'Lancar', note: ''
  });

  useEffect(() => { fetchSantri(); }, []);
  useEffect(() => {
    if (selectedSantri) fetchLogs(selectedSantri);
    else setLogs([]);
  }, [selectedSantri]);

  const fetchSantri = async () => {
    try { const data = await dataService.getSantriList(); setSantri(data); }
    catch { showToast('Gagal memuat daftar santri', 'error'); }
    finally { setLoading(false); }
  };

  const fetchLogs = async (id: string) => {
    try { const data = await dataService.getTahfidzLogs(id); setLogs(data); }
    catch { showToast('Gagal memuat riwayat hafalan', 'error'); }
  };

  const handleOpenEdit = (log: any) => {
    setEditingLog(log);
    setFormData({ surah: log.surah, from_ayat: log.from_ayat, to_ayat: log.to_ayat,
      type: log.type, fluency: log.fluency, note: log.note || '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus riwayat hafalan ini?')) return;
    try { await dataService.deleteTahfidz(id); showToast('Riwayat berhasil dihapus', 'success'); if (selectedSantri) fetchLogs(selectedSantri); }
    catch { showToast('Gagal menghapus riwayat', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSantri) return showToast('Pilih santri terlebih dahulu', 'error');
    setSubmitting(true);
    try {
      const payload = { ...formData, from_ayat: Number(formData.from_ayat), to_ayat: Number(formData.to_ayat), santri_id: selectedSantri };
      if (editingLog) { await dataService.updateTahfidz(editingLog.id, payload); showToast('Riwayat diperbarui', 'success'); setIsModalOpen(false); }
      else { await dataService.createTahfidz(payload); showToast('Setoran berhasil disimpan!', 'success'); }
      fetchLogs(selectedSantri);
      if (!editingLog) setFormData({ surah: '', from_ayat: '', to_ayat: '', type: 'Setoran Baru', fluency: 'Lancar', note: '' });
    } catch (error: any) { showToast(error.message || 'Gagal menyimpan setoran', 'error'); }
    finally { setSubmitting(false); }
  };

  const fluencyColor = (f: string) =>
    f === 'Lancar' ? 'bg-emerald-50 text-emerald-700' : f === 'Cukup' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700';
  const fluencyBorder = (f: string) =>
    f === 'Lancar' ? 'bg-emerald-500' : f === 'Cukup' ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="page-header">Manajemen Tahfidz</h1>
        <p className="text-sm text-slate-500 mt-0.5">Catat dan pantau perkembangan hafalan Al-Qur'an santri</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Form Input */}
        <div className="lg:col-span-2">
          <div className="card p-5 space-y-4 sticky top-20">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
                <Plus size={16} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Input Setoran Baru</h3>
                <p className="text-[10px] text-slate-400">Data tersinkron ke Portal Wali</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="form-label">Pilih Santri</label>
                <div className="relative">
                  <select className="input-field appearance-none pr-9 cursor-pointer" value={selectedSantri}
                    onChange={(e) => setSelectedSantri(e.target.value)}>
                    <option value="">-- Pilih Santri --</option>
                    {santri.map(s => <option key={s.id} value={s.id}>{s.name} ({s.nis})</option>)}
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="form-label">Pilih Surah / Juz</label>
                <div className="relative">
                  <select className="input-field appearance-none pr-9 cursor-pointer" value={formData.surah}
                    onChange={(e) => setFormData({ ...formData, surah: e.target.value })} required>
                    <option value="">-- Pilih Surah --</option>
                    <optgroup label="Surah Populer">
                      <option value="Al-Fatihah">Al-Fatihah</option>
                      <option value="Al-Baqarah">Al-Baqarah</option>
                      <option value="Ali 'Imran">Ali 'Imran</option>
                      <option value="Yasin">Yasin</option>
                      <option value="Ar-Rahman">Ar-Rahman</option>
                      <option value="Al-Waqi'ah">Al-Waqi'ah</option>
                      <option value="Al-Mulk">Al-Mulk</option>
                      <option value="Al-Kahf">Al-Kahf</option>
                    </optgroup>
                    <optgroup label="Juz 30 (Juz 'Amma)">
                      <option value="An-Naba'">An-Naba'</option>
                      <option value="An-Nazi'at">An-Nazi'at</option>
                      <option value="'Abasa">'Abasa</option>
                      <option value="At-Takwir">At-Takwir</option>
                      <option value="Al-Infitar">Al-Infitar</option>
                      <option value="Al-Mutaffifin">Al-Mutaffifin</option>
                      <option value="Al-Inshiqaq">Al-Inshiqaq</option>
                      <option value="Al-Buruj">Al-Buruj</option>
                      <option value="At-Tariq">At-Tariq</option>
                      <option value="Al-A'la">Al-A'la</option>
                      <option value="Al-Ghashiyah">Al-Ghashiyah</option>
                      <option value="Al-Fajr">Al-Fajr</option>
                      <option value="Al-Balad">Al-Balad</option>
                      <option value="Ash-Shams">Ash-Shams</option>
                      <option value="Al-Lail">Al-Lail</option>
                      <option value="Ad-Duha">Ad-Duha</option>
                      <option value="Ash-Sharh">Ash-Sharh</option>
                      <option value="At-Tin">At-Tin</option>
                      <option value="Al-'Alaq">Al-'Alaq</option>
                      <option value="Al-Qadr">Al-Qadr</option>
                      <option value="Al-Bayyinah">Al-Bayyinah</option>
                      <option value="Az-Zalzalah">Az-Zalzalah</option>
                      <option value="Al-'Adiyat">Al-'Adiyat</option>
                      <option value="Al-Qari'ah">Al-Qari'ah</option>
                      <option value="At-Takathur">At-Takathur</option>
                      <option value="Al-'Asr">Al-'Asr</option>
                      <option value="Al-Humazah">Al-Humazah</option>
                      <option value="Al-Fil">Al-Fil</option>
                      <option value="Quraish">Quraish</option>
                      <option value="Al-Ma'un">Al-Ma'un</option>
                      <option value="Al-Kauthar">Al-Kauthar</option>
                      <option value="Al-Kafirun">Al-Kafirun</option>
                      <option value="An-Nasr">An-Nasr</option>
                      <option value="Al-Masad">Al-Masad</option>
                      <option value="Al-Ikhlas">Al-Ikhlas</option>
                      <option value="Al-Falaq">Al-Falaq</option>
                      <option value="An-Nas">An-Nas</option>
                    </optgroup>
                    <optgroup label="Lainnya">
                      <option value="Lainnya (Tulis di Catatan)">Surah Lainnya (Tulis di Catatan)</option>
                    </optgroup>
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Dari Ayat</label>
                  <input type="number" className="input-field" value={formData.from_ayat}
                    onChange={(e) => setFormData({ ...formData, from_ayat: e.target.value })} required />
                </div>
                <div>
                  <label className="form-label">Sampai Ayat</label>
                  <input type="number" className="input-field" value={formData.to_ayat}
                    onChange={(e) => setFormData({ ...formData, to_ayat: e.target.value })} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Jenis Setoran</label>
                  <select className="input-field appearance-none" value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                    <option value="Setoran Baru">Setoran Baru</option>
                    <option value="Murojaah">Murojaah</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Kelancaran</label>
                  <select className="input-field appearance-none" value={formData.fluency}
                    onChange={(e) => setFormData({ ...formData, fluency: e.target.value })}>
                    <option value="Lancar">Lancar</option>
                    <option value="Cukup">Cukup</option>
                    <option value="Kurang">Kurang</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Catatan Pembimbing</label>
                <textarea className="input-field" rows={2} placeholder="Tuliskan catatan atau saran..."
                  value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} />
              </div>

              <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
                {submitting ? <Loader2 size={15} className="animate-spin" /> : <BookOpen size={15} />}
                {submitting ? 'Menyimpan...' : 'Simpan Setoran'}
              </button>
            </form>
          </div>
        </div>

        {/* Riwayat */}
        <div className="lg:col-span-3 card overflow-hidden flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <History size={16} className="text-slate-400" />
              <h3 className="section-title">Riwayat Hafalan</h3>
            </div>
            {logs.length > 0 && (
              <span className="badge-blue">{logs.length} catatan</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {!selectedSantri ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-300">
                <UserCircle size={44} className="mb-2 opacity-30" />
                <p className="text-sm text-slate-400">Pilih santri untuk melihat riwayat hafalan</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48">
                <BookOpen size={36} className="text-slate-200 mb-2" />
                <p className="text-sm text-slate-400">Belum ada riwayat hafalan untuk santri ini.</p>
              </div>
            ) : logs.map((log) => (
              <motion.div key={log.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className="relative flex items-start gap-3 p-4 bg-slate-50/60 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-white transition-all group">
                {/* Colored indicator */}
                <div className={cn("absolute left-0 top-3 bottom-3 w-1 rounded-r-full", fluencyBorder(log.fluency))} />
                <div className={cn("flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ml-1", fluencyColor(log.fluency))}>
                  <CheckCircle2 size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{log.surah}</p>
                      <p className="text-xs text-slate-500">Ayat {log.from_ayat}–{log.to_ayat}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenEdit(log)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#1e3a5f] hover:bg-blue-50 transition-colors">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => handleDelete(log.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full",
                      log.type === 'Setoran Baru' ? 'bg-blue-50 text-blue-600' : 'bg-sky-50 text-sky-600')}>
                      {log.type}
                    </span>
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", fluencyColor(log.fluency))}>
                      {log.fluency}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {format(new Date(log.created_at), 'dd MMM yyyy', { locale: id })}
                    </span>
                  </div>
                  {log.note && <p className="text-xs text-slate-500 mt-1.5 italic">"{log.note}"</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingLog(null); }} title="Edit Riwayat Hafalan">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="form-label">Surah</label>
            <input type="text" required className="input-field" value={formData.surah}
              onChange={(e) => setFormData({ ...formData, surah: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Dari Ayat</label>
              <input type="number" required className="input-field" value={formData.from_ayat}
                onChange={(e) => setFormData({ ...formData, from_ayat: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Sampai Ayat</label>
              <input type="number" required className="input-field" value={formData.to_ayat}
                onChange={(e) => setFormData({ ...formData, to_ayat: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Jenis</label>
              <select className="input-field" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                <option value="Setoran Baru">Setoran Baru</option>
                <option value="Murojaah">Murojaah</option>
              </select>
            </div>
            <div>
              <label className="form-label">Kelancaran</label>
              <select className="input-field" value={formData.fluency} onChange={(e) => setFormData({ ...formData, fluency: e.target.value })}>
                <option value="Lancar">Lancar</option>
                <option value="Cukup">Cukup</option>
                <option value="Kurang">Kurang</option>
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">Catatan</label>
            <textarea className="input-field" rows={2} value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })} />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => { setIsModalOpen(false); setEditingLog(null); }} className="btn-secondary flex-1">Batal</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? <Loader2 size={15} className="animate-spin" /> : null}
              {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => {}} />}
    </div>
  );
}
