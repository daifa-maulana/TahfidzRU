import { CAMPUS_ABSENSI_SESSIONS, CAMPUS_GENDER } from './campus';

export const ABSENSI_SESSIONS = CAMPUS_ABSENSI_SESSIONS;
export type AbsensiSession = (typeof ABSENSI_SESSIONS)[number];

export const DEFAULT_ABSENSI_SESSION: AbsensiSession = 'Shubuh';

const thirdSession = ABSENSI_SESSIONS[2];

export const SESSION_GENDER_MAP: Record<AbsensiSession, 'L' | 'P' | 'all'> = {
  Shubuh: 'all',
  Ashar: 'all',
  ...(thirdSession === 'Isya' ? { Isya: 'P' as const } : { Maghrib: 'L' as const }),
} as Record<AbsensiSession, 'L' | 'P' | 'all'>;

export const DEFAULT_GENDER_FILTER = CAMPUS_GENDER;
