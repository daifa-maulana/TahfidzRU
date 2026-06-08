import React, { useState, useEffect } from 'react';
import { dataService } from '../services/data';
import PublicNavbar from '../components/PublicNavbar';
import { Calendar, MapPin, Clock, Loader2, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion } from 'motion/react';

const toLocalNoon = (dateStr: string) => {
  try {
    if (!dateStr) return new Date();
    const clean = typeof dateStr === 'string' ? dateStr.split('T')[0] : String(dateStr);
    const d = new Date(clean + 'T00:00:00');
    return isNaN(d.getTime()) ? new Date() : d;
  } catch {
    return new Date();
  }
};

export default function AgendaPage() {
  const [agendas, setAgendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgendas();
  }, []);

  const fetchAgendas = async () => {
    try {
      const data = await dataService.getAgenda();
      // Only show upcoming agendas or sort them by date descending/ascending
      setAgendas(data || []);
    } catch (err) {
      console.error('Gagal memuat agenda publik:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh text-slate-800 font-sans">
      <PublicNavbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-display font-black text-pesantren-dark mb-6 tracking-tight">Agenda Kegiatan</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">Ikuti jadwal kegiatan, kajian, dan acara penting lainnya di Pondok Pesantren Roudlotul 'Ulum.</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={36} className="animate-spin text-pesantren-green mb-4" />
              <p className="text-slate-500 font-medium">Memuat agenda pesantren...</p>
            </div>
          ) : agendas.length === 0 ? (
            <div className="glass-panel p-16 text-center max-w-lg mx-auto">
              <Calendar size={48} className="text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-pesantren-dark mb-2">Belum Ada Agenda</h3>
              <p className="text-slate-500 font-medium">Saat ini belum ada agenda kegiatan yang terjadwal. Silakan periksa kembali nanti.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {agendas.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="glass-panel flex flex-col hover:bg-white/90 transition-all duration-500 overflow-hidden group shadow-lg"
                >
                  {/* Photo Section */}
                  {item.photo_url ? (
                    <div className="relative h-56 overflow-hidden bg-slate-100 border-b border-slate-100 flex-shrink-0">
                      <img 
                        src={item.photo_url} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>
                  ) : (
                    <div className="relative h-32 bg-gradient-to-br from-pesantren-green/20 to-pesantren-blue/20 border-b border-slate-50 flex items-center justify-center flex-shrink-0">
                      <ImageIcon size={32} className="text-pesantren-green/50" />
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Date Indicator Badge */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="px-3 py-1 bg-pesantren-green/20 text-pesantren-dark text-xs font-black rounded-full uppercase tracking-wider">
                          {(() => {
                            try {
                              return format(toLocalNoon(item.date), 'EEEE, dd MMMM yyyy', { locale: id });
                            } catch {
                              return 'Tanggal tidak valid';
                            }
                          })()}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-pesantren-dark mb-3 group-hover:text-pesantren-green transition-colors leading-snug">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6 line-clamp-3">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100/60 mt-auto">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                        <Clock size={14} className="text-pesantren-blue" />
                        <span>{item.time || '08:00'} WIB</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold truncate flex-1">
                        <MapPin size={14} className="text-pesantren-red flex-shrink-0" />
                        <span className="truncate">{item.location || 'Pondok Pesantren'}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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
