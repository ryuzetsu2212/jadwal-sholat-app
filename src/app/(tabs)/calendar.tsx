import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HIJRI_MONTHS, HijriDate, formatHijri, toHijri } from '../../hijri';
import { Theme } from '../../theme';
import { useAppTheme } from '../../useAppTheme';

const DAYS_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

interface Cell {
  date: Date;
  hijri: HijriDate;
  inMonth: boolean;
}

function buildCells(year: number, month: number): Cell[] {
  const first = new Date(year, month, 1);
  const startOffset = first.getDay(); // 0 = Minggu
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Cell[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(year, month, 1 - startOffset + i);
    cells.push({
      date: d,
      hijri: toHijri(d),
      inMonth: d.getMonth() === month,
    });
    if (i >= startOffset + daysInMonth - 1 && (i + 1) % 7 === 0) break;
  }
  return cells;
}

function hijriRange(cells: Cell[]): string {
  const inMonth = cells.filter((c) => c.inMonth);
  const first = inMonth[0].hijri;
  const last = inMonth[inMonth.length - 1].hijri;
  if (first.month === last.month) return `${HIJRI_MONTHS[first.month - 1]} ${first.year} H`;
  return `${HIJRI_MONTHS[first.month - 1]} – ${HIJRI_MONTHS[last.month - 1]} ${last.year} H`;
}

export default function Calendar() {
  const theme: Theme = useAppTheme();
  const now = useMemo(() => new Date(), []);
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [selected, setSelected] = useState<Date>(now);

  const cells = useMemo(() => buildCells(ym.y, ym.m), [ym]);
  const s = styles(theme);
  const isToday = (d: Date) => d.toDateString() === now.toDateString();
  const isSelected = (d: Date) => d.toDateString() === selected.toDateString();

  const shift = (dir: number) => {
    const d = new Date(ym.y, ym.m + dir, 1);
    setYm({ y: d.getFullYear(), m: d.getMonth() });
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Pressable onPress={() => shift(-1)} style={s.navBtn}>
          <Ionicons name="chevron-back" size={22} color={theme.primary} />
        </Pressable>
        <View style={s.headerText}>
          <Text style={s.headerTitle}>
            {MONTHS_ID[ym.m]} {ym.y}
          </Text>
          <Text style={s.headerSub}>{hijriRange(cells)}</Text>
        </View>
        <Pressable onPress={() => shift(1)} style={s.navBtn}>
          <Ionicons name="chevron-forward" size={22} color={theme.primary} />
        </Pressable>
      </View>

      <View style={s.weekRow}>
        {DAYS_SHORT.map((d) => (
          <Text key={d} style={s.weekDay}>
            {d}
          </Text>
        ))}
      </View>

      <View style={s.grid}>
        {cells.map((c, i) => (
          <View key={i} style={s.cellWrap}>
            <Pressable
              style={[s.cell, isSelected(c.date) && s.cellSelected, isToday(c.date) && s.cellToday]}
              onPress={() => setSelected(c.date)}
            >
              <Text
                style={[
                  s.cellDay,
                  !c.inMonth && s.cellDayFaded,
                  isSelected(c.date) && s.cellDaySelected,
                ]}
              >
                {c.date.getDate()}
              </Text>
              <Text
                style={[
                  s.cellHijri,
                  !c.inMonth && s.cellDayFaded,
                  isSelected(c.date) && s.cellDaySelected,
                ]}
              >
                {c.hijri.day}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>

      <View style={s.detail}>
        <Text style={s.detailTitle}>
          {selected.getDate()} {MONTHS_ID[selected.getMonth()]} {selected.getFullYear()}
        </Text>
        <Text style={s.detailSub}>{formatHijri(toHijri(selected))}</Text>
      </View>
    </View>
  );
}

const styles = (t: Theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: t.bg, padding: 16 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    navBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: t.card,
      borderWidth: 1,
      borderColor: t.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerText: { alignItems: 'center' },
    headerTitle: { color: t.text, fontSize: 18, fontWeight: '700' },
    headerSub: { color: t.subtext, fontSize: 13, marginTop: 2 },
    weekRow: { flexDirection: 'row', marginBottom: 4 },
    weekDay: { flex: 1, textAlign: 'center', color: t.subtext, fontSize: 12, fontWeight: '600' },
    grid: { flexDirection: 'row', flexWrap: 'wrap' },
    cellWrap: { width: `${100 / 7}%`, padding: 3 },
    cell: {
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
    },
    cellSelected: { backgroundColor: t.primary },
    cellToday: { borderWidth: 1.5, borderColor: t.primary },
    cellDay: { color: t.text, fontSize: 15, fontWeight: '500', fontVariant: ['tabular-nums'] },
    cellHijri: { color: t.subtext, fontSize: 10, fontVariant: ['tabular-nums'] },
    cellDayFaded: { opacity: 0.35 },
    cellDaySelected: { color: '#fff' },
    detail: {
      marginTop: 16,
      backgroundColor: t.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: t.border,
      padding: 16,
      alignItems: 'center',
    },
    detailTitle: { color: t.text, fontSize: 16, fontWeight: '700' },
    detailSub: { color: t.primary, fontSize: 14, marginTop: 4, fontWeight: '600' },
  });
