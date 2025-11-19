"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Send, MessageCircle, HelpCircle, Phone, Clock, CheckCircle } from "lucide-react";

const faqs = [
  {
    question: "Como funciona a análise da pele?",
    answer: "Tire uma foto do seu rosto e nossa IA analisa sua pele em segundos, identificando tipo de pele, problemas específicos e criando uma rotina personalizada."
  },
  {
    question: "Posso cancelar minha assinatura a qualquer momento?",
    answer: "Sim! Você pode cancelar quando quiser. Seu acesso continua até o fim do período pago e não há multas por cancelamento."
  },
  {
    question: "Quanto tempo leva para ver resultados?",
    answer: "A maioria dos usuários vê melhorias significativas em 30 dias com o uso consistente da rotina recomendada."
  },
  {
    question: "Meus dados estão seguros?",
    answer: "Sim, utilizamos criptografia de ponta e não compartilhamos seus dados pessoais com terceiros."
  },
  {
    question: "Posso mudar meu plano?",
    answer: "Claro! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento através do seu perfil."
  }
];

export default function SupportPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simula envio de email
    const mailtoLink = `mailto:aldoconstantinomendes@gmail.com?subject=${encodeURIComponent(
      `[${formData.type.toUpperCase()}] ${formData.subject}`
    )}&body=${encodeURIComponent(
      `Nome: ${formData.name}\nEmail: ${formData.email}\nTipo: ${formData.type}\n\nMensagem:\n${formData.message}`
    )}`;

    window.location.href = mailtoLink;

    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setFormData({ name: "", email: "", subject: "", message: "", type: "general" });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 hover:bg-white/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div>
            <Card className="p-8 bg-white shadow-xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Suporte GlowAI
                </h1>
                <p className="text-gray-600">
                  Estamos aqui para ajudar! Como podemos te auxiliar hoje?
                </p>
              </div>

              {success && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-800 text-sm font-medium">
                      Mensagem enviada com sucesso! Responderemos em até 24 horas.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Suporte *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    required
                  >
                    <option value="general">Geral</option>
                    <option value="technical">Técnico</option>
                    <option value="billing">Cobrança</option>
                    <option value="account">Conta</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seu Nome *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                      placeholder="Maria Silva"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seu Email *
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assunto *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    placeholder="Como podemos ajudar?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
                    placeholder="Descreva sua dúvida ou problema em detalhes..."
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 text-lg shadow-xl disabled:opacity-50"
                >
                  {loading ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* FAQ and Contact Info */}
          <div className="space-y-6">
            {/* FAQ */}
            <Card className="p-8 bg-white shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Perguntas Frequentes</h2>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-2 border-gray-200 rounded-lg">
                    <button
                      onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                      className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        <span className={`transform transition-transform ${activeFaq === index ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </div>
                    </button>
                    {activeFaq === index && (
                      <div className="px-4 pb-4">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Contact Methods */}
            <Card className="p-8 bg-white shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Outras Formas de Contato</h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <Mail className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="font-semibold text-purple-900">Email</p>
                    <p className="text-sm text-purple-700">aldoconstantinomendes@gmail.com</p>
                    <p className="text-xs text-purple-600">Resposta em até 24h</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-900">Horário de Atendimento</p>
                    <p className="text-sm text-blue-700">Segunda a Sexta</p>
                    <p className="text-xs text-blue-600">9h às 18h (GMT-3)</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <Phone className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">Suporte Prioritário</p>
                    <p className="text-sm text-green-700">Para usuários Pro</p>
                    <p className="text-xs text-green-600">Resposta em até 2h</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 bg-white shadow-lg text-center">
                <div className="text-2xl font-bold text-purple-600">24h</div>
                <p className="text-xs text-gray-600">Tempo médio de resposta</p>
              </Card>

              <Card className="p-4 bg-white shadow-lg text-center">
                <div className="text-2xl font-bold text-pink-600">98%</div>
                <p className="text-xs text-gray-600">Satisfação dos usuários</p>
              </Card>

              <Card className="p-4 bg-white shadow-lg text-center">
                <div className="text-2xl font-bold text-blue-600">50k+</div>
                <p className="text-xs text-gray-600">Usuários ajudados</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}