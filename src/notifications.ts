import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { City, Prayer, getTomorrowPrayers } from './prayer';

type NotificationsModule = typeof import('expo-notifications');

const CHANNEL_ID = 'jadwal-sholat-reminder';

// Expo Go (SDK 53+) tidak mendukung expo-notifications sama sekali:
// import-nya langsung throw. Karena itu modul dimuat malas (lazy),
// dan dilewati total saat aplikasi jalan di Expo Go.
export function isReminderSupported(): boolean {
  return Constants.appOwnership !== 'expo';
}

let mod: NotificationsModule | null = null;
let handlerSet = false;

async function load(): Promise<NotificationsModule | null> {
  if (!isReminderSupported()) return null;
  if (!mod) {
    mod = await import('expo-notifications');
    if (!handlerSet) {
      handlerSet = true;
      mod.setNotificationHandler({
        handleNotification: async () => ({
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    }
  }
  return mod;
}

export async function ensurePermissions(): Promise<boolean> {
  const N = await load();
  if (!N) return false;
  if (Platform.OS === 'android') {
    await N.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Pengingat Sholat',
      importance: N.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
  const { status } = await N.getPermissionsAsync();
  if (status === 'granted') return true;
  const { status: next } = await N.requestPermissionsAsync();
  return next === 'granted';
}

// Jadwalkan pengingat harian untuk setiap waktu sholat (hari ini + besok agar mulus).
export async function rescheduleReminders(
  city: City,
  prayers: Prayer[],
  minutesBefore: number,
  enabled: boolean,
): Promise<void> {
  const N = await load();
  if (!N) return;
  await N.cancelAllScheduledNotificationsAsync();
  if (!enabled) return;
  const ok = await ensurePermissions();
  if (!ok) return;

  const all = [...prayers, ...getTomorrowPrayers(city)];
  const now = Date.now();

  for (const p of all) {
    const at = new Date(p.time.getTime() - minutesBefore * 60 * 1000);
    if (at.getTime() <= now) continue;
    // Jika masih di hari yang sama dan pengingatnya sudah lewat hari ini,
    // pakai trigger harian; untuk besok pakai trigger tanggal pasti.
    const isToday = at.toDateString() === new Date().toDateString();
    await N.scheduleNotificationAsync({
      content: {
        title: `${p.name} ${minutesBefore} menit lagi`,
        body: `Waktu ${p.name} di ${city.name} pukul ${fmt(at)}`,
      },
      trigger: isToday
        ? {
            type: N.SchedulableTriggerInputTypes.DAILY,
            hour: at.getHours(),
            minute: at.getMinutes(),
            channelId: CHANNEL_ID,
          }
        : {
            type: N.SchedulableTriggerInputTypes.DATE,
            date: at,
            channelId: CHANNEL_ID,
          },
    });
  }
}

function fmt(d: Date): string {
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}
