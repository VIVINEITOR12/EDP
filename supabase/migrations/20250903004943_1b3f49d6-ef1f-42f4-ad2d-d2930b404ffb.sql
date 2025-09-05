-- Fix admin password verification to use bcrypt properly
CREATE OR REPLACE FUNCTION public.verify_admin_password(input_password text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    stored_password TEXT;
BEGIN
    SELECT password_hash INTO stored_password FROM admin_config LIMIT 1;
    
    IF stored_password IS NOT NULL THEN
        -- Try bcrypt verification first
        IF stored_password ~ '^\$2[abxy]?\$' THEN
            RETURN stored_password = crypt(input_password, stored_password);
        ELSE
            -- Fallback to plain text comparison for backwards compatibility
            RETURN stored_password = input_password;
        END IF;
    END IF;
    
    RETURN false;
END;
$function$;

-- Change default status for reviews to 'approved' for auto-approval
ALTER TABLE public.reviews ALTER COLUMN status SET DEFAULT 'approved';

-- Update any existing pending reviews to approved (optional - uncomment if desired)
-- UPDATE public.reviews SET status = 'approved' WHERE status = 'pending';