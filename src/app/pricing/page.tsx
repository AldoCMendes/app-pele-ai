"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Camera, Star, ArrowRight, Crown, Zap } from "lucide-react";

const plans = [
  {
    id: "basic",
    name: "Básico",
    price: 29.90,
    originalPrice: 49.90,
    description: "Perfeito para começar sua jornada",
    features: [
      "Análise completa da pele via IA",
      "Rotina personalizada de skincare",
      "Acompanhamento semanal",
      "Suporte via email",
      "Até 5 fotos por mês",
    ],
    popular: false,
    color: "from-blue-500 to-blue-600",
    icon: Check,
  },
  {
    id: "premium",
    name: "Premium",
    price: 49.90,
    originalPrice: 79.90,
    description: "Para quem quer resultados reais",
    features: [
      "Tudo do Básico +",
      "Análise diária da pele",
      "Relatórios detalhados de progresso",
      "Recomendações de produtos",
      "Acesso prioritário ao suporte",
      "Fotos ilimitadas",
      "Alertas personalizados",
    ],
    popular: true,
    color: "from-purple-500 to-purple-600",
    icon: Star,
  },
  {
    id: "pro",
    name: "Pro",
    price: 79.90,
    originalPrice: 119.90,
    description: "Experiência completa e avançada",
    features: [
      "Tudo do Premium +",
      "Consultoria com dermatologistas",
      "Análises avançadas com IA",
      "Relatórios mensais VIP",
      "Produtos recomendados com desconto",
      "Suporte 24/7",
      "Acesso antecipado a novos recursos",
      "Sessões de acompanhamento ao vivo",
    ],
    popular: false,
    color: "from-pink-500 to-pink-600",
    icon: Crown,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const handleSelectPlan = (planId: string) => {
    router.push(`/checkout?plan=${planId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">GlowAI</h1>
                <p className="text-sm text-gray-600">Transforme sua pele com IA</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/login")}
              >
                Entrar
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/support")}
              >
                Suporte
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 border-2 border-purple-200 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-semibold text-purple-800">Oferta Especial</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Escolha seu Plano
            </span>
            <br />
            <span className="text-gray-900">e Transforme sua Pele</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Análises personalizadas com IA, rotinas adaptadas ao seu tipo de pele e acompanhamento
            profissional. Resultados reais em apenas 30 dias.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-lg border-2 border-gray-200 mb-8">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-3 rounded-md font-semibold transition-all ${
                billingCycle === "monthly"
                  ? "bg-purple-500 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-3 rounded-md font-semibold transition-all ${
                billingCycle === "yearly"
                  ? "bg-purple-500 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Anual
              <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            const price = billingCycle === "yearly" ? plan.price * 0.8 : plan.price;
            const originalPrice = billingCycle === "yearly" ? plan.originalPrice * 0.8 : plan.originalPrice;

            return (
              <Card
                key={plan.id}
                className={`relative p-8 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${
                  plan.popular ? "ring-2 ring-purple-500 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      MAIS POPULAR
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${plan.color} rounded-full flex items-center justify-center shadow-xl mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>

                  <div className="mb-4">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        R$ {price.toFixed(2).replace(".", ",")}
                      </span>
                      <span className="text-gray-500">/{billingCycle === "monthly" ? "mês" : "ano"}</span>
                    </div>
                    <div className="text-sm text-gray-500 line-through">
                      R$ {originalPrice.toFixed(2).replace(".", ",")}
                    </div>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-6 text-lg font-bold shadow-xl hover:scale-105 transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      : "bg-gray-900 hover:bg-gray-800 text-white"
                  }`}
                >
                  {plan.popular ? (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Começar Agora
                    </>
                  ) : (
                    <>
                      Escolher Plano
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Features Comparison */}
        <Card className="p-8 bg-white shadow-xl mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher o GlowAI?
            </h2>
            <p className="text-gray-600">
              Tecnologia de ponta para resultados reais
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl mb-4">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Análise por Foto</h3>
              <p className="text-gray-600">
                Nossa IA analisa sua pele em segundos, identificando problemas invisíveis a olho nu.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rotina Personalizada</h3>
              <p className="text-gray-600">
                Receba uma rotina 100% adaptada ao seu tipo de pele e necessidades específicas.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-xl mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Acompanhamento</h3>
              <p className="text-gray-600">
                Monitore sua evolução diariamente e receba dicas personalizadas para melhores resultados.
              </p>
            </div>
          </div>
        </Card>

        {/* Testimonials */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            O que nossos usuários dizem
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 bg-white shadow-lg">
              <div className="flex gap-1 mb-3 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 text-sm italic mb-3">
                "Em 3 semanas minha pele mudou completamente! O acompanhamento diário faz toda diferença."
              </p>
              <p className="text-sm font-semibold text-gray-900">Maria Clara, 28</p>
            </Card>

            <Card className="p-6 bg-white shadow-lg">
              <div className="flex gap-1 mb-3 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 text-sm italic mb-3">
                "Finalmente uma rotina que funciona! A IA realmente entende minha pele."
              </p>
              <p className="text-sm font-semibold text-gray-900">Rafael Santos, 32</p>
            </Card>

            <Card className="p-6 bg-white shadow-lg">
              <div className="flex gap-1 mb-3 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 text-sm italic mb-3">
                "O melhor investimento que fiz pela minha pele. Resultados incríveis!"
              </p>
              <p className="text-sm font-semibold text-gray-900">Ana Paula, 35</p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="p-8 sm:p-12 bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 text-white shadow-2xl">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Pronto para Transformar sua Pele?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Junte-se a mais de 50.000 pessoas que já descobriram sua rotina perfeita
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => handleSelectPlan("premium")}
                className="bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold text-xl px-12 py-6 shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <Zap className="w-6 h-6 mr-2" />
                Começar Gratuitamente
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/")}
                className="border-2 border-white text-white hover:bg-white hover:text-purple-900 px-12 py-6"
              >
                Fazer o Quiz Primeiro
              </Button>
            </div>

            <p className="text-sm text-purple-200 mt-6">
              🎁 7 dias grátis • Cancele quando quiser • Sem taxas ocultas
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}