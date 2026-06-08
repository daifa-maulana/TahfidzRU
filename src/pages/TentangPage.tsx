import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, BookOpen, Shield, MapPin, Users } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-mesh text-slate-800 font-sans">
      <PublicNavbar />

      <section className="pt-32 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-8 w-full max-w-6xl mx-auto"
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

      <footer className="py-12 bg-white border-t-4 border-pesantren-green">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-medium text-slate-500">© 2026 Pondok Pesantren Roudlotul 'Ulum</p>
        </div>
      </footer>
    </div>
  );
}