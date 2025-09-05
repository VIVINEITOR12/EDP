-- Enable RLS on all remaining tables
ALTER TABLE public.product_change_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for product_change_logs
CREATE POLICY "Product change logs are fully manageable" 
ON public.product_change_logs 
FOR ALL 
USING (true);

-- Create policies for site_config_audit_logs  
CREATE POLICY "Site config audit logs are fully manageable" 
ON public.site_config_audit_logs 
FOR ALL 
USING (true);