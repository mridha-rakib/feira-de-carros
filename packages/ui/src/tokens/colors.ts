/**
 * Figma Design Tokens: Color Palette
 * Source of truth for brand colors, neutrals, and contextual status tokens.
 */
export const figmaTokens = {
  colors: {
    brand: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        500: '#2563eb',
        600: '#1d4ed8',
        700: '#1e40af',
        900: '#1e3a8a',
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
