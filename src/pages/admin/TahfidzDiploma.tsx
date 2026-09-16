import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dataService } from '../../services/data';
import { Printer, ArrowLeft, Settings, Send, CheckCircle2, Loader2, AlertTriangle, UserPlus, Upload, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
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
  const [uploadingLeftSign, setUploadingLeftSign] = useState(false);
  const [uploadingRightSign, setUploadingRightSign] = useState(false);
  const leftFileRef = useRef<HTMLInputElement>(null);
  const rightFileRef = useRef<HTMLInputElement>(null);
  const { toast, showToast } = useToast();

  const [settings, setSettings] = useState({
    title: "Program Tahfidz Al-Qur'an",
    statementText: "Telah menyelesaikan program tahfidz Al-Qur'an dengan pencapaian:",
    pencapaian: "Al-Qur'an 3 Juz (Juz 28-30)",
    location: 'Cihanjuang, Parongpong',
    predikat: 'Mumtaz',
    leftSignName: 'K.H. Ubaydillah Al Bisyri',
    leftSignTitle: 'Pengasuh Pesantren',
    leftSignImage: '',
    rightSignName: 'Hj. Siti Aisyah, S.Pd.I',
    rightSignTitle: 'Ketua Program Tahfidz',
    rightSignImage: '',
  });

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        const [santriData, ijazahData] = await Promise.all([
          dataService.getSantriById(id).catch(() => null),
          dataService.getIjazahBySantri(id).catch(() => null),
        ]);

        if (santriData) {
          setSantri(santriData);
        }

        if (ijazahData) {
          setExistingIjazah(ijazahData);
          setSettings({
            title: ijazahData.title || settings.title,
            statementText: ijazahData.statement_text || "Telah menyelesaikan program tahfidz Al-Qur'an dengan pencapaian:",
            pencapaian:
              ijazahData.pencapaian ||
              (santriData?.target_hafalan ? `Al-Qur'an ${santriData.target_hafalan}` : settings.pencapaian),
            location: ijazahData.location || settings.location,
            predikat: ijazahData.predikat || settings.predikat,
            leftSignName: ijazahData.left_sign_name || settings.leftSignName,
            leftSignTitle: ijazahData.left_sign_title || settings.leftSignTitle,
            leftSignImage: ijazahData.left_sign_image || '',
            rightSignName: ijazahData.right_sign_name || settings.rightSignName,
            rightSignTitle: ijazahData.right_sign_title || settings.rightSignTitle,
            rightSignImage: ijazahData.right_sign_image || '',
          });
        } else if (santriData?.target_hafalan) {
          setSettings((prev) => ({
            ...prev,
            pencapaian: `Al-Qur'an ${santriData.target_hafalan}`,
          }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleUploadSign = async (e: React.ChangeEvent<HTMLInputElement>, side: 'left' | 'right') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (side === 'left') setUploadingLeftSign(true);
    else setUploadingRightSign(true);

    try {
      const url = await dataService.uploadKontenMedia(file, 'ijazah');
      setSettings((prev) => ({
        ...prev,
        [side === 'left' ? 'leftSignImage' : 'rightSignImage']: url,
      }));
      showToast('Tanda tangan berhasil diunggah!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal mengunggah tanda tangan', 'error');
    } finally {
      if (side === 'left') setUploadingLeftSign(false);
      else setUploadingRightSign(false);
    }
  };

  const handleSave = async (publish = false) => {
    if (!id) return;
    setIsSaving(true);
    try {
      const payload = {
        santri_id: id,
        title: settings.title,
        statement_text: settings.statementText,
        pencapaian: settings.pencapaian,
        location: settings.location,
        predikat: settings.predikat,
        left_sign_name: settings.leftSignName,
        left_sign_title: settings.leftSignTitle,
        left_sign_image: settings.leftSignImage,
        right_sign_name: settings.rightSignName,
        right_sign_title: settings.rightSignTitle,
        right_sign_image: settings.rightSignImage,
        is_published: publish,
        issue_date: existingIjazah?.issue_date || format(new Date(), 'yyyy-MM-dd'),
      };

      const saved = await dataService.saveIjazah(payload);
      setExistingIjazah(saved);
      showToast(publish ? 'Ijazah berhasil dikirim ke portal wali!' : 'Ijazah berhasil disimpan!', 'success');
      setIsSettingsOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan ijazah', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Menyiapkan Ijazah...</div>;
  if (!santri) return <div className="p-8 text-center text-rose-500">Data santri tidak ditemukan.</div>;

  const isPublished = existingIjazah?.is_published;
  const issueDate = existingIjazah?.issue_date
    ? format(new Date(existingIjazah.issue_date), 'dd MMMM yyyy', { locale: localeId })
    : format(new Date(), 'dd MMMM yyyy', { locale: localeId });

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 print:p-0 print:bg-white">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => {}} />}

      {/* Action Bar */}
      <div className="max-w-[1123px] mx-auto mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
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
            <Settings size={16} /> Edit &amp; Simpan
          </button>
          <button onClick={() => window.print()} className="btn-secondary">
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

      {/* Wali warning */}
      {!santri.wali_id && (
        <div className="max-w-[1123px] mx-auto mb-4 print:hidden">
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-amber-800">Santri Belum Terhubung ke Wali</p>
              <p className="text-xs text-amber-600 mt-0.5">
                Ijazah ini tidak bisa dikirim karena <strong>{santri.name}</strong> belum memiliki wali terdaftar.
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

      {/* DIPLOMA CANVAS - Exact Ratio 1123 x 794 */}
      <div className="overflow-x-auto pb-4">
        <div className="md:hidden text-center text-xs text-slate-500 mb-2 font-medium flex items-center justify-center gap-1.5 print:hidden bg-slate-200/60 py-1 px-3 rounded-full w-fit mx-auto">
          <span>↔ Geser ke samping untuk melihat sertifikat utuh</span>
        </div>
        <div
          id="diploma-print"
          style={{ width: 1123, height: 794, minWidth: 1123 }}
          className="mx-auto relative bg-white shadow-2xl print:shadow-none overflow-hidden select-none"
        >
          {/* Background Clean Artwork */}
          <img
            src="/sertifikat_bg.png"
            alt="Sertifikat Background"
            className="absolute inset-0 w-full h-full object-fill pointer-events-none z-0"
          />

          {/* 1. Subtitle / Label */}
          <div
            className="absolute z-10 w-full text-center"
            style={{
              top: '36.5%',
              left: 0,
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: '15px',
              fontStyle: 'italic',
              fontWeight: 500,
              color: '#2b3730',
            }}
          >
            Diberikan Kepada :
          </div>

          {/* 2. Dynamic Student Name */}
          <div
            className="absolute z-10 w-full text-center"
            style={{
              top: '40.8%',
              left: 0,
              fontFamily: "'Playfair Display', 'Georgia', 'Times New Roman', serif",
              fontSize: '44px',
              fontStyle: 'italic',
              fontWeight: 700,
              color: '#1d3e2e',
              lineHeight: 1.1,
            }}
          >
            {santri.name}
          </div>

          {/* 3. Statement / Description */}
          <div
            className="absolute z-10 w-full text-center px-12"
            style={{
              top: '52.0%',
              left: 0,
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: '15px',
              color: '#2b3730',
            }}
          >
            {settings.statementText}
          </div>

          {/* 4. Dynamic Hafalan Detail */}
          <div
            className="absolute z-10 w-full text-center"
            style={{
              top: '57.0%',
              left: 0,
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: '20px',
              fontStyle: 'italic',
              fontWeight: 700,
              color: '#1d3e2e',
            }}
          >
            {settings.pencapaian}
          </div>

          {/* 5. Dynamic Date & Location */}
          <div
            className="absolute z-10 text-center"
            style={{
              top: '64.5%',
              left: '52%',
              width: '34%',
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: '15px',
              fontWeight: 700,
              color: '#2b3730',
            }}
          >
            {settings.location}, {issueDate}
          </div>

          {/* 6. Left Signer Name, Title & Digital Signature */}
          <div
            className="absolute z-10 text-center flex flex-col items-center justify-end"
            style={{
              top: '71.0%',
              left: '14%',
              width: '28%',
              height: '115px',
            }}
          >
            {/* Digital Signature Image */}
            <div className="h-16 w-full flex items-end justify-center mb-1">
              {settings.leftSignImage ? (
                <img
                  src={settings.leftSignImage}
                  alt="Tanda Tangan Kiri"
                  className="max-h-16 max-w-[140px] object-contain"
                />
              ) : (
                <div className="h-12"></div>
              )}
            </div>
            <div
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: '16px',
                fontWeight: 700,
                color: '#1d3e2e',
              }}
            >
              {settings.leftSignName}
            </div>
            <div
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: '12.5px',
                color: '#4a5568',
                marginTop: '2px',
              }}
            >
              {settings.leftSignTitle}
            </div>
          </div>

          {/* 7. Right Signer Name, Title & Digital Signature */}
          <div
            className="absolute z-10 text-center flex flex-col items-center justify-end"
            style={{
              top: '71.0%',
              left: '58%',
              width: '28%',
              height: '115px',
            }}
          >
            {/* Digital Signature Image */}
            <div className="h-16 w-full flex items-end justify-center mb-1">
              {settings.rightSignImage ? (
                <img
                  src={settings.rightSignImage}
                  alt="Tanda Tangan Kanan"
                  className="max-h-16 max-w-[140px] object-contain"
                />
              ) : (
                <div className="h-12"></div>
              )}
            </div>
            <div
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: '16px',
                fontWeight: 700,
                color: '#1d3e2e',
              }}
            >
              {settings.rightSignName}
            </div>
            <div
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: '12.5px',
                color: '#4a5568',
                marginTop: '2px',
              }}
            >
              {settings.rightSignTitle}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Pengaturan Ijazah
            </h3>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Judul Program</label>
                <input
                  type="text"
                  className="input-field mt-1"
                  value={settings.title}
                  onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Teks Pernyataan Kelulusan</label>
                <textarea
                  rows={2}
                  className="input-field mt-1"
                  value={settings.statementText}
                  onChange={(e) => setSettings({ ...settings, statementText: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Detail Pencapaian Hafalan</label>
                <input
                  type="text"
                  className="input-field mt-1"
                  value={settings.pencapaian}
                  onChange={(e) => setSettings({ ...settings, pencapaian: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Lokasi Terbit</label>
                <input
                  type="text"
                  className="input-field mt-1"
                  value={settings.location}
                  onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                />
              </div>

              {/* Left Signer & Signature */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Penandatangan Kiri</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Nama</label>
                    <input
                      type="text"
                      className="input-field mt-1 text-sm"
                      value={settings.leftSignName}
                      onChange={(e) => setSettings({ ...settings, leftSignName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Jabatan</label>
                    <input
                      type="text"
                      className="input-field mt-1 text-sm"
                      value={settings.leftSignTitle}
                      onChange={(e) => setSettings({ ...settings, leftSignTitle: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                    Gambar Tanda Tangan Kiri
                  </label>
                  {settings.leftSignImage ? (
                    <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200">
                      <img
                        src={settings.leftSignImage}
                        alt="Tanda Tangan Kiri"
                        className="h-10 max-w-[100px] object-contain border border-slate-100 rounded"
                      />
                      <span className="text-xs text-emerald-600 font-medium flex-1 truncate">Tanda tangan terpasang</span>
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, leftSignImage: '' })}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus gambar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={leftFileRef}
                        accept="image/*"
                        onChange={(e) => handleUploadSign(e, 'left')}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => leftFileRef.current?.click()}
                        disabled={uploadingLeftSign}
                        className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                      >
                        {uploadingLeftSign ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                        Unggah Tanda Tangan Kiri
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Signer & Signature */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Penandatangan Kanan</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Nama</label>
                    <input
                      type="text"
                      className="input-field mt-1 text-sm"
                      value={settings.rightSignName}
                      onChange={(e) => setSettings({ ...settings, rightSignName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Jabatan</label>
                    <input
                      type="text"
                      className="input-field mt-1 text-sm"
                      value={settings.rightSignTitle}
                      onChange={(e) => setSettings({ ...settings, rightSignTitle: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                    Gambar Tanda Tangan Kanan
                  </label>
                  {settings.rightSignImage ? (
                    <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200">
                      <img
                        src={settings.rightSignImage}
                        alt="Tanda Tangan Kanan"
                        className="h-10 max-w-[100px] object-contain border border-slate-100 rounded"
                      />
                      <span className="text-xs text-emerald-600 font-medium flex-1 truncate">Tanda tangan terpasang</span>
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, rightSignImage: '' })}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus gambar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={rightFileRef}
                        accept="image/*"
                        onChange={(e) => handleUploadSign(e, 'right')}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => rightFileRef.current?.click()}
                        disabled={uploadingRightSign}
                        className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                      >
                        {uploadingRightSign ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                        Unggah Tanda Tangan Kanan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsSettingsOpen(false)} className="btn-secondary">
                Batal
              </button>
              <button onClick={() => handleSave(false)} disabled={isSaving} className="btn-primary">
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Simpan Draf'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
