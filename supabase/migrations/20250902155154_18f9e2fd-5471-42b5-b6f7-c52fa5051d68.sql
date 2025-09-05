-- Create RPC function to update admin password with bcrypt
CREATE OR REPLACE FUNCTION update_admin_password(new_password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE admin_config 
  SET password_hash = crypt(new_password, gen_salt('bf'))
  WHERE id IS NOT NULL;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;