-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.get_product_average_rating(product_id_param UUID)
RETURNS TABLE(avg_rating NUMERIC, review_count BIGINT) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(AVG(rating), 4.5) as avg_rating,
    COUNT(*) as review_count
  FROM public.reviews 
  WHERE product_id = product_id_param 
  AND status = 'approved';
END;
$$;