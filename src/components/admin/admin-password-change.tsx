import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Eye, EyeOff } from "lucide-react";

export function AdminPasswordChange() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Strong password validation function
  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push("La contraseña debe tener al menos 8 caracteres");
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("Debe contener al menos una letra mayúscula");
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push("Debe contener al menos una letra minúscula");
    }
    
    if (!/\d/.test(password)) {
      errors.push("Debe contener al menos un número");
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push("Debe contener al menos un carácter especial (!@#$%^&*...)");
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas nuevas no coinciden",
        variant: "destructive",
      });
      return;
    }

    // Strong password validation
    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      toast({
        title: "Contraseña no válida",
        description: validation.errors.join(". "),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Verify current password using RPC function
      const { data: isValid, error: verifyError } = await supabase
        .rpc('verify_admin_password', { 
          input_password: currentPassword 
        });

      if (verifyError) throw verifyError;

      if (!isValid) {
        toast({
          title: "Error",
          description: "La contraseña actual es incorrecta",
          variant: "destructive",
        });
        return;
      }

      // Update password using RPC function with bcrypt
      const { error: updateError } = await supabase
        .rpc('update_admin_password', { 
          new_password: newPassword 
        });

      if (updateError) throw updateError;

      toast({
        title: "Contraseña actualizada",
        description: "La contraseña se ha cambiado exitosamente",
      });

      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "Error",
        description: "Error al cambiar la contraseña",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Cambiar Contraseña</h2>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Actualizar Contraseña del Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Contraseña Actual</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPasswords ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña actual"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <Input
                id="new-password"
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingresa la nueva contraseña"
                required
                minLength={8}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
              <Input
                id="confirm-password"
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma la nueva contraseña"
                required
                minLength={8}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Cambiando..." : "Cambiar Contraseña"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Consejos de Seguridad</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Usa una contraseña de al menos 8 caracteres</li>
            <li>• Debe incluir letras mayúsculas y minúsculas</li>
            <li>• Debe contener al menos un número</li>
            <li>• Debe incluir al menos un carácter especial (!@#$%^&*...)</li>
            <li>• No uses información personal fácil de adivinar</li>
            <li>• Cambia la contraseña regularmente</li>
            <li>• No compartas la contraseña con otros</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}