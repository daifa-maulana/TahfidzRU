import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { BookOpen, Printer, ArrowLeft, Award, Star } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export default function TahfidzDiploma() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [santri, setSantri] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSantri() {
      try {
        const { data, error } = await supabase
          .from('santri')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setSantri(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchSantri();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Menyiapkan Ijazah...</div>;
  if (!santri) return <div className="p-8 text-center text-rose-500">Data santri tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 print:p-0 print:bg-white">
      {/* Action Bar */}
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between print:hidden">
        <button onClick={() => navigate(-1)} className="btn-secondary">
          <ArrowLeft size={16} /> Kembali
        </button>
        <button onClick={handlePrint} className="btn-primary">
          <Printer size={16} /> Cetak Ijazah
        </button>
      </div>

      {/* Diploma Card */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border-[12px] border-double border-slate-900 p-12 md:p-20 text-center relative print:border-slate-800 print:shadow-none shadow-xl min-h-[900px] flex flex-col justify-center">
          
          {/* Header */}
          <div className="mb-16">
            <div className="w-24 h-24 bg-[#1e3a5f] text-white rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-3 shadow-lg">
              <BookOpen size={48} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-widest mb-2">Pondok Pesantren Tahfidz</h1>
            <h2 className="text-5xl font-black text-[#1e3a5f] uppercase tracking-tighter mb-8">Roudhlatul Ulum</h2>
            
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-slate-300"></div>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Ijazah Kehormatan</span>
              <div className="h-px w-16 bg-slate-300"></div>
            </div>
          </div>

          {/* Body */}
          <div className="max-w-2xl mx-auto space-y-8">
            <p className="text-lg text-slate-600 leading-relaxed">
              Dengan penuh rasa syukur dan bangga, kami menganugerahkan ijazah ini kepada:
            </p>
            
            <div className="py-4">
              <h3 className="text-4xl font-bold text-slate-900 uppercase mb-2">
                {santri.name}
              </h3>
              <p className="text-sm text-slate-500 font-mono">NIS: {santri.nis}</p>
            </div>

            <p className="text-lg text-slate-700 leading-relaxed italic">
              "Atas dedikasi, ketekunan, dan pencapaian luar biasa dalam menghafal dan menjaga ayat-ayat suci Al-Qur'an."
            </p>

            <div className="flex items-center justify-center gap-12 pt-8">
              <div className="flex flex-col items-center">
                <Star className="text-amber-400 mb-2" size={32} fill="currentColor" />
                <span className="text-xs font-bold text-slate-500 uppercase">Mumtaz</span>
              </div>
              <div className="flex flex-col items-center">
                <Award className="text-[#1e3a5f] mb-2" size={48} />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">Tersertifikasi</span>
              </div>
              <div className="flex flex-col items-center">
                <Star className="text-amber-400 mb-2" size={32} fill="currentColor" />
                <span className="text-xs font-bold text-slate-500 uppercase">Hafiz</span>
              </div>
            </div>
          </div>

          {/* Footer / Signature */}
          <div className="mt-24 flex justify-between items-end px-8">
            <div className="text-left">
              <p className="text-xs text-slate-500 mb-16">Diterbitkan di Jember</p>
              <div className="border-t border-slate-900 pt-2 px-4">
                <p className="text-sm font-bold text-slate-900">Pengasuh Pesantren</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-500 mb-16">Tanggal: {format(new Date(), 'dd MMMM yyyy', { locale: localeId })}</p>
              <div className="border-t border-slate-900 pt-2 px-4">
                <p className="text-sm font-bold text-slate-900">Dewan Asatidz</p>
              </div>
            </div>
          </div>

          {/* Watermark Logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
            <BookOpen size={600} />
          </div>
        </div>
      </div>
    </div>
  );
}
