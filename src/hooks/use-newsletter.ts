import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useNewsletter() {
  const [isLoading, setIsLoading] = useState(false);

  const subscribe = async (email: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email, status: 'active' }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return { success: false, message: 'Este email ya está suscrito' };
        }
        throw error;
      }

      return { success: true, message: 'Suscripción exitosa' };
    } catch (err) {
      console.error('Error subscribing to newsletter:', err);
      return { success: false, message: 'Error al suscribirse' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    subscribe,
    isLoading
  };
}