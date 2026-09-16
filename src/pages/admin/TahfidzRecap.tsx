import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/data';
import { 
  BookOpen, 
  Loader2, 
  BarChart3, 
  Search, 
  User, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Layers, 
  ListFilter,
  Award,
  Sparkles
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Toast';

export default function TahfidzRecap() {
  const [recapPeriod, setRecapPeriod] = useState<'month' | 'year'>('month');
  const [recapMonth, setRecapMonth] = useState(new Date().getMonth() + 1);
  const [recapYear, setRecapYear] = useState(new Date().getFullYear());
  const [recapData, setRecapData] = useState<any[]>([]);
  const [recapLoading, setRecapLoading] = useState(false);

  // View & Filter States
  const [viewMode, setViewMode] = useState<'per-santri' | 'semua-riwayat'>('per-santri');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSantri, setExpandedSantri] = useState<Record<string, boolean>>({});

  const { toast, showToast } = useToast();

  const fetchRecap = async () => {
    setRecapLoading(true);
    try {
      const data = await dataService.getTahfidzRecap(recapPeriod, recapYear, recapPeriod === 'month' ? recapMonth : undefined);
      setRecapData(data || []);
    } catch { 
      showToast('Gagal memuat rekap setoran. Periksa koneksi.', 'error'); 
    } finally { 
      setRecapLoading(false); 
    }
  };

  useEffect(() => { 
    fetchRecap(); 
  }, []);

  const toggleExpand = (santriId: string) => {
    setExpandedSantri((prev) => ({
      ...prev,
      [santriId]: !prev[santriId],
    }));
  };

  // Grouping Data Per Santri
  const groupedData = React.useMemo(() => {
    const map: Record<string, {
      santri: any;
      logs: any[];
      totalBaru: number;
      totalMurojaah: number;
      totalPages: number;
      latestSurah: string;
      latestFluency: string;
    }> = {};

    recapData.forEach((log) => {
      const sid = log.santri_id || log.santri?.id || log.santri?.name || 'unknown';
      if (!map[sid]) {
        map[sid] = {
          santri: log.santri || { name: 'Santri', nis: '-' },
          logs: [],
          totalBaru: 0,
          totalMurojaah: 0,
          totalPages: 0,
          latestSurah: '-',
          latestFluency: '-',
        };
      }

      map[sid].logs.push(log);
      if (log.type === 'Setoran Baru') map[sid].totalBaru++;
      else map[sid].totalMurojaah++;

      const pages = log.from_ayat && log.to_ayat ? Math.max(1, log.to_ayat - log.from_ayat + 1) : 1;
      map[sid].totalPages += pages;
    });

    // Determine latest surah per santri
    Object.values(map).forEach((group) => {
      if (group.logs.length > 0) {
        const sorted = [...group.logs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const latest = sorted[0];
        group.latestSurah = `${latest.surah || ''} (${latest.from_ayat || ''}-${latest.to_ayat || ''})`;
        group.latestFluency = latest.fluency || '-';
      }
    });

    return Object.values(map);
  }, [recapData]);

  // Filtered lists
  const filteredGrouped = groupedData.filter((g) => {
    const sName = g.santri?.name?.toLowerCase() || '';
    const sNis = g.santri?.nis?.toLowerCase() || '';
    const query = searchTerm.toLowerCase();
    return sName.includes(query) || sNis.includes(query);
  });

  const filteredFlatLogs = recapData.filter((r) => {
    const sName = r.santri?.name?.toLowerCase() || '';
    const sNis = r.santri?.nis?.toLowerCase() || '';
    const query = searchTerm.toLowerCase();
    return sName.includes(query) || sNis.includes(query);
  });

  // Summary Metrics
  const totalLogsCount = recapData.length;
  const totalSantriCount = groupedData.length;
  const totalSetoranBaru = recapData.filter(r => r.type === 'Setoran Baru').length;
  const totalMurojaah = recapData.filter(r => r.type === 'Murojaah').length;

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => {}} />}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Rekap Setoran Hafalan</h1>
          <p className="text-sm text-slate-500 mt-0.5">Rekapitulasi capaian hafalan Al-Qur'an santri per bulan atau per tahun</p>
        </div>
      </div>

      {/* Control Card (Filter & View Switcher) */}
      <div className="card p-5 space-y-4 border-[#1e3a5f]/10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <select className="input-field w-auto" value={recapPeriod} onChange={(e) => setRecapPeriod(e.target.value as 'month' | 'year')}>
              <option value="month">Per Bulan</option>
              <option value="year">Per Tahun</option>
            </select>

            {recapPeriod === 'month' && (
              <select className="input-field w-auto" value={recapMonth} onChange={(e) => setRecapMonth(Number(e.target.value))}>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{format(new Date(2000, i, 1), 'MMMM', { locale: id })}</option>
                ))}
              </select>
            )}

            <input type="number" className="input-field w-28" value={recapYear} onChange={(e) => setRecapYear(Number(e.target.value))} min="2000" max="2100" />

            <button onClick={fetchRecap} className="btn-primary py-2.5">
              {recapLoading ? <Loader2 size={15} className="animate-spin" /> : <BarChart3 size={15} />}
              {recapLoading ? 'Memuat...' : 'Tampilkan Rekap'}
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 border border-slate-200/60">
            <button
              onClick={() => setViewMode('per-santri')}
              className={cn(
                'flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold transition-all',
                viewMode === 'per-santri' ? 'bg-[#1e3a5f] text-white shadow' : 'text-slate-500 hover:text-slate-800'
              )}
            >
              <UsersIcon size={14} /> Per Santri
            </button>
            <button
              onClick={() => setViewMode('semua-riwayat')}
              className={cn(
                'flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold transition-all',
                viewMode === 'semua-riwayat' ? 'bg-[#1e3a5f] text-white shadow' : 'text-slate-500 hover:text-slate-800'
              )}
            >
              <ListFilter size={14} /> Semua Riwayat
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama santri atau NIS..."
            className="input-field pl-10 text-xs py-2.5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Setoran</p>
          <h3 className="text-xl font-bold text-slate-800">{totalLogsCount} Kali</h3>
          <p className="text-[10px] text-slate-400 mt-1">Akumulasi sesi setoran</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] font-bold text-blue-500 uppercase tracking-wider mb-1">Setoran Baru</p>
          <h3 className="text-xl font-bold text-blue-700">{totalSetoranBaru} Kali</h3>
          <p className="text-[10px] text-blue-400 mt-1">Penambahan hafalan baru</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] font-bold text-sky-500 uppercase tracking-wider mb-1">Murojaah</p>
          <h3 className="text-xl font-bold text-sky-700">{totalMurojaah} Kali</h3>
          <p className="text-[10px] text-sky-400 mt-1">Pengulangan hafalan</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider mb-1">Santri Aktif Setor</p>
          <h3 className="text-xl font-bold text-emerald-700">{totalSantriCount} Santri</h3>
          <p className="text-[10px] text-emerald-400 mt-1">Punya catatan setoran</p>
        </div>
      </div>

      {/* Content Rendering based on View Mode */}
      {recapLoading ? (
        <div className="p-12 text-center text-slate-400">
          <Loader2 size={32} className="animate-spin mx-auto mb-2 text-emerald-600" />
          <span>Memuat rekapitulasi setoran...</span>
        </div>
      ) : recapData.length === 0 ? (
        <div className="card p-12 text-center text-slate-400">
          <BookOpen size={40} className="mx-auto text-slate-200 mb-3" />
          <p className="text-sm font-semibold">Belum ada data setoran untuk periode ini</p>
        </div>
      ) : viewMode === 'per-santri' ? (
        /* PER SANTRI GROUPED VIEW */
        <div className="space-y-3">
          {filteredGrouped.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">Tidak ada santri yang cocok dengan pencarian.</div>
          ) : (
            filteredGrouped.map((group, idx) => {
              const sid = group.santri?.id || idx.toString();
              const isExpanded = !!expandedSantri[sid];

              return (
                <div key={sid} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all">
                  {/* Student Card Header */}
                  <div 
                    onClick={() => toggleExpand(sid)}
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center flex-shrink-0 text-sm border border-emerald-100">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                          {group.santri?.name}
                          <span className="text-xs font-mono font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            NIS: {group.santri?.nis || '-'}
                          </span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                          <span>Kelas: <strong>{group.santri?.class_name || '-'}</strong></span>
                          <span>•</span>
                          <span className="text-slate-600 font-medium">Capaian Terakhir: <strong>{group.latestSurah}</strong></span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-100">
                          {group.totalBaru} Setoran Baru
                        </span>
                        <span className="px-2.5 py-1 rounded-xl bg-sky-50 text-sky-700 font-bold border border-sky-100">
                          {group.totalMurojaah} Murojaah
                        </span>
                      </div>
                      <div className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 bg-slate-100/60">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Setoran History Table */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50/50 p-4">
                      <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Layers size={13} className="text-emerald-600" /> Riwayat Setoran {group.santri?.name}
                      </h5>
                      <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="bg-slate-100/80 border-b border-slate-200/80 text-slate-500 text-[10px] uppercase font-bold">
                              <th className="px-3 py-2 text-center">No</th>
                              <th className="px-3 py-2">Surah</th>
                              <th className="px-3 py-2 text-center">Dari Ayat/Hal</th>
                              <th className="px-3 py-2 text-center">Sampai Ayat/Hal</th>
                              <th className="px-3 py-2 text-center">Jenis</th>
                              <th className="px-3 py-2 text-center">Kelancaran</th>
                              <th className="px-3 py-2 text-center">Tanggal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {group.logs.map((log, lIdx) => (
                              <tr key={log.id || lIdx} className="hover:bg-slate-50">
                                <td className="px-3 py-2 text-center font-medium text-slate-400">{lIdx + 1}</td>
                                <td className="px-3 py-2 font-bold text-slate-800">{log.surah}</td>
                                <td className="px-3 py-2 text-center font-medium">{log.from_ayat ?? '-'}</td>
                                <td className="px-3 py-2 text-center font-medium">{log.to_ayat ?? '-'}</td>
                                <td className="px-3 py-2 text-center">
                                  <span className={cn(
                                    'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                                    log.type === 'Setoran Baru'
                                      ? 'bg-blue-50 text-blue-600 border-blue-100'
                                      : 'bg-sky-50 text-sky-600 border-sky-100'
                                  )}>
                                    {log.type}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-center">
                                  <span className={cn(
                                    'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                                    log.fluency === 'Lancar'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                      : log.fluency === 'Cukup'
                                      ? 'bg-amber-50 text-amber-700 border-amber-100'
                                      : 'bg-red-50 text-red-700 border-red-100'
                                  )}>
                                    {log.fluency || '-'}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-center text-slate-500">
                                  {log.created_at ? format(new Date(log.created_at), 'dd MMM yyyy', { locale: id }) : '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* FLAT ALL LOGS TABLE VIEW */
        <div className="card p-5 border-[#1e3a5f]/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-3 py-2.5 text-center text-[10px] font-bold text-slate-500 uppercase border border-slate-200">No</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase border border-slate-200">Santri</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase border border-slate-200">Surah</th>
                  <th className="px-3 py-2.5 text-center text-[10px] font-bold text-slate-500 uppercase border border-slate-200">Dari Ayat/Hal</th>
                  <th className="px-3 py-2.5 text-center text-[10px] font-bold text-slate-500 uppercase border border-slate-200">Sampai Ayat/Hal</th>
                  <th className="px-3 py-2.5 text-center text-[10px] font-bold text-slate-500 uppercase border border-slate-200">Jumlah</th>
                  <th className="px-3 py-2.5 text-center text-[10px] font-bold text-slate-500 uppercase border border-slate-200">Jenis</th>
                  <th className="px-3 py-2.5 text-center text-[10px] font-bold text-slate-500 uppercase border border-slate-200">Skema</th>
                  <th className="px-3 py-2.5 text-center text-[10px] font-bold text-slate-500 uppercase border border-slate-200">Kelancaran</th>
                  <th className="px-3 py-2.5 text-center text-[10px] font-bold text-slate-500 uppercase border border-slate-200">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFlatLogs.map((r: any, idx: number) => {
                  const countAyat = r.from_ayat && r.to_ayat ? Math.max(1, r.to_ayat - r.from_ayat + 1) : '-';
                  return (
                    <tr key={r.id || idx} className="hover:bg-slate-50/50">
                      <td className="px-3 py-2 text-center border border-slate-200 font-medium text-slate-400">{idx + 1}</td>
                      <td className="px-3 py-2 font-semibold text-slate-800 border border-slate-200">
                        {r.santri?.name || '-'} 
                        <span className="text-slate-400 font-mono ml-1.5 text-[10px]">{r.santri?.nis || '-'}</span>
                      </td>
                      <td className="px-3 py-2 text-slate-700 border border-slate-200 font-bold">{r.surah}</td>
                      <td className="px-3 py-2 text-center text-slate-600 border border-slate-200">{r.from_ayat ?? '-'}</td>
                      <td className="px-3 py-2 text-center text-slate-600 border border-slate-200">{r.to_ayat ?? '-'}</td>
                      <td className="px-3 py-2 text-center text-slate-600 border border-slate-200 font-bold">{countAyat}</td>
                      <td className="px-3 py-2 text-center border border-slate-200">
                        <span className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                          r.type === 'Setoran Baru' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-sky-50 text-sky-600 border-sky-100'
                        )}>
                          {r.type}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center text-slate-500 border border-slate-200">
                        {r.setoran_mode === 'per_juz' ? 'Per Juz' : 'Per Halaman'}
                      </td>
                      <td className="px-3 py-2 text-center border border-slate-200">
                        <span className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                          r.fluency === 'Lancar' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : r.fluency === 'Cukup' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-red-50 text-red-700 border-red-100'
                        )}>
                          {r.fluency || '-'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center text-slate-500 border border-slate-200">
                        {r.created_at ? format(new Date(r.created_at), 'dd MMM yyyy', { locale: id }) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function UsersIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
