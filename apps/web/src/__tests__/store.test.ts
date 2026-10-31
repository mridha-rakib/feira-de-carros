import { useSearchFilterStore } from '@/stores/use-search-filter-store';
import { describe, expect, it } from 'vitest';

describe('useSearchFilterStore', () => {
  it('initializes with default search filters', () => {
    const state = useSearchFilterStore.getState();
    expect(state.viewMode).toBe('grid');
    expect(state.filters.page).toBe(1);
    expect(state.filters.sortBy).toBe('created_desc');
  });

  it('updates individual filters and resets pagination', () => {
    useSearchFilterStore.getState().updateFilter('make', 'Honda');
    const updated = useSearchFilterStore.getState();
    expect(updated.filters.make).toBe('Honda');
    expect(updated.filters.page).toBe(1);
  });
});
