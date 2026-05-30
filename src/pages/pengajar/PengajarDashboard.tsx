import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/data';
import { BookOpen, ClipboardCheck, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { id as localeId } from 'date-fns/locale';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function PengajarDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await dataService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Portal Pengajar</h1>
          <p className="text-sm text-slate-500 mt-0.5">Kelola absensi dan setoran hafalan santri hari ini</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/pengajar/absensi" className="group">
          <motion.div whileHover={{ y: -4 }} className="card p-8 flex flex-col items-center text-center hover:shadow-lg hover:border-slate-300 transition-all">
            <div className="w-16 h-16 bg-[#1e3a5f] rounded-2xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform">
              <ClipboardCheck size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-[#1e3a5f] transition-colors">Absensi Kelas</h3>
            <p className="text-sm text-slate-500">Catat kehadiran santri pada sesi belajar</p>
          </motion.div>
        </Link>

        <Link to="/pengajar/tahfidz" className="group">
          <motion.div whileHover={{ y: -4 }} className="card p-8 flex flex-col items-center text-center hover:shadow-lg hover:border-slate-300 transition-all">
            <div className="w-16 h-16 bg-[#1e3a5f] rounded-2xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform">
              <BookOpen size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-[#1e3a5f] transition-colors">Setoran Tahfidz</h3>
            <p className="text-sm text-slate-500">Input dan evaluasi hafalan Al-Qur'an santri</p>
          </motion.div>
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Setoran Terakhir Hari Ini</h3>
            <p className="text-xs text-slate-500 mt-1">Sesi • {format(new Date(), 'dd MMMM yyyy', { locale: localeId })}</p>
          </div>
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
            <Clock size={20} />
          </div>
        </div>
        
        <div className="p-5">
          {loading ? (
            <div className="text-center py-10 text-slate-400 text-sm">Memuat riwayat...</div>
          ) : stats?.recentTahfidz?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {stats.recentTahfidz.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#1e3a5f] text-white rounded-lg flex items-center justify-center font-bold">
                      {item.santri?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{item.santri?.name}</p>
                      <p className="text-xs text-slate-500">{item.surah} • Ayat {item.from_ayat}-{item.to_ayat}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold uppercase tracking-wider block mb-1">{item.fluency}</span>
                    <span className="text-[10px] text-slate-400">{format(new Date(item.created_at), 'HH:mm')}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <BookOpen size={40} className="mx-auto text-slate-200 mb-3" />
              <p className="text-sm font-medium">Belum ada aktivitas setoran hari ini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
