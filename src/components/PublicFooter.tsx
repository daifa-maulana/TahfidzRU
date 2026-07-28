import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Shield } from 'lucide-react';
import { dataService } from '../services/data';

const DEFAULT_SETTINGS = {
  footer_desc: "Mencetak generasi penghafal Al-Qur'an yang berakhlak mulia, unggul dalam ilmu pengetahuan, dan siap menghadapi tantangan zaman.",
  footer_address: 'Cihanjuang Parongpong KBB, Jawa Barat',
  footer_phone: '(022) 1234567',
  footer_email: 'info@roudlotululum.com',
  footer_instagram: 'https://instagram.com/roudlotululum',
  footer_copyright: "© 2026 Pondok Pesantren Roudlotul 'Ulum. Hak Cipta Dilindungi."
};

interface PublicFooterProps {
  compact?: boolean;
}

export default function PublicFooter({ compact = false }: PublicFooterProps) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    dataService.getSettings()
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setSettings({
            footer_desc: data.footer_desc || DEFAULT_SETTINGS.footer_desc,
            footer_address: data.footer_address || DEFAULT_SETTINGS.footer_address,
            footer_phone: data.footer_phone || DEFAULT_SETTINGS.footer_phone,
            footer_email: data.footer_email || DEFAULT_SETTINGS.footer_email,
            footer_instagram: data.footer_instagram || DEFAULT_SETTINGS.footer_instagram,
            footer_copyright: data.footer_copyright || DEFAULT_SETTINGS.footer_copyright,
          });
        }
      })
      .catch((err) => console.warn('Could not load footer settings, using fallbacks', err));
  }, []);

  if (compact) {
    return (
      <footer className="py-12 bg-white border-t-4 border-pesantren-green">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-medium text-slate-500">{settings.footer_copyright}</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="py-20 bg-white border-t-4 border-pesantren-green relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-4 mb-8">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-16 h-16 rounded-full bg-white p-1 shadow-lg object-contain" 
                onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=RU&background=A4C95A&color=fff'; }} 
              />
              <div>
                <span className="text-3xl font-display font-extrabold text-pesantren-dark tracking-tight">Roudlotul 'Ulum</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] block mt-1">Sidata Pesantren Tahfidz Putri</span>
              </div>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed max-w-md mb-8">
              {settings.footer_desc}
            </p>
            <div className="flex space-x-4">
              {settings.footer_instagram && (
                <a 
                  href={settings.footer_instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center hover:bg-pesantren-blue hover:text-white transition-all shadow-sm"
                >
                  <Instagram size={20} />
                </a>
              )}
              <a 
                href={`mailto:${settings.footer_email}`} 
                className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center hover:bg-pesantren-red hover:text-white transition-all shadow-sm"
              >
                <Mail size={20} />
              </a>
              <a 
                href={`tel:${settings.footer_phone}`} 
                className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center hover:bg-pesantren-green hover:text-white transition-all shadow-sm"
              >
                <Phone size={20} />
              </a>
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
                <span>{settings.footer_address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-pesantren-green flex-shrink-0" />
                <span>{settings.footer_phone}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium text-slate-500">
          <p>{settings.footer_copyright}</p>
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full">
             <Shield size={16} className="text-pesantren-green" />
             <span>Sistem Terenkripsi & Aman</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
