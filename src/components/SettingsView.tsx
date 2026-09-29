import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PROVINCES, getCitiesByProvince, getCity } from '../prayer';
import { Settings } from '../storage';
import { Theme } from '../theme';
import { useAppTheme } from '../useAppTheme';
import { useSettings } from '../settings-context';



const THEMES: { id: Settings['theme']; label: string }[] = [
  { id: 'auto', label: 'Otomatis' },
  { id: 'light', label: 'Terang' },
  { id: 'dark', label: 'Gelap' },
];

export default function SettingsView() {
  const theme: Theme = useAppTheme();
  const { settings, update } = useSettings();
  const s = styles(theme);

  const currentCity = getCity(settings.cityId);
  const [province, setProvince] = useState<string | null>(currentCity.province);
  const [showProvinces, setShowProvinces] = useState(false);
  const [provinceQuery, setProvinceQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');

  const filteredProvinces = PROVINCES.filter((p) =>
    p.toLowerCase().includes(provinceQuery.toLowerCase()),
  );
  const allCities = province ? getCitiesByProvince(province) : [];
  const cities = allCities.filter((c) =>
    c.name.toLowerCase().includes(cityQuery.toLowerCase()),
  );

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.sectionTitle}>Kota</Text>

      {/* Pilihan provinsi */}
      <Pressable style={s.card} onPress={() => setShowProvinces(!showProvinces)}>
        <View style={s.provinceRow}>
          <View>
            <Text style={s.provinceLabel}>Provinsi</Text>
            <Text style={s.provinceValue}>{province ?? 'Pilih provinsi'}</Text>
          </View>
          <Ionicons
            name={showProvinces ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={theme.subtext}
          />
        </View>
      </Pressable>

      {showProvinces && (
        <View style={[s.card, s.provinceList]}>
          <View style={s.searchWrap}>
            <Ionicons name="search" size={18} color={theme.subtext} />
            <TextInput
              style={s.searchInput}
              placeholder="Cari provinsi..."
              placeholderTextColor={theme.subtext}
              value={provinceQuery}
              onChangeText={setProvinceQuery}
              autoFocus
            />
          </View>
          <ScrollView style={s.listScroll} nestedScrollEnabled>
            {filteredProvinces.map((p) => {
              const active = p === province;
              return (
                <Pressable
                  key={p}
                  style={[s.cityRow, active && s.cityRowActive]}
                  onPress={() => {
                    setProvince(p);
                    setShowProvinces(false);
                    setProvinceQuery('');
                    setCityQuery('');
                  }}
                >
                  <Text style={[s.cityName, active && s.cityNameActive]}>{p}</Text>
                  {active && <Text style={s.check}>✓</Text>}
                </Pressable>
              );
            })}
            {filteredProvinces.length === 0 && (
              <Text style={s.emptyText}>Tidak ditemukan</Text>
            )}
          </ScrollView>
        </View>
      )}

      {/* Daftar kota dalam provinsi */}
      {province && (
        <View style={[s.card, s.cityList]}>
          <View style={s.searchWrap}>
            <Ionicons name="search" size={18} color={theme.subtext} />
            <TextInput
              style={s.searchInput}
              placeholder={`Cari kabupaten/kota di ${province}...`}
              placeholderTextColor={theme.subtext}
              value={cityQuery}
              onChangeText={setCityQuery}
            />
          </View>
          {cities.map((c) => {
            const active = c.id === settings.cityId;
            return (
              <Pressable
                key={c.id}
                style={[s.cityRow, active && s.cityRowActive]}
                onPress={() => update({ cityId: c.id })}
              >
                <Text style={[s.cityName, active && s.cityNameActive]}>{c.name}</Text>
                {active && <Text style={s.check}>✓</Text>}
              </Pressable>
            );
          })}
          {cities.length === 0 && (
            <Text style={s.emptyText}>Tidak ditemukan</Text>
          )}
        </View>
      )}

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
    provinceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    provinceLabel: { color: t.subtext, fontSize: 12 },
    provinceValue: { color: t.text, fontSize: 16, fontWeight: '700', marginTop: 2 },
    provinceList: { marginTop: 8, maxHeight: 320 },
    cityList: { marginTop: 8 },
    listScroll: { maxHeight: 240 },
    searchWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: t.border,
      gap: 8,
    },
    searchInput: { flex: 1, color: t.text, fontSize: 15, padding: 0 },
    emptyText: { color: t.subtext, fontSize: 14, textAlign: 'center', paddingVertical: 16 },
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
