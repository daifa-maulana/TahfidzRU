import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { BookOpen, Printer, ArrowLeft, Award, Star, Settings, Send, CheckCircle2, Loader2, AlertTriangle, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';

export default function TahfidzDiploma() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [santri, setSantri] = useState<any>(null);
  const [existingIjazah, setExistingIjazah] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toast, showToast } = useToast();

  const [settings, setSettings] = useState({
    title: 'Program Tahfidz Al-Qur\'an',
    pencapaian: 'Telah menyelesaikan program tahfidz dengan sempurna, menghafal dan menjaga ayat-ayat suci Al-Qur\'an dengan penuh dedikasi dan ketekunan.',
    location: 'Cihanjuang, Parongpong',
    predikat: 'Mumtaz',
    leftSignName: 'K.H. Ubaydillah Al Bisyri',
    leftSignTitle: 'Pengasuh Pesantren',
    rightSignName: 'Hj. Siti Aisyah, S.Pd.I',
    rightSignTitle: 'Ketua Program Tahfidz',
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [santriRes, ijazahRes] = await Promise.all([
          supabase.from('santri').select('*').eq('id', id).single(),
          supabase.from('ijazah').select('*').eq('santri_id', id).maybeSingle(),
        ]);
        if (santriRes.error) throw santriRes.error;
        setSantri(santriRes.data);

        if (ijazahRes.data) {
          setExistingIjazah(ijazahRes.data);
          const d = ijazahRes.data;
          setSettings({
            title: d.title || settings.title,
            pencapaian: d.pencapaian || settings.pencapaian,
            location: d.location || settings.location,
            predikat: d.predikat || settings.predikat,
            leftSignName: d.left_sign_name || settings.leftSignName,
            leftSignTitle: d.left_sign_title || settings.leftSignTitle,
            rightSignName: d.right_sign_name || settings.rightSignName,
            rightSignTitle: d.right_sign_title || settings.rightSignTitle,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleSave = async (publish = false) => {
    setIsSaving(true);
    try {
      const payload = {
        santri_id: id,
        title: settings.title,
        pencapaian: settings.pencapaian,
        location: settings.location,
        predikat: settings.predikat,
        left_sign_name: settings.leftSignName,
        left_sign_title: settings.leftSignTitle,
        right_sign_name: settings.rightSignName,
        right_sign_title: settings.rightSignTitle,
        is_published: publish,
        issue_date: format(new Date(), 'yyyy-MM-dd'),
      };

      if (existingIjazah) {
        await supabase.from('ijazah').update(payload).eq('id', existingIjazah.id);
        setExistingIjazah({ ...existingIjazah, ...payload });
      } else {
        const { data } = await supabase.from('ijazah').insert(payload).select().single();
        setExistingIjazah(data);
      }

      if (publish) {
        showToast('Ijazah berhasil dikirim ke portal wali!', 'success');
      } else {
        showToast('Ijazah berhasil disimpan!', 'success');
      }
      setIsSettingsOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan ijazah', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => window.print();

  if (loading) return <div className="p-8 text-center text-slate-400">Menyiapkan Ijazah...</div>;
  if (!santri) return <div className="p-8 text-center text-rose-500">Data santri tidak ditemukan.</div>;

  const isPublished = existingIjazah?.is_published;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 print:p-0 print:bg-white">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => {}} />}

      {/* Action Bar */}
      <div className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <button onClick={() => navigate(-1)} className="btn-secondary mb-2">
            <ArrowLeft size={16} /> Kembali
          </button>
          {isPublished && (
            <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <CheckCircle2 size={13} /> Sudah dikirim ke portal wali
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setIsSettingsOpen(true)} className="btn-secondary">
            <Settings size={16} /> Edit & Simpan
          </button>
          <button onClick={handlePrint} className="btn-secondary">
            <Printer size={16} /> Cetak
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="btn-primary bg-emerald-600 hover:bg-emerald-700"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {isPublished ? 'Perbarui ke Wali' : 'Kirim ke Wali'}
          </button>
        </div>
      </div>

      {/* No Wali Warning */}
      {!santri.wali_id && (
        <div className="max-w-4xl mx-auto mb-6 print:hidden">
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-amber-800">Santri Belum Terhubung ke Wali</p>
              <p className="text-xs text-amber-600 mt-0.5">
                Ijazah ini tidak bisa dikirim karena <strong>{santri.name}</strong> belum memiliki wali yang terdaftar.
                Hubungkan santri ini ke akun wali terlebih dahulu agar ijazah bisa dilihat oleh orang tua.
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/santri')}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors flex-shrink-0"
            >
              <UserPlus size={13} /> Hubungkan Wali
            </button>
          </div>
        </div>
      )}

      {/* Diploma Card */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border-[12px] border-double border-slate-900 p-12 md:p-20 text-center relative print:border-slate-800 print:shadow-none shadow-xl min-h-[900px] flex flex-col justify-between">

          {/* Header */}
          <div className="mb-10">
            <div className="w-24 h-24 bg-[#1e3a5f] text-white rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-3 shadow-lg">
              <BookOpen size={48} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-widest mb-2">Pondok Pesantren Tahfidz</h1>
            <h2 className="text-5xl font-black text-[#1e3a5f] uppercase tracking-tighter mb-8">Roudhlatul Ulum</h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-slate-300"></div>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Ijazah Kehormatan</span>
              <div className="h-px w-16 bg-slate-300"></div>
            </div>
          </div>

          {/* Body */}
          <div className="max-w-2xl mx-auto space-y-6 flex-1 flex flex-col justify-center">
            <p className="text-lg text-slate-600 leading-relaxed">
              Dengan penuh rasa syukur dan bangga, kami menganugerahkan ijazah ini kepada:
            </p>
            <div className="py-4 border-y border-slate-100">
              <h3 className="text-4xl font-bold text-slate-900 uppercase mb-2">{santri.name}</h3>
              <p className="text-sm text-slate-500 font-mono">NIS: {santri.nis}</p>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Program</p>
              <p className="text-lg font-bold text-[#1e3a5f]">{settings.title}</p>
            </div>

            <p className="text-base text-slate-700 leading-relaxed italic">
              "{settings.pencapaian}"
            </p>

            <div className="flex items-center justify-center gap-12 pt-4">
              <div className="flex flex-col items-center">
                <Star className="text-amber-400 mb-2" size={32} fill="currentColor" />
                <span className="text-xs font-bold text-slate-500 uppercase">{settings.predikat}</span>
              </div>
              <div className="flex flex-col items-center">
                <Award className="text-[#1e3a5f] mb-2" size={48} />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">Tersertifikasi</span>
              </div>
              <div className="flex flex-col items-center">
                <Star className="text-amber-400 mb-2" size={32} fill="currentColor" />
                <span className="text-xs font-bold text-slate-500 uppercase">{settings.predikat}</span>
              </div>
            </div>
          </div>

          {/* Footer / Signature */}
          <div className="mt-16 flex justify-between items-end px-12">
            <div className="text-center w-56">
              <p className="text-xs text-slate-500 mb-16">{settings.leftSignTitle}</p>
              <div className="border-t border-slate-900 pt-2 px-2">
                <p className="text-sm font-bold text-slate-900 whitespace-nowrap">{settings.leftSignName}</p>
              </div>
            </div>
            <div className="text-center w-56">
              <p className="text-xs text-slate-500 mb-16">
                {settings.location},<br />
                {format(new Date(), 'dd MMMM yyyy', { locale: localeId })}<br />
                {settings.rightSignTitle}
              </p>
              <div className="border-t border-slate-900 pt-2 px-2">
                <p className="text-sm font-bold text-slate-900 whitespace-nowrap">{settings.rightSignName}</p>
              </div>
            </div>
          </div>

          {/* Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
            <BookOpen size={600} />
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Edit Isi Ijazah">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div>
            <label className="form-label">Judul Program</label>
            <input type="text" className="input-field" value={settings.title}
              onChange={e => setSettings({ ...settings, title: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Kalimat Pencapaian (akan ditampilkan dalam tanda petik)</label>
            <textarea rows={3} className="input-field" value={settings.pencapaian}
              onChange={e => setSettings({ ...settings, pencapaian: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Predikat Kelulusan</label>
            <input type="text" className="input-field" value={settings.predikat}
              onChange={e => setSettings({ ...settings, predikat: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Lokasi Penerbitan</label>
            <input type="text" className="input-field" value={settings.location}
              onChange={e => setSettings({ ...settings, location: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
            <div>
              <label className="form-label">Jabatan Tanda Tangan Kiri</label>
              <input type="text" className="input-field" value={settings.leftSignTitle}
                onChange={e => setSettings({ ...settings, leftSignTitle: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Nama (Kiri)</label>
              <input type="text" className="input-field" value={settings.leftSignName}
                onChange={e => setSettings({ ...settings, leftSignName: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Jabatan Tanda Tangan Kanan</label>
              <input type="text" className="input-field" value={settings.rightSignTitle}
                onChange={e => setSettings({ ...settings, rightSignTitle: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Nama (Kanan)</label>
              <input type="text" className="input-field" value={settings.rightSignName}
                onChange={e => setSettings({ ...settings, rightSignName: e.target.value })} />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => handleSave(false)} disabled={isSaving} className="btn-secondary flex-1">
              {isSaving ? <Loader2 size={15} className="animate-spin" /> : null}
              Simpan Draf
            </button>
            <button onClick={() => handleSave(true)} disabled={isSaving} className="btn-primary flex-1 bg-emerald-600 hover:bg-emerald-700">
              {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              Kirim ke Wali
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
