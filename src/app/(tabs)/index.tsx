import { useEffect, useMemo, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { formatGregorian, formatHijri, toHijri } from '../../hijri';
import { rescheduleReminders } from '../../notifications';
import {
  Prayer,
  formatTime,
  getCity,
  getNextPrayer,
  getTodayPrayers,
  getTomorrowPrayers,
} from '../../prayer';
import { Theme } from '../../theme';
import { useAppTheme } from '../../useAppTheme';
import { useSettings } from '../../settings-context';

const HERO = require('../../../assets/mosque-hero.jpg');

function useNow(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function countdown(target: Date, now: Date): string {
  let s = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const m = Math.floor(s / 60);
  s -= m * 60;
  const p = (n: number) => n.toString().padStart(2, '0');
  return `${p(h)}:${p(m)}:${p(s)}`;
}

export default function Home() {
  const theme = useAppTheme();
  const { settings } = useSettings();
  const now = useNow();

  const city = useMemo(() => getCity(settings.cityId), [settings.cityId]);
  const today = useMemo(() => getTodayPrayers(city), [city]);
  const tomorrow = useMemo(() => getTomorrowPrayers(city), [city]);
  const next = useMemo(() => getNextPrayer(city, today, now), [city, today, now]);

  // Jadwalkan ulang pengingat setiap kali kota/pengaturan berubah
  useEffect(() => {
    rescheduleReminders(city, today, settings.reminderMinutes, settings.reminderEnabled).catch(() => {});
  }, [city, today, settings.reminderEnabled, settings.reminderMinutes]);

  const s = styles(theme);

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <ImageBackground source={HERO} style={s.hero} imageStyle={s.heroImage}>
        <View style={s.heroOverlay}>
          <Text style={s.heroLabel}>Berikutnya</Text>
          <Text style={s.heroPrayer}>{next.prayer.name}</Text>
          <Text style={s.heroTime}>{formatTime(next.prayer.time)} WIB</Text>
          <Text style={s.countdown}>{countdown(next.prayer.time, now)}</Text>
          <Text style={s.heroDate}>
            {formatGregorian(now)}{'\n'}{formatHijri(toHijri(now))}
          </Text>
          <Text style={s.heroCity}>{city.name}</Text>
        </View>
      </ImageBackground>

      <Text style={s.sectionTitle}>Hari ini</Text>
      {today.map((p: Prayer) => {
        const isNext = p.key === next.prayer.key && !next.isTomorrow;
        const passed = p.time.getTime() <= now.getTime();
        return (
          <View key={p.key} style={[s.row, isNext && s.rowNext]}>
            <Text style={[s.rowName, isNext && s.rowNameNext, passed && !isNext && s.rowPassed]}>
              {p.name}
            </Text>
            <Text style={[s.rowTime, isNext && s.rowNameNext, passed && !isNext && s.rowPassed]}>
              {formatTime(p.time)}
            </Text>
          </View>
        );
      })}

      <Text style={s.sectionTitle}>Besok</Text>
      {tomorrow.map((p: Prayer) => (
        <View key={p.key} style={s.row}>
          <Text style={s.rowName}>{p.name}</Text>
          <Text style={s.rowTime}>{formatTime(p.time)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = (t: Theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: t.bg },
    content: { padding: 16, paddingBottom: 32 },
    hero: { borderRadius: 20, overflow: 'hidden', marginBottom: 20 },
    heroImage: { borderRadius: 20 },
    heroOverlay: {
      backgroundColor: 'rgba(6, 40, 26, 0.55)',
      padding: 24,
      alignItems: 'center',
      borderRadius: 20,
    },
    heroLabel: { color: '#fff', opacity: 0.85, fontSize: 13, marginBottom: 2 },
    heroPrayer: { color: '#fff', fontSize: 32, fontWeight: '700' },
    heroTime: { color: '#fff', fontSize: 16, marginTop: 2, opacity: 0.9 },
    countdown: {
      color: '#fff',
      fontSize: 42,
      fontWeight: '800',
      fontVariant: ['tabular-nums'],
      marginTop: 8,
    },
    heroDate: { color: '#fff', fontSize: 12, marginTop: 10, opacity: 0.9, textAlign: 'center', lineHeight: 18 },
    heroCity: { color: '#fff', fontSize: 14, fontWeight: '600', marginTop: 6 },
    sectionTitle: { color: t.text, fontSize: 16, fontWeight: '700', marginBottom: 8, marginTop: 4 },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: t.card,
      borderRadius: 12,
      paddingVertical: 13,
      paddingHorizontal: 16,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: t.border,
    },
    rowNext: { backgroundColor: t.highlight, borderColor: t.primary },
    rowName: { color: t.text, fontSize: 16, fontWeight: '500' },
    rowNameNext: { color: t.primary, fontWeight: '700' },
    rowTime: { color: t.text, fontSize: 16, fontVariant: ['tabular-nums'] },
    rowPassed: { color: t.subtext },
  });
