import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Users, 
  ChevronRight, 
  Phone,
  Mail,
  Instagram,
  ClipboardCheck,
  GraduationCap,
  Shield,
  Star,
  MapPin,
  LayoutDashboard
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-mesh text-slate-800 font-sans selection:bg-pesantren-green/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl border-b border-white/50">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-pesantren-yellow rounded-full blur-md opacity-50"></div>
              <img src="/logo.png" alt="Logo" className="w-14 h-14 rounded-full relative z-10 bg-white p-1 object-contain" onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=RU&background=A4C95A&color=fff'; }} />
            </div>
            <div>
              <span className="text-2xl font-display font-extrabold tracking-tight block leading-none text-pesantren-dark">Roudlotul 'Ulum</span>
              <span className="text-[10px] font-bold text-pesantren-blue uppercase tracking-[0.2em] block mt-1">Sistem Informasi Terpadu</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-8 text-sm font-bold text-slate-600">
              <a href="#fitur" className="hover:text-pesantren-green transition-colors">Fitur Unggulan</a>
              <a href="#tentang" className="hover:text-pesantren-green transition-colors">Profil Pesantren</a>
            </div>
            <Link 
              to="/login" 
              className="px-8 py-3 bg-white text-pesantren-dark border-2 border-pesantren-green rounded-xl text-sm font-extrabold hover:bg-pesantren-green hover:shadow-[0_8px_30px_rgba(164,201,90,0.3)] transition-all flex items-center space-x-2 group"
            >
              <span>Masuk Portal</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 flex flex-col items-center">
        <div className="max-w-5xl mx-auto w-full text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-3 px-6 py-2 rounded-full bg-white/80 backdrop-blur border border-white shadow-xl text-pesantren-dark text-xs font-bold uppercase tracking-widest mb-10"
          >
            <Star className="text-pesantren-yellow fill-pesantren-yellow" size={14} />
            <span>Pendidikan Tahfidz Modern Berkualitas</span>
            <Star className="text-pesantren-yellow fill-pesantren-yellow" size={14} />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-6xl md:text-7xl lg:text-[5.5rem] font-display font-black text-pesantren-dark leading-[1.05] tracking-tight mb-8"
          >
            Membangun Generasi <br className="hidden md:block" />
            <span className="relative inline-block">
              <span className="relative z-10 text-pesantren-green">Qur'ani & Berprestasi</span>
              <div className="absolute bottom-2 left-0 w-full h-6 bg-pesantren-yellow/30 -z-0 -rotate-1 rounded-full blur-sm"></div>
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto font-medium"
          >
            Sistem informasi cerdas untuk memantau perkembangan hafalan, akademik, dan kedisiplinan santri secara interaktif.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <Link 
              to="/login" 
              className="px-10 py-5 bg-pesantren-green text-pesantren-dark rounded-[1.5rem] font-black text-lg flex items-center justify-center space-x-3 hover:bg-[#b5db69] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(164,201,90,0.4)] transition-all duration-300"
            >
              <span>Akses Dasbor</span>
              <ChevronRight size={20} />
            </Link>
            <Link 
              to="/register" 
              className="px-10 py-5 bg-white text-pesantren-dark border-2 border-pesantren-green/20 rounded-[1.5rem] font-black text-lg flex items-center justify-center hover:border-pesantren-green hover:shadow-xl transition-all duration-300"
            >
              Pendaftaran Wali
            </Link>
          </motion.div>
        </div>

        {/* Profil Pesantren (Company Profile) */}
        <motion.div
          id="tentang"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 w-full max-w-6xl mx-auto scroll-mt-32 relative z-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative group perspective">
              <div className="absolute -inset-6 bg-gradient-to-r from-pesantren-green to-pesantren-blue opacity-30 blur-3xl rounded-[3rem] group-hover:opacity-60 transition-opacity duration-1000"></div>
              <div className="glass-panel p-10 lg:p-14 relative overflow-hidden transform transition-all duration-700 hover:scale-[1.02] shadow-2xl border-white/80">
                <div className="absolute top-0 right-0 w-64 h-64 bg-pesantren-yellow/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <img 
                  src="/logo.png" 
                  alt="Logo Besar" 
                  className="w-48 h-48 lg:w-56 lg:h-56 mx-auto object-contain drop-shadow-[0_20px_50px_rgba(164,201,90,0.3)] mb-10 relative z-10" 
                  onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                />
                <h3 className="text-3xl font-display font-black text-pesantren-dark mb-6 text-center leading-tight">
                  Yayasan Ubaydillah Al Bisyri
                </h3>
                <p className="text-slate-600 font-medium leading-relaxed text-center text-lg">
                  Berdiri kokoh di Cihanjuang, Parongpong, Kabupaten Bandung Barat. Pondok Pesantren Roudlotul 'Ulum berdedikasi penuh untuk mencetak generasi Qur'ani yang berpegang teguh pada nilai-nilai salafus shalih dengan pendekatan modern dan profesional.
                </p>
              </div>
            </div>

            <div className="space-y-10 lg:pl-8">
              <div className="flex gap-6 items-start">
                <div className="w-16 h-16 rounded-2xl bg-pesantren-yellow/20 border border-pesantren-yellow/30 flex items-center justify-center text-pesantren-dark flex-shrink-0 shadow-sm transform transition-transform hover:scale-110 duration-300">
                  <Star size={32} className="fill-pesantren-yellow text-pesantren-yellow" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-pesantren-dark mb-3">Visi Kami</h4>
                  <p className="text-slate-600 font-medium leading-relaxed text-lg">
                    Menjadi lembaga pendidikan Islam rujukan yang melahirkan para huffadz (penghafal Al-Qur'an) berkarakter pemimpin, cerdas secara intelektual, dan mulia secara spiritual.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6 items-start">
                <div className="w-16 h-16 rounded-2xl bg-pesantren-blue/20 border border-pesantren-blue/30 flex items-center justify-center text-[#0d557c] flex-shrink-0 shadow-sm transform transition-transform hover:scale-110 duration-300">
                  <BookOpen size={32} />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-pesantren-dark mb-3">Misi Unggulan</h4>
                  <ul className="text-slate-600 font-medium leading-relaxed text-lg space-y-3">
                     <li className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-pesantren-blue"></div>
                       Menerapkan metode tahfidz intensif dan mutqin.
                     </li>
                     <li className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-pesantren-blue"></div>
                       Integrasi pendidikan diniyah (salaf) dan nasional.
                     </li>
                     <li className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-pesantren-blue"></div>
                       Membekali santri dengan adab Islami & kemandirian.
                     </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Sejarah & Pimpinan */}
      <section className="py-24 px-6 relative bg-pesantren-dark text-white overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
         <div className="absolute -top-32 -right-32 w-96 h-96 bg-pesantren-green rounded-full blur-[100px] opacity-20"></div>
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div>
                  <h2 className="text-3xl md:text-4xl font-display font-black mb-6 text-pesantren-yellow">Sejarah & Kepengasuhan</h2>
                  <p className="text-slate-300 leading-relaxed mb-6 font-medium text-lg text-justify">
                     Berangkat dari niat suci untuk mencetak generasi Rabbani, Yayasan Ubaydillah Al Bisyri didirikan sebagai wadah pendidikan yang menjunjung tinggi adab dan ilmu. Pondok Pesantren Roudlotul 'Ulum mengadopsi kurikulum salaf (kitab kuning) yang dipadukan dengan metode tahfidz mutqin, tanpa meninggalkan pentingnya ilmu pengetahuan umum (formal).
                  </p>
                  <div className="bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-sm mt-8 transform transition-transform hover:-translate-y-2 duration-300">
                     <h3 className="text-xl font-bold mb-2">Dewan Pengasuh</h3>
                     <p className="text-pesantren-green font-bold text-lg">KH. Ubaydillah Al Bisyri</p>
                     <p className="text-slate-400 text-sm">Pimpinan Yayasan & Pondok Pesantren</p>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-pesantren-green/20 p-6 rounded-3xl border border-pesantren-green/30 text-center hover:bg-pesantren-green/30 transition-colors">
                     <div className="w-12 h-12 mx-auto bg-pesantren-green text-pesantren-dark rounded-full flex items-center justify-center mb-4"><Shield size={24} /></div>
                     <h4 className="font-bold mb-2">Legalitas Resmi</h4>
                     <p className="text-xs text-slate-300">Terdaftar di Kemenag & Lembaga Pendidikan Terkait</p>
                  </div>
                  <div className="bg-pesantren-blue/20 p-6 rounded-3xl border border-pesantren-blue/30 text-center translate-y-8 hover:bg-pesantren-blue/30 transition-colors">
                     <div className="w-12 h-12 mx-auto bg-pesantren-blue text-white rounded-full flex items-center justify-center mb-4"><Users size={24} /></div>
                     <h4 className="font-bold mb-2">Tenaga Pendidik</h4>
                     <p className="text-xs text-slate-300">Lulusan Timur Tengah & Universitas Islam Lokal</p>
                  </div>
                  <div className="bg-pesantren-yellow/20 p-6 rounded-3xl border border-pesantren-yellow/30 text-center hover:bg-pesantren-yellow/30 transition-colors">
                     <div className="w-12 h-12 mx-auto bg-pesantren-yellow text-pesantren-dark rounded-full flex items-center justify-center mb-4"><MapPin size={24} /></div>
                     <h4 className="font-bold mb-2">Lokasi Strategis</h4>
                     <p className="text-xs text-slate-300">Lingkungan sejuk dan asri di Parongpong, Bandung</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Feature Section */}
      <section id="fitur" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-display font-black text-pesantren-dark mb-6 tracking-tight">Ekosistem Pembelajaran</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">Platform terintegrasi untuk menghubungkan santri, pengajar, dan wali santri dalam satu lingkungan digital yang nyaman.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                
                {/* Decorative Accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${f.color} opacity-10 rounded-bl-[100px] -z-10`}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Pendidikan Unggulan */}
      <section className="py-32 px-6 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-black text-pesantren-dark mb-6 tracking-tight">Program Pendidikan Unggulan</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">Sistem pendidikan yang didesain secara komprehensif memadukan keilmuan salaf, tahfidz Al-Qur'an, dan pendidikan formal jenjang MTs & MA.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Tahfidz Al-Qur'an", desc: "Metode ziyadah dan murojaah mutqin dengan target capaian hafalan 30 Juz bersanad.", icon: BookOpen, color: "text-pesantren-green", bg: "bg-pesantren-green/10" },
              { title: "Kajian Kitab Kuning", desc: "Pendalaman fiqih, nahwu, shorof, dan tauhid dengan metode bandongan dan sorogan.", icon: Star, color: "text-pesantren-yellow fill-pesantren-yellow", bg: "bg-pesantren-yellow/10" },
              { title: "Pendidikan Formal", desc: "Kurikulum standar nasional untuk jenjang Madrasah Tsanawiyah (MTs) dan Aliyah (MA).", icon: GraduationCap, color: "text-pesantren-blue", bg: "bg-pesantren-blue/10" }
            ].map((prog, idx) => (
              <motion.div key={idx} whileHover={{ y: -10 }} className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 group relative overflow-hidden">
                <div className={`w-16 h-16 rounded-2xl ${prog.bg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300`}>
                  <prog.icon size={32} className={prog.color} />
                </div>
                <h3 className="text-xl font-bold text-pesantren-dark mb-3">{prog.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{prog.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimoni Section */}
      <section className="py-24 px-6 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white to-slate-50 -z-10"></div>
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-16 items-center">
               <div className="md:w-1/3">
                  <h2 className="text-4xl md:text-5xl font-display font-black text-pesantren-dark mb-6 tracking-tight leading-tight">Apa Kata Mereka?</h2>
                  <p className="text-lg text-slate-600 font-medium mb-8">Ratusan wali santri telah mempercayakan pendidikan putra-putrinya di Pondok Pesantren Roudlotul 'Ulum.</p>
                  <div className="flex gap-2">
                     {[1,2,3,4,5].map(i => <Star key={i} size={24} className="fill-pesantren-yellow text-pesantren-yellow" />)}
                  </div>
               </div>
               <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative">
                     <div className="absolute -top-4 -left-4 w-10 h-10 bg-pesantren-blue rounded-full flex items-center justify-center text-white font-serif text-3xl pt-2 shadow-lg">"</div>
                     <p className="text-slate-600 font-medium italic mb-6 leading-relaxed">"Sistem ini sangat memudahkan saya memantau hafalan anak saya meskipun saya sedang bekerja di luar kota. Sangat transparan dan real-time!"</p>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden border-2 border-pesantren-blue">
                           <img src="https://ui-avatars.com/api/?name=Bapak+Ahmad&background=54B4E5&color=fff" alt="" />
                        </div>
                        <div>
                           <p className="font-bold text-pesantren-dark">Bapak Ahmad</p>
                           <p className="text-xs text-slate-500">Wali Santri Kelas VIII</p>
                        </div>
                     </div>
                  </div>
                  <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative sm:translate-y-8">
                     <div className="absolute -top-4 -left-4 w-10 h-10 bg-pesantren-green rounded-full flex items-center justify-center text-white font-serif text-3xl pt-2 shadow-lg">"</div>
                     <p className="text-slate-600 font-medium italic mb-6 leading-relaxed">"Penilaiannya sangat komprehensif, tidak hanya nilai akademik tapi juga ada nilai adab dan hafalan. Pesantren ini benar-benar mencetak generasi rabbani."</p>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden border-2 border-pesantren-green">
                           <img src="https://ui-avatars.com/api/?name=Ibu+Siti&background=A4C95A&color=fff" alt="" />
                        </div>
                        <div>
                           <p className="font-bold text-pesantren-dark">Ibu Siti Khadijah</p>
                           <p className="text-xs text-slate-500">Wali Santri Kelas X</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Galeri Kegiatan */}
      <section className="py-24 px-6 relative bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-black text-pesantren-dark mb-6 tracking-tight">Galeri Kegiatan</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">Momen kebersamaan, proses belajar, dan berbagai aktivitas positif santri di lingkungan Pondok Pesantren Roudlotul 'Ulum.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
             <div className="col-span-2 md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden group relative shadow-[0_8px_30px_rgb(0,0,0,0.08)] h-64 md:h-auto">
                <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800" alt="Kegiatan" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-pesantren-dark/90 via-pesantren-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 md:p-8">
                   <div>
                     <p className="text-pesantren-yellow font-bold text-sm uppercase tracking-wider mb-1">Diniyah</p>
                     <p className="text-white font-bold text-2xl">Kajian Kitab Ba'da Maghrib</p>
                   </div>
                </div>
             </div>
             <div className="rounded-3xl overflow-hidden group relative shadow-md h-48 md:h-64">
                <img src="https://images.unsplash.com/photo-1596484552834-6a58f84bfc0a?auto=format&fit=crop&q=80&w=400" alt="Kegiatan" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-pesantren-dark/90 via-pesantren-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 md:p-6">
                   <p className="text-white font-bold text-lg leading-tight">Halaqah Tahfidz</p>
                </div>
             </div>
             <div className="rounded-3xl overflow-hidden group relative shadow-md h-48 md:h-64">
                <img src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=400" alt="Kegiatan" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-pesantren-dark/90 via-pesantren-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 md:p-6">
                   <p className="text-white font-bold text-lg leading-tight">Kegiatan Ekstrakurikuler</p>
                </div>
             </div>
             <div className="col-span-2 rounded-3xl overflow-hidden group relative shadow-md h-48 md:h-64">
                <img src="https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=800" alt="Kegiatan" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-pesantren-dark/90 via-pesantren-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 md:p-8">
                   <div>
                     <p className="text-pesantren-blue font-bold text-sm uppercase tracking-wider mb-1">Formal</p>
                     <p className="text-white font-bold text-xl">Pendidikan Kelas Nasional</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Stats with Big Visual Impact */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-pesantren-dark"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { val: "1000+", label: "Santri Aktif" },
              { val: "50+", label: "Asatidz" },
              { val: "30", label: "Juz Al-Qur'an" },
              { val: "100%", label: "Digitalisasi" }
            ].map((stat, i) => (
              <div key={i} className="group">
                <p className="text-5xl md:text-7xl font-display font-black text-white mb-4 group-hover:text-pesantren-yellow transition-colors duration-500">{stat.val}</p>
                <div className="h-1.5 w-12 bg-pesantren-green mx-auto mb-6 group-hover:w-24 group-hover:bg-pesantren-blue transition-all duration-500 rounded-full"></div>
                <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
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
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] block mt-1">Yayasan Ubaydillah Al Bisyri</span>
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
                <li><Link to="/login" className="hover:text-pesantren-blue transition-colors">Portal Masuk</Link></li>
                <li><Link to="/register" className="hover:text-pesantren-blue transition-colors">Pendaftaran Akun</Link></li>
                <li><a href="#fitur" className="hover:text-pesantren-blue transition-colors">Fasilitas Digital</a></li>
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
            <p>© 2026 Pondok Pesantren Roudlotul 'Ulum. Hak Cipta Dilindungi.</p>
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
