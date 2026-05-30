import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Loader2, BookOpen, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        if (error.message.includes('apiKey') || error.message.includes('JWT')) {
          throw new Error('API Key Supabase tidak valid atau belum dikonfigurasi di Secrets.');
        }
        throw error;
      }

      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) throw new Error('Database Error: ' + profileError.message);

      if (!profile) {
        const { count } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'admin');

        const isFirstAdmin = count === 0;
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name || email.split('@')[0],
            role: isFirstAdmin ? 'admin' : 'wali',
            is_approved: isFirstAdmin
          })
          .select()
          .single();

        if (insertError) throw new Error('Gagal membuat profil: ' + insertError.message);
        profile = newProfile;
      }

      if (!profile) throw new Error('Profil pengguna tidak ditemukan.');

      if (!profile.is_approved && profile.role !== 'admin') {
        throw new Error(`Akun Anda belum disetujui oleh Admin. Silakan hubungi administrator.`);
      }

      if (profile.role === 'admin') navigate('/admin');
      else if (profile.role === 'pengajar') navigate('/pengajar');
      else navigate('/wali');

    } catch (err: any) {
      if (err.message === 'Failed to fetch' || err.message?.toLowerCase().includes('fetch')) {
        setError('Gagal menghubungi server. Periksa koneksi internet dan konfigurasi Supabase Anda.');
      } else if (err.message?.includes('Invalid login credentials')) {
        setError('Email atau kata sandi salah. Silakan coba lagi.');
      } else {
        setError(err.message || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-4 relative">
      <Link to="/" className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-slate-500 hover:text-pesantren-green transition-all duration-300 font-bold bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/60 shadow-sm hover:shadow-md hover:-translate-x-1">
         <ArrowLeft size={18} />
         <span className="hidden sm:inline">Kembali ke Beranda</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-5 relative">
            <div className="absolute inset-0 bg-pesantren-yellow rounded-full blur-md opacity-50"></div>
            <img src="/logo.png" alt="Logo" className="w-full h-full rounded-full relative z-10 bg-white p-1 shadow-lg object-contain" onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=RU&background=A4C95A&color=fff'; }} />
          </div>
          <h1 className="text-3xl font-display font-black text-pesantren-dark mb-1">Portal Masuk</h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Sistem Roudlotul 'Ulum</p>
        </div>

        {/* Form Card */}
        <div className="glass-panel p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-rose-50 border border-rose-100 text-rose-700 text-sm rounded-xl flex items-start gap-3 font-medium"
              >
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>{error}</span>
              </motion.div>
            )}

            <div>
              <label htmlFor="email" className="form-label">Alamat Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  className="input-field pl-12"
                  placeholder="contoh@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="form-label">Kata Sandi</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pl-12 pr-12"
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-pesantren-green transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              id="login-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 mt-4 text-base"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <LogIn size={20} />
              )}
              <span>{loading ? 'Memverifikasi...' : 'Masuk Sistem'}</span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100/50 text-center">
            <p className="text-sm font-medium text-slate-500">
              Belum punya akun?{' '}
              <Link to="/register" className="text-pesantren-blue font-bold hover:text-[#3da0d1] transition-colors">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          © 2026 Pesantren Roudhlatul Ulum
        </p>
      </motion.div>
    </div>
  );
}
