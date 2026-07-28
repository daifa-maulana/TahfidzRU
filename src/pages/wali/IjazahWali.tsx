import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Award, Printer, ArrowLeft, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

export default function IjazahWali() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ijazahList, setIjazahList] = useState<any[]>([]);
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
          .select('*, santri(name, nis)')
          .in('santri_id', santriIds)
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        setIjazahList(ijazahData || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetch();
  }, [user?.id]);

  const handlePrint = (selected: any) => {
    if (!selected) return;
    const dateStr = `${selected.location || 'Cihanjuang'}, ${format(new Date(selected.issue_date || selected.created_at), 'dd MMMM yyyy', { locale: localeId })}`;
    const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Ijazah – ${selected.santri?.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');
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
  <div class="cert-name">${selected.santri?.name}</div>
  <div class="cert-program">${selected.title}</div>
  <div class="cert-date">${dateStr}</div>
  <div class="cert-sign-left">
    <div class="sign-title">${selected.left_sign_title}</div>
    <div class="sign-name">${selected.left_sign_name}</div>
  </div>
  <div class="cert-sign-right">
    <div class="sign-title">${selected.right_sign_title}</div>
    <div class="sign-name">${selected.right_sign_name}</div>
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

  if (loading) return <div className="flex h-96 items-center justify-center text-slate-400">Memuat ijazah...</div>;

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
      <div className="flex items-center justify-between gap-4">
        <div>
          <button onClick={() => navigate(-1)} className="btn-secondary mb-2">
            <ArrowLeft size={16} /> Kembali
          </button>
          <h1 className="page-header">Ijazah Ananda</h1>
          <p className="text-sm text-slate-500">Daftar ijazah resmi yang diterbitkan oleh pesantren</p>
        </div>
      </div>

      <div className="space-y-12">
        {ijazahList.map((item) => {
          const dateStr = `${item.location || 'Cihanjuang'}, ${format(new Date(item.issue_date || item.created_at), 'dd MMMM yyyy', { locale: localeId })}`;
          return (
            <div key={item.id} className="max-w-4xl mx-auto bg-slate-50 p-4 rounded-3xl border border-slate-200/60 shadow-sm">
              {/* Card actions */}
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Clock size={14} />
                  Diterbitkan pada {dateStr}
                </div>
                <button onClick={() => handlePrint(item)} className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5">
                  <Printer size={13} /> Cetak Ijazah Ini
                </button>
              </div>

              {/* Certificate preview */}
              <div
                className="bg-white relative shadow-md mx-auto overflow-hidden"
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
                    {item.santri?.name}
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
                    {item.title}
                  </div>

                  <div 
                    className="absolute bg-white px-2 py-0.5 text-slate-700 whitespace-nowrap"
                    style={{
                      bottom: '23%',
                      right: '16%',
                      fontSize: '0.85em'
                    }}
                  >
                    {dateStr}
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
                    <div className="text-slate-500 mb-[1.5em] leading-tight">{item.left_sign_title}</div>
                    <div className="font-bold text-slate-900 border-t border-slate-900 pt-0.5 truncate">{item.left_sign_name}</div>
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
                    <div className="text-slate-500 mb-[1.5em] leading-tight">{item.right_sign_title}</div>
                    <div className="font-bold text-slate-900 border-t border-slate-900 pt-0.5 truncate">{item.right_sign_name}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
