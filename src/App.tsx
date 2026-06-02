import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Database, ExternalLink } from 'lucide-react';

// Layouts
// ... (rest of imports remain same)
import { AdminLayout } from './layouts/AdminLayout';
import { PengajarLayout } from './layouts/PengajarLayout';
import { WaliLayout } from './layouts/WaliLayout';

// Direct Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import SantriManagement from './pages/admin/SantriManagement';
import AbsensiManagement from './pages/admin/AbsensiManagement';
import TahfidzManagement from './pages/admin/TahfidzManagement';
import NilaiDevelopment from './pages/admin/NilaiDevelopment';
import KeuanganAdmin from './pages/admin/KeuanganAdmin';
import AgendaManagement from './pages/admin/AgendaManagement';
import UserApproval from './pages/admin/UserApproval';
import TahfidzDiploma from './pages/admin/TahfidzDiploma';

// Pengajar Pages
import PengajarDashboard from './pages/pengajar/PengajarDashboard';
import AbsensiPengajar from './pages/pengajar/AbsensiPengajar';
import TahfidzPengajar from './pages/pengajar/TahfidzPengajar';

// Wali Pages
import WaliDashboard from './pages/wali/WaliDashboard';
import ProfilSantri from './pages/wali/ProfilSantri';
import KeuanganWali from './pages/wali/KeuanganWali';
import AbsensiWali from './pages/wali/AbsensiWali';
import HafalanWali from './pages/wali/HafalanWali';
import AgendaWali from './pages/wali/AgendaWali';

// Placeholder Pages (To avoid build errors)
const Placeholder = ({ title }: { title: string }) => (
  <div>
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="text-slate-500 mt-2">Halaman ini sedang dalam pengembangan.</p>
  </div>
);

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

      <a 
        href="https://supabase.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center text-slate-900 font-bold hover:underline"
      >
        Buka Dashboard Supabase <ExternalLink size={16} className="ml-1" />
      </a>
    </div>
  </div>
);

function AppContent() {
  const { isConfigured } = useAuth();

  if (!isConfigured) {
    return <SetupRequired />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="santri" element={<SantriManagement />} />
            <Route path="absensi" element={<AbsensiManagement />} />
            <Route path="tahfidz" element={<TahfidzManagement />} />
            <Route path="nilai" element={<NilaiDevelopment />} />
            <Route path="keuangan" element={<KeuanganAdmin />} />
            <Route path="agenda" element={<AgendaManagement />} />
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
          </Route>
        </Route>

        {/* Wali Routes */}
        <Route element={<ProtectedRoute allowedRoles={['wali']} />}>
          <Route path="/wali" element={<WaliLayout />}>
            <Route index element={<WaliDashboard />} />
            <Route path="absensi" element={<AbsensiWali />} />
            <Route path="hafalan" element={<HafalanWali />} />
            <Route path="ijazah/:id" element={<TahfidzDiploma />} />
            <Route path="keuangan" element={<KeuanganWali />} />
            <Route path="agenda" element={<AgendaWali />} />
            <Route path="profil" element={<ProfilSantri />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
