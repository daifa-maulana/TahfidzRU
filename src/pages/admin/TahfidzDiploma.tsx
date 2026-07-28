import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { BookOpen, Printer, ArrowLeft, Award, Star, Settings, Send, CheckCircle2, Loader2, AlertTriangle, UserPlus, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';

export default function TahfidzDiploma() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [santri, setSantri] = useState<any>(null);
  const [ijazahList, setIjazahList] = useState<any[]>([]);
  const [selectedIjazah, setSelectedIjazah] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const resetToDefaultSettings = () => {
    setSettings({
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
  };

  const loadIjazahSettings = (d: any) => {
    setSettings({
      schoolName: d.school_name || 'Pondok Pesantren Tahfidz',
      schoolSubtitle: d.school_subtitle || 'Roudhlatul Ulum',
      certificateType: d.certificate_type || 'Ijazah Kehormatan',
      introText: d.intro_text || 'Dengan penuh rasa syukur dan bangga, kami menganugerahkan ijazah ini kepada:',
      title: d.title || 'Program Tahfidz Al-Qur\'an',
      pencapaian: d.pencapaian || '',
      location: d.location || 'Cihanjuang, Parongpong',
      predikat: d.predikat || 'Mumtaz',
      leftSignName: d.left_sign_name || 'K.H. Ubaydillah Al Bisyri',
      leftSignTitle: d.left_sign_title || 'Pengasuh Pesantren',
      rightSignName: d.right_sign_name || 'Hj. Siti Aisyah, S.Pd.I',
      rightSignTitle: d.right_sign_title || 'Ketua Program Tahfidz',
    });
  };

  const fetchIjazahList = async () => {
    try {
      const { data, error } = await supabase
        .from('ijazah')
        .select('*')
        .eq('santri_id', id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setIjazahList(data || []);
      return data || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [santriRes, ijazahs] = await Promise.all([
          supabase.from('santri').select('*').eq('id', id).single(),
          fetchIjazahList()
        ]);
        if (santriRes.error) throw santriRes.error;
        setSantri(santriRes.data);

        if (ijazahs && ijazahs.length > 0) {
          setSelectedIjazah(ijazahs[0]);
          loadIjazahSettings(ijazahs[0]);
        } else {
          setSelectedIjazah(null);
          resetToDefaultSettings();
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

      let savedData: any = null;
      if (selectedIjazah) {
        const { data, error } = await supabase.from('ijazah').update(payload).eq('id', selectedIjazah.id).select().single();
        if (error) throw error;
        savedData = data;
      } else {
        const { data, error } = await supabase.from('ijazah').insert(payload).select().single();
        if (error) throw error;
        savedData = data;
      }

      const list = await fetchIjazahList();
      const updatedItem = list.find((item: any) => item.id === savedData.id);
      setSelectedIjazah(updatedItem || savedData);

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

  const handleDelete = async () => {
    if (!selectedIjazah) return;
    if (!confirm('Apakah Anda yakin ingin menghapus sertifikat ini?')) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('ijazah').delete().eq('id', selectedIjazah.id);
      if (error) throw error;
      showToast('Sertifikat berhasil dihapus', 'success');
      const list = await fetchIjazahList();
      if (list && list.length > 0) {
        setSelectedIjazah(list[0]);
        loadIjazahSettings(list[0]);
      } else {
        setSelectedIjazah(null);
        resetToDefaultSettings();
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus sertifikat', 'error');
    } finally {
      setIsDeleting(false);
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
      padding: 16mm;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
      background-image: url('/sertifikat 1.svg');
      background-size: 100% 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-color: white;
    }
    .card {
      width: 297mm;
      height: 210mm;
      position: relative;
      overflow: hidden;
      background-image: url('/sertifikat 1.svg');
      background-size: 100% 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-color: white;
    }
    .cert-name {
      position: absolute;
      top: 48%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 4px 20px;
      font-family: 'Playfair Display', serif;
      font-weight: bold;
      font-style: italic;
      font-size: 26pt;
      color: #0f172a;
      white-space: nowrap;
    }
    .cert-program {
      position: absolute;
      top: 64%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 4px 20px;
      font-family: 'Inter', sans-serif;
      font-weight: bold;
      font-size: 16pt;
      color: #1e3a5f;
      white-space: nowrap;
    }
    .cert-date {
      position: absolute;
      bottom: 23%;
      right: 16%;
      background: white;
      padding: 2px 10px;
      font-family: 'Inter', sans-serif;
      font-size: 10pt;
      color: #334155;
      white-space: nowrap;
      text-align: right;
    }
    .cert-sign-left {
      position: absolute;
      bottom: 10%;
      left: 20%;
      width: 180px;
      text-align: center;
      background: white;
      padding: 4px 10px;
      font-family: 'Inter', sans-serif;
    }
    .cert-sign-right {
      position: absolute;
      bottom: 10%;
      right: 20%;
      width: 180px;
      text-align: center;
      background: white;
      padding: 4px 10px;
      font-family: 'Inter', sans-serif;
    }
    .sign-title {
      font-size: 7.5pt;
      color: #64748b;
      margin-bottom: 25px;
      line-height: 1.4;
    }
    .sign-name {
      font-size: 8.5pt;
      font-weight: 700;
      color: #0f172a;
      border-top: 1px solid #0f172a;
      padding-top: 3px;
      display: inline-block;
      width: 100%;
    }
  </style>
</head>
<body>
<div class="card">
  <div class="cert-name">${santri.name}</div>
  <div class="cert-program">${settings.title}</div>
  <div class="cert-date">${settings.location || 'Cihanjuang'}, ${dateStr}</div>
  <div class="cert-sign-left">
    <div class="sign-title">${settings.leftSignTitle}</div>
    <div class="sign-name">${settings.leftSignName}</div>
  </div>
  <div class="cert-sign-right">
    <div class="sign-title">${settings.rightSignTitle}</div>
    <div class="sign-name">${settings.rightSignName}</div>
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

  const isPublished = selectedIjazah?.is_published;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => {}} />}

      {/* Action Bar */}
      <div className="max-w-5xl mx-auto mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <button onClick={() => navigate(-1)} className="btn-secondary mb-2">
            <ArrowLeft size={16} /> Kembali
          </button>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-500 font-semibold">Pilih Ijazah:</span>
            <select
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
              value={selectedIjazah?.id || 'new'}
              onChange={(e) => {
                if (e.target.value === 'new') {
                  setSelectedIjazah(null);
                  resetToDefaultSettings();
                } else {
                  const found = ijazahList.find(i => i.id === e.target.value);
                  if (found) {
                    setSelectedIjazah(found);
                    loadIjazahSettings(found);
                  }
                }
              }}
            >
              {ijazahList.map((i, index) => (
                <option key={i.id} value={i.id}>
                  {i.title} ({i.is_published ? 'Dikirim' : 'Draf'})
                </option>
              ))}
              <option value="new">+ Tambah Sertifikat Baru</option>
            </select>
          </div>

          {isPublished && (
            <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-2">
              <CheckCircle2 size={13} /> Sudah dikirim ke portal wali
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {selectedIjazah && (
            <button onClick={handleDelete} disabled={isDeleting} className="btn-secondary text-rose-600 hover:bg-rose-50 border-rose-200 hover:border-rose-300">
              {isDeleting ? <Loader2 size={16} className="animate-spin text-rose-500" /> : <Trash size={16} />}
              Hapus
            </button>
          )}
          <button onClick={() => setIsSettingsOpen(true)} className="btn-secondary">
            <Settings size={16} /> Edit & Simpan
          </button>
          <button onClick={handlePrint} className="btn-secondary" disabled={!selectedIjazah}>
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
      <div className="max-w-5xl mx-auto animate-fade-in mb-10">
        <div
          className="bg-white relative shadow-xl flex flex-col justify-between overflow-hidden"
          style={{
            aspectRatio: '297/210',
            backgroundImage: "url('/sertifikat 1.svg')",
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100%',
            maxWidth: '780px',
            height: 'auto'
          }}
        >
          {/* Scaled overlays for responsive browser preview */}
          <div 
            className="absolute inset-0"
            style={{ fontSize: 'calc(0.6vw + 0.4vh)' }}
          >
            <div 
              className="absolute bg-white px-2 py-0.5 font-bold italic font-serif text-slate-900 whitespace-nowrap"
              style={{
                top: '48%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '2.2em'
              }}
            >
              {santri.name}
            </div>

            <div 
              className="absolute bg-white px-2 py-0.5 font-bold text-[#1e3a5f] whitespace-nowrap"
              style={{
                top: '64%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '1.3em'
              }}
            >
              {settings.title}
            </div>

            <div 
              className="absolute bg-white px-2 py-0.5 text-slate-700 whitespace-nowrap"
              style={{
                bottom: '23%',
                right: '16%',
                fontSize: '0.85em'
              }}
            >
              {settings.location || 'Cihanjuang'}, {format(new Date(), 'dd MMMM yyyy', { locale: localeId })}
            </div>

            <div 
              className="absolute bg-white px-2 py-0.5 text-center"
              style={{
                bottom: '9%',
                left: '20%',
                width: '24%',
                fontSize: '0.8em'
              }}
            >
              <div className="text-slate-500 mb-[1.5em] leading-tight">{settings.leftSignTitle}</div>
              <div className="font-bold text-slate-900 border-t border-slate-900 pt-0.5 truncate">{settings.leftSignName}</div>
            </div>

            <div 
              className="absolute bg-white px-2 py-0.5 text-center"
              style={{
                bottom: '9%',
                right: '20%',
                width: '24%',
                fontSize: '0.8em'
              }}
            >
              <div className="text-slate-500 mb-[1.5em] leading-tight">{settings.rightSignTitle}</div>
              <div className="font-bold text-slate-900 border-t border-slate-900 pt-0.5 truncate">{settings.rightSignName}</div>
            </div>
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
