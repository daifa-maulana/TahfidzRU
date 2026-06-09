import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ChevronRight as ArrowRight, Star, Pause, Play, Loader2 } from 'lucide-react';
import { FALLBACK_HERO_SLIDES, mapHeroFromDb, type HeroSlide } from '../constants/heroSlides';
import { dataService } from '../services/data';
import { CAMPUS_LABEL, CAMPUS_SUBTITLE } from '../constants/campus';

const SLIDE_INTERVAL = 6000;

export default function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>(FALLBACK_HERO_SLIDES);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    dataService.getHeroSlides()
      .then((data) => {
        if (data?.length) setSlides(mapHeroFromDb(data));
      })
      .catch(() => { /* fallback tetap dipakai */ })
      .finally(() => setLoading(false));
  }, []);

  const total = slides.length;

  const goTo = useCallback(
    (index: number) => {
      if (total === 0) return;
      setCurrent(((index % total) + total) % total);
    },
    [total]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (isPaused || total === 0) return;
    const timer = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, next, total]);

  useEffect(() => {
    if (current >= total && total > 0) setCurrent(0);
  }, [current, total]);

  if (loading) {
    return (
      <section className="relative w-full min-h-[100svh] flex items-center justify-center bg-pesantren-dark">
        <Loader2 className="animate-spin text-pesantren-green" size={40} />
      </section>
    );
  }

  const slide = slides[current];

  return (
    <section className="relative w-full min-h-[100svh] flex items-end overflow-hidden">
      <div className="absolute inset-0 bg-pesantren-dark">
        {total > 0 && slide && (
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              {slide.type === 'video' ? (
                <video
                  key={slide.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={slide.poster}
                  className="w-full h-full object-cover opacity-60"
                >
                  <source src={slide.src} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-full object-cover opacity-60"
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-pesantren-dark/95 via-pesantren-dark/60 to-pesantren-dark/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-pesantren-dark/40 to-transparent" />
      </div>

      <div className="relative z-10 w-full pt-32 pb-16 md:pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-bold uppercase tracking-widest mb-6">
              <Star className="text-pesantren-yellow fill-pesantren-yellow" size={14} />
              <span>{CAMPUS_SUBTITLE}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black text-white leading-[1.08] tracking-tight mb-5">
              Pondok Pesantren{' '}
              <span className="text-pesantren-green">Roudlotul &apos;Ulum</span>
              <br />
              <span className="text-pesantren-yellow">Tahfidz {CAMPUS_LABEL}</span>
            </h1>

            <p className="text-lg md:text-xl text-white/85 font-medium leading-relaxed mb-4 max-w-2xl">
              Yayasan Ubaydillah Al Bisyri — lembaga pendidikan Islam yang mencetak generasi
              penghafal Al-Qur&apos;an berakhlak mulia, unggul dalam ilmu, dan siap berprestasi.
            </p>

            {total > 0 && slide?.caption && (
              <motion.p
                key={slide.caption}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm md:text-base text-pesantren-green/90 font-semibold mb-8 italic"
              >
                {slide.caption}
              </motion.p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                to="/tentang"
                className="px-8 py-4 bg-pesantren-green text-pesantren-dark rounded-2xl font-black text-base flex items-center justify-center gap-2 hover:bg-[#b5db69] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(164,201,90,0.45)] transition-all duration-300"
              >
                <span>Profil Pesantren</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-2xl font-black text-base flex items-center justify-center hover:bg-white/20 hover:border-white/50 transition-all duration-300"
              >
                Akses Portal Wali
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 bg-transparent text-white border-2 border-white/20 rounded-2xl font-bold text-base flex items-center justify-center hover:border-pesantren-green hover:text-pesantren-green transition-all duration-300"
              >
                Pendaftaran Wali
              </Link>
            </div>
          </motion.div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-10 bg-pesantren-green'
                      : 'w-3 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
              <span className="text-white/50 text-xs font-bold ml-2 tabular-nums">
                {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaused((p) => !p)}
                aria-label={isPaused ? 'Putar slide' : 'Jeda slide'}
                className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                {isPaused ? <Play size={16} /> : <Pause size={16} />}
              </button>
              <button
                onClick={prev}
                aria-label="Slide sebelumnya"
                className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                aria-label="Slide berikutnya"
                className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 text-white/40 animate-bounce">
        <div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
