const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'accesstoken',
  'refreshtoken',
  'authorization',
  'cookie',
  'secret',
  'clientsecret',
  'apikey',
  'cardnumber',
  'cvv',
  'cpf',
  'cnpj',
  'session',
  'sessionid',
  'fdcadminsession',
  'bearer',
  'auth',
  'phone',
  'telefone',
  'documento',
  'email',
]);

const SENSITIVE_QUERY_PARAMS = new Set([
  'token',
  'auth',
  'access_token',
  'refresh_token',
  'secret',
  'code',
  'key',
  'apikey',
  'api_key',
  'password',
  'cpf',
  'cnpj',
  'email',
  'phone',
  'telefone',
  'session',
  'session_id',
  'sig',
  'signature',
]);

/**
 * Sanitizes a URL string by redacting sensitive query parameter values and credentials.
 */
export function sanitizeUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return rawUrl;
  }

  try {
    const isAbsolute = /^https?:\/\//i.test(rawUrl);
    const dummyBase = 'http://localhost';
    const parsed = new URL(rawUrl, isAbsolute ? undefined : dummyBase);

    // Redact username/password if present in URL
    if (parsed.username) parsed.username = '[REDACTED]';
    if (parsed.password) parsed.password = '[REDACTED]';

    // Redact sensitive query parameters
    const params = parsed.searchParams;

    for (const [key] of Array.from(params.entries())) {
      const normalizedKey = key.toLowerCase().replace(/[-_]/g, '');
      if (SENSITIVE_QUERY_PARAMS.has(key.toLowerCase()) || SENSITIVE_KEYS.has(normalizedKey)) {
        params.set(key, '[REDACTED]');
      }
    }

    if (isAbsolute) {
      return parsed.toString();
    }

    // Relative path + search + hash
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    // If URL parsing fails, perform safe regex sanitization on common query parameters
    return rawUrl.replace(
      /([?&](?:token|auth|access_token|secret|code|password|cpf|cnpj|email|phone)=)([^&]+)/gi,
      '$1[REDACTED]',
    );
  }
}

/**
 * Redacts known sensitive patterns inside arbitrary text strings (such as Bearer tokens).
 */
export function redactString(str: string): string {
  if (!str || typeof str !== 'string') return str;

  // Redact Bearer tokens
  let result = str.replace(/Bearer\s+[A-Za-z0-9\-_.]+/gi, 'Bearer [REDACTED]');

  // Redact possible JWT tokens (eyJ...)
  result = result.replace(
    /eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/g,
    '[REDACTED_JWT]',
  );

  return result;
}

/**
 * Deeply redacts sensitive keys from plain objects, arrays, and error context payloads.
 */
export function redactSensitiveData(obj: unknown, depth = 0): unknown {
  if (depth > 5 || obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return redactString(obj);
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => redactSensitiveData(item, depth + 1));
  }

  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const normalizedKey = key.toLowerCase().replace(/[-_]/g, '');
    if (SENSITIVE_KEYS.has(normalizedKey)) {
      redacted[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      redacted[key] = redactSensitiveData(value, depth + 1);
    } else if (typeof value === 'string') {
      redacted[key] = redactString(value);
    } else {
      redacted[key] = value;
    }
  }

  return redacted;
}
