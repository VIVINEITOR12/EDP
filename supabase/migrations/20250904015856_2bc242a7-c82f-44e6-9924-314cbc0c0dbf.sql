-- CRITICAL SECURITY FIX: Secure database tables from public manipulation
-- Remove overly permissive policies and add admin-only policies

-- 1. Fix products table RLS policies
DROP POLICY IF EXISTS "Products are publicly manageable" ON public.products;

-- Products: Public read, admin-only write
CREATE POLICY "Products are publicly readable" 
ON public.products 
FOR SELECT 
USING (true);

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

-- 2. Fix reviews table RLS policies  
DROP POLICY IF EXISTS "Reviews are fully manageable" ON public.reviews;

-- Reviews: Public read (approved), public insert (pending), admin manage
CREATE POLICY "Anyone can create reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (status = 'pending');

CREATE POLICY "Reviews are publicly readable when approved" 
ON public.reviews 
FOR SELECT 
USING (status = 'approved');

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

-- 3. Fix custom_designs table RLS policies
DROP POLICY IF EXISTS "Custom designs are fully manageable" ON public.custom_designs;

-- Custom designs: Public read (active), admin-only write
CREATE POLICY "Custom designs are publicly readable when active" 
ON public.custom_designs 
FOR SELECT 
USING (status = 'active');

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

-- 4. Fix usd_rate_history table RLS policies
DROP POLICY IF EXISTS "USD rate is fully manageable" ON public.usd_rate_history;

-- USD rate: Public read, admin-only write
CREATE POLICY "USD rate is publicly readable" 
ON public.usd_rate_history 
FOR SELECT 
USING (true);

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