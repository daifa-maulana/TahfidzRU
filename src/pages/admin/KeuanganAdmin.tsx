import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { dataService } from '../../services/data';
import { Wallet, Plus, Search, Download, CreditCard, Clock, Loader2, Edit2, Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Toast';
import { Modal } from '../../components/Modal';

export default function KeuanganAdmin() {
  const [santri, setSantri] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast, showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);

  const [formData, setFormData] = useState({
    santri_id: '', type: 'SPP Bulanan', amount: '', status: 'Paid', note: ''
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [transData, santriData] = await Promise.all([
        dataService.getTransactions(), dataService.getSantriList()
      ]);
      setTransactions(transData); setSantri(santriData);
    } catch { showToast('Gagal memuat data keuangan', 'error'); }
    finally { setLoading(false); }
  };

  const handleOpenModal = (t?: any) => {
    if (t) {
      setEditingTransaction(t);
      setFormData({ santri_id: t.santri_id, type: t.type, amount: t.amount.toString(), status: t.status, note: t.note || '' });
    } else {
      setEditingTransaction(null);
      setFormData({ santri_id: '', type: 'SPP Bulanan', amount: '', status: 'Paid', note: '' });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus transaksi ini?')) return;
    try { await dataService.deleteTransaction(id); showToast('Transaksi berhasil dihapus', 'success'); fetchData(); }
    catch { showToast('Gagal menghapus transaksi', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.santri_id) return showToast('Pilih santri terlebih dahulu', 'error');
    setIsSubmitting(true);
    try {
      const payload = { ...formData, amount: Number(formData.amount),
        date: editingTransaction ? editingTransaction.date : new Date().toISOString().split('T')[0] };
      if (editingTransaction) { await dataService.updateTransaction(editingTransaction.id, payload); showToast('Transaksi berhasil diperbarui', 'success'); }
      else { await dataService.createTransaction(payload); showToast('Transaksi berhasil dicatat', 'success'); }
      setIsModalOpen(false); fetchData();
    } catch { showToast('Gagal menyimpan transaksi', 'error'); }
    finally { setIsSubmitting(false); }
  };

  const totalLunas = transactions.reduce((acc, t) => t.status === 'Paid' ? acc + t.amount : acc, 0);
  const totalTertunda = transactions.reduce((acc, t) => t.status === 'Pending' ? acc + t.amount : acc, 0);

  const filteredTrans = transactions.filter(t =>
    t.santri?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="page-header">Keuangan Pesantren</h1>
          <p className="text-sm text-slate-500 mt-0.5">Kelola pencatatan keuangan dan tagihan santri</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="btn-secondary">
            <Download size={15} /> Cetak
          </button>
          <button onClick={() => handleOpenModal()} className="btn-primary">
            <Plus size={15} /> Catat Transaksi
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:hidden">
        <div className="card p-4 flex items-center gap-4">
          <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <CreditCard size={20} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Pembayaran Lunas</p>
            <p className="text-xl font-bold text-slate-900">Rp {totalLunas.toLocaleString('id-ID')}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Clock size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Tagihan Tertunda</p>
            <p className="text-xl font-bold text-slate-900">Rp {totalTertunda.toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden print:border-none print:shadow-none">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-50 print:hidden">
          <h3 className="section-title">Riwayat Transaksi</h3>
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Cari santri atau kategori..."
              className="input-field pl-9 text-sm" value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Tanggal</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Santri</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Kategori</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Jumlah</th>
                <th className="px-5 py-3 text-center text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wider print:hidden">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center">
                  <Loader2 size={22} className="animate-spin text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Memuat data keuangan...</p>
                </td></tr>
              ) : filteredTrans.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400">
                  Belum ada data transaksi.
                </td></tr>
              ) : filteredTrans.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-xs text-slate-500 font-mono whitespace-nowrap">
                    {format(new Date(t.date + 'T00:00:00'), 'dd MMM yyyy', { locale: id })}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold text-slate-800">{t.santri?.name}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="text-sm text-slate-600">{t.type}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-sm font-bold text-slate-800">Rp {t.amount.toLocaleString('id-ID')}</span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={cn(t.status === 'Paid' ? 'badge-green' : 'badge-amber')}>
                      {t.status === 'Paid' ? 'Lunas' : 'Tertunda'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right print:hidden">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleOpenModal(t)}
                        className="p-2 rounded-lg text-slate-400 hover:text-[#1e3a5f] hover:bg-blue-50 transition-colors">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(t.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        title={editingTransaction ? 'Edit Transaksi' : 'Catat Transaksi Baru'}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="form-label">Pilih Santri</label>
            <select required className="input-field" value={formData.santri_id}
              onChange={(e) => setFormData({ ...formData, santri_id: e.target.value })}>
              <option value="">Pilih santri...</option>
              {santri.map(s => <option key={s.id} value={s.id}>{s.name} ({s.nis})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Kategori</label>
              <select className="input-field" value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                <option value="SPP Bulanan">SPP Bulanan</option>
                <option value="Uang Gedung">Uang Gedung</option>
                <option value="Kegiatan">Kegiatan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="form-label">Status</label>
              <select className="input-field" value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="Paid">Lunas</option>
                <option value="Pending">Tertunda</option>
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">Jumlah (Rp)</label>
            <input type="number" required className="input-field" placeholder="0" value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Catatan</label>
            <textarea className="input-field" rows={2} value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })} />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">Batal</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
              {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : null}
              {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}
            </button>
          </div>
        </form>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => {}} />}
    </div>
  );
}
