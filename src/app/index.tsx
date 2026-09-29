import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '../useAppTheme';
import HomeView from '../components/HomeView';
import CalendarView from '../components/CalendarView';
import SettingsView from '../components/SettingsView';
import TabBar, { TabId } from '../components/TabBar';
import ScreenHeader from '../components/ScreenHeader';

const TITLES: Record<TabId, string> = {
  jadwal: 'Jadwal Sholat',
  kalender: 'Kalender',
  pengaturan: 'Pengaturan',
};

export default function Home() {
  const theme = useAppTheme();
  const [tab, setTab] = useState<TabId>('jadwal');

  return (
    <View style={[s.root, { backgroundColor: theme.bg }]}>
      <ScreenHeader title={TITLES[tab]} />
      <View style={s.content}>
        {tab === 'jadwal' && <HomeView />}
        {tab === 'kalender' && <CalendarView />}
        {tab === 'pengaturan' && <SettingsView />}
      </View>
      <TabBar active={tab} onPress={setTab} />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1 },
});
