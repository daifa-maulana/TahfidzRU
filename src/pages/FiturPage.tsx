import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Users, 
  ChevronRight,
  Star,
  GraduationCap,
  ClipboardCheck
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';

export default function FiturPage() {
  return (
    <div className="min-h-screen bg-mesh text-slate-800 font-sans">
      <PublicNavbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-display font-black text-pesantren-dark mb-6 tracking-tight">Fitur Unggulan</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">Platform terintegrasi untuk menghubungkan santri, pengajar, dan wali santri dalam satu lingkungan digital yang nyaman.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: 'Monitor Hafalan', desc: 'Pantau pencapaian setoran tahfidz dan murojaah setiap hari secara detail.', color: 'pesantren-green' },
              { icon: Users, title: 'Koneksi Wali', desc: 'Akses transparan bagi orang tua untuk melihat perkembangan anak di pondok.', color: 'pesantren-blue' },
              { icon: ClipboardCheck, title: 'Presensi Otomatis', desc: 'Pencatatan kehadiran kelas dan kegiatan pesantren secara akurat.', color: 'pesantren-yellow' },
              { icon: GraduationCap, title: 'Rapor Akademik', desc: 'Sistem penilaian komprehensif untuk kurikulum diniyah dan formal.', color: 'pesantren-red' },
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="glass-panel p-10 hover:bg-white/80 transition-all duration-500 relative group"
              >
                <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-lg bg-${f.color} group-hover:scale-110 transition-transform duration-500`}>
                  <f.icon size={36} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-pesantren-dark mb-4">{f.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed">{f.desc}</p>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${f.color} opacity-10 rounded-bl-[100px] -z-10`}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 bg-white border-t-4 border-pesantren-green">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-medium text-slate-500">© 2026 Pondok Pesantren Roudlotul 'Ulum</p>
        </div>
      </footer>
    </div>
  );
}