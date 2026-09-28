// Konversi Masehi -> Hijriah (kalender tabular/aritmetik)

export const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabiulawal', 'Rabiulakhir',
  'Jumadilawal', 'Jumadilakhir', 'Rajab', "Syakban",
  'Ramadan', 'Syawal', 'Zulkaidah', 'Zulhijah',
];

export interface HijriDate {
  day: number;
  month: number; // 1-12
  year: number;
}

function gregorianToJd(y: number, m: number, d: number): number {
  if (m < 3) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524;
}

function islamicToJd(year: number, month: number, day: number): number {
  return (
    day +
    Math.ceil(29.5 * (month - 1)) +
    (year - 1) * 354 +
    Math.floor((3 + 11 * year) / 30) +
    1948439.5 -
    1
  );
}

export function toHijri(date: Date): HijriDate {
  const jd = gregorianToJd(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const l = Math.floor(jd) + 0.5;
  // Perkiraan tahun lalu koreksi (mundur/maju) sampai tepat, agar tidak meleset.
  let year = Math.floor((30 * (l - 1948439.5)) / 10631);
  while (islamicToJd(year + 1, 1, 1) <= l) year++;
  while (islamicToJd(year, 1, 1) > l) year--;
  let month = 1;
  while (month < 12 && islamicToJd(year, month + 1, 1) <= l) month++;
  const day = Math.floor(l - islamicToJd(year, month, 1) + 1);
  return { day, month, year };
}

export function formatHijri(h: HijriDate): string {
  return `${h.day} ${HIJRI_MONTHS[h.month - 1]} ${h.year} H`;
}

const DAYS_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export function formatGregorian(date: Date): string {
  return `${DAYS_ID[date.getDay()]}, ${date.getDate()} ${MONTHS_ID[date.getMonth()]} ${date.getFullYear()}`;
}
