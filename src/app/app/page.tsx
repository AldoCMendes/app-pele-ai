"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getCurrentUser, getUserProfile, signOut } from "@/lib/auth";
import {
  Camera,
  Sparkles,
  Check,
  Settings,
  LogOut,
  User,
  Calendar,
  TrendingUp,
  MessageCircle,
  ArrowRight,
  Star,
  Clock,
  Award
} from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  subscription_plan: string;
  subscription_status: string;
  subscription_end_date: string;
  created_at: string;
}

export default function DashboardPage() {
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
        router.push("/");
        return;
      }

      setUser(currentUser);
      const userProfile = await getUserProfile(currentUser.id);
      setProfile(userProfile);
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      router.push("/");
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

  const getPlanColor = (plan: string) => {
    const colors = {
      basic: "from-blue-500 to-blue-600",
      premium: "from-purple-500 to-purple-600",
      pro: "from-pink-500 to-pink-600",
      free: "from-gray-500 to-gray-600"
    };
    return colors[plan as keyof typeof colors] || colors.free;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Carregando seu painel...</p>
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
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GlowAI</h1>
                <p className="text-sm text-gray-600">Bem-vindo de volta, {profile.full_name}!</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/support")}
                className="hidden sm:flex"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Suporte
              </Button>

              <Button
                variant="outline"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome Card */}
            <Card className="p-8 bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 text-white shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    Olá, {profile.full_name.split(' ')[0]}! 👋
                  </h2>
                  <p className="text-purple-100 text-lg">
                    Pronto para continuar sua jornada de skincare?
                  </p>
                </div>
                <div className={`w-16 h-16 bg-gradient-to-br ${getPlanColor(profile.subscription_plan)} rounded-full flex items-center justify-center shadow-xl`}>
                  <Award className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-yellow-300" />
                    <span className="font-semibold">Plano {getPlanName(profile.subscription_plan)}</span>
                  </div>
                  <p className="text-sm text-purple-200">
                    {profile.subscription_status === 'active' ? 'Ativo' : 'Inativo'}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-yellow-300" />
                    <span className="font-semibold">Membro desde</span>
                  </div>
                  <p className="text-sm text-purple-200">
                    {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold text-lg px-8 py-4 shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Camera className="w-5 h-5 mr-2" />
                Tirar Foto do Dia
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Card>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="p-6 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Análise de Foto</h3>
                    <p className="text-sm text-gray-600">Acompanhe sua evolução</p>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white">
                  Nova Análise
                </Button>
              </Card>

              <Card className="p-6 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Rotina Personalizada</h3>
                    <p className="text-sm text-gray-600">Sua rotina do dia</p>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
                  Ver Rotina
                </Button>
              </Card>
            </div>

            {/* Progress Section */}
            <Card className="p-8 bg-white shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <h3 className="text-2xl font-bold text-gray-900">Seu Progresso</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Consistência na Rotina</span>
                    <span className="text-sm text-gray-600">85%</span>
                  </div>
                  <Progress value={85} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Melhoria na Pele</span>
                    <span className="text-sm text-gray-600">72%</span>
                  </div>
                  <Progress value={72} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Dias Consecutivos</span>
                    <span className="text-sm text-gray-600">12 dias</span>
                  </div>
                  <Progress value={80} className="h-3" />
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="p-6 bg-white shadow-xl">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">{profile.full_name}</h3>
                <p className="text-sm text-gray-600">{profile.email}</p>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/profile")}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/support")}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Suporte
                </Button>
              </div>
            </Card>

            {/* Subscription Status */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <Check className="w-6 h-6 text-green-600" />
                <h3 className="font-bold text-green-900">Assinatura Ativa</h3>
              </div>

              <div className="space-y-2 text-sm text-green-800">
                <p><strong>Plano:</strong> {getPlanName(profile.subscription_plan)}</p>
                <p><strong>Próxima cobrança:</strong> {new Date(profile.subscription_end_date).toLocaleDateString('pt-BR')}</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 border-green-300 text-green-700 hover:bg-green-50"
              >
                Gerenciar Assinatura
              </Button>
            </Card>

            {/* Tips */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-blue-900">Dica do Dia</h3>
              </div>

              <p className="text-sm text-blue-800 leading-relaxed">
                "Lembre-se de aplicar protetor solar todos os dias, mesmo em dias nublados.
                Ele é essencial para prevenir danos solares e manter sua pele saudável."
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}