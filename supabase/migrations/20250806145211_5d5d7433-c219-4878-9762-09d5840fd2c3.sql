-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image TEXT,
  rating DECIMAL(2,1) DEFAULT 4.5,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site configuration table
CREATE TABLE public.site_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin configuration table
CREATE TABLE public.admin_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  password_hash TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (but make tables publicly readable for the frontend)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_config ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a public store)
CREATE POLICY "Products are publicly readable" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Site config is publicly readable" 
ON public.site_config 
FOR SELECT 
USING (true);

-- Admin config should only be readable by the application (no user-specific access needed)
CREATE POLICY "Admin config is publicly readable" 
ON public.admin_config 
FOR SELECT 
USING (true);

-- Allow public insert/update/delete (will be controlled by admin authentication in the app)
CREATE POLICY "Products are publicly manageable" 
ON public.products 
FOR ALL 
USING (true);

CREATE POLICY "Site config is publicly manageable" 
ON public.site_config 
FOR ALL 
USING (true);

CREATE POLICY "Admin config is publicly manageable" 
ON public.admin_config 
FOR ALL 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_config_updated_at
  BEFORE UPDATE ON public.site_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_config_updated_at
  BEFORE UPDATE ON public.admin_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default admin password (edpadmin2025)
INSERT INTO public.admin_config (password_hash) 
VALUES ('edpadmin2025');

-- Insert default site configuration
INSERT INTO public.site_config (key, value) VALUES
('contact_phone', '+1234567890'),
('contact_email', 'contacto@edpdiseno.com'),
('contact_address', 'Dirección de la tienda'),
('social_whatsapp', 'https://wa.me/1234567890'),
('social_instagram', 'https://instagram.com/edpdiseno'),
('social_facebook', 'https://facebook.com/edpdiseno');

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true);

-- Create storage policies
CREATE POLICY "Product images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Anyone can upload product images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anyone can update product images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'product-images');

CREATE POLICY "Anyone can delete product images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'product-images');