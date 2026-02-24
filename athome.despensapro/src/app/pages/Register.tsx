import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Package, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { Alert, AlertDescription } from "../components/ui/alert";

export function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, name);
      toast.success("Conta criada com sucesso! Faça login para continuar.");
      navigate("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle different error cases
      if (error.message.includes("email")) {
        toast.error("Verifique seu email para confirmar o cadastro, ou use a conta demo para testar.");
      } else {
        toast.error(error.message || "Erro ao criar conta. Use a conta demo para testar: demo@despensapro.com");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
            <Package className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-semibold text-foreground">Criar Conta</h1>
          <p className="mt-2 text-muted-foreground">
            Comece a controlar suas compras hoje
          </p>
        </div>
        
        {/* Demo Account Info */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Para testar o aplicativo, use a conta demo na tela de login: <strong>demo@despensapro.com</strong>
          </AlertDescription>
        </Alert>

        {/* Register Form */}
        <Card className="p-8">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar senha</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar Conta Gratuita"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Fazer login
              </Link>
            </p>
          </div>
        </Card>

        {/* Plan Info */}
        <Card className="p-6 bg-accent border-accent-foreground/10">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-accent-foreground">Plano Gratuito Inclui:</h3>
            <div className="space-y-1 text-sm text-accent-foreground/80">
              <p>✓ Até 20 itens cadastrados</p>
              <p>✓ Histórico de 3 meses</p>
              <p>✓ Gráficos básicos</p>
            </div>
            <Link to="/pricing">
              <Button variant="outline" size="sm" className="mt-4">
                Ver Planos Premium
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}