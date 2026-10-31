import { create } from 'zustand';

interface AdminUIState {
  isMobileSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  denseMode: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setDenseMode: (dense: boolean) => void;
  toggleDenseMode: () => void;
}

export const useAdminUIStore = create<AdminUIState>((set) => ({
  isMobileSidebarOpen: false,
  isSidebarCollapsed: false,
  denseMode: false,
  setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),
  toggleMobileSidebar: () => set((s) => ({ isMobileSidebarOpen: !s.isMobileSidebarOpen })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  toggleSidebarCollapsed: () => set((s) => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),
  setDenseMode: (dense) => set({ denseMode: dense }),
  toggleDenseMode: () => set((s) => ({ denseMode: !s.denseMode })),
}));
