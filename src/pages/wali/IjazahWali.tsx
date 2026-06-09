import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { BookOpen, Award, Star, Printer, ArrowLeft, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

export default function IjazahWali() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ijazahList, setIjazahList] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    async function fetch() {
      try {
        // Get all santri belonging to this wali
        const { data: santriData } = await supabase
          .from('santri')
          .select('id, name, nis')
          .eq('wali_id', user!.id);

        if (!santriData || santriData.length === 0) { setLoading(false); return; }

        const santriIds = santriData.map((s: any) => s.id);

        // Get published ijazah for those santri
        const { data: ijazahData } = await supabase
          .from('ijazah')
          .select('*, santri:santri_id(name, nis)')
          .in('santri_id', santriIds)
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        setIjazahList(ijazahData || []);
        if (ijazahData && ijazahData.length > 0) setSelected(ijazahData[0]);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetch();
  }, [user?.id]);

  if (loading) return <div className="flex h-96 items-center justify-center text-slate-400">Memuat ijazah...</div>;

  if (ijazahList.length === 0) {
    return (
      <div className="space-y-6 pb-10">
        <button onClick={() => navigate(-1)} className="btn-secondary">
          <ArrowLeft size={16} /> Kembali
        </button>
        <div className="card p-16 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Award className="text-slate-300" size={40} />
          </div>
          <h2 className="text-lg font-bold text-slate-700 mb-2">Belum Ada Ijazah</h2>
          <p className="text-sm text-slate-500 max-w-sm">
            Ijazah ananda belum tersedia atau belum diterbitkan oleh pihak pesantren. Silakan hubungi admin untuk informasi lebih lanjut.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button onClick={() => navigate(-1)} className="btn-secondary mb-2">
            <ArrowLeft size={16} /> Kembali
          </button>
          <h1 className="page-header">Ijazah Ananda</h1>
          <p className="text-sm text-slate-500">Dokumen resmi yang diterbitkan oleh pesantren</p>
        </div>
        <div className="flex gap-2">
          {ijazahList.length > 1 && (
            <select className="input-field" onChange={e => {
              const found = ijazahList.find(i => i.id === e.target.value);
              setSelected(found);
            }}>
              {ijazahList.map(i => (
                <option key={i.id} value={i.id}>{i.santri?.name} – {i.title}</option>
              ))}
            </select>
          )}
          <button onClick={() => window.print()} className="btn-primary print:hidden">
            <Printer size={16} /> Cetak
          </button>
        </div>
      </div>

      {selected && (
        <div className="max-w-4xl mx-auto">
          {/* Issued date badge */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 print:hidden">
            <Clock size={13} />
            Diterbitkan pada {format(new Date(selected.issue_date || selected.created_at), 'dd MMMM yyyy', { locale: localeId })}
          </div>

          {/* Diploma */}
          <div className="bg-white border-[12px] border-double border-slate-900 p-10 md:p-16 text-center relative shadow-xl min-h-[800px] flex flex-col justify-between print:border-slate-800 print:shadow-none">

            {/* Header */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-[#1e3a5f] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 shadow-lg">
                <BookOpen size={40} />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 uppercase tracking-widest mb-1">
                Pondok Pesantren Tahfidz
              </h1>
              <h2 className="text-4xl md:text-5xl font-black text-[#1e3a5f] uppercase tracking-tighter mb-6">
                Roudhlatul Ulum
              </h2>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-16 bg-slate-300" />
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Ijazah Kehormatan</span>
                <div className="h-px w-16 bg-slate-300" />
              </div>
            </div>

            {/* Body */}
            <div className="max-w-xl mx-auto space-y-5 flex-1 flex flex-col justify-center">
              <p className="text-base text-slate-600 leading-relaxed">
                Dengan penuh rasa syukur dan bangga, kami menganugerahkan ijazah ini kepada:
              </p>
              <div className="py-4 border-y border-slate-100">
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 uppercase mb-2">
                  {selected.santri?.name}
                </h3>
                <p className="text-sm text-slate-500 font-mono">NIS: {selected.santri?.nis}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Program</p>
                <p className="text-base font-bold text-[#1e3a5f]">{selected.title}</p>
              </div>
              <p className="text-sm md:text-base text-slate-700 leading-relaxed italic">
                "{selected.pencapaian}"
              </p>
              <div className="flex items-center justify-center gap-10 pt-2">
                <div className="flex flex-col items-center">
                  <Star className="text-amber-400 mb-1" size={28} fill="currentColor" />
                  <span className="text-xs font-bold text-slate-500 uppercase">{selected.predikat}</span>
                </div>
                <div className="flex flex-col items-center">
                  <Award className="text-[#1e3a5f] mb-1" size={44} />
                  <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Tersertifikasi</span>
                </div>
                <div className="flex flex-col items-center">
                  <Star className="text-amber-400 mb-1" size={28} fill="currentColor" />
                  <span className="text-xs font-bold text-slate-500 uppercase">{selected.predikat}</span>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="mt-12 flex justify-between items-end px-8">
              <div className="text-center w-48">
                <p className="text-xs text-slate-500 mb-14">{selected.left_sign_title}</p>
                <div className="border-t border-slate-900 pt-2">
                  <p className="text-sm font-bold text-slate-900 whitespace-nowrap">{selected.left_sign_name}</p>
                </div>
              </div>
              <div className="text-center w-48">
                <p className="text-xs text-slate-500 mb-14">
                  {selected.location},<br />
                  {format(new Date(selected.issue_date || selected.created_at), 'dd MMMM yyyy', { locale: localeId })}<br />
                  {selected.right_sign_title}
                </p>
                <div className="border-t border-slate-900 pt-2">
                  <p className="text-sm font-bold text-slate-900 whitespace-nowrap">{selected.right_sign_name}</p>
                </div>
              </div>
            </div>

            {/* Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
              <BookOpen size={500} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
