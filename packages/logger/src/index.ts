import { redactSensitiveData, redactString, sanitizeUrl } from './formatters';

export { redactSensitiveData, redactString, sanitizeUrl };

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  namespace: string;
  message: string;
  durationMs?: number;
  context?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string | number;
  };
}

const LOG_LEVEL_PRIORITIES: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function getActiveLogLevel(): LogLevel {
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
    return 'error';
  }
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') {
    return 'info';
  }
  return 'debug';
}

export class Logger {
  private timers: Map<string, number> = new Map();

  constructor(
    private readonly namespace: string,
    private minLevel: LogLevel = getActiveLogLevel(),
  ) {}

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITIES[level] >= LOG_LEVEL_PRIORITIES[this.minLevel];
  }

  private write(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    err?: unknown,
    durationMs?: number,
  ) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      namespace: this.namespace,
      message,
    };

    if (durationMs !== undefined) {
      entry.durationMs = durationMs;
    }

    if (context) {
      entry.context = redactSensitiveData(context) as Record<string, unknown>;
    }

    if (err instanceof Error) {
      entry.error = {
        name: err.name,
        message: redactString(err.message),
        stack: err.stack ? redactString(err.stack) : undefined,
        code: (err as { code?: string | number }).code,
      };
    } else if (err) {
      entry.error = {
        name: 'UnknownError',
        message: redactString(String(err)),
      };
    }

    const durationTag = entry.durationMs !== undefined ? ` [${entry.durationMs}ms]` : '';
    const formatted = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.namespace}] ${entry.message}${durationTag}`;

    switch (level) {
      case 'debug':
        console.debug(formatted, entry.context ?? '', entry.error ?? '');
        break;
      case 'info':
        console.info(formatted, entry.context ?? '', entry.error ?? '');
        break;
      case 'warn':
        console.warn(formatted, entry.context ?? '', entry.error ?? '');
        break;
      case 'error':
        console.error(formatted, entry.context ?? '', entry.error ?? '');
        break;
    }
  }

  time(label: string) {
    this.timers.set(label, Date.now());
  }

  timeEnd(label: string, message?: string, context?: Record<string, unknown>) {
    const start = this.timers.get(label);
    if (start === undefined) {
      this.warn(`Timer "${label}" does not exist`);
      return;
    }
    this.timers.delete(label);
    const durationMs = Date.now() - start;
    this.info(message || `${label} completed in ${durationMs}ms`, context, durationMs);
  }

  logRequest(
    method: string,
    url: string,
    durationMs: number,
    statusCode: number,
    context?: Record<string, unknown>,
  ) {
    const level: LogLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    const cleanUrl = sanitizeUrl(url);
    this.write(
      level,
      `HTTP ${method.toUpperCase()} ${cleanUrl} -> ${statusCode}`,
      context,
      undefined,
      durationMs,
    );
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.write('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>, durationMs?: number) {
    this.write('info', message, context, undefined, durationMs);
  }

  warn(message: string, context?: Record<string, unknown>, err?: unknown) {
    this.write('warn', message, context, err);
  }

  error(message: string, context?: Record<string, unknown>, err?: unknown) {
    this.write('error', message, context, err);
  }
}

export function createLogger(namespace: string): Logger {
  return new Logger(namespace);
}

export const logger = createLogger('app');
