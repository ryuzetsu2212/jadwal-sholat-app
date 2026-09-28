import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { CITIES } from '../../prayer';
import { Settings } from '../../storage';
import { Theme } from '../../theme';
import { useAppTheme } from '../../useAppTheme';
import { useSettings } from '../../settings-context';
import { isReminderSupported } from '../../notifications';

const THEMES: { id: Settings['theme']; label: string }[] = [
  { id: 'auto', label: 'Otomatis' },
  { id: 'light', label: 'Terang' },
  { id: 'dark', label: 'Gelap' },
];

export default function SettingsScreen() {
  const theme: Theme = useAppTheme();
  const { settings, update } = useSettings();

  const s = styles(theme);

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.sectionTitle}>Kota</Text>
      <View style={s.card}>
        {CITIES.map((c) => {
          const active = c.id === settings.cityId;
          return (
            <Pressable key={c.id} style={[s.cityRow, active && s.cityRowActive]} onPress={() => update({ cityId: c.id })}>
              <Text style={[s.cityName, active && s.cityNameActive]}>{c.name}</Text>
              {active && <Text style={s.check}>✓</Text>}
            </Pressable>
          );
        })}
      </View>

      <Text style={s.sectionTitle}>Pengingat</Text>
      {!isReminderSupported() && (
        <Text style={s.note}>
          Pengingat tidak didukung di Expo Go. Install versi APK agar pengingat bunyi.
        </Text>
      )}
      <View style={s.card}>
        <View style={s.row}>
          <Text style={s.label}>Aktifkan pengingat</Text>
          <Switch
            value={settings.reminderEnabled}
            disabled={!isReminderSupported()}
            onValueChange={(v) => update({ reminderEnabled: v })}
          />
        </View>
        <View style={s.row}>
          <Text style={s.label}>Ingatkan sebelum</Text>
          <View style={s.stepper}>
            <Pressable
              style={s.stepBtn}
              onPress={() => update({ reminderMinutes: Math.max(1, settings.reminderMinutes - 1) })}
            >
              <Text style={s.stepText}>−</Text>
            </Pressable>
            <Text style={s.stepValue}>{settings.reminderMinutes} mnt</Text>
            <Pressable
              style={s.stepBtn}
              onPress={() => update({ reminderMinutes: Math.min(120, settings.reminderMinutes + 1) })}
            >
              <Text style={s.stepText}>+</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <Text style={s.sectionTitle}>Tampilan</Text>
      <View style={s.themeRow}>
        {THEMES.map((t) => {
          const active = t.id === settings.theme;
          return (
            <Pressable
              key={t.id}
              style={[s.themeBtn, active && s.themeBtnActive]}
              onPress={() => update({ theme: t.id })}
            >
              <Text style={[s.themeText, active && s.themeTextActive]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = (t: Theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: t.bg },
    content: { padding: 16, paddingBottom: 32 },
    sectionTitle: { color: t.text, fontSize: 16, fontWeight: '700', marginBottom: 8, marginTop: 12 },
    note: { color: t.subtext, fontSize: 13, marginBottom: 8, fontStyle: 'italic' },
    card: {
      backgroundColor: t.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: t.border,
      overflow: 'hidden',
    },
    cityRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: t.border,
    },
    cityRowActive: { backgroundColor: t.highlight },
    cityName: { color: t.text, fontSize: 15 },
    cityNameActive: { color: t.primary, fontWeight: '700' },
    check: { color: t.primary, fontSize: 16, fontWeight: '700' },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: t.border,
    },
    label: { color: t.text, fontSize: 15 },
    stepper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    stepBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: t.highlight,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: t.border,
    },
    stepText: { color: t.primary, fontSize: 18, fontWeight: '700' },
    stepValue: { color: t.text, fontSize: 15, minWidth: 56, textAlign: 'center', fontVariant: ['tabular-nums'] },
    themeRow: { flexDirection: 'row', gap: 10 },
    themeBtn: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
      backgroundColor: t.card,
      borderWidth: 1,
      borderColor: t.border,
    },
    themeBtnActive: { borderColor: t.primary, backgroundColor: t.highlight },
    themeText: { color: t.subtext, fontSize: 14, fontWeight: '600' },
    themeTextActive: { color: t.primary },
  });
