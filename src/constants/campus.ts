/** Konfigurasi kampus — ubah di sini jika beralih putra/putri */
export const CAMPUS_TYPE = 'putri' as const;
export const CAMPUS_GENDER = 'P' as const;
export const CAMPUS_LABEL = 'Putri';
export const CAMPUS_GENDER_LABEL = 'Perempuan (Putri)';
export const CAMPUS_FULL_NAME = "Pondok Pesantren Roudlotul 'Ulum Tahfidz Putri";
export const CAMPUS_SUBTITLE = 'Tahfidz Putri · Parongpong KBB';

/** Sesi presensi: putra = Shubuh/Ashar/Maghrib, putri = Shubuh/Ashar/Isya */
export const CAMPUS_ABSENSI_SESSIONS =
  CAMPUS_TYPE === 'putri'
    ? (['Shubuh', 'Ashar', 'Isya'] as const)
    : (['Shubuh', 'Ashar', 'Maghrib'] as const);

export type CampusAbsensiSession = (typeof CAMPUS_ABSENSI_SESSIONS)[number];

export const CAMPUS_ABSENSI_SESSION_LABEL = CAMPUS_ABSENSI_SESSIONS.join(', ');

const emptySessionStats = () => ({ hadir: 0, izin: 0, sakit: 0, alpa: 0, total: 0 });

export type SessionStats = ReturnType<typeof emptySessionStats>;

export function createEmptySessionStats(): Record<CampusAbsensiSession, SessionStats> {
  return Object.fromEntries(
    CAMPUS_ABSENSI_SESSIONS.map((s) => [s, emptySessionStats()])
  ) as Record<CampusAbsensiSession, SessionStats>;
}
