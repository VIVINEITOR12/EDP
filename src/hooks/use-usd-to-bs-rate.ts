import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const LS_RATE_KEY = "bcv_usd_to_bs_rate";
const LS_UPDATED_AT_KEY = "bcv_rate_updated_at";
const DEFAULT_REFRESH_MS = 4 * 60 * 60 * 1000; // 4 horas

export function useUsdToBsRate(refreshMs: number = DEFAULT_REFRESH_MS) {
  const [rate, setRate] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(LS_RATE_KEY);
      const parsed = stored ? parseFloat(stored) : NaN;
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 140;
    } catch {
      return 140;
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(() => {
    try {
      const ts = localStorage.getItem(LS_UPDATED_AT_KEY);
      return ts ? new Date(ts) : null;
    } catch {
      return null;
    }
  });

  const timerRef = useRef<number | null>(null);

  // Función para obtener la tasa del BCV
  const fetchBcvRate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: funcError } = await supabase.functions.invoke('get-bcv-rate');
      
      if (funcError) throw funcError;
      
      if (data.success && data.rate) {
        const fetchedRate = Number(data.rate);
        
        if (Number.isFinite(fetchedRate) && fetchedRate > 0) {
          setRate(fetchedRate);
          const now = new Date();
          setLastUpdated(now);
          
          try {
            localStorage.setItem(LS_RATE_KEY, String(fetchedRate));
            localStorage.setItem(LS_UPDATED_AT_KEY, now.toISOString());
          } catch {}
        } else {
          throw new Error('Tasa inválida recibida del BCV');
        }
      } else {
        throw new Error(data.error || 'Error desconocido del BCV');
      }
      
    } catch (e: any) {
      console.error('Error obteniendo tasa del BCV:', e);
      setError(`No se pudo actualizar desde BCV: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función para refrescar manualmente la tasa
  const refreshRate = useCallback(() => {
    fetchBcvRate();
  }, [fetchBcvRate]);

  useEffect(() => {
    const shouldUpdate = () => {
      if (!lastUpdated) return true;
      const timeSinceUpdate = Date.now() - lastUpdated.getTime();
      return timeSinceUpdate >= refreshMs;
    };

    if (shouldUpdate()) {
      fetchBcvRate();
    }

    timerRef.current = window.setInterval(() => {
      if (shouldUpdate()) {
        fetchBcvRate();
      }
    }, refreshMs);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [refreshMs, lastUpdated, fetchBcvRate]);

  return { 
    rate, 
    isLoading, 
    error, 
    lastUpdated,
    source: 'BCV Oficial',
    refreshRate // Nueva función para refresco manual
  };
}
