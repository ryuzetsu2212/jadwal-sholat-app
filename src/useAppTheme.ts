import { useColorScheme } from 'react-native';
import { useMemo } from 'react';
import { useSettings } from './settings-context';
import { Theme, darkTheme, lightTheme } from './theme';

export function useAppTheme(): Theme {
  const systemScheme = useColorScheme();
  const { settings } = useSettings();

  return useMemo(() => {
    if (settings.theme === 'light') return lightTheme;
    if (settings.theme === 'dark') return darkTheme;
    return systemScheme === 'dark' ? darkTheme : lightTheme;
  }, [settings.theme, systemScheme]);
}
