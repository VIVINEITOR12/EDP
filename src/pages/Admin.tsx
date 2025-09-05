import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AdminProductsEnhanced } from "@/components/admin/admin-products-enhanced";
import { AdminSiteConfig } from "@/components/admin/admin-site-config";
import { AdminPasswordChange } from "@/components/admin/admin-password-change";
import { AdminReviews } from "@/components/admin/admin-reviews";
import { AdminCustomDesigns } from "@/components/admin/admin-custom-designs";
import { AdminUsdRate } from "@/components/admin/admin-usd-rate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Package, Settings, Key, Star, Palette, DollarSign, LogOut } from "lucide-react";
import { useAdminSession } from "@/hooks/use-admin-session";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: sessionLoading, login, logout } = useAdminSession();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(password);
      toast({
        title: "Acceso autorizado",
        description: "Bienvenido al panel de administración",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al verificar la contraseña",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (sessionLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">Verificando sesión...</div>
    </div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Panel de Administración</CardTitle>
            <p className="text-muted-foreground">
              Ingresa la contraseña para acceder
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa la contraseña"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Verificando..." : "Ingresar"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a la tienda
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la tienda
            </Button>
          </div>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Productos
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Reseñas
            </TabsTrigger>
            <TabsTrigger value="designs" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Mockups
            </TabsTrigger>
            <TabsTrigger value="usd-rate" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Tasa USD
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Config
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              Contraseña
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <AdminProductsEnhanced />
          </TabsContent>

          <TabsContent value="reviews">
            <AdminReviews />
          </TabsContent>

          <TabsContent value="designs">
            <AdminCustomDesigns />
          </TabsContent>

          <TabsContent value="usd-rate">
            <AdminUsdRate />
          </TabsContent>

          <TabsContent value="config">
            <AdminSiteConfig />
          </TabsContent>

          <TabsContent value="password">
            <AdminPasswordChange />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}