-- CRITICAL SECURITY FIX: Fix only the problematic RLS policies
-- Only drop the overly permissive policies and add admin-only policies where missing

-- 1. Fix products table - drop the overly permissive policy and add admin-only management
DROP POLICY IF EXISTS "Products are publicly manageable" ON public.products;

CREATE POLICY "Only admins can manage products" 
ON public.products 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM admin_sessions 
    WHERE session_token = (current_setting('request.headers', true)::json ->> 'authorization')
    AND is_active = true 
    AND expires_at > now()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_sessions 
    WHERE session_token = (current_setting('request.headers', true)::json ->> 'authorization')
    AND is_active = true 
    AND expires_at > now()
  )
);

-- 2. Fix reviews table - drop the overly permissive policy and add admin-only management
DROP POLICY IF EXISTS "Reviews are fully manageable" ON public.reviews;

CREATE POLICY "Only admins can manage reviews" 
ON public.reviews 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM admin_sessions 
    WHERE session_token = (current_setting('request.headers', true)::json ->> 'authorization')
    AND is_active = true 
    AND expires_at > now()
  )
);

CREATE POLICY "Only admins can delete reviews" 
ON public.reviews 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM admin_sessions 
    WHERE session_token = (current_setting('request.headers', true)::json ->> 'authorization')
    AND is_active = true 
    AND expires_at > now()
  )
);

-- 3. Fix custom_designs table - drop the overly permissive policy and add admin-only management
DROP POLICY IF EXISTS "Custom designs are fully manageable" ON public.custom_designs;

CREATE POLICY "Only admins can manage custom designs" 
ON public.custom_designs 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM admin_sessions 
    WHERE session_token = (current_setting('request.headers', true)::json ->> 'authorization')
    AND is_active = true 
    AND expires_at > now()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_sessions 
    WHERE session_token = (current_setting('request.headers', true)::json ->> 'authorization')
    AND is_active = true 
    AND expires_at > now()
  )
);

-- 4. Fix usd_rate_history table - drop the overly permissive policy and add admin-only management
DROP POLICY IF EXISTS "USD rate is fully manageable" ON public.usd_rate_history;

CREATE POLICY "Only admins can manage USD rates" 
ON public.usd_rate_history 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM admin_sessions 
    WHERE session_token = (current_setting('request.headers', true)::json ->> 'authorization')
    AND is_active = true 
    AND expires_at > now()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_sessions 
    WHERE session_token = (current_setting('request.headers', true)::json ->> 'authorization')
    AND is_active = true 
    AND expires_at > now()
  )
);