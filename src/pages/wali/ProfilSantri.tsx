import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { User, MapPin, Award, Shield, UserCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProfilSantri() {
  const { user } = useAuth();
  const [santri, setSantri] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSantri();
  }, []);

  const fetchSantri = async () => {
    try {
      const { data, error } = await supabase.from('santri').select('*').eq('wali_id', user?.id);
      if (error) throw error;
      setSantri(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-400 text-center">Memuat profil...</div>;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Profil Santri</h1>
          <p className="text-sm text-slate-500 mt-0.5">Informasi identitas dan status akademik santri</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {santri.length === 0 ? (
          <div className="col-span-full card p-16 text-center">
            <UserCircle size={64} className="mx-auto text-slate-200 mb-4" />
            <p className="text-sm font-bold text-slate-500">Santri Belum Terhubung</p>
            <p className="text-xs text-slate-400 mt-1">Belum ada data santri yang dihubungkan dengan akun Anda.</p>
          </div>
        ) : (
          santri.map(s => (
            <motion.div key={s.id} whileHover={{ y: -4 }} className="card overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="h-24 bg-[#1e3a5f] relative"></div>
              <div className="px-6 pb-8 -mt-12 relative z-10 text-center">
                <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 p-1 shadow-sm border border-slate-100 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-3xl font-bold text-slate-400">
                    {s.name.charAt(0)}
                  </div>
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-1">{s.name}</h2>
                <div className="inline-flex items-center px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                  <p className="text-xs font-mono text-slate-500">NIS: {s.nis}</p>
                </div>
                
                <div className="mt-8 space-y-3 text-left">
                  <div className="flex items-center p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400 mr-4 shadow-sm">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Jenis Kelamin</p>
                      <p className="text-sm font-semibold text-slate-700">{s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400 mr-4 shadow-sm">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Alamat</p>
                      <p className="text-sm font-semibold text-slate-700 truncate max-w-[200px]">{s.address || 'Belum diisi'}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400 mr-4 shadow-sm">
                      <Award size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Tipe Santri</p>
                      <p className="text-sm font-semibold text-slate-700">{s.type}</p>
                    </div>
                  </div>

                   <div className="flex items-center p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400 mr-4 shadow-sm">
                      <Shield size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Kelas</p>
                      <p className="text-sm font-semibold text-slate-700">{s.class_name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
