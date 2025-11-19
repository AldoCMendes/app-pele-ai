"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { resetPassword } from "@/lib/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Erro ao enviar email de redefinição. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/login")}
          className="hover:bg-white/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card className="p-8 bg-white shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {success ? "Email Enviado!" : "Redefinir Senha"}
            </h1>
            <p className="text-gray-600">
              {success
                ? "Verifique sua caixa de entrada e siga as instruções para redefinir sua senha."
                : "Digite seu email para receber um link de redefinição de senha."
              }
            </p>
          </div>

          {success ? (
            <div className="space-y-6">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-800 text-sm font-medium">
                    Email enviado com sucesso! Verifique sua caixa de entrada.
                  </p>
                </div>
              </div>

              <Button
                onClick={() => router.push("/login")}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 text-lg shadow-xl"
              >
                Voltar ao Login
              </Button>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seu Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 text-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Enviando..." : "Enviar Link de Redefinição"}
                </Button>
              </form>
            </>
          )}

          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Lembrou sua senha?{" "}
              <Button
                variant="link"
                onClick={() => router.push("/login")}
                className="p-0 h-auto text-purple-600 hover:text-purple-700"
              >
                Fazer login
              </Button>
            </p>
          </div>
        </Card>

        {/* Trust Badges */}
        <div className="text-center text-sm text-gray-600">
          <p>🔒 Links de redefinição são seguros e expiram em 24 horas</p>
        </div>
      </div>
    </div>
  );
}