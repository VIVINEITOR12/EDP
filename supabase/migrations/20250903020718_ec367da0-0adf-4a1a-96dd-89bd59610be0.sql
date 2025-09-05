-- Fix remaining functions with search_path issues

CREATE OR REPLACE FUNCTION public.get_product_average_rating(product_id_param uuid)
 RETURNS TABLE(avg_rating numeric, review_count bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(AVG(rating), 4.5) as avg_rating,
    COUNT(*) as review_count
  FROM public.reviews 
  WHERE product_id = product_id_param 
  AND status = 'approved';
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;