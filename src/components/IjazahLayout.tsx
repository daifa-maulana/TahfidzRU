import React from 'react';
import { Award, Calendar, User, ShieldCheck, Download } from 'lucide-react';
import { cn } from '../utils/cn';

interface IjazahProps {
  santriName: string;
  nis: string;
  title: string;
  date: string;
  certificateId: string;
}

export function IjazahLayout({ santriName, nis, title, date, certificateId }: IjazahProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white border-[16px] border-primary p-12 shadow-2xl relative overflow-hidden">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-24 h-24 border-t-8 border-l-8 border-amber-400 -translate-x-4 -translate-y-4"></div>
      <div className="absolute top-0 right-0 w-24 h-24 border-t-8 border-r-8 border-amber-400 translate-x-4 -translate-y-4"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 border-b-8 border-l-8 border-amber-400 -translate-x-4 translate-y-4"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 border-b-8 border-r-8 border-amber-400 translate-x-4 translate-y-4"></div>

      <div className="text-center space-y-8 relative z-10">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center">
            <Award size={48} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-widest uppercase">Sertifikat Kelulusan</h1>
          <p className="text-amber-600 font-bold tracking-[0.3em] uppercase text-sm">Roudhlatul Ulum Tahfidz</p>
        </div>

        <div className="py-8">
          <p className="text-slate-500 italic font-serif">Diberikan Khusus Kepada:</p>
          <h2 className="text-5xl font-serif font-black text-slate-800 mt-4 border-b-2 border-slate-100 inline-block px-8">{santriName}</h2>
          <p className="text-slate-400 mt-2 font-mono font-bold tracking-widest">NIS: {nis}</p>
        </div>

        <div className="max-w-xl mx-auto">
          <p className="text-slate-600 leading-loose">
            Telah menyelesaikan program tahfidz dengan predikat <span className="font-bold text-slate-900">MUMTAZ</span> pada program <span className="font-bold text-slate-900">{title}</span>. 
            Semoga ilmu yang didapatkan menjadi berkah bagi agama, nusa, dan bangsa.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-12 pt-12">
          <div className="text-center">
            <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-12">Tanggal Terbit</p>
            <p className="text-slate-800 font-bold border-t border-slate-200 pt-2">{date}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-12">Pimpinan Pesantren</p>
            <div className="flex flex-col items-center">
               <div className="w-24 h-1 bg-slate-200 mb-2"></div>
               <p className="text-slate-800 font-bold">K.H. Ahmad Dahlan, M.A.</p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex items-center justify-center space-x-2 text-[10px] text-slate-300 font-mono">
          <ShieldCheck size={12} />
          <span>VERIFIED ID: {certificateId}</span>
        </div>
      </div>

      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
        <Award size={600} />
      </div>
    </div>
  );
}
