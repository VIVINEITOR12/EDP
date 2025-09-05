import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface CustomDesign {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  display_order: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useCustomDesigns() {
  const [designs, setDesigns] = useState<CustomDesign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDesigns = async (includeAll = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      let query = supabase
        .from('custom_designs')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (!includeAll) {
        query = query.eq('status', 'active');
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;
      setDesigns(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar diseños');
      console.error('Error loading custom designs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createDesign = async (design: Omit<CustomDesign, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('custom_designs')
        .insert([design]);

      if (error) throw error;
      await fetchDesigns(true);
      return true;
    } catch (err) {
      console.error('Error creating design:', err);
      return false;
    }
  };

  const updateDesign = async (id: string, updates: Partial<CustomDesign>) => {
    try {
      const { error } = await supabase
        .from('custom_designs')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchDesigns(true);
      return true;
    } catch (err) {
      console.error('Error updating design:', err);
      return false;
    }
  };

  const deleteDesign = async (id: string) => {
    try {
      const { error } = await supabase
        .from('custom_designs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchDesigns(true);
      return true;
    } catch (err) {
      console.error('Error deleting design:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, []);

  return {
    designs,
    isLoading,
    error,
    fetchDesigns,
    createDesign,
    updateDesign,
    deleteDesign
  };
}