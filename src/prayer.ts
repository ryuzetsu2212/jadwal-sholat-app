import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from 'adhan';
import { CITIES, City } from './cities';

export { CITIES, City };
export { PROVINCES, getCitiesByProvince } from './cities';

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
