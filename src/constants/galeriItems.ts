export interface GaleriItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description?: string;
}

export const FALLBACK_GALERI_ITEMS: GaleriItem[] = [
  {
    id: '1',
    title: 'Setoran Hafalan Santri',
    category: 'Kegiatan',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800',
    description: 'Santri putra khusyuk menyetorkan hafalannya di hadapan ustadz pembimbing.',
  },
  {
    id: '2',
    title: 'Gedung Pondok Pesantren',
    category: 'Fasilitas',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800',
    description: 'Gedung utama pesantren Roudlotul Ulum yang asri dan representatif di Parongpong.',
  },
  {
    id: '3',
    title: 'Kajian Kitab Kuning',
    category: 'Kajian',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
    description: 'Kegiatan rutin mengaji kitab salaf untuk membekali santri pemahaman fiqih dan akhlak.',
  },
  {
    id: '4',
    title: 'Perpustakaan Mini',
    category: 'Fasilitas',
    image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=800',
    description: 'Koleksi kitab dan buku umum untuk memperluas wawasan santri.',
  },
  {
    id: '5',
    title: 'Kegiatan Ekstrakurikuler',
    category: 'Kegiatan',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800',
    description: 'Olahraga bersama untuk menjaga kebugaran jasmani santri.',
  },
  {
    id: '6',
    title: 'Murojaah Bersama',
    category: 'Kajian',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    description: 'Mengulang hafalan bersama-sama selepas shalat Shubuh berjamaah.',
  },
];

export function mapGaleriFromDb(items: any[]): GaleriItem[] {
  return (items || []).map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    image: item.image_url,
    description: item.description || '',
  }));
}

