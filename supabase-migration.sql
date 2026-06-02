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
