-- Fix RLS issues on existing tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_config ENABLE ROW LEVEL SECURITY;

-- Fix function search path issues
CREATE OR REPLACE FUNCTION public.log_site_config_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
SET search_path = public
AS $function$
BEGIN
    INSERT INTO product_change_logs 
    (product_id, changed_by, change_type, old_data, new_data)
    VALUES (
        COALESCE(NEW.id, OLD.id),
        current_setting('request.jwt.claims', true)::jsonb->>'sub',
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW)
    );
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;