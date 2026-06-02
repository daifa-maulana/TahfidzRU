import { supabase } from '../lib/supabase';
import type { AbsensiSession } from '../constants/absensi';

const sanitizeSantriPayload = (data: Record<string, unknown>) => {
  const payload: Record<string, unknown> = {
    name: String(data.name || '').trim(),
    nis: String(data.nis || '').trim(),
    class_name: String(data.class_name || '').trim() || null,
    type: data.type || 'Mukim',
    gender: data.gender || 'L',
    wali_id: data.wali_id ? data.wali_id : null,
  };
  const email = String(data.email || '').trim();
  if (email) payload.email = email;
  const photo = data.photo_url;
  if (typeof photo === 'string' && photo.length > 0 && photo.length < 500_000) {
    payload.photo_url = photo;
  }
  return payload;
};

// Generic CRUD operations handler
const handleResponse = async (promise: any) => {
  try {
    const { data, error } = await promise;
    if (error) {
      console.error('Supabase Error:', error);
      throw error;
    }
    return data;
  } catch (err: any) {
    console.error('Network/Request Error:', err);
    // Specifically handle "Failed to fetch" to provide a cleaner developer experience
    if (err.message === 'Failed to fetch') {
      throw new Error('Gagal menghubungi server. Pastikan koneksi internet aktif dan konfigurasi Supabase sudah benar.');
    }
    throw err;
  }
};

export const dataService = {
  // Santri
  getSantriList: () => handleResponse(supabase.from('santri').select('*').order('name')),
  getSantriById: (id: string) => handleResponse(supabase.from('santri').select('*').eq('id', id).single()),
  createSantri: (data: any) =>
    handleResponse(supabase.from('santri').insert(sanitizeSantriPayload(data)).select().single()),
  updateSantri: (id: string, data: any) =>
    handleResponse(supabase.from('santri').update(sanitizeSantriPayload(data)).eq('id', id).select().single()),
  deleteSantri: (id: string) => handleResponse(supabase.from('santri').delete().eq('id', id)),

  // Absensi
  getAbsensiList: (date?: string, session?: AbsensiSession) => {
    let query = supabase.from('absensi').select('*, santri(name, nis, class_name)');
    if (date) query = query.eq('date', date);
    if (session) query = query.eq('session', session);
    return handleResponse(query);
  },
  getAbsensiBySantri: (santriId: string) => handleResponse(
    supabase.from('absensi')
      .select('*')
      .eq('santri_id', santriId)
  ),
  saveAbsensi: async (absensiData: any[]) => {
    if (absensiData.length === 0) return null;
    const date = absensiData[0].date;
    const session = absensiData[0].session || 'Shubuh';
    const santriIds = absensiData.map(a => a.santri_id);

    await supabase
      .from('absensi')
      .delete()
      .eq('date', date)
      .eq('session', session)
      .in('santri_id', santriIds);

    return handleResponse(supabase.from('absensi').insert(absensiData));
  },

  // Tahfidz
  getTahfidzLogs: (santriId?: string) => {
    let query = supabase.from('tahfidz').select('*, santri(name)');
    if (santriId) query = query.eq('santri_id', santriId);
    return handleResponse(query.order('created_at', { ascending: false }));
  },
  createTahfidz: (data: any) => handleResponse(supabase.from('tahfidz').insert(data)),
  updateTahfidz: (id: string, data: any) => handleResponse(supabase.from('tahfidz').update(data).eq('id', id)),
  deleteTahfidz: (id: string) => handleResponse(supabase.from('tahfidz').delete().eq('id', id)),

  // Profiles (User Management)
  getProfiles: () => handleResponse(supabase.from('profiles').select('*')),
  getWaliList: () => handleResponse(supabase.from('profiles').select('*').eq('role', 'wali').eq('is_approved', true).order('full_name')),
  updateProfile: (id: string, data: any) => handleResponse(supabase.from('profiles').update(data).eq('id', id)),
  
  // Keuangan
  getTransactions: (santriId?: string) => {
    let query = supabase.from('transactions').select('*, santri(name)');
    if (santriId) query = query.eq('santri_id', santriId);
    return handleResponse(query.order('date', { ascending: false }));
  },
  createTransaction: (data: any) => handleResponse(supabase.from('transactions').insert(data)),
  updateTransaction: (id: string, data: any) => handleResponse(supabase.from('transactions').update(data).eq('id', id)),
  deleteTransaction: (id: string) => handleResponse(supabase.from('transactions').delete().eq('id', id)),

  // Nilai & Kurikulum
  getKurikulum: () => handleResponse(supabase.from('kurikulum').select('*').order('subject')),
  createKurikulum: (data: any) => handleResponse(supabase.from('kurikulum').insert(data)),
  updateKurikulum: (id: string, data: any) => handleResponse(supabase.from('kurikulum').update(data).eq('id', id)),
  deleteKurikulum: (id: string) => handleResponse(supabase.from('kurikulum').delete().eq('id', id)),

  getNilai: (santriId: string) => handleResponse(
    supabase.from('nilai')
      .select('*, kurikulum(subject)')
      .eq('santri_id', santriId)
      .order('created_at', { ascending: false })
  ),
  createNilai: (data: any) => handleResponse(supabase.from('nilai').insert(data)),
  updateNilai: (id: string, data: any) => handleResponse(supabase.from('nilai').update(data).eq('id', id)),
  deleteNilai: (id: string) => handleResponse(supabase.from('nilai').delete().eq('id', id)),

  // Agenda
  getAgenda: () => handleResponse(supabase.from('agenda').select('*').order('date', { ascending: true })),
  createAgenda: (data: any) => handleResponse(supabase.from('agenda').insert(data)),
  updateAgenda: (id: string, data: any) => handleResponse(supabase.from('agenda').update(data).eq('id', id)),
  deleteAgenda: (id: string) => handleResponse(supabase.from('agenda').delete().eq('id', id)),

  // Dashboard Stats
  getDashboardStats: async () => {
    const { count: santriCount } = await supabase.from('santri').select('*', { count: 'exact', head: true });
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { data: recentTahfidz } = await supabase.from('tahfidz').select('*, santri(name)').limit(5).order('created_at', { ascending: false });
    const { count: pendingTransactions } = await supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('status', 'Pending');
    const { data: upcomingAgenda } = await supabase.from('agenda').select('*').gte('date', new Date().toISOString().split('T')[0]).limit(3).order('date');
    
    return {
      santriCount: santriCount || 0,
      userCount: userCount || 0,
      recentTahfidz: recentTahfidz || [],
      pendingTransactions: pendingTransactions || 0,
      upcomingAgenda: upcomingAgenda || []
    };
  }
};
