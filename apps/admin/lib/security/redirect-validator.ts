/**
 * Strict internal redirect validator to prevent Open Redirect vulnerabilities.
 * Ensures the destination is strictly an internal, relative path on the same origin.
 */
export function getSafeRedirectUrl(target: string | null | undefined, defaultUrl = '/'): string {
  if (!target || typeof target !== 'string') {
    return defaultUrl;
  }

  const trimmed = target.trim();
  if (!trimmed) {
    return defaultUrl;
  }

  // Reject newlines or carriage returns (CRLF injection)
  if (/[\r\n]/.test(trimmed)) {
    return defaultUrl;
  }

  // Check for dangerous schemes: javascript:, data:, vbscript:, file:, etc.
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/i.test(trimmed)) {
    return defaultUrl;
  }

  // Reject protocol-relative URLs (//example.com)
  if (trimmed.startsWith('//')) {
    return defaultUrl;
  }

  // Reject Windows-style paths or backslash tricks (\example.com, /\example.com, \/example.com)
  if (trimmed.includes('\\')) {
    return defaultUrl;
  }

  // Check URL-encoded equivalents (%2f, %5c)
  try {
    const decoded = decodeURIComponent(trimmed);
    if (
      decoded.startsWith('//') ||
      decoded.includes('\\') ||
      /^[a-zA-Z][a-zA-Z0-9+.-]*:/i.test(decoded)
    ) {
      return defaultUrl;
    }
  } catch {
    // Malformed URI encoding
    return defaultUrl;
  }

  // Must strictly begin with a single slash followed by safe internal path
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) {
    return defaultUrl;
  }

  return trimmed;
}
