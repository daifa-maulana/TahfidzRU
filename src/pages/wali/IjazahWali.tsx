import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { dataService } from '../../services/data';
import { Award, Printer, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

export default function IjazahWali() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ijazahList, setIjazahList] = useState<any[]>([]);
  const [selectedIjazah, setSelectedIjazah] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    async function fetchData() {
      try {
        const list = await dataService.getIjazahListByWali(user!.id);
        setIjazahList(list);
        if (list.length > 0) {
          setSelectedIjazah(list[0]);
        }
      } catch (e) {
        console.error('Error fetching ijazah list for wali:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user?.id]);

  if (loading) return <div className="p-8 text-center text-slate-400">Memuat ijazah...</div>;

  if (ijazahList.length === 0 || !selectedIjazah) {
    return (
      <div className="space-y-6 pb-10">
        <button onClick={() => navigate(-1)} className="btn-secondary">
          <ArrowLeft size={16} /> Kembali
        </button>
        <div className="card p-16 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Award className="text-slate-300" size={40} />
          </div>
          <h2 className="text-lg font-bold text-slate-700 mb-2">Belum Ada Ijazah</h2>
          <p className="text-sm text-slate-500 max-w-sm">
            Ijazah ananda belum tersedia atau belum diterbitkan oleh pihak pesantren. Silakan hubungi admin untuk informasi lebih lanjut.
          </p>
        </div>
      </div>
    );
  }

  const santri = selectedIjazah.santri || {};
  const issueDate = selectedIjazah.issue_date
    ? format(new Date(selectedIjazah.issue_date), 'dd MMMM yyyy', { locale: localeId })
    : format(new Date(), 'dd MMMM yyyy', { locale: localeId });

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 print:p-0 print:bg-white">
      {/* Top Selector & Action Bar */}
      <div className="max-w-[1123px] mx-auto mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <button onClick={() => navigate(-1)} className="btn-secondary mb-2">
            <ArrowLeft size={16} /> Kembali
          </button>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="text-emerald-600" /> Ijazah Tahfidz Santri
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Sertifikat kelulusan hafalan Al-Qur'an resmi</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {ijazahList.length > 1 && (
            <select
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm"
              value={selectedIjazah.id}
              onChange={(e) => setSelectedIjazah(ijazahList.find((i) => i.id === e.target.value))}
            >
              {ijazahList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.santri?.name}
                </option>
              ))}
            </select>
          )}

          <button onClick={() => window.print()} className="btn-primary bg-emerald-600 hover:bg-emerald-700">
            <Printer size={16} /> Cetak / Unduh PDF
          </button>
        </div>
      </div>

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
            {selectedIjazah.statement_text || "Telah menyelesaikan program tahfidz Al-Qur'an dengan pencapaian:"}
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
            {selectedIjazah.pencapaian || `Al-Qur'an ${santri.target_hafalan || ''}`}
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
            {selectedIjazah.location || 'Cihanjuang, Parongpong'}, {issueDate}
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
              {selectedIjazah.left_sign_image ? (
                <img
                  src={selectedIjazah.left_sign_image}
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
              {selectedIjazah.left_sign_name || 'Penguji Tahfidz'}
            </div>
            <div
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: '12.5px',
                color: '#4a5568',
                marginTop: '2px',
              }}
            >
              {selectedIjazah.left_sign_title || 'Pengasuh Pesantren'}
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
              {selectedIjazah.right_sign_image ? (
                <img
                  src={selectedIjazah.right_sign_image}
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
              {selectedIjazah.right_sign_name || 'Ketua Program Tahfidz'}
            </div>
            <div
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: '12.5px',
                color: '#4a5568',
                marginTop: '2px',
              }}
            >
              {selectedIjazah.right_sign_title || 'Pimpinan Rumah Tahfidz'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
