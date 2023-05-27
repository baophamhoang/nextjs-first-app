import { create } from "zustand";

interface IStoreState {
  counts: number,
  increaseCount: Function,
  removeAllBears: Function
}

export const useStore = create<IStoreState>((set) => ({
  counts: 0,
  increaseCount: () => set((state) => ({ counts: state.counts + 1 })),
  removeAllBears: () => set({ counts: 0 }),
}));