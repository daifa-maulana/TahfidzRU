import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { ClipboardCheck, Calendar, Loader2, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { motion } from 'motion/react';
import { ABSENSI_SESSIONS } from '../../constants/absensi';

const safeDate = (dateStr: string) => {
  try {
    if (!dateStr) return new Date();
    if (typeof dateStr !== 'string') return new Date();
    if (dateStr.includes('T')) return new Date(dateStr);
    return new Date(dateStr + 'T00:00:00');
  } catch { return new Date(); }
};

export default function AbsensiWali() {
  const { user, loading: authLoading } = useAuth();
  const [santri, setSantri] = useState<any[]>([]);
  const [selectedSantriId, setSelectedSantriId] = useState<string>('');
  const [absensi, setAbsensi] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetchSantri();
  }, [user?.id]);
  useEffect(() => { if (selectedSantriId) fetchAbsensi(selectedSantriId); }, [selectedSantriId]);

  const fetchSantri = async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase.from('santri').select('id, name').eq('wali_id', user.id);
      if (error) throw error;
      setSantri(data || []);
      if (data && data.length > 0) setSelectedSantriId(data[0].id);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const fetchAbsensi = async (id: string) => {
    try {
      const { data, error } = await supabase.from('absensi').select('*').eq('santri_id', id).order('date', { ascending: false }).limit(30);
      if (error) throw error;
      setAbsensi(data || []);
    } catch (error) { console.error(error); }
  };

  if (authLoading || loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-slate-400" /></div>;

  const groupedByDate = absensi.reduce<Record<string, typeof absensi>>((acc, item) => {
    const key = typeof item.date === 'string' ? item.date.split('T')[0] : item.date ? String(item.date) : '';
    if (!key) return acc;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Kehadiran Santri</h1>
          <p className="text-sm text-slate-500 mt-0.5">Pantau absensi harian kegiatan belajar santri</p>
        </div>
        {santri.length > 1 && (
          <div className="relative min-w-[200px]">
            <select className="input-field appearance-none pr-9" value={selectedSantriId} onChange={(e) => setSelectedSantriId(e.target.value)}>
              {santri.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1e3a5f] text-white rounded-lg flex items-center justify-center">
              <Calendar size={18} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Riwayat Presensi</h3>
          </div>
          <span className="text-xs text-slate-500 hidden sm:block">30 hari terakhir</span>
        </div>
        
        <div className="p-5">
          {sortedDates.length === 0 ? (
            <div className="py-16 text-center">
              <ClipboardCheck size={40} className="mx-auto text-slate-200 mb-3" />
              <p className="text-sm font-semibold text-slate-400">Belum ada data kehadiran</p>
              <p className="text-xs text-slate-300 mt-1">Data absensi akan muncul di sini setelah dicatat oleh pengajar.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedDates.map((dateKey) => (
                <motion.div key={dateKey} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <p className="text-sm font-bold text-slate-800 mb-3">
                    {format(safeDate(dateKey), 'EEEE, dd MMM yyyy', { locale: localeId })}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {ABSENSI_SESSIONS.map((sesi) => {
                      const item = groupedByDate[dateKey].find(
                        (a) => (a.session || 'Shubuh') === sesi
                      );
                      return (
                        <div key={sesi} className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-100">
                          <span className="text-xs font-semibold text-slate-500">{sesi}</span>
                          {item ? (
                            <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold",
                              item.status === 'Hadir' ? "bg-emerald-50 text-emerald-600" :
                              item.status === 'Izin' ? "bg-sky-50 text-sky-600" :
                              item.status === 'Sakit' ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                            )}>{item.status}</span>
                          ) : (
                            <span className="text-[10px] text-slate-300">Belum diisi</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
