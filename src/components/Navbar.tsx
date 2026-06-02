import React, { useState, useEffect, useRef } from 'react';
import { Menu, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      setProfile(data);
    }
    fetchProfile();
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'admin': return 'bg-pesantren-red/10 text-pesantren-red border-pesantren-red/20';
      case 'pengajar': return 'bg-pesantren-blue/10 text-[#0d557c] border-pesantren-blue/20';
      case 'wali': return 'bg-pesantren-green/10 text-pesantren-dark border-pesantren-green/20';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'admin': return 'Administrator';
      case 'pengajar': return 'Pengajar';
      case 'wali': return 'Wali Santri';
      default: return 'Pengguna';
    }
  };

  return (
    <nav className="h-20 bg-white/80 backdrop-blur-md border-b border-white/50 shadow-sm flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="p-2 mr-4 rounded-xl text-slate-500 hover:bg-slate-100 lg:hidden transition-colors"
        >
          <Menu size={24} />
        </button>
        
        <div className="hidden md:flex flex-col">
          <p className="text-sm font-bold text-slate-800">
            {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: localeId })}
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
            Sistem Informasi Pesantren
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Status indicator */}
        <div className="hidden sm:flex items-center px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100 mr-2">
           <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
           <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Sistem Online</span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 p-1.5 pr-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
          >
            <div className="w-10 h-10 bg-pesantren-blue/10 rounded-lg flex items-center justify-center text-[#0d557c] border border-pesantren-blue/20">
              <UserIcon size={18} />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-slate-800 leading-tight">
                {profile?.full_name || user?.email?.split('@')[0]}
              </p>
              <p className="text-xs text-slate-500 capitalize font-medium">
                {profile?.role ? getRoleLabel(profile.role) : 'Memuat...'}
              </p>
            </div>
            <ChevronDown size={16} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transform transition-all origin-top-right z-50">
              <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                <p className="text-sm font-bold text-slate-800 truncate">{profile?.full_name}</p>
                <p className="text-xs text-slate-500 truncate mb-2">{user?.email}</p>
                <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${profile ? getRoleColor(profile.role) : ''}`}>
                  {profile ? getRoleLabel(profile.role) : ''}
                </span>
              </div>
              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut size={18} />
                  <span>Keluar Sistem</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
