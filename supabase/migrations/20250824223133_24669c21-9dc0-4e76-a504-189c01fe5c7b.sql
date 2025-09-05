-- Add default admin user with password "admin2025"
INSERT INTO admin_config (password_hash) 
VALUES ('admin2025')
ON CONFLICT (id) DO NOTHING;