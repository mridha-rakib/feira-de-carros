import { useAdminUIStore } from '@/stores/use-admin-ui-store';
import { describe, expect, it } from 'vitest';

describe('useAdminUIStore', () => {
  it('initializes with mobile sidebar closed', () => {
    const state = useAdminUIStore.getState();
    expect(state.isMobileSidebarOpen).toBe(false);
    expect(state.denseMode).toBe(false);
  });

  it('toggles mobile sidebar state cleanly', () => {
    useAdminUIStore.getState().toggleMobileSidebar();
    expect(useAdminUIStore.getState().isMobileSidebarOpen).toBe(true);

    useAdminUIStore.getState().setMobileSidebarOpen(false);
    expect(useAdminUIStore.getState().isMobileSidebarOpen).toBe(false);
  });
});
