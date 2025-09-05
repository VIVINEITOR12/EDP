import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface UsdRateRecord {
  id: string;
  rate: number;
  set_by?: string;
  created_at: string;
  is_current: boolean;
}

export function useUsdRate() {
  const [currentRate, setCurrentRate] = useState<number>(150);
  const [rateHistory, setRateHistory] = useState<UsdRateRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentRate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('usd_rate_history')
        .select('*')
        .eq('is_current', true)
        .single();

      if (supabaseError && supabaseError.code !== 'PGRST116') throw supabaseError;
      
      if (data) {
        setCurrentRate(Number(data.rate));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar tasa');
      console.error('Error loading USD rate:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRateHistory = async () => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('usd_rate_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (supabaseError) throw supabaseError;
      setRateHistory(data || []);
    } catch (err) {
      console.error('Error loading rate history:', err);
    }
  };

  const updateRate = async (newRate: number, setBy = 'Admin') => {
    try {
      // First, set all current rates to false
      await supabase
        .from('usd_rate_history')
        .update({ is_current: false })
        .eq('is_current', true);

      // Then insert the new rate
      const { error } = await supabase
        .from('usd_rate_history')
        .insert([{ 
          rate: newRate, 
          set_by: setBy, 
          is_current: true 
        }]);

      if (error) throw error;
      
      setCurrentRate(newRate);
      await fetchRateHistory();
      return true;
    } catch (err) {
      console.error('Error updating USD rate:', err);
      return false;
    }
  };

  const convertPrice = (usdPrice: number) => {
    return Math.round(usdPrice * currentRate * 100) / 100;
  };

  useEffect(() => {
    fetchCurrentRate();
    fetchRateHistory();
  }, []);

  return {
    currentRate,
    rateHistory,
    isLoading,
    error,
    fetchCurrentRate,
    fetchRateHistory,
    updateRate,
    convertPrice
  };
}