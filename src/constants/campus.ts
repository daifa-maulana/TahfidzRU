/** Konfigurasi kampus - ubah di sini jika beralih putra/putri */
export const CAMPUS_TYPE = 'putra' as const;
export const CAMPUS_GENDER = 'L' as const;
export const CAMPUS_LABEL = 'Putra';
export const CAMPUS_GENDER_LABEL = 'Laki-laki (Putra)';
export const CAMPUS_FULL_NAME = "Pondok Pesantren Roudlotul 'Ulum Tahfidz Putra";
export const CAMPUS_SUBTITLE = 'Tahfidz Putra · Parongpong KBB';

/** Sesi presensi: putra = Shubuh/Ashar/Maghrib, putri = Shubuh/Ashar/Isya */
export const CAMPUS_ABSENSI_SESSIONS =
  CAMPUS_TYPE === 'putra'
    ? (['Shubuh', 'Ashar', 'Maghrib'] as const)
    : (['Shubuh', 'Ashar', 'Isya'] as const);

export type CampusAbsensiSession = (typeof CAMPUS_ABSENSI_SESSIONS)[number];

export const CAMPUS_ABSENSI_SESSION_LABEL = CAMPUS_ABSENSI_SESSIONS.join(', ');

const emptySessionStats = () => ({ hadir: 0, izin: 0, sakit: 0, alpa: 0, total: 0 });

export type SessionStats = ReturnType<typeof emptySessionStats>;

export function createEmptySessionStats(): Record<CampusAbsensiSession, SessionStats> {
  return Object.fromEntries(
    CAMPUS_ABSENSI_SESSIONS.map((s) => [s, emptySessionStats()])
  ) as Record<CampusAbsensiSession, SessionStats>;
}