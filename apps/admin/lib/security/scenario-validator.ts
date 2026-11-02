export const ALLOWED_MOCK_SCENARIOS = ['success', 'empty', 'error_500', 'forbidden_403'] as const;

export type MockScenario = (typeof ALLOWED_MOCK_SCENARIOS)[number];

/**
 * Validates that a requested mock scenario is in the strict allowed enum.
 * In production mode, mock scenarios are strictly disallowed.
 */
export function getSafeScenario(
  param: string | null | undefined,
  isProduction: boolean,
): MockScenario | null {
  if (isProduction) {
    return null;
  }

  if (!param) {
    return 'success';
  }

  const clean = param.trim().toLowerCase();
  if ((ALLOWED_MOCK_SCENARIOS as readonly string[]).includes(clean)) {
    return clean as MockScenario;
  }

  return 'success';
}

/**
 * Ensures QA controls and testing panels are completely disabled in production environments.
 */
export function isQAHarnessAllowed(isProduction: boolean, qaQueryParam?: string | null): boolean {
  if (isProduction) {
    return false;
  }

  return (
    qaQueryParam === '1' ||
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  );
}
