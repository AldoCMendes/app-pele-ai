"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail, Calendar, Settings, Shield, CreditCard } from "lucide-react";
import { getCurrentUser, getUserProfile, signOut } from "@/lib/auth";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  subscription_plan: string;
  subscription_status: string;
  subscription_end_date: string;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);
      const userProfile = await getUserProfile(currentUser.id);
      setProfile(userProfile);
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const getPlanName = (plan: string) => {
    const plans = {
      basic: "Básico",
      premium: "Premium",
      pro: "Pro",
      free: "Grátis"
    };
    return plans[plan as keyof typeof plans] || plan;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Carregando seu perfil...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => router.push("/app")}
                className="hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Meu Perfil</h1>
                <p className="text-sm text-gray-600">Gerencie suas informações</p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleSignOut}
            >
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 bg-white shadow-xl">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{profile.full_name}</h2>
                  <p className="text-gray-600">{profile.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-3 h-3 rounded-full ${profile.subscription_status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="text-sm text-gray-600">
                      Plano {getPlanName(profile.subscription_plan)} • {profile.subscription_status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-gray-900">Membro desde</span>
                  </div>
                  <p className="text-gray-700">{new Date(profile.created_at).toLocaleDateString('pt-BR')}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-gray-900">Próxima cobrança</span>
                  </div>
                  <p className="text-gray-700">{new Date(profile.subscription_end_date).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </Card>

            {/* Account Settings */}
            <Card className="p-8 bg-white shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Configurações da Conta</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={profile.full_name}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Para alterar seu nome, entre em contato com o suporte</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Para alterar seu email, entre em contato com o suporte</p>
                </div>

                <div className="pt-4 border-t-2 border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Ações da Conta</h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Alterar Senha
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Gerenciar Assinatura
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Excluir Conta
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Status */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h3 className="font-bold text-green-900">Assinatura Ativa</h3>
              </div>

              <div className="space-y-2 text-sm text-green-800">
                <p><strong>Plano:</strong> {getPlanName(profile.subscription_plan)}</p>
                <p><strong>Status:</strong> Ativa</p>
                <p><strong>Próxima cobrança:</strong> {new Date(profile.subscription_end_date).toLocaleDateString('pt-BR')}</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 border-green-300 text-green-700 hover:bg-green-50"
              >
                Alterar Plano
              </Button>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-white shadow-xl">
              <h3 className="font-bold text-gray-900 mb-4">Ações Rápidas</h3>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/app")}
                >
                  <User className="w-4 h-4 mr-2" />
                  Ir para Dashboard
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/support")}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Falar com Suporte
                </Button>
              </div>
            </Card>

            {/* Security */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-blue-900">Segurança</h3>
              </div>

              <div className="space-y-2 text-sm text-blue-800">
                <p>✓ Conta protegida com criptografia</p>
                <p>✓ Dados armazenados com segurança</p>
                <p>✓ Acesso seguro e privado</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}