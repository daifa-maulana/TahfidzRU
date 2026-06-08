export const ABSENSI_SESSIONS = ['Shubuh', 'Ashar', 'Maghrib'] as const;
export type AbsensiSession = (typeof ABSENSI_SESSIONS)[number];

export const DEFAULT_ABSENSI_SESSION: AbsensiSession = 'Shubuh';

export const SESSION_GENDER_MAP: Record<AbsensiSession, 'L' | 'P' | 'all'> = {
  Shubuh: 'all',
  Ashar: 'all',
  Maghrib: 'L',
};
