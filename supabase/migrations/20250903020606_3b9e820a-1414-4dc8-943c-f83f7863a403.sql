-- CRITICAL SECURITY FIXES

-- 1. Fix Admin Sessions Table - Remove overly permissive policy
DROP POLICY IF EXISTS "Admin sessions are manageable" ON admin_sessions;

-- Keep only the restrictive policy (already exists):
-- "No direct public access to admin_sessions" with USING (false) and WITH CHECK (false)

-- 2. Fix Newsletter Subscribers Table - Remove conflicting policies and implement clean ones
DROP POLICY IF EXISTS "Allow public newsletter signup" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Newsletter is publicly manageable" ON newsletter_subscribers; 
DROP POLICY IF EXISTS "Only admins can modify newsletter_subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Only admins can read newsletter_subscribers" ON newsletter_subscribers;

-- Create clean newsletter policies
CREATE POLICY "Public can signup to newsletter" 
ON newsletter_subscribers 
FOR INSERT 
WITH CHECK ((email IS NOT NULL) AND (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text));

CREATE POLICY "Only service role can read newsletter_subscribers" 
ON newsletter_subscribers 
FOR SELECT 
USING (false);

CREATE POLICY "Only service role can modify newsletter_subscribers" 
ON newsletter_subscribers 
FOR ALL 
USING (false) 
WITH CHECK (false);

-- 3. Restrict Audit and Change Logs Access
DROP POLICY IF EXISTS "Site config audit logs are fully manageable" ON site_config_audit_logs;

CREATE POLICY "Only authenticated admins can access audit logs" 
ON site_config_audit_logs 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM admin_sessions 
  WHERE session_token = ((current_setting('request.headers'::text, true))::json ->> 'authorization'::text) 
  AND is_active = true 
  AND expires_at > now()
));

-- Restrict product change logs access (currently has no policies)
CREATE POLICY "Only authenticated admins can access product change logs" 
ON product_change_logs 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM admin_sessions 
  WHERE session_token = ((current_setting('request.headers'::text, true))::json ->> 'authorization'::text) 
  AND is_active = true 
  AND expires_at > now()
));

-- 4. Fix Database Function Security - Add proper search_path
CREATE OR REPLACE FUNCTION public.update_admin_password(new_password text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE admin_config 
  SET password_hash = extensions.crypt(new_password, extensions.gen_salt('bf'))
  WHERE id IS NOT NULL;
  RETURN FOUND;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_site_config_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    INSERT INTO site_config_audit_logs 
    (changed_by, old_value, new_value, change_type)
    VALUES (
        current_setting('request.jwt.claims', true)::jsonb->>'sub',
        to_jsonb(OLD),
        to_jsonb(NEW),
        TG_OP
    );
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_product_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    INSERT INTO product_change_logs 
    (product_id, changed_by, change_type, old_data, new_data)
    VALUES (
        COALESCE(NEW.id, OLD.id),
        CASE 
            WHEN current_setting('request.jwt.claims', true)::jsonb->>'sub' IS NOT NULL 
            THEN (current_setting('request.jwt.claims', true)::jsonb->>'sub')::uuid
            ELSE NULL 
        END,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW)
    );
    RETURN NEW;
END;
$function$;