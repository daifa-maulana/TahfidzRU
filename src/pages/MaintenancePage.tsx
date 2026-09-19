import React, { useEffect } from 'react';
import { ExternalLink, ArrowRight, ShieldCheck, Globe, MoveRight, CheckCircle2 } from 'lucide-react';

export default function MaintenancePage() {
  // Pastikan splash screen dari index.html hilang dengan mulus
  useEffect(() => {
    const splash = document.getElementById('splash');
    if (!splash) return;

    const elapsed = performance.now();
    const MIN_DISPLAY = 150;
    const wait = Math.max(0, MIN_DISPLAY - elapsed);

    const timer = setTimeout(() => {
      splash.style.opacity = '0';
      splash.addEventListener('transitionend', () => splash.remove(), { once: true });
      setTimeout(() => splash.remove(), 500);
    }, wait);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f9f1] text-slate-800 font-sans relative flex flex-col justify-between overflow-x-hidden selection:bg-[#A4C95A]/30 selection:text-[#1a2e12]">
      {/* Background Decorative Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Top-left soft Green Glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 md:w-[500px] md:h-[500px] rounded-full bg-[#A4C95A]/25 blur-3xl" />
        {/* Top-right soft Blue Glow */}
        <div className="absolute top-10 -right-28 w-96 h-96 md:w-[550px] md:h-[550px] rounded-full bg-[#54B4E5]/25 blur-3xl" />
        {/* Bottom-center soft Yellow/Gold Glow */}
        <div className="absolute -bottom-28 left-1/2 -translate-x-1/2 w-96 h-96 md:w-[600px] md:h-[600px] rounded-full bg-[#FFDD00]/20 blur-3xl" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(#1a2e12 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* Top Navigation / Brand Bar */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <div className="flex items-center justify-between bg-white/70 backdrop-blur-md px-4 sm:px-6 py-3 rounded-2xl border border-white/80 shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo Pondok Pesantren Roudlotul 'Ulum"
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-sm"
              onError={(e) => {
                // Fallback jika logo gagal dimuat
                (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=RU&background=A4C95A&color=fff';
              }}
            />
            <div className="text-left">
              <h1 className="text-xs sm:text-sm font-extrabold text-[#1a2e12] leading-tight font-display tracking-tight">
                Pondok Pesantren Roudlotul 'Ulum
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-wider uppercase">
                Pondok Pesantren Tahfidz
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/60 shadow-xs">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span>Website Baru Aktif</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-2xl mx-auto">
          {/* Main Card Container */}
          <div className="bg-white/85 backdrop-blur-xl border border-white rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-6 sm:p-10 md:p-12 text-center relative overflow-hidden transition-all">
            {/* Top decorative badge bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#A4C95A] via-[#54B4E5] to-[#FFDD00]" />

            {/* Logo and Icon Showcase */}
            <div className="relative inline-block mb-6 sm:mb-8">
              {/* Outer decorative halo */}
              <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#A4C95A]/30 via-[#54B4E5]/30 to-[#FFDD00]/30 blur-md animate-pulse"></div>
              
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-3.5 shadow-lg border-2 border-[#A4C95A]/30 flex items-center justify-center mx-auto transition-transform hover:scale-105 duration-300">
                <img
                  src="/logo.png"
                  alt="Logo Roudlotul 'Ulum"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=RU&background=A4C95A&color=fff';
                  }}
                />
              </div>

              {/* Moved badge floating */}
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 sm:p-2 rounded-full shadow-md border-2 border-white flex items-center justify-center">
                <MoveRight size={14} className="text-white" />
              </div>
            </div>

            {/* Moved Status Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-full text-emerald-800 text-xs sm:text-sm font-semibold mb-4 sm:mb-5">
              <CheckCircle2 size={15} className="text-emerald-600" />
              <span>Website Resmi Telah Berpindah</span>
            </div>

            {/* Primary Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1a2e12] font-display tracking-tight leading-tight mb-4">
              Website Kami Telah Berpindah
            </h2>

            {/* Description Text */}
            <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto mb-8 sm:mb-10 font-normal">
              Website Pondok Pesantren Roudlotul 'Ulum kini telah resmi beralih ke alamat baru. Kunjungi website baru kami untuk informasi, kegiatan, dan layanan terkini.
            </p>

            {/* Call to Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 sm:mb-10">
              <a
                href="https://ponpestahfidzroudlotululum.ponpes.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#8bb838] via-[#A4C95A] to-[#76a728] text-[#0d2208] text-base sm:text-lg font-bold rounded-2xl shadow-[0_10px_25px_rgba(164,201,90,0.4)] hover:shadow-[0_15px_35px_rgba(164,201,90,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group border border-[#c4e47a]"
              >
                <span>Kunjungi Website Baru</span>
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1.5 duration-300 text-[#0d2208]" />
              </a>
            </div>

            {/* Feature info highlight cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-6 border-t border-slate-100">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-[#54B4E5]/15 text-[#0c6b9f] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Globe size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800">Domain & Website Baru</h3>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                    Alamat resmi baru kami di portal ponpes.id — lebih cepat dan mudah diakses
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-[#A4C95A]/20 text-[#285710] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800">Informasi Terkini</h3>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                    Informasi kegiatan, pendaftaran santri, dan layanan tersedia di website baru
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Link text */}
            <div className="mt-6 pt-4 text-center">
              <a
                href="https://ponpestahfidzroudlotululum.ponpes.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#1a2e12] hover:underline transition-colors"
              >
                <span>https://ponpestahfidzroudlotululum.ponpes.id/</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Pondok Pesantren Roudlotul 'Ulum. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
}
