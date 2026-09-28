import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'auto' | 'light' | 'dark';

export interface Settings {
  cityId: string;
  reminderEnabled: boolean;
  reminderMinutes: number;
  theme: ThemeMode;
}

export const DEFAULT_SETTINGS: Settings = {
  cityId: 'bengkalis',
  reminderEnabled: true,
  reminderMinutes: 10,
  theme: 'auto',
};

const KEY = 'jadwal-sholat-settings';

export async function loadSettings(): Promise<Settings> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(s: Settings): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(s));
}
