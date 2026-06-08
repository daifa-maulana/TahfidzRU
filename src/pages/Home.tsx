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
    title: 'Khusus Santri Putri',
    desc: 'Lingkungan khusus putri dengan pembinaan akhlak dan kedisiplinan Islami.',
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
      <footer className="py-20 bg-white border-t-4 border-pesantren-green relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-4 mb-8">
                <img src="/logo.png" alt="Logo" className="w-16 h-16 rounded-full bg-white p-1 shadow-lg object-contain" onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=RU&background=A4C95A&color=fff'; }} />
                <div>
                  <span className="text-3xl font-display font-extrabold text-pesantren-dark tracking-tight">Roudlotul 'Ulum</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] block mt-1">{CAMPUS_SUBTITLE}</span>
                </div>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed max-w-md mb-8">
                Mencetak generasi penghafal Al-Qur'an yang berakhlak mulia, unggul dalam ilmu pengetahuan, dan siap menghadapi tantangan zaman.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center hover:bg-pesantren-blue hover:text-white transition-all shadow-sm"><Instagram size={20} /></a>
                <a href="#" className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center hover:bg-pesantren-red hover:text-white transition-all shadow-sm"><Mail size={20} /></a>
                <a href="#" className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center hover:bg-pesantren-green hover:text-white transition-all shadow-sm"><Phone size={20} /></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold text-pesantren-dark mb-6">Navigasi</h4>
              <ul className="space-y-4 font-medium text-slate-600">
                <li><Link to="/" className="hover:text-pesantren-blue transition-colors">Beranda</Link></li>
                <li><Link to="/fitur" className="hover:text-pesantren-blue transition-colors">Fitur</Link></li>
                <li><Link to="/tentang" className="hover:text-pesantren-blue transition-colors">Tentang</Link></li>
                <li><Link to="/agenda" className="hover:text-pesantren-blue transition-colors">Agenda</Link></li>
                <li><Link to="/login" className="hover:text-pesantren-blue transition-colors">Portal Masuk</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-pesantren-dark mb-6">Hubungi Kami</h4>
              <ul className="space-y-4 font-medium text-slate-600">
                <li className="flex items-start gap-3">
                  <MapPin size={20} className="text-pesantren-red flex-shrink-0 mt-1" />
                  <span>Cihanjjuang Parongpong KBB, Jawa Barat</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={20} className="text-pesantren-green flex-shrink-0" />
                  <span>(022) 1234567</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium text-slate-500">
            <p>© 2026 {CAMPUS_FULL_NAME}. Hak Cipta Dilindungi.</p>
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full">
               <Shield size={16} className="text-pesantren-green" />
               <span>Sistem Terenkripsi & Aman</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
