import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@feira/ui';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-primary">
                Feira<span className="text-amber-500">DeCarros</span>
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link href="/search" className="transition-colors hover:text-foreground">
                Comprar
              </Link>
              <Link href="/dealerships" className="transition-colors hover:text-foreground">
                Concessionárias
              </Link>
              <Link href="/pricing" className="transition-colors hover:text-foreground">
                Planos
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/seller/sell">
              <Button variant="accent" size="sm">
                Anunciar Carro
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-blue-50/50 via-background to-background">
        <div className="container flex flex-col items-center text-center">
          <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs font-medium">
            🚗 O Maior Ecossistema Automotivo do Brasil
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl max-w-4xl">
            Encontre o carro perfeito ou venda o seu pelo melhor valor
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Milhares de ofertas verificadas de particulares e lojas credenciadas com garantia e
            procedência.
          </p>

          {/* Quick Search Action Box */}
          <div className="mt-8 w-full max-w-3xl rounded-2xl border bg-card p-4 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col text-left">
                <label
                  htmlFor="search-make"
                  className="text-xs font-semibold text-muted-foreground uppercase px-1"
                >
                  Marca / Modelo
                </label>
                <input
                  id="search-make"
                  type="text"
                  placeholder="Ex: Toyota Corolla"
                  className="mt-1 h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col text-left">
                <label
                  htmlFor="search-state"
                  className="text-xs font-semibold text-muted-foreground uppercase px-1"
                >
                  Localização
                </label>
                <select
                  id="search-state"
                  className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Selecione o Estado
                  </option>
                  <option value="SP">São Paulo (SP)</option>
                  <option value="RJ">Rio de Janeiro (RJ)</option>
                  <option value="MG">Minas Gerais (MG)</option>
                  <option value="PR">Paraná (PR)</option>
                </select>
              </div>
              <div className="flex items-end">
                <Link href="/search" className="w-full">
                  <Button className="w-full h-10 font-semibold" size="default">
                    Buscar Veículos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-12 bg-background">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Veículos em Destaque</h2>
              <p className="text-sm text-muted-foreground">
                Oportunidades selecionadas com vistoria cautelar aprovada
              </p>
            </div>
            <Link href="/search">
              <Button variant="outline" size="sm">
                Ver Todos
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video w-full bg-slate-100 relative flex items-center justify-center text-muted-foreground text-sm font-medium">
                Toyota Corolla 2.0 XEi
                <Badge variant="warning" className="absolute top-3 left-3">
                  Destaque
                </Badge>
              </div>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Toyota Corolla</CardTitle>
                    <p className="text-xs text-muted-foreground">2.0 XEi Flex Automático</p>
                  </div>
                  <span className="text-lg font-bold text-primary">R$ 142.900</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2 pb-2">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>2024/2024</span>
                  <span>•</span>
                  <span>18.500 km</span>
                  <span>•</span>
                  <span>São Paulo, SP</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-2">
                <Link href="/car/veh-1" className="w-full">
                  <Button variant="outline" className="w-full" size="sm">
                    Ver Detalhes
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Card 2 */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video w-full bg-slate-100 relative flex items-center justify-center text-muted-foreground text-sm font-medium">
                Jeep Compass Longitude
                <Badge variant="success" className="absolute top-3 left-3">
                  Garantia Feira
                </Badge>
              </div>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Jeep Compass</CardTitle>
                    <p className="text-xs text-muted-foreground">1.3 T270 Turbo Flex Automático</p>
                  </div>
                  <span className="text-lg font-bold text-primary">R$ 158.900</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2 pb-2">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>2023/2024</span>
                  <span>•</span>
                  <span>24.000 km</span>
                  <span>•</span>
                  <span>Campinas, SP</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-2">
                <Link href="/car/veh-2" className="w-full">
                  <Button variant="outline" className="w-full" size="sm">
                    Ver Detalhes
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Card 3 */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video w-full bg-slate-100 relative flex items-center justify-center text-muted-foreground text-sm font-medium">
                BYD Dolphin Plus
                <Badge variant="secondary" className="absolute top-3 left-3">
                  100% Elétrico
                </Badge>
              </div>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">BYD Dolphin Plus</CardTitle>
                    <p className="text-xs text-muted-foreground">60.48 kWh Elétrico</p>
                  </div>
                  <span className="text-lg font-bold text-primary">R$ 169.800</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2 pb-2">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>2024/2024</span>
                  <span>•</span>
                  <span>9.200 km</span>
                  <span>•</span>
                  <span>Curitiba, PR</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-2">
                <Link href="/car/veh-3" className="w-full">
                  <Button variant="outline" className="w-full" size="sm">
                    Ver Detalhes
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t py-8 bg-slate-50 text-muted-foreground text-sm">
        <div className="container flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Feira de Carros Marketplace. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-foreground">
              Termos de Uso
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacidade
            </Link>
            <Link href="/support" className="hover:text-foreground">
              Atendimento
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
