import React, { createContext, useContext, useEffect, useState } from "react";

interface SettingsContextType {
  screenTimeLimit: number;
  setScreenTimeLimit: (value: number) => void;
  waterGoal: number;
  setWaterGoal: (value: number) => void;
  waterReminderInterval: number;
  setWaterReminderInterval: (value: number) => void;
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
  screenTimeEnabled: boolean;
  setScreenTimeEnabled: (value: boolean) => void;
  activeBreaksEnabled: boolean;
  setActiveBreaksEnabled: (value: boolean) => void;
  hydrationEnabled: boolean;
  setHydrationEnabled: (value: boolean) => void;
  breakGoal: number;
  setBreakGoal: (value: number) => void;
  breakStartDelay: number;
  setBreakStartDelay: (value: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screenTimeLimit, setScreenTimeLimit] = useState<number>(8);
  const [waterGoal, setWaterGoal] = useState<number>(8);
  const [waterReminderInterval, setWaterReminderInterval] = useState<number>(45);
  const [breakInterval, setBreakInterval] = useState<number>(25);
  const [breakDuration, setBreakDuration] = useState<number>(5);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [accessibilityMode, setAccessibilityMode] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>("system");
  const [screenTimeEnabled, setScreenTimeEnabled] = useState<boolean>(true);
  const [activeBreaksEnabled, setActiveBreaksEnabled] = useState<boolean>(true);
  const [hydrationEnabled, setHydrationEnabled] = useState<boolean>(true);
  const [breakGoal, setBreakGoal] = useState<number>(6);
  const [breakStartDelay, setBreakStartDelay] = useState<number>(2);

  useEffect(() => {
    const saved = localStorage.getItem("userSettings");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.screenTimeLimit !== undefined) setScreenTimeLimit(parsed.screenTimeLimit);
      if (parsed.waterGoal !== undefined) setWaterGoal(parsed.waterGoal);
      if (parsed.waterReminderInterval !== undefined) setWaterReminderInterval(parsed.waterReminderInterval);
      if (parsed.breakInterval !== undefined) setBreakInterval(parsed.breakInterval);
      if (parsed.breakDuration !== undefined) setBreakDuration(parsed.breakDuration);
      if (parsed.breakGoal !== undefined) setBreakGoal(parsed.breakGoal);
      if (parsed.breakStartDelay !== undefined) setBreakStartDelay(parsed.breakStartDelay);
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
    parsed.waterReminderInterval = waterReminderInterval;
    parsed.breakInterval = breakInterval;
    parsed.breakDuration = breakDuration;
    parsed.breakGoal = breakGoal;
    parsed.breakStartDelay = breakStartDelay;
    parsed.notificationsEnabled = notificationsEnabled;
    parsed.soundEnabled = soundEnabled;
    parsed.accessibilityMode = accessibilityMode;
    parsed.theme = theme;
    localStorage.setItem("userSettings", JSON.stringify(parsed));
  }, [screenTimeLimit, waterGoal, waterReminderInterval, breakInterval, breakDuration, breakGoal, breakStartDelay, notificationsEnabled, soundEnabled, accessibilityMode, theme]);

  return (
    <SettingsContext.Provider value={{
      screenTimeLimit,
      setScreenTimeLimit,
      waterGoal,
      setWaterGoal,
      waterReminderInterval,
      setWaterReminderInterval,
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
      setTheme,
      screenTimeEnabled,
      setScreenTimeEnabled,
      activeBreaksEnabled,
      setActiveBreaksEnabled,
      hydrationEnabled,
      setHydrationEnabled,
      breakGoal,
      setBreakGoal,
      breakStartDelay,
      setBreakStartDelay
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
