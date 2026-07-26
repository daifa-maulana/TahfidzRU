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
    schoolName: 'Pondok Pesantren Tahfidz',
    schoolSubtitle: 'Roudhlatul Ulum',
    certificateType: 'Ijazah Kehormatan',
    introText: 'Dengan penuh rasa syukur dan bangga, kami menganugerahkan ijazah ini kepada:',
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
            schoolName: d.school_name || settings.schoolName,
            schoolSubtitle: d.school_subtitle || settings.schoolSubtitle,
            certificateType: d.certificate_type || settings.certificateType,
            introText: d.intro_text || settings.introText,
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
        school_name: settings.schoolName,
        school_subtitle: settings.schoolSubtitle,
        certificate_type: settings.certificateType,
        intro_text: settings.introText,
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

  const handlePrint = () => {
    const dateStr = format(new Date(), 'dd MMMM yyyy', { locale: localeId });
    const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>${settings.certificateType} – ${santri.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4 landscape; margin: 0; }
    html, body {
      width: 297mm;
      height: 210mm;
      overflow: hidden;
      background: white;
      font-family: 'Inter', sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .card {
      width: 297mm;
      height: 210mm;
      padding: 14mm 20mm;
      border: 12px double #0f172a;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      background: white;
    }
    .header { text-align: center; }
    .logo {
      width: 64px; height: 64px;
      background: #1e3a5f;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 12px;
      transform: rotate(3deg);
    }
    .logo svg { color: white; }
    h1 { font-size: 18pt; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2px; }
    h2 { font-size: 30pt; font-weight: 900; color: #1e3a5f; text-transform: uppercase; letter-spacing: -0.02em; margin-bottom: 10px; }
    .divider { display: flex; align-items: center; justify-content: center; gap: 12px; }
    .divider-line { height: 1px; width: 48px; background: #cbd5e1; }
    .divider-text { font-size: 7pt; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.15em; }
    .body { text-align: center; }
    .intro { font-size: 9pt; color: #475569; margin-bottom: 8px; }
    .name-block { border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; padding: 8px 0; margin-bottom: 8px; }
    .santri-name { font-size: 26pt; font-weight: 700; color: #0f172a; text-transform: uppercase; }
    .nis { font-size: 7pt; color: #94a3b8; font-family: monospace; }
    .program-label { font-size: 6pt; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 2px; }
    .program-name { font-size: 12pt; font-weight: 700; color: #1e3a5f; margin-bottom: 6px; }
    .pencapaian { font-size: 8pt; color: #334155; font-style: italic; max-width: 420px; margin: 0 auto 8px; line-height: 1.5; }
    .badges { display: flex; justify-content: center; gap: 32px; align-items: flex-end; }
    .badge { display: flex; flex-direction: column; align-items: center; gap: 2px; }
    .badge-label { font-size: 6.5pt; font-weight: 700; color: #64748b; text-transform: uppercase; }
    .badge-label-dark { font-size: 5.5pt; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.1em; }
    .star { color: #fbbf24; font-size: 18pt; }
    .footer { display: flex; justify-content: space-between; padding: 0 40px; }
    .sign-block { text-align: center; width: 160px; }
    .sign-label { font-size: 7pt; color: #64748b; margin-bottom: 40px; line-height: 1.6; }
    .sign-line { border-top: 1px solid #0f172a; padding-top: 4px; }
    .sign-name { font-size: 8pt; font-weight: 700; color: #0f172a; white-space: nowrap; }
    .watermark {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0.02; pointer-events: none;
      color: #0f172a;
    }
  </style>
</head>
<body>
<div class="card">
  <div class="header">
    <div class="logo">
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
    </div>
    <h1>${settings.schoolName}</h1>
    <h2>${settings.schoolSubtitle}</h2>
    <div class="divider">
      <div class="divider-line"></div>
      <span class="divider-text">${settings.certificateType}</span>
      <div class="divider-line"></div>
    </div>
  </div>
  <div class="body">
    <p class="intro">${settings.introText}</p>
    <div class="name-block">
      <div class="santri-name">${santri.name}</div>
      <div class="nis">NIS: ${santri.nis}</div>
    </div>
    <div class="program-label">Program</div>
    <div class="program-name">${settings.title}</div>
    <div class="pencapaian">&ldquo;${settings.pencapaian}&rdquo;</div>
    <div class="badges">
      <div class="badge"><span class="star">★</span><span class="badge-label">${settings.predikat}</span></div>
      <div class="badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
        <span class="badge-label-dark">Tersertifikasi</span>
      </div>
      <div class="badge"><span class="star">★</span><span class="badge-label">${settings.predikat}</span></div>
    </div>
  </div>
  <div class="footer">
    <div class="sign-block">
      <div class="sign-label">${settings.leftSignTitle}</div>
      <div class="sign-line"><span class="sign-name">${settings.leftSignName}</span></div>
    </div>
    <div class="sign-block">
      <div class="sign-label">${settings.location},<br/>${dateStr}<br/>${settings.rightSignTitle}</div>
      <div class="sign-line"><span class="sign-name">${settings.rightSignName}</span></div>
    </div>
  </div>
  <div class="watermark">
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
  </div>
</div>
<script>window.onload = function(){ window.print(); window.onafterprint = function(){ window.close(); }; }<\/script>
</body>
</html>`;
    const win = window.open('', '_blank', 'width=1200,height=700');
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Menyiapkan Ijazah...</div>;
  if (!santri) return <div className="p-8 text-center text-rose-500">Data santri tidak ditemukan.</div>;

  const isPublished = existingIjazah?.is_published;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => {}} />}

      {/* Action Bar */}
      <div className="max-w-5xl mx-auto mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
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
        <div className="max-w-5xl mx-auto mb-6 print:hidden">
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
      <div className="max-w-5xl mx-auto animate-fade-in">
        <div className="bg-white border-[12px] border-double border-slate-900 p-8 md:p-12 text-center relative print:border-slate-800 print:shadow-none shadow-xl aspect-[297/210] flex flex-col justify-between print-ijazah-container overflow-hidden">

          {/* Header */}
          <div className="mb-4 relative z-10">
            <div className="w-16 h-16 bg-[#1e3a5f] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-lg">
              <BookOpen size={36} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-widest mb-1">{settings.schoolName}</h1>
            <h2 className="text-4xl font-black text-[#1e3a5f] uppercase tracking-tighter mb-6">{settings.schoolSubtitle}</h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-slate-300"></div>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{settings.certificateType}</span>
              <div className="h-px w-16 bg-slate-300"></div>
            </div>
          </div>

          {/* Body */}
          <div className="max-w-2xl mx-auto space-y-4 flex-1 flex flex-col justify-center relative z-10">
            <p className="text-base text-slate-600 leading-relaxed">
              {settings.introText}
            </p>
            <div className="py-3 border-y border-slate-100 print:py-4">
              <h3 className="text-3xl font-bold text-slate-900 uppercase mb-1 print:text-4xl">{santri.name}</h3>
              <p className="text-xs text-slate-500 font-mono">NIS: {santri.nis}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Program</p>
              <p className="text-lg font-bold text-[#1e3a5f] print:text-xl">{settings.title}</p>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed italic max-w-xl mx-auto print:text-base">
              "{settings.pencapaian}"
            </p>

            <div className="flex items-center justify-center gap-10 pt-2 print:pt-4">
              <div className="flex flex-col items-center">
                <Star className="text-amber-400 mb-1" size={24} fill="currentColor" />
                <span className="text-xs font-bold text-slate-500 uppercase">{settings.predikat}</span>
              </div>
              <div className="flex flex-col items-center">
                <Award className="text-[#1e3a5f] mb-1" size={40} />
                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Tersertifikasi</span>
              </div>
              <div className="flex flex-col items-center">
                <Star className="text-amber-400 mb-1" size={24} fill="currentColor" />
                <span className="text-xs font-bold text-slate-500 uppercase">{settings.predikat}</span>
              </div>
            </div>
          </div>

          {/* Footer / Signature */}
          <div className="mt-8 flex justify-between items-end px-12 print:mt-12 relative z-10">
            <div className="text-center w-52">
              <p className="text-xs text-slate-500 mb-14 print:mb-16">{settings.leftSignTitle}</p>
              <div className="border-t border-slate-955 pt-1">
                <p className="text-sm font-bold text-slate-900 whitespace-nowrap">{settings.leftSignName}</p>
              </div>
            </div>
            <div className="text-center w-52">
              <p className="text-xs text-slate-500 mb-14 print:mb-16">
                {settings.location},<br />
                {format(new Date(), 'dd MMMM yyyy', { locale: localeId })}<br />
                {settings.rightSignTitle}
              </p>
              <div className="border-t border-slate-955 pt-1">
                <p className="text-sm font-bold text-slate-900 whitespace-nowrap">{settings.rightSignName}</p>
              </div>
            </div>
          </div>

          {/* Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none print-watermark">
            <BookOpen size={450} />
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Edit Isi Ijazah">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">

          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-100">Identitas Lembaga</p>
          <div>
            <label className="form-label">Nama Pesantren (baris atas)</label>
            <input type="text" className="input-field" value={settings.schoolName}
              onChange={e => setSettings({ ...settings, schoolName: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Nama Lembaga (baris bawah, besar)</label>
            <input type="text" className="input-field" value={settings.schoolSubtitle}
              onChange={e => setSettings({ ...settings, schoolSubtitle: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Jenis Dokumen (di bawah garis)</label>
            <input type="text" className="input-field" value={settings.certificateType}
              onChange={e => setSettings({ ...settings, certificateType: e.target.value })} />
          </div>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-100 pt-2">Isi Ijazah</p>
          <div>
            <label className="form-label">Kalimat Pembuka</label>
            <textarea rows={2} className="input-field" value={settings.introText}
              onChange={e => setSettings({ ...settings, introText: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Judul Program</label>
            <input type="text" className="input-field" value={settings.title}
              onChange={e => setSettings({ ...settings, title: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Kalimat Pencapaian (ditampilkan dalam tanda petik)</label>
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

          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-100 pt-2">Tanda Tangan</p>
          <div className="grid grid-cols-2 gap-3">
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
