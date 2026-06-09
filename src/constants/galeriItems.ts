export interface GaleriItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description?: string;
}

export const FALLBACK_GALERI_ITEMS: GaleriItem[] = [];

export function mapGaleriFromDb(items: any[]): GaleriItem[] {
  return (items || []).map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    image: item.image_url,
    description: item.description || '',
  }));
}

