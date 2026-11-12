import { createLogger, sanitizeUrl } from '@feira/logger';
import type { ApiErrorDetail, ApiErrorResponse } from './types/auth';

const logger = createLogger('api-client');

export class ApiError extends Error {
  public readonly code?: string;
  public readonly requestId?: string;
  public readonly fieldErrors?: ApiErrorDetail[];

  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';

    if (typeof details === 'object' && details !== null) {
      const err = details as Partial<ApiErrorResponse>;
      this.code = err.code;
      this.requestId = err.request_id;
      this.fieldErrors = err.details;
    }
  }

  get isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  get isForbidden(): boolean {
    return this.statusCode === 403;
  }

  get isNotFound(): boolean {
    return this.statusCode === 404;
  }
}

export interface ApiClientConfig {
  baseUrl: string;
  getToken?: () => string | null | Promise<string | null>;
  credentials?: RequestCredentials;
  onUnauthorized?: () => void;
  onForbidden?: () => void;
}

export class ApiClient {
  constructor(private readonly config: ApiClientConfig) {}

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = path.startsWith('http')
      ? path
      : `${this.config.baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

    const method = options.method || 'GET';
    const headers = new Headers(options.headers);
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    if (this.config.getToken) {
      const token = await this.config.getToken();
      if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    const credentials = options.credentials || this.config.credentials || 'include';
    const startTime = Date.now();
    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials,
      });

      const durationMs = Date.now() - startTime;
      logger.logRequest(method, sanitizeUrl(url), durationMs, response.status);

      if (!response.ok) {
        let errorBody: unknown;
        try {
          errorBody = await response.json();
        } catch {
          errorBody = await response.text();
        }

        if (response.status === 401 && this.config.onUnauthorized) {
          this.config.onUnauthorized();
        } else if (response.status === 403 && this.config.onForbidden) {
          this.config.onForbidden();
        }

        const errorMessage =
          (typeof errorBody === 'object' && errorBody !== null && 'message' in errorBody
            ? String((errorBody as { message: unknown }).message)
            : null) || `Request failed with status ${response.status}`;

        throw new ApiError(response.status, errorMessage, errorBody);
      }

      if (response.status === 204) {
        return undefined as T;
      }

      return response.json();
    } catch (err) {
      const durationMs = Date.now() - startTime;
      if (err instanceof ApiError) {
        throw err;
      }
      logger.error(`Network error on ${method} ${url} [${durationMs}ms]`, {}, err);
      throw new ApiError(0, err instanceof Error ? err.message : 'Network request failed');
    }
  }

  get<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  post<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  put<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  patch<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  delete<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }
}

export function createApiClient(config: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}
