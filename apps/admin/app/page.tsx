'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@feira/ui';
import Link from 'next/link';
import { useAdminUIStore } from '../stores/use-admin-ui-store';

export default function AdminDashboardPage() {
  const {
    isMobileSidebarOpen,
    toggleMobileSidebar,
    setMobileSidebarOpen,
    denseMode,
    toggleDenseMode,
  } = useAdminUIStore();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Sidebar Backdrop & Drawer */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            className="fixed inset-0 bg-black/50 border-0 cursor-default"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Fechar menu lateral"
          />
          <div className="relative z-10 w-64 bg-slate-900 text-white p-6 shadow-xl flex flex-col">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <span className="text-lg font-bold tracking-tight">
                Admin <span className="text-amber-400">Backoffice</span>
              </span>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="text-slate-400 hover:text-white p-1"
                aria-label="Fechar menu"
              >
                ✕
              </button>
            </div>
            <nav className="mt-6 flex flex-col gap-2">
              <Link
                href="/"
                className="rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-white"
                onClick={() => setMobileSidebarOpen(false)}
              >
                📊 Visão Geral
              </Link>
              <Link
                href="/vehicles"
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                onClick={() => setMobileSidebarOpen(false)}
              >
                🚗 Veículos & Moderação
              </Link>
              <Link
                href="/dealerships"
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                onClick={() => setMobileSidebarOpen(false)}
              >
                🏢 Concessionárias
              </Link>
              <Link
                href="/leads"
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                onClick={() => setMobileSidebarOpen(false)}
              >
                💼 Leads Comerciais
              </Link>
              <Link
                href="/support"
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                onClick={() => setMobileSidebarOpen(false)}
              >
                🎧 Suporte ao Cliente
              </Link>
            </nav>
            <div className="mt-auto pt-6 border-t border-slate-800 text-xs text-slate-400">
              <p className="font-semibold text-slate-300">Admin Móvel</p>
              <p>Perfil: Super Admin</p>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-slate-900 text-slate-200">
        <div className="flex h-16 items-center px-6 border-b border-slate-800">
          <span className="text-lg font-bold tracking-tight text-white">
            Feira <span className="text-amber-400">Admin</span>
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-1 text-sm font-medium">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg bg-slate-800 px-3 py-2.5 text-white"
          >
            <span>📊</span> Visão Geral
          </Link>
          <Link
            href="/vehicles"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-400 hover:bg-slate-800/60 hover:text-white"
          >
            <span>🚗</span> Moderação de Carros
          </Link>
          <Link
            href="/dealerships"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-400 hover:bg-slate-800/60 hover:text-white"
          >
            <span>🏢</span> Concessionárias
          </Link>
          <Link
            href="/leads"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-400 hover:bg-slate-800/60 hover:text-white"
          >
            <span>💼</span> Pipeline de Vendas
          </Link>
          <Link
            href="/support"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-400 hover:bg-slate-800/60 hover:text-white"
          >
            <span>🎧</span> Fila de Suporte
          </Link>
          <Link
            href="/audit"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-400 hover:bg-slate-800/60 hover:text-white"
          >
            <span>📋</span> Auditoria & Logs
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
          <p className="font-semibold text-slate-200">Central de Operações</p>
          <p>RBAC: Super Admin (Nível 3)</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleMobileSidebar}
              className="lg:hidden p-2 rounded-md hover:bg-slate-100 text-slate-700"
              aria-label="Menu de Navegação"
            >
              ☰
            </button>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Painel de Controle</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDenseMode}
              className="text-xs hidden sm:inline-flex"
            >
              Modo: {denseMode ? 'Denso' : 'Padrão'}
            </Button>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              ● API Conectada
            </Badge>
          </div>
        </header>

        {/* Essential Mobile & Desktop Metrics */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs uppercase font-medium">
                  Fila de Moderação
                </CardDescription>
                <CardTitle className="text-2xl font-extrabold text-amber-600">28</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                Veículos aguardando revisão
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs uppercase font-medium">
                  Lojas Pendentes
                </CardDescription>
                <CardTitle className="text-2xl font-extrabold text-blue-600">6</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                Documentos CNPJ a validar
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs uppercase font-medium">
                  Novos Leads (Hoje)
                </CardDescription>
                <CardTitle className="text-2xl font-extrabold text-emerald-600">142</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                +18% em relação a ontem
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs uppercase font-medium">
                  Chamados de Suporte
                </CardDescription>
                <CardTitle className="text-2xl font-extrabold text-slate-800">9</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                Tempo médio resp.: 8 min
              </CardContent>
            </Card>
          </div>

          {/* Essential Mobile Action Banner */}
          <div className="lg:hidden p-4 rounded-xl border bg-blue-50/60 border-blue-200 flex flex-col gap-2">
            <span className="text-xs font-semibold text-blue-900 uppercase">
              ⚡ Ações Rápidas no Mobile
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="default" className="text-xs">
                Aprovar Veículos
              </Button>
              <Button size="sm" variant="outline" className="text-xs bg-white">
                Verificar CNPJ
              </Button>
            </div>
          </div>

          {/* Moderation Queue Data Table */}
          <Card>
            <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Fila Prioritária de Moderação</CardTitle>
                <CardDescription className="text-xs">
                  Anúncios recentes submetidos para aprovação de conteúdo e vistoria
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Filtrar Status
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100/75 border-y text-xs uppercase font-semibold text-slate-600">
                    <tr>
                      <th className="p-3 pl-5">Veículo</th>
                      <th className="p-3">Vendedor</th>
                      <th className="p-3">Valor</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 pr-5 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/80">
                      <td className="p-3 pl-5 font-medium">
                        Toyota Corolla 2.0 XEi
                        <span className="block text-xs text-slate-400 font-normal">
                          Placa final 8 • 2024
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">Auto Shopping Premium</td>
                      <td className="p-3 font-semibold text-slate-900">R$ 142.900</td>
                      <td className="p-3">
                        <Badge variant="warning">Pendente</Badge>
                      </td>
                      <td className="p-3 pr-5 text-right space-x-2">
                        <Button size="sm" variant="default" className="h-7 text-xs">
                          Aprovar
                        </Button>
                        <Button size="sm" variant="destructive" className="h-7 text-xs">
                          Rejeitar
                        </Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/80">
                      <td className="p-3 pl-5 font-medium">
                        Honda Civic Touring
                        <span className="block text-xs text-slate-400 font-normal">
                          Placa final 3 • 2023
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">Carlos Eduardo (Particular)</td>
                      <td className="p-3 font-semibold text-slate-900">R$ 138.500</td>
                      <td className="p-3">
                        <Badge variant="warning">Pendente</Badge>
                      </td>
                      <td className="p-3 pr-5 text-right space-x-2">
                        <Button size="sm" variant="default" className="h-7 text-xs">
                          Aprovar
                        </Button>
                        <Button size="sm" variant="destructive" className="h-7 text-xs">
                          Rejeitar
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
