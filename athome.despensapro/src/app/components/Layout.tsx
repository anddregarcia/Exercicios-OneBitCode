import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Settings as SettingsIcon,
  History,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { DataInitializer } from "./DataInitializer";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Nova Compra", href: "/new-purchase", icon: ShoppingCart },
    { name: "Despensa", href: "/pantry", icon: Package },
    { name: "Itens", href: "/items", icon: SettingsIcon },
    { name: "Histórico", href: "/history", icon: History },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logout realizado com sucesso!");
      navigate("/login");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <DataInitializer>
      <div className="min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-border bg-card md:block">
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center border-b border-border px-6">
              <Package className="h-6 w-6 text-primary" />
              <span className="ml-3 text-lg font-semibold text-foreground">Despensa Pro</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="border-t border-border p-4 space-y-3">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
              <div className="rounded-lg bg-accent p-4">
                <p className="text-sm text-accent-foreground mb-2">Plano Gratuito</p>
                <Link to="/pricing">
                  <Button size="sm" className="w-full">
                    Upgrade
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-card md:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <Package className="h-6 w-6 text-primary" />
              <span className="ml-3 text-lg font-semibold text-foreground">Despensa Pro</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div className="fixed inset-y-0 right-0 w-64 bg-card" onClick={(e) => e.stopPropagation()}>
              <nav className="flex flex-col gap-1 p-4 pt-20">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                <div className="mt-6 border-t border-border pt-6 space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-muted-foreground"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                  <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full">
                      Upgrade para Premium
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="md:pl-64">
          <div className="pt-16 md:pt-0">
            <Outlet />
          </div>
        </main>
      </div>
    </DataInitializer>
  );
}