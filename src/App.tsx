import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Database, ExternalLink, Loader2 } from 'lucide-react';
import { prefetchSantriData, initPrefetchDeps } from './pages/admin/SantriManagement';
import { supabase } from './lib/supabase';
import { dataService } from './services/data';

// Layouts
import { AdminLayout } from './layouts/AdminLayout';
import { PengajarLayout } from './layouts/PengajarLayout';
import { WaliLayout } from './layouts/WaliLayout';

// Direct Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FiturPage from './pages/FiturPage';
import TentangPage from './pages/TentangPage';
import AgendaPage from './pages/AgendaPage';
import GaleriPage from './pages/GaleriPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import SantriManagement from './pages/admin/SantriManagement';
import AbsensiManagement from './pages/admin/AbsensiManagement';
import AbsensiRecap from './pages/admin/AbsensiRecap';
import LaporanTerpadu from './pages/admin/LaporanTerpadu';
import TahfidzManagement from './pages/admin/TahfidzManagement';
import TahfidzRecap from './pages/admin/TahfidzRecap';
import NilaiManagement from './pages/admin/NilaiManagement';
import AgendaManagement from './pages/admin/AgendaManagement';
import KontenManagement from './pages/admin/KontenManagement';
import UserApproval from './pages/admin/UserApproval';
import TahfidzDiploma from './pages/admin/TahfidzDiploma';

// Pengajar Pages
import PengajarDashboard from './pages/pengajar/PengajarDashboard';
import AbsensiPengajar from './pages/pengajar/AbsensiPengajar';
import TahfidzPengajar from './pages/pengajar/TahfidzPengajar';
import AgendaPengajar from './pages/pengajar/AgendaPengajar';
import SantriPengajar from './pages/pengajar/SantriPengajar';

// Wali Pages
import WaliDashboard from './pages/wali/WaliDashboard';
import ProfilSantri from './pages/wali/ProfilSantri';
import AgendaWali from './pages/wali/AgendaWali';
import HafalanWali from './pages/wali/HafalanWali';
import AbsensiWali from './pages/wali/AbsensiWali';
import IjazahWali from './pages/wali/IjazahWali';

const SetupRequired = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-900">
    <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
      <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Database size={32} />
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Konfigurasi Diperlukan</h1>
      <p className="text-slate-500 mb-8">Hubungkan aplikasi ini dengan project Supabase Anda untuk mulai menggunakan fitur manajemen pesantren.</p>
      <div className="space-y-4 text-left bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
          <p className="text-sm font-medium text-slate-700">Buka <span className="font-bold">Settings &gt; Secrets</span> di panel AI Studio.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
          <p className="text-sm font-medium text-slate-700">Tambahkan <span className="font-mono bg-white px-1 border rounded text-xs select-all">VITE_SUPABASE_URL</span></p>
        </div>
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
          <p className="text-sm font-medium text-slate-700">Tambahkan <span className="font-mono bg-white px-1 border rounded text-xs select-all">VITE_SUPABASE_ANON_KEY</span></p>
        </div>
      </div>
      <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-slate-900 font-bold hover:underline">
        Buka Dashboard Supabase <ExternalLink size={16} className="ml-1" />
      </a>
    </div>
  </div>
);

function AppContent() {
  const { isConfigured, user, profile } = useAuth();
  const [prefetching, setPrefetching] = useState(false);
  const [siteLoading, setSiteLoading] = useState(true);

  // Animasi awal pembukaan website
  useEffect(() => {
    const timer = setTimeout(() => {
      setSiteLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Prefetch data santri di background saat admin login
  useEffect(() => {
    if (profile?.role === 'admin' && user) {
      initPrefetchDeps(supabase, dataService);
      setPrefetching(true);
      prefetchSantriData().finally(() => setPrefetching(false));
    }
  }, [user, profile]);

  if (!isConfigured) {
    return <SetupRequired />;
  }

  return (
    <>
      <AnimatePresence>
        {siteLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed inset-0 z-[99999] bg-slate-900 flex flex-col items-center justify-center p-6 text-white overflow-hidden font-sans"
          >
            {/* Background gradient glowing effects */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col items-center max-w-sm text-center">
              {/* Pulsing logo */}
              <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-2 mb-8 animate-pulse shadow-2xl">
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="w-full h-full object-contain" 
                  onError={(e) => { 
                    e.currentTarget.src = 'https://ui-avatars.com/api/?name=RU&background=A4C95A&color=fff'; 
                  }} 
                />
              </div>
              
              <h2 className="text-xl font-bold tracking-tight mb-2">Roudlotul 'Ulum</h2>
              <p className="text-xs text-slate-400 font-medium tracking-widest uppercase mb-8">PONDOK PESANTREN TAHFIDZ</p>
              
              {/* Spinner and loading message */}
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-full backdrop-blur-md">
                <Loader2 className="animate-spin text-emerald-400" size={16} />
                <span className="text-xs text-slate-300 font-medium">Mohon tunggu sebentar...</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge prefetch di pojok kiri bawah */}
      {prefetching && (
        <div className="fixed bottom-4 left-4 z-[9999] flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-slate-200 shadow-lg rounded-full px-3.5 py-2 text-xs text-slate-500 animate-pulse pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span>
          Mempersiapkan data...
        </div>
      )}
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fitur" element={<FiturPage />} />
        <Route path="/tentang" element={<TentangPage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/galeri" element={<GaleriPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="santri" element={<SantriManagement />} />
            <Route path="absensi" element={<AbsensiManagement />} />
            <Route path="absensi-rekap" element={<AbsensiRecap />} />
            <Route path="rekap-laporan" element={<LaporanTerpadu />} />
            <Route path="tahfidz" element={<TahfidzManagement />} />
            <Route path="tahfidz-rekap" element={<TahfidzRecap />} />
            <Route path="nilai" element={<NilaiManagement />} />
            <Route path="agenda" element={<AgendaManagement />} />
            <Route path="konten" element={<KontenManagement />} />
            <Route path="ijazah/:id" element={<TahfidzDiploma />} />
            <Route path="approval" element={<UserApproval />} />
          </Route>
        </Route>

        {/* Pengajar Routes */}
        <Route element={<ProtectedRoute allowedRoles={['pengajar']} />}>
          <Route path="/pengajar" element={<PengajarLayout />}>
            <Route index element={<PengajarDashboard />} />
            <Route path="absensi" element={<AbsensiPengajar />} />
            <Route path="tahfidz" element={<TahfidzPengajar />} />
            <Route path="santri" element={<SantriPengajar />} />
            <Route path="agenda" element={<AgendaPengajar />} />
          </Route>
        </Route>

        {/* Wali Routes */}
        <Route element={<ProtectedRoute allowedRoles={['wali']} />}>
          <Route path="/wali" element={<WaliLayout />}>
            <Route index element={<WaliDashboard />} />
            <Route path="hafalan" element={<HafalanWali />} />
            <Route path="absensi" element={<AbsensiWali />} />
            <Route path="agenda" element={<AgendaWali />} />
            <Route path="profil" element={<ProfilSantri />} />
            <Route path="ijazah" element={<IjazahWali />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}