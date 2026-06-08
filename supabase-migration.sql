-- Jalankan di Supabase SQL Editor jika database sudah ada sebelumnya

ALTER TABLE santri ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Mukim'
  CHECK (type IN ('Mukim', 'Non-Mukim'));

ALTER TABLE absensi ADD COLUMN IF NOT EXISTS session TEXT DEFAULT 'Shubuh'
  CHECK (session IN ('Shubuh', 'Ashar', 'Maghrib'));

UPDATE absensi SET session = 'Shubuh' WHERE session IS NULL;

-- Ganti constraint unik lama jika ada, lalu buat yang baru
ALTER TABLE absensi DROP CONSTRAINT IF EXISTS absensi_santri_id_date_key;
ALTER TABLE absensi DROP CONSTRAINT IF EXISTS absensi_santri_date_session_unique;
CREATE UNIQUE INDEX IF NOT EXISTS absensi_santri_date_session_unique
  ON absensi (santri_id, date, session);

ALTER TABLE agenda ADD COLUMN IF NOT EXISTS time TIME DEFAULT '08:00';

ALTER TABLE absensi DROP CONSTRAINT IF EXISTS absensi_session_check;
ALTER TABLE absensi ADD CONSTRAINT absensi_session_check
  CHECK (session IN ('Shubuh', 'Ashar', 'Maghrib', 'Isya'));

ALTER TABLE tahfidz ADD COLUMN IF NOT EXISTS setoran_mode TEXT DEFAULT 'per_halaman'
  CHECK (setoran_mode IN ('per_juz', 'per_halaman'));

DROP POLICY IF EXISTS "agenda_pengajar_all" ON agenda;
CREATE POLICY "agenda_pengajar_all" ON agenda FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'pengajar')
);

-- Migrasi baru
ALTER TABLE santri ADD COLUMN IF NOT EXISTS tahfidz_level TEXT DEFAULT 'binnadzhor'
  CHECK (tahfidz_level IN ('binnadzhor', 'bilghoib'));

ALTER TABLE agenda ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Konten website: hero slider & galeri
CREATE TABLE IF NOT EXISTS hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT DEFAULT 'image' CHECK (type IN ('image', 'video')),
    media_url TEXT NOT NULL,
    poster_url TEXT,
    alt TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS galeri_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Kegiatan' CHECK (category IN ('Kegiatan', 'Fasilitas', 'Kajian')),
    image_url TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeri_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "hero_slides_select_all" ON hero_slides;
DROP POLICY IF EXISTS "hero_slides_admin_all" ON hero_slides;
CREATE POLICY "hero_slides_select_all" ON hero_slides FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "hero_slides_admin_all" ON hero_slides FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "galeri_items_select_all" ON galeri_items;
DROP POLICY IF EXISTS "galeri_items_admin_all" ON galeri_items;
CREATE POLICY "galeri_items_select_all" ON galeri_items FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "galeri_items_admin_all" ON galeri_items FOR ALL USING (is_admin());

INSERT INTO storage.buckets (id, name, public)
VALUES ('konten', 'konten', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "konten_public_read" ON storage.objects;
DROP POLICY IF EXISTS "konten_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "konten_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "konten_admin_delete" ON storage.objects;

CREATE POLICY "konten_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'konten');
CREATE POLICY "konten_admin_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'konten' AND is_admin());
CREATE POLICY "konten_admin_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'konten' AND is_admin());
CREATE POLICY "konten_admin_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'konten' AND is_admin());
