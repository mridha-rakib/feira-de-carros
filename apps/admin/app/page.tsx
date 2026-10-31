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
  Building2,
  Car,
  CheckCircle,
  ChevronRight,
  Database,
  DollarSign,
  FileText,
  Filter,
  Headphones,
  Home,
  Layers,
  LayoutDashboard,
  LogOut,
  RefreshCw,
  Search,
  Settings,
  ShieldAlert,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { mockAuthAdapter } from '../lib/adapters/mock-auth-adapter';
import { type MockScenario, mockDashboardAdapter } from '../lib/adapters/mock-dashboard-adapter';
import { useAdminUIStore } from '../stores/use-admin-ui-store';

interface ModerationItem {
  id: string;
  makeModel: string;
  yearPlate: string;
  sellerName: string;
  sellerType: 'Particular' | 'Concessionária';
  priceFormatted: string;
  submissionDate: string;
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
}

const mockModerationQueue: ModerationItem[] = [
  {
    id: 'rev-001',
    makeModel: 'Toyota Corolla 2.0 XEi Flex Automático',
    yearPlate: '2024/2024 • Final 8',
    sellerName: 'Auto Shopping Leste Ltda',
    sellerType: 'Concessionária',
    priceFormatted: 'R$ 142.900',
    submissionDate: 'Hoje, 10:14',
    status: 'PENDENTE',
  },
  {
    id: 'rev-002',
    makeModel: 'Jeep Compass Longitude 1.3 T270 Turbo',
    yearPlate: '2023/2024 • Final 4',
    sellerName: 'Marcos Vinícius Silva',
    sellerType: 'Particular',
    priceFormatted: 'R$ 158.900',
    submissionDate: 'Hoje, 09:42',
    status: 'PENDENTE',
  },
  {
    id: 'rev-003',
    makeModel: 'BYD Dolphin Plus 60.48 kWh Elétrico',
    yearPlate: '2024/2024 • Final 1',
    sellerName: 'Green Motors Ipatinga',
    sellerType: 'Concessionária',
    priceFormatted: 'R$ 169.800',
    submissionDate: 'Ontem, 17:30',
    status: 'PENDENTE',
  },
  {
    id: 'rev-004',
    makeModel: 'Honda Civic Touring 1.5 Turbo Automático',
    yearPlate: '2022/2023 • Final 9',
    sellerName: 'Ana Beatriz Souza',
    sellerType: 'Particular',
    priceFormatted: 'R$ 138.500',
    submissionDate: 'Ontem, 15:18',
    status: 'PENDENTE',
  },
];

export default function AdminOverviewPage() {
  const router = useRouter();
  const { denseMode, toggleDenseMode } = useAdminUIStore();

  const [scenario, setScenario] = React.useState<MockScenario>('success');
  const [overview, setOverview] = React.useState<AdminDashboardOverview | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<ApiError | null>(null);
  const [selectedTab, setSelectedTab] = React.useState<
    'todos' | 'particulares' | 'concessionarias'
  >('todos');
  const [activeMobileTab, setActiveMobileTab] = React.useState<
    'overview' | 'revisoes' | 'alertas' | 'perfil'
  >('overview');

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

  const handleScenarioChange = (newScenario: MockScenario) => {
    setScenario(newScenario);
    fetchOverview(newScenario);
  };

  const handleLogout = async () => {
    await mockAuthAdapter.logout();
    router.push('/login');
  };

  const filteredQueue = React.useMemo(() => {
    if (scenario === 'empty') {
      return [];
    }
    if (selectedTab === 'particulares') {
      return mockModerationQueue.filter((item) => item.sellerType === 'Particular');
    }
    if (selectedTab === 'concessionarias') {
      return mockModerationQueue.filter((item) => item.sellerType === 'Concessionária');
    }
    return mockModerationQueue;
  }, [selectedTab, scenario]);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased theme-admin pb-20 lg:pb-0">
      {/* Desktop Sidebar (252px width specified in Figma) */}
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
        <nav className="flex-1 px-3 py-4 space-y-1 text-sm font-medium overflow-y-auto">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-50 text-red-700 font-semibold"
          >
            <LayoutDashboard className="w-4 h-4 text-red-600 shrink-0" />
            <span>Visão Geral</span>
          </Link>

          <Link
            href="/vehicles"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Car className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Moderação de Carros</span>
            <Badge
              variant="outline"
              className="ml-auto text-[10px] bg-amber-50 text-amber-700 border-amber-200"
            >
              28
            </Badge>
          </Link>

          <Link
            href="/dealerships"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Concessionárias</span>
            <Badge
              variant="outline"
              className="ml-auto text-[10px] bg-blue-50 text-blue-700 border-blue-200"
            >
              6
            </Badge>
          </Link>

          <Link
            href="/users"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Users className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Gestão de Usuários</span>
          </Link>

          <Link
            href="/payments"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <DollarSign className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Pagamentos & Finanças</span>
          </Link>

          <Link
            href="/support"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Headphones className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Suporte & Chamados</span>
          </Link>

          <Link
            href="/settings"
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

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar Header (76px height specified in Figma) */}
        <header className="h-[76px] sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 shadow-sm">
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
                Visão consolidada do ecossistema e fila de moderação de anúncios
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Provenance Tag */}
            <Badge
              variant="outline"
              className="text-[11px] bg-amber-50 text-amber-800 border-amber-300 hidden md:inline-flex items-center gap-1.5"
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
              className="text-xs hidden xl:inline-flex h-8"
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

        {/* Dashboard Body Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
          {/* Provenance & Safety Notice Banner */}
          <div className="p-3.5 sm:p-4 rounded-xl border border-amber-200 bg-amber-50/80 text-amber-900 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-950">
                Ambiente de Demonstração — Dados Simulados
              </p>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                As métricas de usuários, anúncios e aprovações abaixo são dados simulados para
                validação de interface e layout visual (API-106). Não representam estatísticas reais
                de produção.
              </p>
            </div>
          </div>

          {/* Interactive QA Testing Bar */}
          <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                🧪 Cenários de QA:
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

          {/* 403 Forbidden Access Restricted State (UI-036) */}
          {error?.statusCode === 403 && (
            <Card className="border-amber-200 bg-amber-50/50 p-8 text-center my-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mb-3">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-amber-950">Acesso Restrito ao Painel (403)</h3>
              <p className="text-sm text-amber-800 max-w-md mx-auto mt-1">
                {error.message ||
                  'Sua conta não possui permissão para visualizar o painel geral de administração.'}
              </p>
              <div className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleScenarioChange('success')}
                >
                  Restaurar Permissão Admin
                </Button>
              </div>
            </Card>
          )}

          {/* 500 Network / Server Error State with Retry (UI-033) */}
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

          {/* Metric Cards Top Row (OpenAPI v0.2 AdminDashboardOverview) */}
          {!error && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Total Users Metric Card */}
              <Card className="border-slate-200 bg-white shadow-xs">
                <CardHeader className="p-5 pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                      Total de Usuários
                    </CardDescription>
                    <Users className="w-4 h-4 text-slate-400" />
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-8 w-24 mt-2" />
                  ) : (
                    <CardTitle className="text-3xl font-extrabold text-slate-900 mt-1">
                      {overview?.total_users.toLocaleString('pt-BR') || '0'}
                    </CardTitle>
                  )}
                </CardHeader>
                <CardContent className="p-5 pt-1 text-xs text-slate-500">
                  Compradores, vendedores e concessionárias
                </CardContent>
              </Card>

              {/* Active Listings Metric Card */}
              <Card className="border-slate-200 bg-white shadow-xs">
                <CardHeader className="p-5 pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                      Anúncios Ativos
                    </CardDescription>
                    <Car className="w-4 h-4 text-emerald-600" />
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-8 w-24 mt-2" />
                  ) : (
                    <CardTitle className="text-3xl font-extrabold text-emerald-600 mt-1">
                      {overview?.active_listings.toLocaleString('pt-BR') || '0'}
                    </CardTitle>
                  )}
                </CardHeader>
                <CardContent className="p-5 pt-1 text-xs text-slate-500">
                  Veículos publicados no marketplace
                </CardContent>
              </Card>

              {/* Pending Approvals Metric Card */}
              <Card className="border-slate-200 bg-white shadow-xs border-l-4 border-l-amber-500">
                <CardHeader className="p-5 pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-xs uppercase font-bold text-amber-800 tracking-wider">
                      Aprovações Pendentes
                    </CardDescription>
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-8 w-24 mt-2" />
                  ) : (
                    <CardTitle className="text-3xl font-extrabold text-amber-600 mt-1">
                      {overview?.pending_approvals.toLocaleString('pt-BR') || '0'}
                    </CardTitle>
                  )}
                </CardHeader>
                <CardContent className="p-5 pt-1 text-xs text-slate-500">
                  Fila prioritária de moderação e vistoria
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

          {/* Moderation Queue Section (ADM-D-002 Table / ADM-M-001 Cards) */}
          {!error && (
            <Card className="border-slate-200 bg-white shadow-xs">
              <CardHeader className="p-5 pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-bold text-slate-900">
                      Fila Prioritária de Moderação de Anúncios
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-300"
                    >
                      {overview?.pending_approvals ?? 28} Pendentes
                    </Badge>
                  </div>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    Anúncios submetidos aguardando revisão cadastral, vistoria e liberação pública
                  </CardDescription>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setSelectedTab('todos')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      selectedTab === 'todos'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTab('particulares')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      selectedTab === 'particulares'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Particulares
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTab('concessionarias')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      selectedTab === 'concessionarias'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Lojas
                  </button>
                </div>
              </CardHeader>

              {/* Empty State Presentation (UI-033) */}
              {overview?.pending_approvals === 0 || filteredQueue.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">Fila de Moderação Vazia</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Não existem anúncios pendentes de aprovação neste filtro no momento.
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-600 tracking-wider border-b border-slate-100">
                        <tr>
                          <th className="py-3 px-5">Veículo / Detalhes</th>
                          <th className="py-3 px-4">Anunciante</th>
                          <th className="py-3 px-4">Valor</th>
                          <th className="py-3 px-4">Envio</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-5 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredQueue.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-slate-500">
                              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                              <p className="font-semibold text-slate-800 text-sm">
                                Nenhum Anúncio Pendente
                              </p>
                              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-0.5">
                                A fila de moderação está limpa. Todos os anúncios foram revisados ou
                                estão vazios.
                              </p>
                            </td>
                          </tr>
                        ) : (
                          filteredQueue.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3.5 px-5 font-semibold text-slate-900">
                                {item.makeModel}
                                <span className="block text-xs font-normal text-slate-500 mt-0.5">
                                  {item.yearPlate}
                                </span>
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
                                {item.submissionDate}
                              </td>
                              <td className="py-3.5 px-4">
                                <Badge
                                  variant="outline"
                                  className="bg-amber-50 text-amber-700 border-amber-300 text-xs"
                                >
                                  Pendente
                                </Badge>
                              </td>
                              <td className="py-3.5 px-5 text-right">
                                <Link href={`/vehicles/${item.id}`}>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 text-xs font-semibold"
                                  >
                                    Revisar Anúncio
                                  </Button>
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Stacked Card List (ADM-M-001) */}
                  <div className="sm:hidden divide-y divide-slate-100">
                    {filteredQueue.length === 0 ? (
                      <div className="py-10 px-4 text-center text-slate-500">
                        <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        <p className="font-semibold text-slate-800 text-sm">
                          Nenhum Anúncio Pendente
                        </p>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto mt-0.5">
                          A fila de moderação está limpa no momento.
                        </p>
                      </div>
                    ) : (
                      filteredQueue.map((item) => (
                        <div key={item.id} className="p-4 space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <p className="font-bold text-sm text-slate-900 leading-snug">
                                {item.makeModel}
                              </p>
                              <p className="text-xs text-slate-500">{item.yearPlate}</p>
                            </div>
                            <span className="text-sm font-bold text-slate-900 shrink-0">
                              {item.priceFormatted}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                            <span>{item.sellerName}</span>
                            <Badge
                              variant="outline"
                              className="bg-amber-50 text-amber-700 border-amber-300 text-[10px]"
                            >
                              Pendente
                            </Badge>
                          </div>
                          <div className="pt-2">
                            <Link href={`/vehicles/${item.id}`} className="block w-full">
                              <Button size="sm" variant="outline" className="w-full text-xs h-8">
                                Revisar Anúncio
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </Card>
          )}
        </main>
      </div>

      {/* Mobile Essential Bottom Tab Navigation (86px height with safe area, ADM-M-001) */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-slate-200 z-40 flex items-center justify-around px-2 shadow-lg"
        aria-label="Navegação móvel principal"
      >
        <button
          type="button"
          onClick={() => setActiveMobileTab('overview')}
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-semibold transition-colors ${
            activeMobileTab === 'overview'
              ? 'text-red-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5 mb-1" />
          <span>Início</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMobileTab('revisoes')}
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-semibold transition-colors relative ${
            activeMobileTab === 'revisoes'
              ? 'text-red-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Car className="w-5 h-5 mb-1" />
          <span>Revisões</span>
          <span className="absolute top-1 right-5 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
            28
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMobileTab('alertas')}
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-semibold transition-colors ${
            activeMobileTab === 'alertas'
              ? 'text-red-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertCircle className="w-5 h-5 mb-1" />
          <span>Alertas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMobileTab('perfil')}
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-semibold transition-colors ${
            activeMobileTab === 'perfil'
              ? 'text-red-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-5 h-5 mb-1" />
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
}
