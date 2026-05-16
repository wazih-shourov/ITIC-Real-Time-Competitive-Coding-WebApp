import { create } from 'zustand'

interface UIState {
  leftSidebarOpen: boolean
  rightPanelOpen: boolean
  secondarySidebarOpen: boolean
  toggleLeftSidebar: () => void
  toggleRightPanel: () => void
  toggleSecondarySidebar: () => void
  setLeftSidebar: (open: boolean) => void
  setRightPanel: (open: boolean) => void
  setSecondarySidebar: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  leftSidebarOpen: true,
  rightPanelOpen: false,
  secondarySidebarOpen: true,
  toggleLeftSidebar: () => set((state) => ({ leftSidebarOpen: !state.leftSidebarOpen })),
  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
  toggleSecondarySidebar: () => set((state) => ({ secondarySidebarOpen: !state.secondarySidebarOpen })),
  setLeftSidebar: (open) => set({ leftSidebarOpen: open }),
  setRightPanel: (open) => set({ rightPanelOpen: open }),
  setSecondarySidebar: (open) => set({ secondarySidebarOpen: open }),
}))
