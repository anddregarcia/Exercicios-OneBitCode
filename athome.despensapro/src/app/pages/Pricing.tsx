import { Link } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Package, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function Pricing() {
  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Ideal para começar",
      features: [
        "Até 20 itens cadastrados",
        "Histórico de 3 meses",
        "Gráficos básicos",
        "1 mercado",
        "Suporte por e-mail",
      ],
      limitations: [
        "Limite de itens",
        "Histórico limitado",
      ],
      buttonText: "Plano Atual",
      buttonVariant: "outline" as const,
      popular: false,
    },
    {
      name: "Premium",
      price: "R$ 9,90",
      period: "/mês",
      description: "Para quem quer controle total",
      features: [
        "Itens ilimitados",
        "Histórico ilimitado",
        "Gráficos avançados",
        "Mercados ilimitados",
        "Exportação de dados (Excel/CSV)",
        "Alertas personalizados",
        "Comparação de preços",
        "Suporte prioritário",
      ],
      buttonText: "Assinar Premium",
      buttonVariant: "default" as const,
      popular: true,
    },
    {
      name: "Premium Plus",
      price: "R$ 19,90",
      period: "/mês",
      description: "Para famílias e uso intenso",
      features: [
        "Tudo do Premium +",
        "Múltiplas despensas",
        "Compartilhamento familiar",
        "Análise preditiva de compras",
        "API de integração",
        "Relatórios personalizados",
        "Suporte 24/7",
      ],
      buttonText: "Assinar Premium Plus",
      buttonVariant: "default" as const,
      popular: false,
    },
  ];

  const handleSubscribe = (planName: string) => {
    if (planName === "Gratuito") {
      return;
    }
    toast.success(`Redirecionando para pagamento do plano ${planName}...`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-foreground">Despensa Pro</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Escolha o plano ideal para você
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Controle suas compras, economize dinheiro e tome decisões mais inteligentes
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto max-w-7xl px-4 pb-24">
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative p-8 ${
                plan.popular
                  ? "border-2 border-primary shadow-xl"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold">
                    <Sparkles className="h-4 w-4" />
                    Mais Popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="rounded-full bg-success/10 p-1 mt-0.5">
                      <Check className="h-4 w-4 text-success" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                variant={plan.buttonVariant}
                className="w-full"
                size="lg"
                onClick={() => handleSubscribe(plan.name)}
                disabled={plan.name === "Gratuito"}
              >
                {plan.buttonText}
              </Button>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Perguntas Frequentes
          </h2>
          
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-2">
                Posso cancelar a qualquer momento?
              </h3>
              <p className="text-muted-foreground">
                Sim! Você pode cancelar sua assinatura a qualquer momento. Não há taxa de cancelamento
                e você continuará tendo acesso aos recursos premium até o fim do período pago.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-2">
                Como funciona a exportação de dados?
              </h3>
              <p className="text-muted-foreground">
                Com o plano Premium, você pode exportar todo seu histórico de compras e análises
                em formatos Excel (.xlsx) e CSV, permitindo usar os dados em outras ferramentas.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-2">
                Meus dados estão seguros?
              </h3>
              <p className="text-muted-foreground">
                Sim! Todos os dados são criptografados e armazenados com segurança. Não compartilhamos
                suas informações com terceiros e você tem total controle sobre seus dados.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-2">
                O que acontece se eu exceder o limite do plano gratuito?
              </h3>
              <p className="text-muted-foreground">
                Você será notificado quando estiver próximo do limite. Para continuar cadastrando
                novos itens, será necessário fazer upgrade para um plano Premium.
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <Card className="p-12 bg-gradient-to-br from-primary/5 to-accent/20 border-primary/20">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Pronto para economizar?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de pessoas que já estão economizando com o Despensa Pro
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="min-w-[200px]">
                  Começar Gratuitamente
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
