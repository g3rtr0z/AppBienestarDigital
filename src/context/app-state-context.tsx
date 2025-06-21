import React, { createContext, useContext, useState, useEffect } from "react";

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

  // Registrar tiempo de pantalla por hora
  useEffect(() => {
    if (elapsedScreenTimeSeconds % 3600 === 0 && elapsedScreenTimeSeconds !== 0) {
      const currentHour = new Date().getHours();
      const hourLabel = currentHour === 0 ? "12AM" : 
                       currentHour === 12 ? "12PM" : 
                       currentHour > 12 ? `${currentHour - 12}PM` : `${currentHour}AM`;
      
      const minutesInCurrentHour = Math.floor((elapsedScreenTimeSeconds % 3600) / 60);
      
      setScreenTimeHistory(prev => {
        const existingIndex = prev.findIndex(item => item.hour === hourLabel);
        if (existingIndex >= 0) {
          // Actualizar hora existente
          const updated = [...prev];
          updated[existingIndex] = { hour: hourLabel, minutes: minutesInCurrentHour };
          return updated;
        } else {
          // Agregar nueva hora
          return [...prev, { hour: hourLabel, minutes: minutesInCurrentHour }];
        }
      });
    }
  }, [elapsedScreenTimeSeconds]);

  // Inicializar historial con horas del día actual
  useEffect(() => {
    const initializeHistory = () => {
      // Intentar cargar datos guardados
      const savedHistory = localStorage.getItem('screenTimeHistory');
      const savedElapsedTime = localStorage.getItem('elapsedScreenTimeSeconds');
      const savedCurrentTime = localStorage.getItem('currentScreenTime');
      const savedTrackingState = localStorage.getItem('isScreenTimeTrackingRunning');
      
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);
          setScreenTimeHistory(parsedHistory);
        } catch (error) {
          console.error('Error al cargar historial guardado:', error);
        }
      } else {
        // Inicializar con horas vacías si no hay datos guardados
        const hours = [];
        const currentHour = new Date().getHours();
        
        // Ventana deslizante de 10 horas
        const windowSize = 10;
        let startHour = currentHour - Math.floor(windowSize / 2);
        let endHour = currentHour + Math.floor(windowSize / 2);
        
        // Ajustar si la ventana se sale del rango del día
        if (startHour < 0) {
          startHour = 0;
          endHour = windowSize - 1;
        } else if (endHour > 23) {
          endHour = 23;
          startHour = 23 - windowSize + 1;
        }
        
        // Asegurar que siempre tengamos exactamente 10 horas
        while (endHour - startHour + 1 < windowSize) {
          if (startHour > 0) {
            startHour--;
          } else if (endHour < 23) {
            endHour++;
          } else {
            break; // Si no podemos extender más, mantener lo que tenemos
          }
        }
        
        for (let i = startHour; i <= endHour; i++) {
          const hourLabel = i === 0 ? "12AM" :
                           i === 12 ? "12PM" : 
                           i > 12 ? `${i - 12}PM` : `${i}AM`;
          hours.push({ hour: hourLabel, minutes: 0 });
        }
        setScreenTimeHistory(hours);
      }
      
      // Cargar tiempo transcurrido guardado
      if (savedElapsedTime) {
        setElapsedScreenTimeSeconds(parseInt(savedElapsedTime));
      }
      
      if (savedCurrentTime) {
        setCurrentScreenTime(parseInt(savedCurrentTime));
      }
      
      if (savedTrackingState) {
        setIsScreenTimeTrackingRunning(JSON.parse(savedTrackingState));
      }
    };

    initializeHistory();
  }, []);

  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('screenTimeHistory', JSON.stringify(screenTimeHistory));
  }, [screenTimeHistory]);

  useEffect(() => {
    localStorage.setItem('elapsedScreenTimeSeconds', elapsedScreenTimeSeconds.toString());
  }, [elapsedScreenTimeSeconds]);

  useEffect(() => {
    localStorage.setItem('currentScreenTime', currentScreenTime.toString());
  }, [currentScreenTime]);

  useEffect(() => {
    localStorage.setItem('isScreenTimeTrackingRunning', JSON.stringify(isScreenTimeTrackingRunning));
  }, [isScreenTimeTrackingRunning]);

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