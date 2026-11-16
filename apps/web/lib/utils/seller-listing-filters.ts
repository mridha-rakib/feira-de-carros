import type { SellerListingItem, SellerListingStatus } from '@/lib/types/seller-presentation';

/**
 * Production utility for filtering and sorting seller vehicle listings.
 * Used by WEB-020 (My Advertisements) in apps/web.
 */
export function filterAndSortSellerListings(
  listings: SellerListingItem[],
  query: string,
  statusFilter: 'ALL' | SellerListingStatus,
  sortBy: 'latest' | 'price_asc' | 'price_desc',
): SellerListingItem[] {
  let result = [...listings];

  // 1. Keyword search (case-insensitive across title, brand, model, and id)
  if (query.trim()) {
    const q = query.toLowerCase().trim();
    result = result.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q),
    );
  }

  // 2. Status filter
  if (statusFilter !== 'ALL') {
    result = result.filter((item) => item.status === statusFilter);
  }

  // 3. Sorting
  if (sortBy === 'price_asc') {
    result.sort((a, b) => a.priceCents - b.priceCents);
  } else if (sortBy === 'price_desc') {
    result.sort((a, b) => b.priceCents - a.priceCents);
  }

  return result;
}
