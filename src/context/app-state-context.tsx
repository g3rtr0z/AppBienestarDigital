import React, { createContext, useContext, useState } from "react";

interface AppStateContextType {
  // Screen time
  elapsedScreenTimeSeconds: number;
  setElapsedScreenTimeSeconds: React.Dispatch<React.SetStateAction<number>>;
  currentScreenTime: number;
  setCurrentScreenTime: React.Dispatch<React.SetStateAction<number>>;
  isScreenTimeTrackingRunning: boolean;
  setIsScreenTimeTrackingRunning: React.Dispatch<React.SetStateAction<boolean>>;
  screenTimeHistory: { hour: string, minutes: number }[];
  setScreenTimeHistory: React.Dispatch<React.SetStateAction<{ hour: string, minutes: number }[]>>;

  // Hidratación
  waterIntake: number;
  setWaterIntake: React.Dispatch<React.SetStateAction<number>>;
  nextReminder: number | null;
  setNextReminder: React.Dispatch<React.SetStateAction<number | null>>;
  mostrarRecordatorio: boolean;
  setMostrarRecordatorio: React.Dispatch<React.SetStateAction<boolean>>;

  // Pausas activas
  nextBreak: number;
  setNextBreak: React.Dispatch<React.SetStateAction<number>>;
  breaksTaken: number;
  setBreaksTaken: React.Dispatch<React.SetStateAction<number>>;
  isBreakActive: boolean;
  setIsBreakActive: React.Dispatch<React.SetStateAction<boolean>>;
  breakTime: number;
  setBreakTime: React.Dispatch<React.SetStateAction<number>>;
  isTimerStarted: boolean;
  setIsTimerStarted: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Screen time
  const [elapsedScreenTimeSeconds, setElapsedScreenTimeSeconds] = useState(0);
  const [currentScreenTime, setCurrentScreenTime] = useState(0);
  const [isScreenTimeTrackingRunning, setIsScreenTimeTrackingRunning] = useState(false);
  const [screenTimeHistory, setScreenTimeHistory] = useState<{ hour: string, minutes: number }[]>([]);

  // Hidratación
  const [waterIntake, setWaterIntake] = useState(0);
  const [nextReminder, setNextReminder] = useState<number | null>(null);
  const [mostrarRecordatorio, setMostrarRecordatorio] = useState(false);

  // Pausas activas
  const [nextBreak, setNextBreak] = useState(25 * 60); // 25 minutos
  const [breaksTaken, setBreaksTaken] = useState(0);
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [breakTime, setBreakTime] = useState(5 * 60); // 5 minutos
  const [isTimerStarted, setIsTimerStarted] = useState(false);

  return (
    <AppStateContext.Provider value={{
      elapsedScreenTimeSeconds, setElapsedScreenTimeSeconds,
      currentScreenTime, setCurrentScreenTime,
      isScreenTimeTrackingRunning, setIsScreenTimeTrackingRunning,
      screenTimeHistory, setScreenTimeHistory,
      waterIntake, setWaterIntake,
      nextReminder, setNextReminder,
      mostrarRecordatorio, setMostrarRecordatorio,
      nextBreak, setNextBreak,
      breaksTaken, setBreaksTaken,
      isBreakActive, setIsBreakActive,
      breakTime, setBreakTime,
      isTimerStarted, setIsTimerStarted
    }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) throw new Error("useAppState must be used within AppStateProvider");
  return context;
}; 