import React, { createContext, useContext, useEffect, useState } from "react";

interface SettingsContextType {
  screenTimeLimit: number;
  setScreenTimeLimit: (value: number) => void;
  waterGoal: number;
  setWaterGoal: (value: number) => void;
  breakInterval: number;
  setBreakInterval: (value: number) => void;
  breakDuration: number;
  setBreakDuration: (value: number) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (value: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
  accessibilityMode: boolean;
  setAccessibilityMode: (value: boolean) => void;
  theme: string;
  setTheme: (value: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screenTimeLimit, setScreenTimeLimit] = useState<number>(8);
  const [waterGoal, setWaterGoal] = useState<number>(8);
  const [breakInterval, setBreakInterval] = useState<number>(25);
  const [breakDuration, setBreakDuration] = useState<number>(5);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [accessibilityMode, setAccessibilityMode] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>("system");

  useEffect(() => {
    const saved = localStorage.getItem("userSettings");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.screenTimeLimit !== undefined) setScreenTimeLimit(parsed.screenTimeLimit);
      if (parsed.waterGoal !== undefined) setWaterGoal(parsed.waterGoal);
      if (parsed.breakInterval !== undefined) setBreakInterval(parsed.breakInterval);
      if (parsed.breakDuration !== undefined) setBreakDuration(parsed.breakDuration);
      if (parsed.notificationsEnabled !== undefined) setNotificationsEnabled(parsed.notificationsEnabled);
      if (parsed.soundEnabled !== undefined) setSoundEnabled(parsed.soundEnabled);
      if (parsed.accessibilityMode !== undefined) setAccessibilityMode(parsed.accessibilityMode);
      if (parsed.theme !== undefined) setTheme(parsed.theme);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("userSettings");
    const parsed = saved ? JSON.parse(saved) : {};
    parsed.screenTimeLimit = screenTimeLimit;
    parsed.waterGoal = waterGoal;
    parsed.breakInterval = breakInterval;
    parsed.breakDuration = breakDuration;
    parsed.notificationsEnabled = notificationsEnabled;
    parsed.soundEnabled = soundEnabled;
    parsed.accessibilityMode = accessibilityMode;
    parsed.theme = theme;
    localStorage.setItem("userSettings", JSON.stringify(parsed));
  }, [screenTimeLimit, waterGoal, breakInterval, breakDuration, notificationsEnabled, soundEnabled, accessibilityMode, theme]);

  return (
    <SettingsContext.Provider value={{
      screenTimeLimit,
      setScreenTimeLimit,
      waterGoal,
      setWaterGoal,
      breakInterval,
      setBreakInterval,
      breakDuration,
      setBreakDuration,
      notificationsEnabled,
      setNotificationsEnabled,
      soundEnabled,
      setSoundEnabled,
      accessibilityMode,
      setAccessibilityMode,
      theme,
      setTheme
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};
