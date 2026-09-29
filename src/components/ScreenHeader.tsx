import { StyleSheet, Text, View } from 'react-native';

export default function ScreenHeader({ title }: { title: string }) {
  return (
    <View style={s.bar}>
      <Text style={s.title}>{title}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    backgroundColor: '#0d7a4f',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
