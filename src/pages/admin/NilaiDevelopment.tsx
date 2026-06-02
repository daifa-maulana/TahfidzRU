import { GraduationCap, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function NilaiDevelopment() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-header">Manajemen Nilai Akademik</h1>
        <p className="text-sm text-slate-500 mt-0.5">Fitur ini sedang dalam pengembangan</p>
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="card p-16 flex flex-col items-center text-center border-dashed border-2 border-slate-200">
        <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mb-5">
          <Loader2 size={32} className="text-amber-500 animate-spin" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Sedang Dalam Pengembangan</h3>
        <p className="text-sm text-slate-500 max-w-sm">
          Fitur manajemen nilai akademik sedang dalam proses penyempurnaan. Mohon untuk kembali lagi di pembaruan berikutnya.
        </p>
      </motion.div>
    </div>
  );
}