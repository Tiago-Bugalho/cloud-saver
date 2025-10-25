import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Cloud } from "lucide-react";
import { authAPI, type User } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AuthPageProps {
  onSuccess: (user: User) => void;
}

export default function AuthPage({ onSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let user: User;
      if (isLogin) {
        user = await authAPI.login(username, password);
        toast({
          title: "Login realizado!",
          description: `Bem-vindo de volta, ${user.username}`,
        });
      } else {
        user = await authAPI.register(username, password);
        toast({
          title: "Conta criada!",
          description: `Bem-vindo, ${user.username}`,
        });
      }
      onSuccess(user);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <Cloud className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold">
              {isLogin ? "Bem-vindo de volta" : "Criar conta"}
            </CardTitle>
            <CardDescription className="mt-2">
              {isLogin 
                ? "Entre na sua conta para acessar seus arquivos" 
                : "Crie uma conta e ganhe 15GB de armazenamento gratuito"}
            </CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                data-testid="input-username"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                data-testid="input-password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              data-testid="button-submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Aguarde..." : (isLogin ? "Entrar" : "Criar conta")}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
              <button
                type="button"
                data-testid="link-toggle-auth"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-medium hover-elevate"
                disabled={isLoading}
              >
                {isLogin ? "Cadastre-se" : "Entre"}
              </button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
