              <div className="pt-4 border-t-2 border-gray-200 space-y-3">
            <p className="text-sm text-gray-600">Já tem uma conta?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => router.push("/login")}
                className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50"
              >
                Fazer Login
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/pricing")}
                className="border-2 border-green-500 text-green-600 hover:bg-green-50"
              >
                Ver Planos
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/support")}
                className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Suporte
              </Button>
            </div>
          </div>