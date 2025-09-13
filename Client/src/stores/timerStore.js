import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTimerStore = create(
  persist(
    (set, get) => ({
      // Current timer state
      time: { hours: 0, minutes: 0, seconds: 0 },
      isRunning: false,
      startTime: null,
      lastUpdate: new Date().toISOString(),
      hasPosted: false,
      lastSavedSeconds: 0,

      // Direct setters
      setTime: (updater) =>
        set((state) => ({
          // Check if the updater is a function. If so, call it with the current time.
          // Otherwise, use it as the new value directly.
          time: typeof updater === "function" ? updater(state.time) : updater,
        })),
      setIsRunning: (isRunning) => set({ isRunning }),
      setStartTime: (startTime) => set({ startTime }),
      setLastUpdate: (lastUpdate) => set({ lastUpdate }),
      setHasPosted: (hasPosted) => set({ hasPosted }),
      setLastSavedSeconds: (lastSavedSeconds) => set({ lastSavedSeconds }),

      // Composite actions
      startTimer: () =>
        set({
          isRunning: true,
          startTime: get().startTime || new Date().toISOString(),
        }),
      pauseTimer: () => set({ isRunning: false }),
      resetTimer: () =>
        set({
          time: { hours: 0, minutes: 0, seconds: 0 },
          isRunning: false,
          startTime: null,
          hasPosted: false,
          lastSavedSeconds: 0,
        }),
    }),
    {
      name: "timer-storage",
    }
  )
);
