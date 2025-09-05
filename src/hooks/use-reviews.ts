import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Review {
  id: string;
  name: string;
  comment: string;
  rating: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async (includeAll = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
      
      if (!includeAll) {
        query = query.eq('status', 'approved').limit(9);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;
      setReviews(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar reseñas');
      console.error('Error loading reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const submitReview = async (review: Omit<Review, 'id' | 'status' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .insert([{ ...review, status: 'approved' }]);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error submitting review:', err);
      return false;
    }
  };

  const updateReviewStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      await fetchReviews(true);
      return true;
    } catch (err) {
      console.error('Error updating review:', err);
      return false;
    }
  };

  const deleteReview = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchReviews(true);
      return true;
    } catch (err) {
      console.error('Error deleting review:', err);
      return false;
    }
  };

  const getAverageRating = () => {
    const approvedReviews = reviews.filter(r => r.status === 'approved');
    if (approvedReviews.length === 0) return 4.8; // Default rating
    
    const sum = approvedReviews.reduce((acc, review) => acc + review.rating, 0);
    return Number((sum / approvedReviews.length).toFixed(1));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return {
    reviews,
    isLoading,
    error,
    fetchReviews,
    submitReview,
    updateReviewStatus,
    deleteReview,
    getAverageRating
  };
}