import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { SettingsProvider, useSettings } from '../../settings-context';
import { darkTheme, lightTheme } from '../../theme';

function ThemedTabs() {
  const { settings } = useSettings();
  const systemScheme = useColorScheme();
  const theme =
    settings.theme === 'light'
      ? lightTheme
      : settings.theme === 'dark'
        ? darkTheme
        : systemScheme === 'dark'
          ? darkTheme
          : lightTheme;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.subtext,
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
        headerStyle: { backgroundColor: '#0d7a4f' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Jadwal Sholat',
          tabBarLabel: 'Jadwal',
          tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Kalender',
          tabBarLabel: 'Kalender',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Pengaturan',
          tabBarLabel: 'Pengaturan',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

export default function TabsLayout() {
  return (
    <SettingsProvider>
      <ThemedTabs />
    </SettingsProvider>
  );
}
