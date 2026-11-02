'use client';

import { type AdminDashboardOverview, ApiError } from '@feira/api-client';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@feira/ui';
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Building2,
  Car,
  CheckCircle,
  Clock,
  Database,
  DollarSign,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Headphones,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  RefreshCw,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { mockAuthAdapter } from '../lib/adapters/mock-auth-adapter';
import { type MockScenario, mockDashboardAdapter } from '../lib/adapters/mock-dashboard-adapter';
import {
  mockAttentionItems,
  mockChartData,
  mockRecentListings,
  mockSimulatedRevenue,
} from '../lib/adapters/mock-presentation-data';
import { useAdminUIStore } from '../stores/use-admin-ui-store';

function AdminOverviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { denseMode, toggleDenseMode } = useAdminUIStore();

  const urlScenario = (searchParams.get('scenario') as MockScenario) || 'success';
  const showQAHarness = process.env.NODE_ENV !== 'production' || searchParams.get('qa') === '1';

  const [scenario, setScenario] = React.useState<MockScenario>(urlScenario);
  const [overview, setOverview] = React.useState<AdminDashboardOverview | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<ApiError | null>(null);

  // Selected filters
  const [selectedListingsFilter, setSelectedListingsFilter] = React.useState<
    'todos' | 'particulares' | 'concessionarias'
  >('todos');
  const [chartRange, setChartRange] = React.useState<'30d' | '90d' | '12m'>('30d');
  const [activeMobileTab, setActiveMobileTab] = React.useState<
    'painel' | 'vendedores' | 'anuncios' | 'alertas'
  >('painel');

  const fetchOverview = React.useCallback(
    async (targetScenario: MockScenario = scenario) => {
      setIsLoading(true);
      setError(null);
      mockDashboardAdapter.setScenario(targetScenario);

      try {
        const data = await mockDashboardAdapter.getOverview();
        setOverview(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err);
        } else {
          setError(new ApiError(500, 'Erro desconhecido ao carregar painel'));
        }
      } finally {
        setIsLoading(false);
      }
    },
    [scenario],
  );

  React.useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  // Sync scenario if query param changes
  React.useEffect(() => {
    const q = searchParams.get('scenario') as MockScenario | null;
    if (q && q !== scenario) {
      setScenario(q);
      fetchOverview(q);
    }
  }, [searchParams, scenario, fetchOverview]);

  const handleScenarioChange = (newScenario: MockScenario) => {
    setScenario(newScenario);
    fetchOverview(newScenario);
  };

  const handleLogout = async () => {
    await mockAuthAdapter.logout();
    router.push('/login');
  };

  // Filtered recent listings
  const filteredRecentListings = React.useMemo(() => {
    if (scenario === 'empty') {
      return [];
    }
    if (selectedListingsFilter === 'particulares') {
      return mockRecentListings.filter((item) => item.sellerType === 'Particular');
    }
    if (selectedListingsFilter === 'concessionarias') {
      return mockRecentListings.filter((item) => item.sellerType === 'Concessionária');
    }
    return mockRecentListings;
  }, [selectedListingsFilter, scenario]);

  // Attention items for current scenario
  const currentAttentionItems = React.useMemo(() => {
    if (scenario === 'empty') {
      return [];
    }
    return mockAttentionItems;
  }, [scenario]);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased theme-admin pb-28 lg:pb-0">
      {/* =========================================================================
          DESKTOP SIDEBAR (252px width specified in Figma ADM-D-002)
      ========================================================================= */}
      <aside className="hidden lg:flex w-[252px] flex-col border-r border-slate-200 bg-white shrink-0 z-30">
        {/* Brand Logo Header */}
        <div className="h-[76px] flex items-center px-6 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/brand/logo-main.png"
              alt="Feira de Carros Logo"
              width={145}
              height={38}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav
          className="flex-1 px-3 py-4 space-y-1 text-sm font-medium overflow-y-auto"
          aria-label="Menu principal desktop"
        >
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-50 text-red-700 font-semibold transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-red-600 shrink-0" />
            <span>Painel</span>
          </Link>

          <Link
            href="/vendedores"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Vendedores & Lojas</span>
            <Badge
              variant="outline"
              className="ml-auto text-[10px] bg-blue-50 text-blue-700 border-blue-200"
            >
              6
            </Badge>
          </Link>

          <Link
            href="/anuncios"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Car className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Anúncios</span>
            <Badge
              variant="outline"
              className="ml-auto text-[10px] bg-amber-50 text-amber-700 border-amber-200"
            >
              {overview?.pending_approvals ?? 28}
            </Badge>
          </Link>

          <Link
            href="/usuarios"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Users className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Usuários</span>
          </Link>

          <Link
            href="/pagamentos"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <DollarSign className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Financeiro</span>
          </Link>

          <Link
            href="/alertas"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Bell className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Alertas</span>
            <Badge
              variant="outline"
              className="ml-auto text-[10px] bg-red-50 text-red-700 border-red-200 font-bold"
            >
              3
            </Badge>
          </Link>

          <Link
            href="/configuracoes"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Configurações</span>
          </Link>
        </nav>

        {/* User Card & Logout (Bottom) */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                AC
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">Administrador Central</p>
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-red-100 text-red-800">
                  main_admin
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50"
              title="Encerrar Sessão"
              aria-label="Encerrar Sessão"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MAIN CONTENT AREA
      ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar Header (76px height specified in Figma) */}
        <header className="h-[76px] sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Header Logo */}
            <div className="lg:hidden flex items-center gap-2">
              <Image
                src="/brand/logo-main.png"
                alt="Feira de Carros Logo"
                width={120}
                height={30}
                priority
                className="h-6 w-auto object-contain"
              />
            </div>
            <div className="hidden lg:block">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                Painel Administrativo — ADM-D-002
              </h1>
              <p className="text-xs text-slate-500">
                Visão consolidada de métricas, receita simulada e itens que requerem atenção
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Explicit Simulated Mock Data Tag */}
            <Badge
              variant="outline"
              className="text-[11px] bg-amber-50 text-amber-800 border-amber-300 hidden md:inline-flex items-center gap-1.5 font-medium"
            >
              <Database className="w-3 h-3 text-amber-600" />
              SIMULATED_MOCK_DATA
            </Badge>

            {/* Dense Mode Toggle */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleDenseMode}
              className="text-xs hidden xl:inline-flex h-8 text-slate-700"
            >
              Densidade: {denseMode ? 'Alta' : 'Padrão'}
            </Button>

            {/* Refresh Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fetchOverview()}
              disabled={isLoading}
              className="h-8 px-2.5 text-xs text-slate-700"
              title="Recarregar Dados"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>

            {/* Mobile Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="lg:hidden p-2 text-slate-500 hover:text-red-600 rounded-md"
              aria-label="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <main
          className={`flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto ${
            denseMode ? 'space-y-4' : 'space-y-6'
          }`}
        >
          {/* Provenance & Safety Notice Banner (AGENTS.md rule 4 & API-106 compliance) */}
          <div className="p-3.5 sm:p-4 rounded-xl border border-amber-200 bg-amber-50/80 text-amber-900 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-950">
                Ambiente de Demonstração — Dados de Apresentação Simulados
              </p>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                As métricas visuais de receita estimada, gráficos e histórico de anúncios são
                apresentações simuladas para validação de interface e conformidade visual com o
                Figma ADM-D-002/ADM-M-001. Não representam dados contábeis ou de produção.
              </p>
            </div>
          </div>

          {/* Development-Gated QA Testing Toolbar (Step 4 & Step 5) */}
          {showQAHarness && (
            <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  🧪 QA Harness:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    variant={scenario === 'success' ? 'default' : 'outline'}
                    onClick={() => handleScenarioChange('success')}
                    className="h-7 text-xs bg-red-600 hover:bg-red-700 text-white"
                  >
                    Normal (200)
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={scenario === 'loading' ? 'default' : 'outline'}
                    onClick={() => handleScenarioChange('loading')}
                    className="h-7 text-xs"
                  >
                    Carregando
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={scenario === 'empty' ? 'default' : 'outline'}
                    onClick={() => handleScenarioChange('empty')}
                    className="h-7 text-xs"
                  >
                    Vazio (0 dados)
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={scenario === 'error' ? 'destructive' : 'outline'}
                    onClick={() => handleScenarioChange('error')}
                    className="h-7 text-xs"
                  >
                    Erro (500)
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={scenario === 'forbidden' ? 'secondary' : 'outline'}
                    onClick={() => handleScenarioChange('forbidden')}
                    className="h-7 text-xs"
                  >
                    Negado (403)
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 403 Forbidden Access Restricted State (Step 4 Security Compliance - NO Self-Elevation) */}
          {error?.statusCode === 403 && (
            <Card className="border-amber-200 bg-amber-50/50 p-8 text-center my-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mb-3">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-amber-950">Acesso Restrito ao Painel (403)</h3>
              <p className="text-sm text-amber-800 max-w-md mx-auto mt-1">
                {error.message ||
                  'Sua conta não possui privilégios suficientes para acessar as funções de administração geral.'}
              </p>
              <div className="mt-5 flex justify-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-xs text-slate-700 border-slate-300"
                >
                  Encerrar Sessão
                </Button>
                <Link href="/login">
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="text-xs bg-red-600 hover:bg-red-700 text-white"
                  >
                    Trocar Credenciais
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {/* 500 Network / Server Error State with Retry */}
          {error && error.statusCode !== 403 && (
            <Card className="border-red-200 bg-red-50/50 p-8 text-center my-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-red-950">Falha ao Carregar Métricas</h3>
              <p className="text-sm text-red-800 max-w-md mx-auto mt-1">
                {error.message || 'Ocorreu uma falha na comunicação com a API de administração.'}
              </p>
              <div className="mt-4">
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => fetchOverview()}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Tentar Novamente
                </Button>
              </div>
            </Card>
          )}

          {/* =====================================================================
              STEP 2 & 3: FOUR SUMMARY CARDS (Figma ADM-D-002 & ADM-M-001)
          ===================================================================== */}
          {!error && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Card 1: Total Users (Approved OpenAPI v0.2 total_users) */}
              <Card className="border-slate-200 bg-white shadow-xs">
                <CardHeader className="p-4 sm:p-5 pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-[11px] sm:text-xs uppercase font-bold text-slate-500 tracking-wider">
                      Total de Usuários
                    </CardDescription>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-8 w-24 mt-2" />
                  ) : (
                    <div className="mt-1">
                      <CardTitle className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {overview?.total_users.toLocaleString('pt-BR') || '0'}
                      </CardTitle>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-600 font-medium">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+12% no mês</span>
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4 sm:p-5 pt-0 text-[11px] text-slate-500 hidden sm:block">
                  Compradores, vendedores e lojas
                </CardContent>
              </Card>

              {/* Card 2: Active Listings (Approved OpenAPI v0.2 active_listings) */}
              <Card className="border-slate-200 bg-white shadow-xs">
                <CardHeader className="p-4 sm:p-5 pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-[11px] sm:text-xs uppercase font-bold text-slate-500 tracking-wider">
                      Anúncios Ativos
                    </CardDescription>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Car className="w-4 h-4" />
                    </div>
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-8 w-24 mt-2" />
                  ) : (
                    <div className="mt-1">
                      <CardTitle className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {overview?.active_listings.toLocaleString('pt-BR') || '0'}
                      </CardTitle>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-600 font-medium">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+8% no mês</span>
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4 sm:p-5 pt-0 text-[11px] text-slate-500 hidden sm:block">
                  Veículos publicados no catálogo
                </CardContent>
              </Card>

              {/* Card 3: Revenue (Simulated Mock Presentation Data) */}
              <Card className="border-slate-200 bg-white shadow-xs">
                <CardHeader className="p-4 sm:p-5 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <CardDescription className="text-[11px] sm:text-xs uppercase font-bold text-slate-500 tracking-wider">
                        Receita Estimada (Mês)
                      </CardDescription>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-8 w-28 mt-2" />
                  ) : (
                    <div className="mt-1">
                      <div className="flex items-center gap-1.5">
                        <CardTitle className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                          {scenario === 'empty'
                            ? 'R$ 0'
                            : `R$ ${mockSimulatedRevenue.monthlyEstimatedRevenue.toLocaleString('pt-BR')}`}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1 py-0 h-4 bg-purple-50 text-purple-700 border-purple-200"
                        >
                          SIMULADO
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-600 font-medium">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+15% vs mês anterior</span>
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4 sm:p-5 pt-0 text-[11px] text-slate-500 hidden sm:block">
                  Assinaturas e taxas de destaque
                </CardContent>
              </Card>

              {/* Card 4: Pending Approvals (Approved OpenAPI v0.2 pending_approvals) */}
              <Card className="border-slate-200 bg-white shadow-xs border-l-4 border-l-amber-500">
                <CardHeader className="p-4 sm:p-5 pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-[11px] sm:text-xs uppercase font-bold text-amber-800 tracking-wider">
                      Pendentes de Moderação
                    </CardDescription>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20 mt-2" />
                  ) : (
                    <div className="mt-1">
                      <CardTitle className="text-2xl sm:text-3xl font-extrabold text-amber-600">
                        {overview?.pending_approvals.toLocaleString('pt-BR') || '0'}
                      </CardTitle>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-amber-700 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Requer ação de vistoria</span>
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4 sm:p-5 pt-0 text-[11px] text-slate-500 hidden sm:block">
                  Fila prioritária de conformidade
                </CardContent>
              </Card>
            </div>
          )}

          {/* Essential Mobile Restriction Notice (SRS ADM-020 Compliance) */}
          <div className="lg:hidden p-3.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-900 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Política de Operação Mobile</p>
              <p className="text-[11px] text-blue-800 mt-0.5">
                Conforme diretriz SRS ADM-020, confirmação de pagamentos em dinheiro e conciliação
                financeira avançada são estritamente restritas ao acesso desktop.
              </p>
            </div>
          </div>

          {/* =====================================================================
              MAIN 2-COLUMN SECTION:
              - Left: Revenue Chart + Recent Listings Table
              - Right: "Requer Atenção" Panel + Authorized Quick Access
          ===================================================================== */}
          {!error && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (8 cols): Revenue Chart + Recent Listings Table */}
              <div className="lg:col-span-8 space-y-6">
                {/* 1. Revenue & Performance Chart (Figma ADM-D-002) */}
                <Card className="border-slate-200 bg-white shadow-xs">
                  <CardHeader className="p-5 pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-bold text-slate-900">
                          Evolução de Receita & Anúncios
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-700 border-purple-200 text-[10px]"
                        >
                          SIMULADO
                        </Badge>
                      </div>
                      <CardDescription className="text-xs text-slate-500 mt-0.5">
                        Faturamento mensal estimado e volume de anúncios publicados no marketplace
                      </CardDescription>
                    </div>

                    {/* Chart Range Filters */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
                      <button
                        type="button"
                        onClick={() => setChartRange('30d')}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                          chartRange === '30d'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        30 Dias
                      </button>
                      <button
                        type="button"
                        onClick={() => setChartRange('90d')}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                          chartRange === '90d'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        90 Dias
                      </button>
                      <button
                        type="button"
                        onClick={() => setChartRange('12m')}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                          chartRange === '12m'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        12 Meses
                      </button>
                    </div>
                  </CardHeader>

                  <CardContent className="p-5">
                    {/* SVG Chart Visualization */}
                    {scenario === 'empty' ? (
                      <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                        <CheckCircle className="w-10 h-10 text-slate-300 mb-2" />
                        <p className="text-sm font-semibold text-slate-700">Sem dados no período</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Nenhuma transação registrada no intervalo selecionado.
                        </p>
                      </div>
                    ) : (
                      <div>
                        {/* Legend */}
                        <div className="flex items-center justify-end gap-5 mb-4 text-xs font-medium text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-sm bg-red-600 inline-block" />
                            <span>Receita (R$)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-slate-800 inline-block" />
                            <span>Anúncios Ativos</span>
                          </div>
                        </div>

                        {/* Interactive SVG Bar & Line Chart */}
                        <div className="relative h-56 w-full">
                          <svg
                            className="w-full h-full overflow-visible"
                            viewBox="0 0 600 220"
                            preserveAspectRatio="none"
                            aria-label="Gráfico de evolução de receita e anúncios"
                          >
                            <title>Evolução de Receita e Anúncios</title>
                            {/* Gridlines */}
                            <line
                              x1="0"
                              y1="40"
                              x2="600"
                              y2="40"
                              stroke="#F1F5F9"
                              strokeWidth="1"
                              strokeDasharray="4 4"
                            />
                            <line
                              x1="0"
                              y1="90"
                              x2="600"
                              y2="90"
                              stroke="#F1F5F9"
                              strokeWidth="1"
                              strokeDasharray="4 4"
                            />
                            <line
                              x1="0"
                              y1="140"
                              x2="600"
                              y2="140"
                              stroke="#F1F5F9"
                              strokeWidth="1"
                              strokeDasharray="4 4"
                            />
                            <line
                              x1="0"
                              y1="190"
                              x2="600"
                              y2="190"
                              stroke="#E2E8F0"
                              strokeWidth="1"
                            />

                            {/* Bars & Labels */}
                            {mockChartData.map((d, idx) => {
                              const x = 50 + idx * 95;
                              const barHeight = (d.revenue / 55000) * 150;
                              const y = 190 - barHeight;

                              return (
                                <g key={d.month} className="group cursor-pointer">
                                  {/* Bar with rounded top */}
                                  <rect
                                    x={x - 18}
                                    y={y}
                                    width="36"
                                    height={barHeight}
                                    rx="4"
                                    className="fill-red-600 hover:fill-red-700 transition-colors"
                                  />
                                  {/* Value text above bar */}
                                  <text
                                    x={x}
                                    y={y - 6}
                                    textAnchor="middle"
                                    className="text-[10px] fill-slate-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    {d.revenueFormatted}
                                  </text>
                                  {/* Month label on X axis */}
                                  <text
                                    x={x}
                                    y="208"
                                    textAnchor="middle"
                                    className="text-[11px] fill-slate-500 font-semibold"
                                  >
                                    {d.month}
                                  </text>
                                </g>
                              );
                            })}

                            {/* Trend Line for Active Listings */}
                            <path
                              d="M 50 145 L 145 130 L 240 115 L 335 100 L 430 85 L 525 75"
                              fill="none"
                              stroke="#1E293B"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                            />

                            {/* Trend Points */}
                            {[
                              { cx: 50, cy: 145, count: 220 },
                              { cx: 145, cy: 130, count: 255 },
                              { cx: 240, cy: 115, count: 280 },
                              { cx: 335, cy: 100, count: 305 },
                              { cx: 430, cy: 85, count: 325 },
                              { cx: 525, cy: 75, count: 342 },
                            ].map((pt) => (
                              <circle
                                key={`pt-${pt.cx}-${pt.cy}`}
                                cx={pt.cx}
                                cy={pt.cy}
                                r="4"
                                className="fill-white stroke-slate-900 stroke-2"
                              />
                            ))}
                          </svg>
                        </div>

                        {/* Chart Summary Metrics Footer */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 pt-4 border-t border-slate-100 text-center">
                          <div className="p-2 sm:p-3 bg-slate-50 rounded-lg">
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">
                              Receita Acumulada
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 block">
                              R$ 253.450
                            </span>
                          </div>
                          <div className="p-2 sm:p-3 bg-slate-50 rounded-lg">
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">
                              Ticket Médio
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 block">
                              R$ 149,00
                            </span>
                          </div>
                          <div className="p-2 sm:p-3 bg-slate-50 rounded-lg">
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">
                              Taxa de Conversão
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-emerald-600 mt-0.5 block">
                              4,2%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 2. Recent Listings Table (Figma ADM-D-002 - NOT Moderation Queue!) */}
                <Card className="border-slate-200 bg-white shadow-xs">
                  <CardHeader className="p-5 pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-bold text-slate-900">
                          Últimos Anúncios Cadastrados
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="bg-slate-100 text-slate-700 border-slate-200"
                        >
                          {filteredRecentListings.length} Recentes
                        </Badge>
                      </div>
                      <CardDescription className="text-xs text-slate-500 mt-0.5">
                        Veículos cadastrados recentemente por particulares e concessionárias
                      </CardDescription>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setSelectedListingsFilter('todos')}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                          selectedListingsFilter === 'todos'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Todos
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedListingsFilter('particulares')}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                          selectedListingsFilter === 'particulares'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Particulares
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedListingsFilter('concessionarias')}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                          selectedListingsFilter === 'concessionarias'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Lojas
                      </button>
                    </div>
                  </CardHeader>

                  {/* Empty State */}
                  {filteredRecentListings.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                      </div>
                      <p className="text-sm font-semibold text-slate-800">
                        Nenhum Anúncio Cadastrado
                      </p>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        Não existem anúncios cadastrados neste filtro no momento.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Desktop Table */}
                      <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-600 tracking-wider border-b border-slate-100">
                            <tr>
                              <th className="py-3 px-5">Veículo</th>
                              <th className="py-3 px-4">Anunciante</th>
                              <th className="py-3 px-4">Valor</th>
                              <th className="py-3 px-4">Envio</th>
                              <th className="py-3 px-4">Status</th>
                              <th className="py-3 px-5 text-right">Ação</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredRecentListings.map((item) => (
                              <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="py-3.5 px-5 font-semibold text-slate-900">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                                      <Car className="w-4 h-4 text-slate-600" />
                                    </div>
                                    <div>
                                      <span className="block font-semibold text-slate-900">
                                        {item.title}
                                      </span>
                                      <span className="block text-xs font-normal text-slate-500">
                                        {item.details}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 text-slate-700">
                                  <span className="font-medium">{item.sellerName}</span>
                                  <span className="block text-xs text-slate-400">
                                    {item.sellerType}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 font-bold text-slate-900">
                                  {item.priceFormatted}
                                </td>
                                <td className="py-3.5 px-4 text-xs text-slate-500">
                                  {item.submittedAt}
                                </td>
                                <td className="py-3.5 px-4">
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      item.status === 'Ativo'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                    }`}
                                  >
                                    {item.status}
                                  </Badge>
                                </td>
                                <td className="py-3.5 px-5 text-right">
                                  <Link href={`/anuncios/${item.id}`}>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 text-xs font-semibold"
                                    >
                                      Ver Detalhes
                                    </Button>
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile Stacked Card List (ADM-M-001) */}
                      <div className="sm:hidden divide-y divide-slate-100">
                        {filteredRecentListings.map((item) => (
                          <div key={item.id} className="p-4 space-y-2">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <p className="font-bold text-sm text-slate-900 leading-snug">
                                  {item.title}
                                </p>
                                <p className="text-xs text-slate-500">{item.details}</p>
                              </div>
                              <span className="text-sm font-bold text-slate-900 shrink-0">
                                {item.priceFormatted}
                              </span>
                            </div>
                            <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                              <span>{item.sellerName}</span>
                              <Badge
                                variant="outline"
                                className={`text-[10px] ${
                                  item.status === 'Ativo'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}
                              >
                                {item.status}
                              </Badge>
                            </div>
                            <div className="pt-2">
                              <Link href={`/anuncios/${item.id}`} className="block w-full">
                                <Button size="sm" variant="outline" className="w-full text-xs h-8">
                                  Ver Detalhes
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </Card>
              </div>

              {/* Right Column (4 cols): "Requer Atenção" Panel + Quick Access */}
              <div className="lg:col-span-4 space-y-6">
                {/* 1. "Requer Atenção" Panel (Figma ADM-D-002 & ADM-M-001) */}
                <Card className="border-slate-200 bg-white shadow-xs">
                  <CardHeader className="p-5 pb-3 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-bold text-slate-900">
                          Requer Atenção
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="bg-red-50 text-red-700 border-red-200 font-bold"
                        >
                          {currentAttentionItems.length}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs text-slate-500 mt-0.5">
                        Itens críticos que demandam ação administrativa
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 space-y-3">
                    {currentAttentionItems.length === 0 ? (
                      <div className="p-6 text-center text-slate-500">
                        <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                        <p className="text-xs font-semibold text-slate-800">Tudo em dia!</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Nenhum item pendente de resolução urgente no momento.
                        </p>
                      </div>
                    ) : (
                      currentAttentionItems.map((item) => (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                item.priority === 'alta'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {item.badgeLabel}
                            </span>
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {item.timestamp}
                            </span>
                          </div>

                          <div>
                            <p className="text-xs font-bold text-slate-900 leading-snug">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          <div className="pt-1">
                            <Link href={item.targetUrl}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs w-full text-slate-700 hover:text-red-700 hover:bg-red-50 hover:border-red-200 transition-colors"
                              >
                                {item.actionLabel}
                                <ArrowUpRight className="w-3 h-3 ml-1" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* 2. Authorized Quick Access Panel */}
                <Card className="border-slate-200 bg-white shadow-xs">
                  <CardHeader className="p-5 pb-3 border-b border-slate-100">
                    <CardTitle className="text-base font-bold text-slate-900">
                      Acesso Rápido Autorizado
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Atalhos operacionais liberados para a função central
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    <Link
                      href="/anuncios/novo"
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 hover:border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <PlusCircle className="w-4 h-4 text-red-600" />
                        <span>Novo Anúncio Gerenciado</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </Link>

                    <Link
                      href="/vendedores"
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 hover:border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <span>Diretório de Concessionárias</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </Link>

                    <Link
                      href="/pagamentos"
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 hover:border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        <span>Relatório de Conciliação Financeira</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </Link>

                    <Link
                      href="/suporte"
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 hover:border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Headphones className="w-4 h-4 text-purple-600" />
                        <span>Canal de Suporte & Denúncias</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================================
          MOBILE ESSENTIAL BOTTOM NAVIGATION (Figma ADM-M-001)
          Exact Labels & Ordering: Painel / Vendedores / Anúncios / Alertas
      ========================================================================= */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-slate-200 z-40 flex items-center justify-around px-2 shadow-lg"
        aria-label="Navegação móvel principal"
      >
        {/* Tab 1: Painel (Active) */}
        <button
          type="button"
          onClick={() => setActiveMobileTab('painel')}
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-semibold transition-colors ${
            activeMobileTab === 'painel'
              ? 'text-red-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-1" />
          <span>Painel</span>
        </button>

        {/* Tab 2: Vendedores */}
        <button
          type="button"
          onClick={() => setActiveMobileTab('vendedores')}
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-semibold transition-colors ${
            activeMobileTab === 'vendedores'
              ? 'text-red-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-5 h-5 mb-1" />
          <span>Vendedores</span>
        </button>

        {/* Tab 3: Anúncios */}
        <button
          type="button"
          onClick={() => setActiveMobileTab('anuncios')}
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-semibold transition-colors relative ${
            activeMobileTab === 'anuncios'
              ? 'text-red-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Car className="w-5 h-5 mb-1" />
          <span>Anúncios</span>
          {overview?.pending_approvals ? (
            <span className="absolute top-1 right-5 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
              {overview.pending_approvals}
            </span>
          ) : null}
        </button>

        {/* Tab 4: Alertas */}
        <button
          type="button"
          onClick={() => setActiveMobileTab('alertas')}
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-semibold transition-colors relative ${
            activeMobileTab === 'alertas'
              ? 'text-red-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-5 h-5 mb-1" />
          <span>Alertas</span>
          <span className="absolute top-1 right-5 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
            {currentAttentionItems.length}
          </span>
        </button>
      </nav>
    </div>
  );
}

export default function AdminOverviewPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
          Carregando painel administrativo...
        </div>
      }
    >
      <AdminOverviewContent />
    </React.Suspense>
  );
}
