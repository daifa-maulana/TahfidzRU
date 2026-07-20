import React, { useEffect, useState } from 'react';
import PublicNavbar from '../components/PublicNavbar';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Eye, X, Loader2 } from 'lucide-react';
import { FALLBACK_GALERI_ITEMS, mapGaleriFromDb, type GaleriItem } from '../constants/galeriItems';
import { dataService } from '../services/data';

export default function GaleriPage() {
  const [items, setItems] = useState<GaleriItem[]>(FALLBACK_GALERI_ITEMS);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Semua');
  const [selectedImage, setSelectedImage] = useState<GaleriItem | null>(null);

  useEffect(() => {
    dataService.getGaleriItems()
      .then((data) => {
        if (data?.length) setItems(mapGaleriFromDb(data));
      })
      .catch(() => { /* fallback */ })
      .finally(() => setLoading(false));
  }, []);

  const categories = ['Semua', 'Kegiatan', 'Prestasi & Pencapaian', 'Kajian'];

  const filteredItems = activeTab === 'Semua'
    ? items
    : items.filter((item) => {
        if (activeTab === 'Prestasi & Pencapaian' || activeTab === 'Prestasi' || activeTab === 'Pencapaian') {
          return item.category === 'Prestasi & Pencapaian' || item.category === 'Prestasi' || item.category === 'Pencapaian' || item.category === 'Fasilitas';
        }
        return item.category === activeTab;
      });

  return (
    <div className="min-h-screen bg-mesh text-slate-800 font-sans">
      <PublicNavbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pesantren-green/15 text-pesantren-dark text-xs font-black uppercase tracking-widest mb-4">
              <Camera size={14} />
              <span>Dokumentasi Pesantren</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-black text-pesantren-dark mb-6 tracking-tight">Galeri Foto</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">Melihat lebih dekat kegiatan harian, prestasi, dan pencapaian Pondok Pesantren Roudlotul 'Ulum.</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center gap-3 mb-12 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-extrabold transition-all duration-300 ${
                  activeTab === cat
                    ? 'bg-pesantren-green text-pesantren-dark shadow-md scale-105'
                    : 'bg-white text-slate-600 border border-slate-100 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid Layout */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass-panel overflow-hidden animate-pulse">
                  <div className="h-64 bg-slate-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-full" />
                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <p className="text-center text-slate-500 font-medium py-20">Belum ada foto galeri.</p>
          ) : (
          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="glass-panel group overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
                  onClick={() => setSelectedImage(item)}
                >
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden bg-slate-100 border-b border-slate-100 flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-0"
                      loading="lazy"
                      onLoad={(e) => e.currentTarget.classList.replace('opacity-0', 'opacity-100')}
                      style={{ transition: 'opacity 0.4s ease, transform 0.7s ease' }}
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/95 rounded-full flex items-center justify-center shadow-lg text-pesantren-dark">
                        <Eye size={20} />
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 bg-pesantren-dark/85 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-white/10">
                      {item.category}
                    </div>
                  </div>

                  {/* Text Description */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-pesantren-dark mb-2 group-hover:text-pesantren-green transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Full Image */}
              <div className="flex-1 max-h-[70vh] lg:max-h-none overflow-hidden bg-slate-100 flex items-center justify-center">
                <img 
                  src={selectedImage.image} 
                  alt={selectedImage.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info Sidebar */}
              <div className="w-full lg:w-80 p-8 flex flex-col justify-between bg-white">
                <div>
                  <span className="px-3 py-1 bg-pesantren-green/20 text-pesantren-dark text-xs font-black rounded-full uppercase tracking-wider">
                    {selectedImage.category}
                  </span>
                  <h3 className="text-2xl font-display font-black text-pesantren-dark mt-4 mb-3">
                    {selectedImage.title}
                  </h3>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed">
                    {selectedImage.description}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="w-full mt-8 py-3 bg-pesantren-green hover:bg-[#b5db69] text-pesantren-dark font-black text-sm rounded-xl transition-all duration-300 text-center"
                >
                  Tutup Galeri
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="py-12 bg-white border-t-4 border-pesantren-green">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-medium text-slate-500">© 2026 Pondok Pesantren Roudlotul 'Ulum</p>
        </div>
      </footer>
    </div>
  );
}
