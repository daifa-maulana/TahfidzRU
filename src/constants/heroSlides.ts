export type HeroSlide =
  | {
      type: 'image';
      src: string;
      alt: string;
      caption?: string;
    }
  | {
      type: 'video';
      src: string;
      poster: string;
      alt: string;
      caption?: string;
    };

/** Ganti src dengan foto/video asli pesantren di folder public/hero/ */
export const FALLBACK_HERO_SLIDES: HeroSlide[] = [
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1920',
    alt: 'Gedung Pondok Pesantren Roudlotul Ulum',
    caption: 'Lingkungan pesantren yang asri di Parongpong, Bandung Barat',
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=1920',
    alt: 'Kegiatan tahfidz santri putra',
    caption: 'Program tahfidz intensif dengan bimbingan ustadz berpengalaman',
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1920',
    alt: 'Kajian kitab kuning santri putra',
    caption: 'Integrasi ilmu diniyah salaf dan pendidikan tahfidz mutqin',
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1920',
    alt: 'Murojaah hafalan bersama',
    caption: 'Membangun generasi Qur\'ani yang berakhlak mulia',
  },
];

export function mapHeroFromDb(items: any[]): HeroSlide[] {
  return (items || []).map((item) => {
    if (item.type === 'video') {
      return {
        type: 'video' as const,
        src: item.media_url,
        poster: item.poster_url || item.media_url,
        alt: item.alt,
        caption: item.caption || undefined,
      };
    }
    return {
      type: 'image' as const,
      src: item.media_url,
      alt: item.alt,
      caption: item.caption || undefined,
    };
  });
}
