import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteConfig {
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  social_whatsapp: string;
  social_instagram: string;
  social_facebook: string;
}

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>({
    contact_phone: "",
    contact_email: "",
    contact_address: "",
    social_whatsapp: "",
    social_instagram: "",
    social_facebook: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setError(null);
    } catch (err) {
      console.error('Error fetching site config:', err);
      setError('Error al cargar la configuración');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();

    // Set up real-time subscription
    const channel = supabase
      .channel('site_config_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_config' },
        () => {
          fetchConfig();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { config, isLoading, error, refetch: fetchConfig };
}
