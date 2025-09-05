import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

interface SiteConfig {
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  social_whatsapp: string;
  social_instagram: string;
  social_facebook: string;
}

export function AdminSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>({
    contact_phone: "",
    contact_email: "",
    contact_address: "",
    social_whatsapp: "",
    social_instagram: "",
    social_facebook: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('key, value');

      if (error) throw error;

      const configData: SiteConfig = {
        contact_phone: "",
        contact_email: "",
        contact_address: "",
        social_whatsapp: "",
        social_instagram: "",
        social_facebook: "",
      };

      data?.forEach((item) => {
        if (item.key in configData) {
          configData[item.key as keyof SiteConfig] = item.value;
        }
      });

      setConfig(configData);
    } catch (error) {
      console.error('Error fetching config:', error);
      toast({
        title: "Error",
        description: "Error al cargar la configuración",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = Object.entries(config).map(([key, value]) => ({
        key,
        value,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('site_config')
          .upsert(update, { onConflict: 'key' });

        if (error) throw error;
      }

      toast({
        title: "Configuración guardada",
        description: "Los cambios se han guardado exitosamente",
      });
    } catch (error) {
      console.error('Error saving config:', error);
      toast({
        title: "Error",
        description: "Error al guardar la configuración",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (key: keyof SiteConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (isLoading) {
    return <div className="text-center py-8">Cargando configuración...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Configuración del Sitio</h2>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Teléfono</Label>
              <Input
                id="contact_phone"
                value={config.contact_phone}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                placeholder="+1234567890"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_email">Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={config.contact_email}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                placeholder="contacto@tienda.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_address">Dirección</Label>
              <Input
                id="contact_address"
                value={config.contact_address}
                onChange={(e) => handleInputChange('contact_address', e.target.value)}
                placeholder="Dirección de la tienda"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redes Sociales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="social_whatsapp">WhatsApp</Label>
              <Input
                id="social_whatsapp"
                value={config.social_whatsapp}
                onChange={(e) => handleInputChange('social_whatsapp', e.target.value)}
                placeholder="https://wa.me/1234567890"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="social_instagram">Instagram</Label>
              <Input
                id="social_instagram"
                value={config.social_instagram}
                onChange={(e) => handleInputChange('social_instagram', e.target.value)}
                placeholder="https://instagram.com/usuario"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="social_facebook">Facebook</Label>
              <Input
                id="social_facebook"
                value={config.social_facebook}
                onChange={(e) => handleInputChange('social_facebook', e.target.value)}
                placeholder="https://facebook.com/pagina"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vista Previa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Información de Contacto:</h4>
              <p className="text-sm text-muted-foreground">
                Teléfono: {config.contact_phone || "No configurado"}
              </p>
              <p className="text-sm text-muted-foreground">
                Email: {config.contact_email || "No configurado"}
              </p>
              <p className="text-sm text-muted-foreground">
                Dirección: {config.contact_address || "No configurado"}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold">Redes Sociales:</h4>
              <p className="text-sm text-muted-foreground">
                WhatsApp: {config.social_whatsapp || "No configurado"}
              </p>
              <p className="text-sm text-muted-foreground">
                Instagram: {config.social_instagram || "No configurado"}
              </p>
              <p className="text-sm text-muted-foreground">
                Facebook: {config.social_facebook || "No configurado"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}