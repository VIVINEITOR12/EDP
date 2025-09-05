-- Final security fixes for all functions

-- Ensure verify_admin_password has proper extensions reference
CREATE OR REPLACE FUNCTION public.verify_admin_password(input_password text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
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

-- Ensure update_admin_password has proper extensions reference
CREATE OR REPLACE FUNCTION public.update_admin_password(new_password text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
BEGIN
  UPDATE admin_config 
  SET password_hash = crypt(new_password, gen_salt('bf'))
  WHERE id IS NOT NULL;
  RETURN FOUND;
END;
$function$;