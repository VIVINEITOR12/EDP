-- Add support for multiple images and additional product fields
ALTER TABLE public.products 
ADD COLUMN images TEXT[], -- Array of image URLs
ADD COLUMN stock INTEGER DEFAULT 0,
ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
ADD COLUMN sku TEXT,
ADD COLUMN sizes TEXT[], -- Array of available sizes
ADD COLUMN colors TEXT[]; -- Array of available colors

-- Update existing products to use the new images column
UPDATE public.products 
SET images = CASE 
  WHEN image IS NOT NULL THEN ARRAY[image]
  ELSE NULL
END
WHERE images IS NULL;

-- Create index for better search performance
CREATE INDEX idx_products_name ON public.products USING gin(to_tsvector('spanish', name));
CREATE INDEX idx_products_category ON public.products (category);
CREATE INDEX idx_products_subcategory ON public.products (subcategory);
CREATE INDEX idx_products_status ON public.products (status);
CREATE INDEX idx_products_sku ON public.products (sku);