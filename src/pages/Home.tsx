import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Phone,
  Mail,
  Instagram,
  Shield,
  MapPin,
  BookOpen,
  GraduationCap,
  Users,
  ChevronRight,
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import HeroSlider from '../components/HeroSlider';
import PublicFooter from '../components/PublicFooter';
import { CAMPUS_FULL_NAME, CAMPUS_SUBTITLE } from '../constants/campus';

const HIGHLIGHTS = [
  {
    icon: BookOpen,
    title: 'Program Tahfidz Mutqin',
    desc: 'Metode hafalan intensif dengan muraja\'ah harian dan bimbingan ustadz.',
    color: 'bg-pesantren-green/15 text-pesantren-dark border-pesantren-green/25',
  },
  {
    icon: GraduationCap,
    title: 'Pendidikan Terpadu',
    desc: 'Integrasi ilmu diniyah salaf dan pendidikan formal nasional.',
    color: 'bg-pesantren-blue/15 text-[#0d557c] border-pesantren-blue/25',
  },
  {
    icon: Users,
    title: 'Khusus Santri Putra',
    desc: 'Lingkungan khusus putra dengan pembinaan akhlak dan kedisiplinan Islami.',
    color: 'bg-pesantren-yellow/20 text-[#7a6a00] border-pesantren-yellow/30',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-mesh text-slate-800 font-sans selection:bg-pesantren-green/30 overflow-x-hidden">
      <PublicNavbar transparent />

      <HeroSlider />

      {/* Profil singkat */}
      <section className="py-20 px-6 bg-white relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-black uppercase tracking-widest text-pesantren-green mb-3">
              Profil Pesantren
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-black text-pesantren-dark mb-4">
              {CAMPUS_FULL_NAME}
            </h2>
            <p className="text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Berdiri di Cihanjuang, Parongpong, Kabupaten Bandung Barat di bawah naungan
              Yayasan Ubaydillah Al Bisyri. Kami berkomitmen mencetak generasi Qur&apos;ani
              yang berpegang teguh pada nilai salafus shalih.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {HIGHLIGHTS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-8 rounded-3xl border ${item.color} hover:-translate-y-1 transition-transform duration-300`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center mb-5 shadow-sm">
                  <item.icon size={24} />
                </div>
                <h3 className="text-lg font-black text-pesantren-dark mb-2">{item.title}</h3>
                <p className="text-slate-600 font-medium text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/galeri"
              className="px-8 py-4 bg-pesantren-dark text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-pesantren-green hover:text-pesantren-dark transition-all"
            >
              Lihat Galeri Foto
              <ChevronRight size={18} />
            </Link>
            <Link
              to="/agenda"
              className="px-8 py-4 bg-white text-pesantren-dark border-2 border-pesantren-green/30 rounded-2xl font-bold flex items-center justify-center hover:border-pesantren-green transition-all"
            >
              Agenda Kegiatan
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
