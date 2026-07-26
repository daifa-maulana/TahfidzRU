import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { BookOpen, Award, Star, Printer, ArrowLeft, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

export default function IjazahWali() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ijazahList, setIjazahList] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    async function fetch() {
      try {
        // Get all santri belonging to this wali
        const { data: santriData } = await supabase
          .from('santri')
          .select('id, name, nis')
          .eq('wali_id', user!.id);

        if (!santriData || santriData.length === 0) { setLoading(false); return; }

        const santriIds = santriData.map((s: any) => s.id);

        // Get published ijazah for those santri
        const { data: ijazahData } = await supabase
          .from('ijazah')
          .select('*, santri:santri_id(name, nis)')
          .in('santri_id', santriIds)
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        setIjazahList(ijazahData || []);
        if (ijazahData && ijazahData.length > 0) setSelected(ijazahData[0]);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetch();
  }, [user?.id]);

  const handlePrint = () => {
    if (!selected) return;
    const dateStr = format(new Date(selected.issue_date || selected.created_at), 'dd MMMM yyyy', { locale: localeId });
    const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Ijazah – ${selected.santri?.name}</title>
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
    <h1>Pondok Pesantren Tahfidz</h1>
    <h2>Roudhlatul Ulum</h2>
    <div class="divider">
      <div class="divider-line"></div>
      <span class="divider-text">Ijazah Kehormatan</span>
      <div class="divider-line"></div>
    </div>
  </div>
  <div class="body">
    <p class="intro">Dengan penuh rasa syukur dan bangga, kami menganugerahkan ijazah ini kepada:</p>
    <div class="name-block">
      <div class="santri-name">${selected.santri?.name}</div>
      <div class="nis">NIS: ${selected.santri?.nis}</div>
    </div>
    <div class="program-label">Program</div>
    <div class="program-name">${selected.title}</div>
    <div class="pencapaian">&ldquo;${selected.pencapaian}&rdquo;</div>
    <div class="badges">
      <div class="badge"><span class="star">★</span><span class="badge-label">${selected.predikat}</span></div>
      <div class="badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
        <span class="badge-label-dark">Tersertifikasi</span>
      </div>
      <div class="badge"><span class="star">★</span><span class="badge-label">${selected.predikat}</span></div>
    </div>
  </div>
  <div class="footer">
    <div class="sign-block">
      <div class="sign-label">${selected.left_sign_title}</div>
      <div class="sign-line"><span class="sign-name">${selected.left_sign_name}</span></div>
    </div>
    <div class="sign-block">
      <div class="sign-label">${selected.location},<br/>${dateStr}<br/>${selected.right_sign_title}</div>
      <div class="sign-line"><span class="sign-name">${selected.right_sign_name}</span></div>
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

  if (loading) return <div className="flex h-96 items-center justify-content text-slate-400">Memuat ijazah...</div>;

  if (ijazahList.length === 0) {
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

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button onClick={() => navigate(-1)} className="btn-secondary mb-2">
            <ArrowLeft size={16} /> Kembali
          </button>
          <h1 className="page-header">Ijazah Ananda</h1>
          <p className="text-sm text-slate-500">Dokumen resmi yang diterbitkan oleh pesantren</p>
        </div>
        <div className="flex gap-2">
          {ijazahList.length > 1 && (
            <select className="input-field" onChange={e => {
              const found = ijazahList.find(i => i.id === e.target.value);
              setSelected(found);
            }}>
              {ijazahList.map(i => (
                <option key={i.id} value={i.id}>{i.santri?.name} – {i.title}</option>
              ))}
            </select>
          )}
          <button onClick={handlePrint} className="btn-primary">
            <Printer size={16} /> Cetak
          </button>
        </div>
      </div>

      {selected && (
        <div className="max-w-4xl mx-auto">
          {/* Issued date badge */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <Clock size={13} />
            Diterbitkan pada {format(new Date(selected.issue_date || selected.created_at), 'dd MMMM yyyy', { locale: localeId })}
          </div>

          {/* Diploma preview (on screen only) */}
          <div className="bg-white border-[12px] border-double border-slate-900 p-10 md:p-16 text-center relative shadow-xl min-h-[800px] flex flex-col justify-between">

            {/* Header */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-[#1e3a5f] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 shadow-lg">
                <BookOpen size={40} />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 uppercase tracking-widest mb-1">
                Pondok Pesantren Tahfidz
              </h1>
              <h2 className="text-4xl md:text-5xl font-black text-[#1e3a5f] uppercase tracking-tighter mb-6">
                Roudhlatul Ulum
              </h2>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-16 bg-slate-300" />
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Ijazah Kehormatan</span>
                <div className="h-px w-16 bg-slate-300" />
              </div>
            </div>

            {/* Body */}
            <div className="max-w-xl mx-auto space-y-5 flex-1 flex flex-col justify-center">
              <p className="text-base text-slate-600 leading-relaxed">
                Dengan penuh rasa syukur dan bangga, kami menganugerahkan ijazah ini kepada:
              </p>
              <div className="py-4 border-y border-slate-100">
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 uppercase mb-2">
                  {selected.santri?.name}
                </h3>
                <p className="text-sm text-slate-500 font-mono">NIS: {selected.santri?.nis}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Program</p>
                <p className="text-base font-bold text-[#1e3a5f]">{selected.title}</p>
              </div>
              <p className="text-sm md:text-base text-slate-700 leading-relaxed italic">
                "{selected.pencapaian}"
              </p>
              <div className="flex items-center justify-center gap-10 pt-2">
                <div className="flex flex-col items-center">
                  <Star className="text-amber-400 mb-1" size={28} fill="currentColor" />
                  <span className="text-xs font-bold text-slate-500 uppercase">{selected.predikat}</span>
                </div>
                <div className="flex flex-col items-center">
                  <Award className="text-[#1e3a5f] mb-1" size={44} />
                  <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Tersertifikasi</span>
                </div>
                <div className="flex flex-col items-center">
                  <Star className="text-amber-400 mb-1" size={28} fill="currentColor" />
                  <span className="text-xs font-bold text-slate-500 uppercase">{selected.predikat}</span>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="mt-12 flex justify-between items-end px-8">
              <div className="text-center w-48">
                <p className="text-xs text-slate-500 mb-14">{selected.left_sign_title}</p>
                <div className="border-t border-slate-900 pt-2">
                  <p className="text-sm font-bold text-slate-900 whitespace-nowrap">{selected.left_sign_name}</p>
                </div>
              </div>
              <div className="text-center w-48">
                <p className="text-xs text-slate-500 mb-14">
                  {selected.location},<br />
                  {format(new Date(selected.issue_date || selected.created_at), 'dd MMMM yyyy', { locale: localeId })}<br />
                  {selected.right_sign_title}
                </p>
                <div className="border-t border-slate-900 pt-2">
                  <p className="text-sm font-bold text-slate-900 whitespace-nowrap">{selected.right_sign_name}</p>
                </div>
              </div>
            </div>

            {/* Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
              <BookOpen size={500} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
