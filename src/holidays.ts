// Hari besar Indonesia: libur nasional resmi (SKB 3 Menteri) + hari besar Islam.
// Untuk 2026 dan 2027 memakai tanggal resmi SKB. Tahun lain memakai
// perhitungan Hijriah (tabular) untuk hari besar Islam dan tanggal tetap Masehi.

import { HijriDate } from './hijri';

// Hari besar Islam: kunci "bulan-hari" Hijriah. Berlaku untuk semua tahun.
const HIJRI_HOLIDAYS: Record<string, string> = {
  '1-1': 'Tahun Baru Hijriah',
  '3-12': 'Maulid Nabi Muhammad SAW',
  '7-27': 'Isra Mikraj Nabi Muhammad SAW',
  '9-1': 'Awal Ramadan',
  '9-17': 'Nuzulul Quran',
  '10-1': 'Idul Fitri',
  '10-2': 'Idul Fitri',
  '12-9': 'Hari Arafah',
  '12-10': 'Idul Adha',
};

// Hari besar nasional tanggal tetap (Masehi). Berlaku untuk semua tahun.
const GREGORIAN_FIXED: Record<string, string> = {
  '1-1': 'Tahun Baru Masehi',
  '4-21': 'Hari Kartini',
  '5-1': 'Hari Buruh Internasional',
  '5-2': 'Hari Pendidikan Nasional',
  '5-20': 'Hari Kebangkitan Nasional',
  '6-1': 'Hari Lahir Pancasila',
  '8-17': 'Hari Kemerdekaan RI',
  '9-30': 'Hari Kesaktian Pancasila',
  '10-1': 'Hari Kesaktian Pancasila',
  '10-28': 'Hari Sumpah Pemuda',
  '11-10': 'Hari Pahlawan',
  '12-22': 'Hari Ibu',
  '12-25': 'Hari Natal',
};

// Libur nasional 2026 (SKB 3 Menteri). Kunci "tahun-bulan-hari".
// Hari besar Islam mengikuti tanggal resmi pemerintah (bisa beda 1 hari dari hisab).
const OFFICIAL_2026: Record<string, string> = {
  '2026-1-1': 'Tahun Baru Masehi',
  '2026-1-16': 'Isra Mikraj Nabi Muhammad SAW',
  '2026-2-17': 'Tahun Baru Imlek 2577',
  '2026-3-19': 'Hari Suci Nyepi',
  '2026-3-21': 'Idul Fitri 1447 H',
  '2026-3-22': 'Idul Fitri 1447 H',
  '2026-4-3': 'Wafat Yesus Kristus',
  '2026-4-5': 'Hari Paskah',
  '2026-5-1': 'Hari Buruh Internasional',
  '2026-5-14': 'Kenaikan Yesus Kristus',
  '2026-5-27': 'Idul Adha 1447 H',
  '2026-5-31': 'Hari Raya Waisak 2570',
  '2026-6-1': 'Hari Lahir Pancasila',
  '2026-6-16': 'Tahun Baru Islam 1448 H',
  '2026-8-17': 'Hari Kemerdekaan RI',
  '2026-8-25': 'Maulid Nabi Muhammad SAW',
  '2026-12-25': 'Hari Natal',
};

// Libur nasional 2027 (SKB 3 Menteri).
const OFFICIAL_2027: Record<string, string> = {
  '2027-1-1': 'Tahun Baru Masehi',
  '2027-1-5': 'Isra Mikraj Nabi Muhammad SAW',
  '2027-2-6': 'Tahun Baru Imlek 2578',
  '2027-3-8': 'Hari Suci Nyepi',
  '2027-3-10': 'Idul Fitri 1448 H',
  '2027-3-11': 'Idul Fitri 1448 H',
  '2027-3-26': 'Wafat Yesus Kristus',
  '2027-3-28': 'Hari Paskah',
  '2027-5-1': 'Hari Buruh Internasional',
  '2027-5-6': 'Kenaikan Yesus Kristus',
  '2027-5-17': 'Idul Adha 1448 H',
  '2027-5-20': 'Hari Raya Waisak 2571',
  '2027-6-1': 'Hari Lahir Pancasila',
  '2027-6-6': 'Tahun Baru Islam 1449 H',
  '2027-8-15': 'Maulid Nabi Muhammad SAW',
  '2027-8-17': 'Hari Kemerdekaan RI',
  '2027-12-25': 'Hari Natal',
  '2027-12-26': 'Isra Mikraj Nabi Muhammad SAW',
};

const OFFICIAL: Record<string, string> = { ...OFFICIAL_2026, ...OFFICIAL_2027 };

export function getHoliday(d: Date, h: HijriDate): string | null {
  // 1. Cek tanggal resmi 2026/2027 dulu (paling akurat).
  const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  if (OFFICIAL[key]) return OFFICIAL[key];
  // 2. Hari besar Islam via Hijriah (untuk tahun lain).
  const hijriKey = `${h.month}-${h.day}`;
  if (HIJRI_HOLIDAYS[hijriKey]) return HIJRI_HOLIDAYS[hijriKey];
  // 3. Hari nasional tanggal tetap.
  const gregKey = `${d.getMonth() + 1}-${d.getDate()}`;
  return GREGORIAN_FIXED[gregKey] ?? null;
}
