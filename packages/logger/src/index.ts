import { redactSensitiveData } from './formatters';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  namespace: string;
  message: string;
  context?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
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
  ) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      namespace: this.namespace,
      message,
    };

    if (context) {
      entry.context = redactSensitiveData(context) as Record<string, unknown>;
    }

    if (err instanceof Error) {
      entry.error = {
        name: err.name,
        message: err.message,
        stack: err.stack,
      };
    } else if (err) {
      entry.error = {
        name: 'UnknownError',
        message: String(err),
      };
    }

    const formatted = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.namespace}] ${entry.message}`;

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

  debug(message: string, context?: Record<string, unknown>) {
    this.write('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.write('info', message, context);
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
