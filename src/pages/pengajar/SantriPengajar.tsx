import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { dataService } from '../../services/data';
import { Search, Users, Loader2, Award, ChevronUp } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Toast';
import { Modal } from '../../components/Modal';

export default function SantriPengajar() {
  const [santri, setSantri] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast, showToast } = useToast();

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Ya',
    onConfirm: () => {}
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const santriData = await supabase.from('santri').select('*, profiles:wali_id(full_name)').order('name');
      if (santriData.error) throw santriData.error;
      setSantri(santriData.data || []);
    } catch (error: any) {
      showToast('Gagal memuat data: ' + (error.message || 'Error tidak diketahui'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = (s: any) => {
    let nextLevel = '';
    let promptMsg = '';
    if (s.tahfidz_level === 'yanbua') {
      nextLevel = 'binnadzhor';
      promptMsg = `Apakah Anda yakin ingin menaikkan tingkat ${s.name} dari Yanbu'a ke Bin Nadzhor?`;
    } else if (s.tahfidz_level === 'binnadzhor') {
      nextLevel = 'bilghoib';
      promptMsg = `Apakah Anda yakin ingin menaikkan tingkat ${s.name} dari Bin Nadzhor ke Bil Ghoib?`;
    } else {
      showToast('Santri sudah mencapai tingkat tertinggi', 'info');
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Konfirmasi Naik Tingkat',
      message: promptMsg,
      confirmText: 'Ya, Naikkan Tingkat',
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        try {
          await dataService.updateSantri(s.id, { ...s, tahfidz_level: nextLevel });
          showToast(`${s.name} berhasil naik tingkat!`, 'success');
          fetchData();
        } catch (error: any) {
          showToast(error.message || 'Gagal menaikkan tingkat santri', 'error');
        }
      }
    });
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'yanbua': return 'Yanbu\'a';
      case 'binnadzhor': return 'Bin Nadzhor';
      case 'bilghoib': return 'Bil Ghoib';
      default: return level;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'yanbua': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'binnadzhor': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'bilghoib': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const canPromote = (level: string) => {
    return level === 'yanbua' || level === 'binnadzhor';
  };

  const filteredSantri = santri.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.nis.includes(searchTerm);
    return matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-header">Data Santri</h1>
          <p className="text-sm text-slate-500 mt-0.5">Lihat dan kelola tingkatan tahfidz santri</p>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama atau NIS santri..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Santri</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Tipe</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Tingkat Tahfidz</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 size={22} className="animate-spin text-slate-300" />
                    <span className="text-sm text-slate-400">Memuat data santri...</span>
                  </div>
                </td></tr>
              ) : filteredSantri.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Users size={22} className="text-slate-300" />
                    <span className="text-sm text-slate-400">Tidak ada data santri ditemukan</span>
                  </div>
                </td></tr>
              ) : filteredSantri.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1e3a5f] text-white rounded-lg flex items-center justify-center font-bold text-sm">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                        <p className="text-xs text-slate-500">{s.nis}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className={cn(
                      "text-xs font-semibold px-2.5 py-1 rounded-full",
                      s.type === 'Mukim' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    )}>
                      {s.type}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn(
                      "text-xs font-semibold px-3 py-1.5 rounded-lg border",
                      getLevelColor(s.tahfidz_level)
                    )}>
                      {getLevelLabel(s.tahfidz_level)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {canPromote(s.tahfidz_level) && (
                      <button
                        onClick={() => handlePromote(s)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1e3a5f] text-white text-xs font-semibold rounded-lg hover:bg-[#2a4a6f] transition-colors"
                      >
                        <Award size={12} />
                        Naik Tingkat
                      </button>
                    )}
                    {!canPromote(s.tahfidz_level) && (
                      <span className="text-xs text-slate-400 italic">Tingkat tertinggi</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        title={confirmModal.title}
      >
        <p className="text-sm text-slate-600 mb-6">{confirmModal.message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={confirmModal.onConfirm}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#1e3a5f] rounded-lg hover:bg-[#2a4a6f] transition-colors"
          >
            {confirmModal.confirmText}
          </button>
        </div>
      </Modal>

      <Toast toast={toast} />
    </div>
  );
}
