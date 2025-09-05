import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ProductReview {
  id: string;
  product_id: string;
  name: string;
  comment: string;
  rating: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProductRating {
  avgRating: number;
  reviewCount: number;
}

export function useProductReviews(productId: string) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [rating, setRating] = useState<ProductRating>({ avgRating: 4.5, reviewCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;
      
      setReviews(data || []);
      
      // Calculate rating statistics
      if (data && data.length > 0) {
        const avgRating = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
        setRating({ avgRating, reviewCount: data.length });
      } else {
        setRating({ avgRating: 4.5, reviewCount: 0 });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar reseñas');
      console.error('Error loading product reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const submitReview = async (review: { name: string; comment: string; rating: number }) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .insert([{ 
          ...review, 
          product_id: productId,
          status: 'approved' 
        }]);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error submitting review:', err);
      return false;
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  return {
    reviews,
    rating,
    isLoading,
    error,
    submitReview,
    refetch: fetchReviews
  };
}