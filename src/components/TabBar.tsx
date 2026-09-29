import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../theme';
import { useAppTheme } from '../useAppTheme';

export type TabId = 'jadwal' | 'kalender' | 'pengaturan';

const TABS: { id: TabId; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'jadwal', label: 'Jadwal', icon: 'time-outline' },
  { id: 'kalender', label: 'Kalender', icon: 'calendar-outline' },
  { id: 'pengaturan', label: 'Pengaturan', icon: 'settings-outline' },
];

export default function TabBar({
  active,
  onPress,
}: {
  active: TabId;
  onPress: (id: TabId) => void;
}) {
  const theme: Theme = useAppTheme();
  const s = styles(theme);

  return (
    <View style={s.bar}>
      {TABS.map((t) => {
        const isActive = t.id === active;
        return (
          <Pressable key={t.id} style={s.tab} onPress={() => onPress(t.id)}>
            <Ionicons
              name={t.icon}
              size={24}
              color={isActive ? theme.primary : theme.subtext}
            />
            <Text style={[s.label, isActive && s.labelActive]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = (t: Theme) =>
  StyleSheet.create({
    bar: {
      flexDirection: 'row',
      backgroundColor: t.card,
      borderTopWidth: 1,
      borderTopColor: t.border,
      paddingTop: 8,
      paddingBottom: 10,
    },
    tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    label: { color: t.subtext, fontSize: 12, marginTop: 2 },
    labelActive: { color: t.primary, fontWeight: '600' },
  });
