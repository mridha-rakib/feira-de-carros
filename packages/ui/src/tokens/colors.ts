/**
 * Figma Design Tokens: Official Color Palette
 * Source of truth from official Figma file (JlRZIGImV7rRROPZndv6NT) and Institutional Chart.
 * Official Brand Red: #F42524
 * Semantic UI Primary Red: #B91C1C
 * Neutral Black: #000000
 */
export const figmaTokens = {
  colors: {
    brand: {
      red: '#F42524',
      black: '#000000',
      primary: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#F42524', // Official source brand red
        600: '#dc2626',
        700: '#B91C1C', // Figma semantic UI primary
        800: '#991b1b',
        900: '#7f1d1d',
      },
      accent: {
        50: '#fffbeb',
        100: '#fef3c7',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
      },
    },
    status: {
      success: {
        50: '#f0fdf4',
        500: '#16a34a',
        700: '#15803d',
      },
      warning: {
        50: '#fffbeb',
        500: '#f59e0b',
        700: '#b45309',
      },
      danger: {
        50: '#fef2f2',
        500: '#dc2626',
        700: '#b91c1c',
      },
      info: {
        50: '#f0f9ff',
        500: '#0284c7',
        700: '#0369a1',
      },
    },
    neutrals: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
  },
} as const;
