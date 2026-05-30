import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Loader2, CheckCircle2, BookOpen, Eye, EyeOff, Info, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('Registrasi gagal. Coba email lain.');

      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        if (countError.message.includes('relation "public.profiles" does not exist')) {
          throw new Error('Database belum siap. Pastikan Anda sudah menjalankan SQL di Supabase Dashboard.');
        }
        throw countError;
      }

      const isFirstUser = count === 0;
      const { data: existingProfile } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single();

      if (!existingProfile) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          full_name: fullName,
          email: email,
          role: isFirstUser ? 'admin' : 'wali',
          is_approved: isFirstUser
        });
        if (profileError) throw profileError;
      } else if (isFirstUser && existingProfile.role !== 'admin') {
        await supabase.from('profiles').update({ role: 'admin', is_approved: true }).eq('id', authData.user.id);
      }

      setSuccess(true);
      setTimeout(() => navigate('/login'), 6000);

    } catch (err: any) {
      if (err.message?.toLowerCase().includes('api key') || err.message?.includes('apiKey')) {
        setError('Konfigurasi API Key bermasalah. Pastikan ENV di panel Secrets sudah benar.');
      } else {
        setError(err.message || 'Gagal mendaftar. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-2xl mb-5">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Akun Anda telah didaftarkan. Silakan cek email untuk verifikasi, lalu tunggu persetujuan dari Admin.
          </p>

          <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2.5 text-left mb-6">
            <Info size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              Jika verifikasi email dimatikan di pengaturan Supabase, Anda bisa langsung login setelah Admin menyetujui akun.
            </p>
          </div>

          <Link
            to="/login"
            className="btn-primary w-full justify-center py-3"
          >
            Pergi ke Halaman Masuk
          </Link>
        </motion.div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-display font-black text-pesantren-dark mb-1">Daftar Akun Baru</h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Sistem Roudlotul 'Ulum</p>
        </div>

        {/* Info Box */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl mb-4 shadow-sm">
          <Info size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed font-medium">
            Akun baru akan menunggu persetujuan dari Administrator sebelum bisa mengakses sistem.
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-panel p-8">
          <form onSubmit={handleRegister} className="space-y-5">
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
              <label htmlFor="fullName" className="form-label">Nama Lengkap</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="fullName"
                  type="text"
                  className="input-field pl-12"
                  placeholder="Masukkan nama lengkap"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="form-label">Alamat Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="reg-email"
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
              <label htmlFor="reg-password" className="form-label">Kata Sandi</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pl-12 pr-12"
                  placeholder="Minimal 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
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
              id="register-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 mt-4 text-base"
            >
              {loading && <Loader2 size={20} className="animate-spin mr-2" />}
              <span>{loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}</span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100/50 text-center">
            <p className="text-sm font-medium text-slate-500">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-pesantren-blue font-bold hover:text-[#3da0d1] transition-colors">
                Masuk di sini
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
