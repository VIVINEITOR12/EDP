-- Ensure all tables have proper indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

-- Update admin password to the requested default
UPDATE admin_config SET password_hash = crypt('admin2025', gen_salt('bf')) WHERE id IS NOT NULL;