-- Create reviews table for customer testimonials
CREATE TABLE public.reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  comment text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews
CREATE POLICY "Reviews are publicly readable when approved" 
ON public.reviews 
FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Anyone can create reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (status = 'pending');

CREATE POLICY "Reviews are fully manageable" 
ON public.reviews 
FOR ALL 
USING (true);

-- Create newsletter subscribers table
CREATE TABLE public.newsletter_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  subscribed_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed'))
);

-- Enable RLS for newsletter
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Newsletter is publicly manageable" 
ON public.newsletter_subscribers 
FOR ALL 
USING (true);

-- Create custom designs table for personalized order section
CREATE TABLE public.custom_designs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  image_url text,
  display_order integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for custom designs
ALTER TABLE public.custom_designs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Custom designs are publicly readable when active" 
ON public.custom_designs 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Custom designs are fully manageable" 
ON public.custom_designs 
FOR ALL 
USING (true);

-- Create USD exchange rate table
CREATE TABLE public.usd_rate_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  rate numeric NOT NULL CHECK (rate > 0),
  set_by text,
  created_at timestamp with time zone DEFAULT now(),
  is_current boolean DEFAULT false
);

-- Enable RLS for USD rate
ALTER TABLE public.usd_rate_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "USD rate is publicly readable" 
ON public.usd_rate_history 
FOR SELECT 
USING (true);

CREATE POLICY "USD rate is fully manageable" 
ON public.usd_rate_history 
FOR ALL 
USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_custom_designs_updated_at
  BEFORE UPDATE ON public.custom_designs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default custom design mockups
INSERT INTO public.custom_designs (title, description, display_order, status) VALUES
('Uniformes Empresariales Exclusivos', 'Diseños profesionales para empresas que buscan destacar', 1, 'active'),
('Trajes de Gala a Medida', 'Elegancia personalizada para eventos especiales', 2, 'active'),
('Conjuntos Deportivos Personalizados', 'Comodidad y estilo para tu rutina deportiva', 3, 'active'),
('Vestidos Únicos para Eventos', 'Piezas exclusivas que te harán brillar', 4, 'active'),
('Camisas Personalizadas con Bordado', 'Detalles únicos que reflejan tu personalidad', 5, 'active'),
('Moda Infantil con Estilo Propio', 'Diseños especiales para los más pequeños', 6, 'active'),
('Diseños de Temporada Especial', 'Colecciones exclusivas para cada época del año', 7, 'active');

-- Insert initial USD rate
INSERT INTO public.usd_rate_history (rate, set_by, is_current) VALUES
(150, 'Sistema', true);