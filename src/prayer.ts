import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from 'adhan';

export interface City {
  id: string;
  name: string;
  lat: number;
  lng: number;
  utcOffset: number; // jam, mis. WIB = 7
}

export const CITIES: City[] = [
  { id: 'bengkalis', name: 'Bengkalis', lat: 1.4852, lng: 102.1128, utcOffset: 7 },
  { id: 'pekanbaru', name: 'Pekanbaru', lat: 0.5071, lng: 101.4478, utcOffset: 7 },
  { id: 'dumai', name: 'Dumai', lat: 1.6667, lng: 101.4, utcOffset: 7 },
  { id: 'tanjung-pinang', name: 'Tanjung Pinang', lat: 0.9176, lng: 104.4391, utcOffset: 7 },
  { id: 'banda-aceh', name: 'Banda Aceh', lat: 5.5483, lng: 95.3238, utcOffset: 7 },
  { id: 'medan', name: 'Medan', lat: 3.5952, lng: 98.6722, utcOffset: 7 },
  { id: 'padang', name: 'Padang', lat: -0.9471, lng: 100.4172, utcOffset: 7 },
  { id: 'jambi', name: 'Jambi', lat: -1.6101, lng: 103.6131, utcOffset: 7 },
  { id: 'palembang', name: 'Palembang', lat: -2.9909, lng: 104.7565, utcOffset: 7 },
  { id: 'bandar-lampung', name: 'Bandar Lampung', lat: -5.4297, lng: 105.2626, utcOffset: 7 },
  { id: 'jakarta', name: 'Jakarta', lat: -6.2088, lng: 106.8456, utcOffset: 7 },
  { id: 'bandung', name: 'Bandung', lat: -6.9175, lng: 107.6191, utcOffset: 7 },
  { id: 'semarang', name: 'Semarang', lat: -6.9667, lng: 110.4167, utcOffset: 7 },
  { id: 'yogyakarta', name: 'Yogyakarta', lat: -7.7956, lng: 110.3695, utcOffset: 7 },
  { id: 'surabaya', name: 'Surabaya', lat: -7.2575, lng: 112.7521, utcOffset: 7 },
  { id: 'pontianak', name: 'Pontianak', lat: -0.0263, lng: 109.3425, utcOffset: 7 },
  { id: 'banjarmasin', name: 'Banjarmasin', lat: -3.3186, lng: 114.5944, utcOffset: 8 },
  { id: 'balikpapan', name: 'Balikpapan', lat: -1.2654, lng: 116.8312, utcOffset: 8 },
  { id: 'denpasar', name: 'Denpasar', lat: -8.6705, lng: 115.2126, utcOffset: 8 },
  { id: 'makassar', name: 'Makassar', lat: -5.1477, lng: 119.4327, utcOffset: 8 },
  { id: 'manado', name: 'Manado', lat: 1.4748, lng: 124.8421, utcOffset: 8 },
];

export interface Prayer {
  key: string;
  name: string;
  time: Date;
}

export function getCity(id: string): City {
  return CITIES.find((c) => c.id === id) ?? CITIES[0];
}

// Metode Singapura (Subuh 20°, Isya 18°) setara metode Kemenag, mazhab Syafi'i.
function calculate(city: City, date: Date): Prayer[] {
  const params = CalculationMethod.Singapore();
  params.madhab = Madhab.Shafi;
  const pt = new PrayerTimes(new Coordinates(city.lat, city.lng), date, params);

  // Koreksi zona waktu: tampilkan waktu sesuai zona kota, bukan zona perangkat.
  const deviceOffset = -date.getTimezoneOffset() / 60;
  const shift = (city.utcOffset - deviceOffset) * 3600 * 1000;
  const at = (d: Date) => new Date(d.getTime() + shift);

  return [
    { key: 'subuh', name: 'Subuh', time: at(pt.fajr) },
    { key: 'dzuhur', name: 'Dzuhur', time: at(pt.dhuhr) },
    { key: 'ashar', name: 'Ashar', time: at(pt.asr) },
    { key: 'maghrib', name: 'Maghrib', time: at(pt.maghrib) },
    { key: 'isya', name: 'Isya', time: at(pt.isha) },
  ];
}

export function getTodayPrayers(city: City): Prayer[] {
  return calculate(city, new Date());
}

export function getTomorrowPrayers(city: City): Prayer[] {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return calculate(city, t);
}

export function getNextPrayer(city: City, prayers: Prayer[], now: Date): { prayer: Prayer; isTomorrow: boolean } {
  for (const p of prayers) {
    if (p.time.getTime() > now.getTime()) return { prayer: p, isTomorrow: false };
  }
  // Lewat Isya: sholat berikutnya adalah Subuh besok
  const t = new Date(now);
  t.setDate(t.getDate() + 1);
  return { prayer: calculate(city, t)[0], isTomorrow: true };
}

export function formatTime(d: Date): string {
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}
