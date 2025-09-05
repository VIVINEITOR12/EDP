-- Add product_id column to reviews table for individual product reviews
ALTER TABLE public.reviews ADD COLUMN product_id UUID REFERENCES public.products(id) ON DELETE CASCADE;

-- Create index for better performance when querying reviews by product
CREATE INDEX idx_reviews_product_id ON public.reviews(product_id);

-- Update RLS policies to handle product-specific reviews
DROP POLICY IF EXISTS "Reviews are publicly readable when approved" ON public.reviews;

-- New policy for reading approved reviews (both general and product-specific)
CREATE POLICY "Reviews are publicly readable when approved" 
ON public.reviews 
FOR SELECT 
USING (status = 'approved'::text);

-- Create admin session table to persist admin login state
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '30 days'),
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS on admin_sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Admin sessions are fully manageable
CREATE POLICY "Admin sessions are manageable" 
ON public.admin_sessions 
FOR ALL 
USING (true);

-- Create function to calculate average rating for products
CREATE OR REPLACE FUNCTION public.get_product_average_rating(product_id_param UUID)
RETURNS TABLE(avg_rating NUMERIC, review_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(AVG(rating), 4.5) as avg_rating,
    COUNT(*) as review_count
  FROM public.reviews 
  WHERE product_id = product_id_param 
  AND status = 'approved';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;