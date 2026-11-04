import { describe, expect, it } from 'vitest';
import { getSafeRedirectUrl } from '../../lib/security/redirect-validator';
import { getSafeScenario, isQAHarnessAllowed } from '../../lib/security/scenario-validator';

describe('Security — Redirect Validation (getSafeRedirectUrl)', () => {
  it('allows safe relative internal routes', () => {
    expect(getSafeRedirectUrl('/')).toBe('/');
    expect(getSafeRedirectUrl('/dashboard')).toBe('/dashboard');
    expect(getSafeRedirectUrl('/anuncios/revisao?id=123')).toBe('/anuncios/revisao?id=123');
    expect(getSafeRedirectUrl('/usuarios/novo')).toBe('/usuarios/novo');
  });

  it('rejects external absolute URLs', () => {
    expect(getSafeRedirectUrl('https://evil.com')).toBe('/');
    expect(getSafeRedirectUrl('http://attacker.org/steal')).toBe('/');
    expect(getSafeRedirectUrl('ftp://files.attacker.com')).toBe('/');
  });

  it('rejects protocol-relative URLs', () => {
    expect(getSafeRedirectUrl('//evil.com')).toBe('/');
    expect(getSafeRedirectUrl('//evil.com/path')).toBe('/');
    expect(getSafeRedirectUrl('///evil.com')).toBe('/');
  });

  it('rejects javascript and data schemes', () => {
    expect(getSafeRedirectUrl('javascript:alert(1)')).toBe('/');
    expect(getSafeRedirectUrl('JAVASCRIPT:alert(document.cookie)')).toBe('/');
    expect(getSafeRedirectUrl('data:text/html,<script>evil()</script>')).toBe('/');
    expect(getSafeRedirectUrl('vbscript:msgbox(1)')).toBe('/');
  });

  it('rejects backslash bypasses and Windows separators', () => {
    expect(getSafeRedirectUrl('\\evil.com')).toBe('/');
    expect(getSafeRedirectUrl('/\\evil.com')).toBe('/');
    expect(getSafeRedirectUrl('\\/evil.com')).toBe('/');
    expect(getSafeRedirectUrl('/path\\subpath')).toBe('/');
  });

  it('rejects URL-encoded bypass attempts', () => {
    expect(getSafeRedirectUrl('%2f%2fevil.com')).toBe('/');
    expect(getSafeRedirectUrl('/%5cevil.com')).toBe('/');
    expect(getSafeRedirectUrl('%6a%61%76%61%73%63%72%69%70%74:alert(1)')).toBe('/');
  });

  it('rejects CRLF injection attempts', () => {
    expect(getSafeRedirectUrl('/safe\r\nSet-Cookie: evil=1')).toBe('/');
    expect(getSafeRedirectUrl('/path\nevil')).toBe('/');
  });

  it('falls back to custom default if provided', () => {
    expect(getSafeRedirectUrl('https://evil.com', '/fallback')).toBe('/fallback');
    expect(getSafeRedirectUrl(null, '/fallback')).toBe('/fallback');
    expect(getSafeRedirectUrl(undefined, '/fallback')).toBe('/fallback');
    expect(getSafeRedirectUrl('', '/fallback')).toBe('/fallback');
  });
});

describe('Security — QA & Scenario Controls (Finding F-04)', () => {
  it('strictly disables QA controls in production regardless of query params', () => {
    expect(isQAHarnessAllowed(true, '1')).toBe(false);
    expect(isQAHarnessAllowed(true, undefined)).toBe(false);
    expect(isQAHarnessAllowed(true, 'true')).toBe(false);
  });

  it('allows QA controls in development/test when explicitly enabled', () => {
    expect(isQAHarnessAllowed(false, '1')).toBe(true);
  });

  it('returns null scenario in production mode', () => {
    expect(getSafeScenario('success', true)).toBeNull();
    expect(getSafeScenario('empty', true)).toBeNull();
    expect(getSafeScenario('error_500', true)).toBeNull();
  });

  it('validates allowed scenarios against enum in non-production', () => {
    expect(getSafeScenario('success', false)).toBe('success');
    expect(getSafeScenario('empty', false)).toBe('empty');
    expect(getSafeScenario('error_500', false)).toBe('error_500');
    expect(getSafeScenario('forbidden_403', false)).toBe('forbidden_403');
    // Invalid value falls back safely to 'success'
    expect(getSafeScenario('unauthorized_admin_bypass', false)).toBe('success');
    expect(getSafeScenario(undefined, false)).toBe('success');
  });
});
