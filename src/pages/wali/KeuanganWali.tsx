import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { dataService } from '../../services/data';
import { supabase } from '../../lib/supabase';
import { CreditCard, History, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { motion } from 'motion/react';

export default function KeuanganWali() {
  const { user, loading: authLoading } = useAuth();
  const [santri, setSantri] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetchData();
  }, [user?.id]);

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      const { data: santriData } = await supabase.from('santri').select('id').eq('wali_id', user.id);
      if (santriData && santriData.length > 0) {
        setSantri(santriData);
        const santriIds = santriData.map(s => s.id);
        const { data: transData } = await supabase.from('transactions').select('*, santri(name)').in('santri_id', santriIds).order('date', { ascending: false });
        setTransactions(transData || []);
      }
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  if (authLoading || loading) {
    return <div className="p-8 flex justify-center text-slate-400 text-sm">Memuat data keuangan...</div>;
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Informasi Keuangan</h1>
          <p className="text-sm text-slate-500 mt-0.5">Pantau status pembayaran dan tagihan santri</p>
        </div>
      </div>

       <div className="card p-5 bg-yellow-50 border-yellow-100 text-slate-700">
         <div className="flex items-start gap-4">
           <div className="w-11 h-11 rounded-2xl bg-yellow-100 text-yellow-700 flex items-center justify-center">
             <Clock size={22} />
           </div>
           <div>
             <p className="text-sm font-bold">Fitur Pembayaran SPP</p>
             <p className="text-sm text-slate-600 mt-1">Sistem pembayaran SPP online saat ini masih dalam tahap pengembangan dan belum tersedia untuk umum.</p>
           </div>
         </div>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <motion.div whileHover={{ y: -4 }} className="card p-6 flex items-center gap-6">
           <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center flex-shrink-0">
             <CreditCard size={28} />
           </div>
           <div>
              <p className="text-xs font-bold">Pembayaran SPP Bulanan</p>
              <p className="text-xs text-slate-400 mt-1">Sistem pembayaran SPP online santri</p>
             <h3 className="text-2xl font-bold text-slate-800">Dalam Pengembangan</h3>
           </div>
         </motion.div>
         
         <motion.div whileHover={{ y: -4 }} className="card p-6 flex items-center gap-6">
           <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center flex-shrink-0">
             <Clock size={28} />
           </div>
           <div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Konfirmasi Pembayaran</p>
             <h3 className="text-2xl font-bold text-slate-800">Hubungi Admin</h3>
           </div>
         </motion.div>
       </div>

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#1e3a5f] text-white rounded-lg flex items-center justify-center">
              <History size={18} />
             </div>
             <h3 className="text-lg font-bold text-slate-800">Riwayat Transaksi</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
             <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Tanggal</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Santri</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Kategori</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Jumlah</th>
                <th className="px-5 py-3 text-center text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {loading ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-400 text-sm">Memuat riwayat transaksi...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-400 text-sm">Belum ada riwayat transaksi.</td></tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                       <span className="text-xs text-slate-500 font-mono">
                         {format(new Date(t.date), 'dd MMM yyyy', { locale: localeId })}
                       </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                       <p className="text-sm font-semibold text-slate-800">{t.santri?.name}</p>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm text-slate-600">
                      {t.type}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                       <span className="text-sm font-bold text-slate-800">
                         Rp {t.amount.toLocaleString('id-ID')}
                       </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-center">
                       <span className={cn("px-3 py-1 rounded text-xs font-bold",
                        t.status === 'Paid' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      )}>
                        {t.status === 'Paid' ? 'Lunas' : 'Menunggu'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
