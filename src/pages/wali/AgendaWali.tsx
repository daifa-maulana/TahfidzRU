import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/data';
import { Calendar, MapPin, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { motion } from 'motion/react';

export default function AgendaWali() {
  const [agendas, setAgendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAgendas() {
      try {
        const data = await dataService.getAgenda();
        setAgendas(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchAgendas();
  }, []);

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-slate-400" /></div>;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Agenda Pesantren</h1>
          <p className="text-sm text-slate-500 mt-0.5">Jadwal kegiatan dan acara penting di Roudhlatul Ulum</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agendas.length === 0 ? (
          <div className="col-span-full card p-16 text-center border-dashed border-2 border-slate-200">
            <Calendar className="text-slate-200 mx-auto mb-3" size={48} />
            <p className="text-sm font-bold text-slate-400">Belum Ada Agenda</p>
            <p className="text-xs text-slate-300 mt-1">Saat ini tidak ada kegiatan yang dijadwalkan.</p>
          </div>
        ) : (
          agendas.map((item) => (
            <motion.div key={item.id} whileHover={{ y: -4 }} className="card p-6 hover:shadow-md transition-all flex flex-col h-full">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-[#1e3a5f] text-white rounded-xl flex flex-col items-center justify-center shadow-sm flex-shrink-0">
                   <span className="text-[10px] uppercase font-semibold opacity-80">{format(new Date(item.date + 'T12:00:00'), 'MMM', { locale: localeId })}</span>
                   <span className="text-xl font-bold leading-none">{format(new Date(item.date + 'T12:00:00'), 'dd')}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{format(new Date(item.date), 'EEEE', { locale: localeId })}</p>
                </div>
              </div>
              
              <div className="flex-1">
                {item.description && (
                  <p className="text-sm text-slate-600 line-clamp-3 mb-4">{item.description}</p>
                )}
              </div>
              
              <div className="flex flex-col gap-2 pt-4 border-t border-slate-50 mt-auto">
                <div className="flex items-center text-xs text-slate-500 font-medium">
                  <Clock size={14} className="mr-2" />
                  <span>{item.time || 'Belum ditentukan'} WIB</span>
                </div>
                <div className="flex items-center text-xs text-slate-500 font-medium">
                  <MapPin size={14} className="mr-2 flex-shrink-0" />
                  <span className="truncate">{item.location || 'Lokasi belum ditentukan'}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
