'use client';

import { ApiError } from '@feira/api-client';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@feira/ui';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock, Mail, ShieldAlert } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { mockAuthAdapter } from '../../lib/adapters/mock-auth-adapter';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const [email, setEmail] = React.useState('admin@feiradecarros.com.br');
  const [password, setPassword] = React.useState('admin123');
  const [showPassword, setShowPassword] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [errorType, setErrorType] = React.useState<'401' | '403' | 'validation' | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setErrorType(null);
    setFieldErrors({});

    // Client validation
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = 'O e-mail institucional é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Formato de e-mail inválido';
    }

    if (!password) {
      errors.password = 'A senha é obrigatória';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      await mockAuthAdapter.login({ email, password });
      router.push(redirectPath);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.statusCode === 401) {
          setErrorType('401');
          setErrorMessage('Credenciais inválidas. Verifique seu e-mail e senha institucional.');
        } else if (err.statusCode === 403) {
          setErrorType('403');
          setErrorMessage(
            'Acesso negado. Sua conta não possui permissão para acessar o painel de administração.',
          );
        } else {
          setErrorMessage(err.message || 'Erro ao realizar login.');
        }
      } else {
        setErrorMessage('Falha na conexão com o servidor de autenticação.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (type: 'valid' | 'wrong' | 'denied') => {
    setErrorMessage(null);
    setErrorType(null);
    setFieldErrors({});

    if (type === 'valid') {
      setEmail('admin@feiradecarros.com.br');
      setPassword('admin123');
    } else if (type === 'wrong') {
      setEmail('admin@feiradecarros.com.br');
      setPassword('wrong-password');
    } else if (type === 'denied') {
      setEmail('denied@feiradecarros.com.br');
      setPassword('staff123');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-900 text-slate-100 p-4 sm:p-8">
      {/* Top Header Logo */}
      <header className="w-full flex items-center justify-between max-w-6xl mx-auto py-2">
        <div className="flex items-center gap-3">
          <Image
            src="/brand/logo-dark.png"
            alt="Feira de Carros Logo"
            width={160}
            height={40}
            priority
            className="h-8 w-auto object-contain"
          />
          <Badge
            variant="outline"
            className="text-xs text-amber-400 border-amber-400/40 hidden sm:inline-flex"
          >
            ADM-D-001 / ADM-M-013
          </Badge>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Gateway Seguro
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="w-full max-w-md mx-auto my-auto py-6">
        <Card className="border-slate-800 bg-slate-950/90 shadow-2xl backdrop-blur-md">
          <CardHeader className="space-y-1.5 text-center pb-6">
            <div className="mx-auto w-12 h-12 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white">
              Acesso Administrativo
            </CardTitle>
            <CardDescription className="text-sm text-slate-400">
              Entre com suas credenciais institucionais para gerenciar o ecossistema Feira de
              Carros.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Error Banners */}
            {errorMessage && (
              <div
                className={`mb-5 p-3.5 rounded-lg text-sm flex items-start gap-3 border ${
                  errorType === '403'
                    ? 'bg-amber-950/40 border-amber-700/50 text-amber-300'
                    : 'bg-red-950/40 border-red-700/50 text-red-300'
                }`}
                role="alert"
              >
                {errorType === '403' ? (
                  <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
                )}
                <div>
                  <p className="font-semibold">
                    {errorType === '403' ? 'Permissão Negada' : 'Falha no Acesso'}
                  </p>
                  <p className="text-xs opacity-90 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="admin-email"
                  className="text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  E-mail Institucional
                </Label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <Input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="colaborador@feiradecarros.com.br"
                    disabled={isLoading}
                    className={`pl-9 bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-red-500 h-10 ${
                      fieldErrors.email ? 'border-red-500 ring-1 ring-red-500' : ''
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-xs text-red-400 font-medium">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="admin-password"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-300"
                  >
                    Senha de Acesso
                  </Label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <Input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className={`pl-9 pr-10 bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-red-500 h-10 ${
                      fieldErrors.password ? 'border-red-500 ring-1 ring-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition-colors"
                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-red-400 font-medium">{fieldErrors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-semibold transition-all shadow-md shadow-red-950/50 mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Autenticando...
                  </span>
                ) : (
                  'Entrar no Painel'
                )}
              </Button>
            </form>

            {/* Quick Testing Simulation Shortcuts (Development only) */}
            {process.env.NODE_ENV !== 'production' && (
              <div className="mt-6 pt-5 border-t border-slate-800 text-center">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Simulações de Teste de QA
                </span>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fillCredentials('valid')}
                    className="text-xs h-7 bg-slate-900 border-slate-700 text-slate-300 hover:text-white"
                  >
                    Admin Válido
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fillCredentials('wrong')}
                    className="text-xs h-7 bg-slate-900 border-slate-700 text-slate-300 hover:text-white"
                  >
                    Senha Incorreta (401)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fillCredentials('denied')}
                    className="text-xs h-7 bg-slate-900 border-slate-700 text-slate-300 hover:text-white"
                  >
                    Sem Permissão (403)
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-xs text-slate-500 border-t border-slate-800/60 max-w-6xl mx-auto">
        <p>© 2026 Feira de Carros Marketplace • Acesso restrito e monitorado sob termos da LGPD.</p>
      </footer>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">
          Carregando portal administrativo...
        </div>
      }
    >
      <AdminLoginForm />
    </React.Suspense>
  );
}
