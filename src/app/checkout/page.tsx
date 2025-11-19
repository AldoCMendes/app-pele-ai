"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Lock, CreditCard, ArrowLeft, Sparkles, QrCode } from "lucide-react";
import { signUp } from "@/lib/auth";
import { updateSubscription } from "@/lib/auth";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") || "basic";

  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix">("card");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pixCode, setPixCode] = useState("");
  const [showPixQR, setShowPixQR] = useState(false);

  const plans = {
    basic: { name: "Básico", price: 29.90 },
    premium: { name: "Premium", price: 49.90 },
    pro: { name: "Pro", price: 79.90 },
  };

  const selectedPlan = plans[planId as keyof typeof plans] || plans.basic;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.slice(0, 19); // 16 dígitos + 3 espaços
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData((prev) => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setFormData((prev) => ({ ...prev, expiryDate: formatted }));
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.password) {
      setError("Por favor, preencha todos os campos obrigatórios");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return false;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return false;
    }

    if (paymentMethod === "card") {
      if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
        setError("Por favor, preencha todos os dados do cartão");
        return false;
      }
    }

    return true;
  };

  const generatePixCode = () => {
    // Gera código PIX simulado (em produção, use API de pagamento real)
    const randomCode = Math.random().toString(36).substring(2, 15).toUpperCase();
    return `00020126580014BR.GOV.BCB.PIX0136${randomCode}520400005303986540${selectedPlan.price.toFixed(2)}5802BR5913GLOWAI6009SAO PAULO62070503***6304`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (paymentMethod === "pix") {
        // Gerar código PIX
        const code = generatePixCode();
        setPixCode(code);
        setShowPixQR(true);
        setLoading(false);
        return;
      }

      // 1. Criar conta do usuário
      const { user } = await signUp(
        formData.email,
        formData.password,
        formData.fullName
      );

      if (!user) throw new Error("Erro ao criar conta");

      // 2. Processar pagamento (simulado)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 3. Ativar assinatura
      await updateSubscription(user.id, planId as any, "active");

      // 4. Redirecionar para o app
      router.push("/app");
    } catch (err: any) {
      setError(err.message || "Erro ao processar pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handlePixPaymentConfirmed = async () => {
    setLoading(true);
    try {
      // 1. Criar conta do usuário
      const { user } = await signUp(
        formData.email,
        formData.password,
        formData.fullName
      );

      if (!user) throw new Error("Erro ao criar conta");

      // 2. Ativar assinatura
      await updateSubscription(user.id, planId as any, "active");

      // 3. Redirecionar para o app
      router.push("/app");
    } catch (err: any) {
      setError(err.message || "Erro ao processar pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (showPixQR) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 bg-white shadow-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <QrCode className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Pagamento via PIX
              </h1>
              <p className="text-gray-600">
                Escaneie o QR Code ou copie o código abaixo
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-8 mb-6">
              <div className="bg-white p-4 rounded-lg mb-4 flex items-center justify-center">
                <div className="w-64 h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-2 font-medium">Código PIX Copia e Cola:</p>
                <div className="bg-gray-50 p-3 rounded border-2 border-gray-200 break-all text-xs font-mono text-gray-800">
                  {pixCode}
                </div>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(pixCode);
                    alert("Código PIX copiado!");
                  }}
                  className="w-full mt-3 bg-purple-600 hover:bg-purple-700"
                >
                  Copiar Código PIX
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900 font-medium mb-2">
                ℹ️ Instruções:
              </p>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Abra o app do seu banco</li>
                <li>Escolha pagar com PIX</li>
                <li>Escaneie o QR Code ou cole o código</li>
                <li>Confirme o pagamento de R$ {selectedPlan.price.toFixed(2).replace(".", ",")}</li>
                <li>Clique em "Já Paguei" abaixo</li>
              </ol>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handlePixPaymentConfirmed}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-6 text-lg"
              >
                {loading ? "Processando..." : "✓ Já Paguei"}
              </Button>
              
              <Button
                onClick={() => setShowPixQR(false)}
                variant="outline"
                className="w-full"
              >
                Voltar
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500 mt-4">
              O pagamento PIX é processado instantaneamente
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 hover:bg-white/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <Card className="p-8 bg-white shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Finalizar Assinatura
                  </h1>
                  <p className="text-gray-600">
                    Comece sua transformação hoje
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dados Pessoais */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Dados Pessoais
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                      placeholder="Maria Silva"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                      placeholder="Mínimo 6 caracteres"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Senha *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                      placeholder="Digite a senha novamente"
                      required
                    />
                  </div>
                </div>

                {/* Método de Pagamento */}
                <div className="space-y-4 pt-6 border-t-2 border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Método de Pagamento
                  </h2>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        paymentMethod === "card"
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <CreditCard className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                      <p className="text-sm font-medium text-gray-900">Cartão</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("pix")}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        paymentMethod === "pix"
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <QrCode className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                      <p className="text-sm font-medium text-gray-900">PIX</p>
                    </button>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Número do Cartão *
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleCardNumberChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome no Cartão *
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                          placeholder="MARIA SILVA"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Validade *
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleExpiryDateChange}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                            placeholder="MM/AA"
                            maxLength={5}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                            placeholder="123"
                            maxLength={4}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "pix" && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900 font-medium mb-2">
                        ℹ️ Pagamento via PIX
                      </p>
                      <p className="text-sm text-blue-800">
                        Ao clicar em "Gerar PIX", você receberá um QR Code para pagamento instantâneo.
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 text-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    "Processando..."
                  ) : paymentMethod === "pix" ? (
                    <>
                      <QrCode className="w-5 h-5 mr-2" />
                      Gerar PIX
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Confirmar Pagamento
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500">
                  🔒 Pagamento 100% seguro e criptografado
                </p>
              </form>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            <Card className="p-8 bg-white shadow-xl sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Resumo do Pedido
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-4 border-b-2 border-gray-200">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Plano {selectedPlan.name}
                    </p>
                    <p className="text-sm text-gray-600">Cobrança mensal</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {selectedPlan.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-semibold text-gray-900">
                    R$ {selectedPlan.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>

                <div className="flex justify-between items-center text-sm pb-4 border-b-2 border-gray-200">
                  <p className="text-gray-600">Desconto (7 dias grátis)</p>
                  <p className="font-semibold text-green-600">
                    -R$ {(selectedPlan.price * 0.23).toFixed(2).replace(".", ",")}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <p className="text-lg font-bold text-gray-900">Total Hoje</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    R$ {(selectedPlan.price * 0.77).toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-5 mb-6">
                <p className="text-sm font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  O que está incluído:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-purple-800">
                    <Check className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>7 dias grátis para experimentar</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-purple-800">
                    <Check className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Acesso completo a todos os recursos</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-purple-800">
                    <Check className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Cancele quando quiser, sem multa</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-purple-800">
                    <Check className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Suporte dedicado via email</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-900">
                  📅 Como funciona a cobrança:
                </p>
                <p>
                  Após os 7 dias grátis, você será cobrado R${" "}
                  {selectedPlan.price.toFixed(2).replace(".", ",")} mensalmente.
                </p>
                <p>
                  Você pode cancelar a qualquer momento nas configurações da sua
                  conta e seu acesso continua até o fim do período pago.
                </p>
              </div>
            </Card>

            {/* Trust Badges */}
            <Card className="p-6 bg-white shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">
                    Pagamento seguro com criptografia SSL
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">
                    Dados protegidos e privados
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">
                    Suporte via email disponível
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">
                    Mais de 50.000 usuários satisfeitos
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
