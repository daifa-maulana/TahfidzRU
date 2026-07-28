-- ========================================================
-- MIGRATION: Pengaturan batasan kategori galeri & tabel pengaturan footer
-- ========================================================

-- 1. Perbarui check constraint kategori galeri agar mendukung 'Prestasi & Pencapaian'
ALTER TABLE galeri_items 
  DROP CONSTRAINT IF EXISTS galeri_items_category_check;

ALTER TABLE galeri_items 
  ADD CONSTRAINT galeri_items_category_check 
  CHECK (category IN ('Kegiatan', 'Fasilitas', 'Kajian', 'Prestasi & Pencapaian'));

-- 2. Buat tabel campus_settings untuk menyimpan pengaturan umum footer secara dinamis
CREATE TABLE IF NOT EXISTS campus_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Aktifkan RLS pada tabel campus_settings
ALTER TABLE campus_settings ENABLE ROW LEVEL SECURITY;

-- 4. Buat policy akses tabel campus_settings
DROP POLICY IF EXISTS "Allow select for everyone" ON campus_settings;
CREATE POLICY "Allow select for everyone" ON campus_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin all" ON campus_settings;
CREATE POLICY "Allow admin all" ON campus_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 5. Masukkan pengaturan bawaan (default settings)
INSERT INTO campus_settings (key, value) VALUES
('footer_desc', 'Mencetak generasi penghafal Al-Qur''an yang berakhlak mulia, unggul dalam ilmu pengetahuan, dan siap menghadapi tantangan zaman.'),
('footer_address', 'Cihanjuang Parongpong KBB, Jawa Barat'),
('footer_phone', '(022) 1234567'),
('footer_email', 'info@roudlotululum.com'),
('footer_instagram', 'https://instagram.com/roudlotululum'),
('footer_copyright', '© 2026 Pondok Pesantren Roudlotul ''Ulum. Hak Cipta Dilindungi.')
ON CONFLICT (key) DO NOTHING;
