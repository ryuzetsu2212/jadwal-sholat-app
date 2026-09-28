import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DEFAULT_SETTINGS, Settings, loadSettings, saveSettings } from './storage';

interface CtxValue {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
}

const SettingsCtx = createContext<CtxValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);

  return <SettingsCtx.Provider value={{ settings, update }}>{children}</SettingsCtx.Provider>;
}

export function useSettings(): CtxValue {
  const v = useContext(SettingsCtx);
  if (!v) throw new Error('useSettings harus dipakai di dalam SettingsProvider');
  return v;
}
