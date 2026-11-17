import type { ListingAnalyticsData } from '../types/seller-presentation';

const MOCK_ANALYTICS: Record<string, ListingAnalyticsData> = {
  'FC-2026-0151': {
    listingId: 'FC-2026-0151',
    listingTitle: 'Volkswagen Polo Track 2023',
    listingSubtitle: '1.0 MPI Flex Manual • 28.500 km',
    listingImageUrl: '/images/vehicles/demo/web027-nivus.png',
    periodLabel: 'Últimos 7 dias (demo)',
    totalImpressions: 1420,
    totalDetailViews: 284,
    totalContactsStarted: 18,
    dailyMetrics: [
      {
        date: '2026-10-21',
        dayLabel: '21 out',
        impressions: 180,
        detailViews: 32,
        contactsStarted: 2,
      },
      {
        date: '2026-10-22',
        dayLabel: '22 out',
        impressions: 210,
        detailViews: 45,
        contactsStarted: 3,
      },
      {
        date: '2026-10-23',
        dayLabel: '23 out',
        impressions: 160,
        detailViews: 28,
        contactsStarted: 1,
      },
      {
        date: '2026-10-24',
        dayLabel: '24 out',
        impressions: 260,
        detailViews: 58,
        contactsStarted: 4,
      },
      {
        date: '2026-10-25',
        dayLabel: '25 out',
        impressions: 195,
        detailViews: 38,
        contactsStarted: 2,
      },
      {
        date: '2026-10-26',
        dayLabel: '26 out',
        impressions: 235,
        detailViews: 48,
        contactsStarted: 3,
      },
      {
        date: '2026-10-27',
        dayLabel: '27 out',
        impressions: 180,
        detailViews: 35,
        contactsStarted: 3,
      },
    ],
    isMockData: true,
  },
  'FC-2026-0042': {
    listingId: 'FC-2026-0042',
    listingTitle: 'Volkswagen Nivus Highline 2023',
    listingSubtitle: '1.0 200 TSI Automático • 32.000 km',
    listingImageUrl: '/images/vehicles/demo/web027-nivus.png',
    periodLabel: 'Últimos 7 dias (demo)',
    totalImpressions: 2150,
    totalDetailViews: 412,
    totalContactsStarted: 27,
    dailyMetrics: [
      {
        date: '2026-10-21',
        dayLabel: '21 out',
        impressions: 280,
        detailViews: 52,
        contactsStarted: 3,
      },
      {
        date: '2026-10-22',
        dayLabel: '22 out',
        impressions: 320,
        detailViews: 65,
        contactsStarted: 5,
      },
      {
        date: '2026-10-23',
        dayLabel: '23 out',
        impressions: 270,
        detailViews: 48,
        contactsStarted: 2,
      },
      {
        date: '2026-10-24',
        dayLabel: '24 out',
        impressions: 390,
        detailViews: 82,
        contactsStarted: 6,
      },
      {
        date: '2026-10-25',
        dayLabel: '25 out',
        impressions: 310,
        detailViews: 56,
        contactsStarted: 4,
      },
      {
        date: '2026-10-26',
        dayLabel: '26 out',
        impressions: 340,
        detailViews: 61,
        contactsStarted: 4,
      },
      {
        date: '2026-10-27',
        dayLabel: '27 out',
        impressions: 240,
        detailViews: 48,
        contactsStarted: 3,
      },
    ],
    isMockData: true,
  },
};

export function getListingAnalytics(listingId: string): ListingAnalyticsData | undefined {
  if (!listingId) return undefined;
  return MOCK_ANALYTICS[listingId] || MOCK_ANALYTICS['FC-2026-0151'];
}
