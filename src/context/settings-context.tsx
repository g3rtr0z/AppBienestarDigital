import React, { createContext, useContext, useEffect, useState } from "react";

interface SettingsContextType {
  screenTimeLimit: number;
  setScreenTimeLimit: (value: number) => void;
  waterGoal: number;
  setWaterGoal: (value: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screenTimeLimit, setScreenTimeLimit] = useState<number>(8);
  const [waterGoal, setWaterGoal] = useState<number>(8);

  useEffect(() => {
    const saved = localStorage.getItem("userSettings");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.screenTimeLimit) setScreenTimeLimit(parsed.screenTimeLimit);
      if (parsed.waterGoal) setWaterGoal(parsed.waterGoal);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("userSettings");
    const parsed = saved ? JSON.parse(saved) : {};
    parsed.screenTimeLimit = screenTimeLimit;
    parsed.waterGoal = waterGoal;
    localStorage.setItem("userSettings", JSON.stringify(parsed));
  }, [screenTimeLimit, waterGoal]);

  return (
    <SettingsContext.Provider value={{ screenTimeLimit, setScreenTimeLimit, waterGoal, setWaterGoal }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};
