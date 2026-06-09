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

export const FALLBACK_HERO_SLIDES: HeroSlide[] = [];

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
