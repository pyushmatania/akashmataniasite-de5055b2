
-- Table to store moodboard card layout positions (single row, no auth needed for portfolio)
CREATE TABLE public.moodboard_layouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  layout_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.moodboard_layouts ENABLE ROW LEVEL SECURITY;

-- Public read access (portfolio site, no auth)
CREATE POLICY "Anyone can read layouts" ON public.moodboard_layouts FOR SELECT USING (true);

-- Public insert/update (for the owner to save; no auth on portfolio)
CREATE POLICY "Anyone can insert layouts" ON public.moodboard_layouts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update layouts" ON public.moodboard_layouts FOR UPDATE USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_moodboard_layouts_updated_at
BEFORE UPDATE ON public.moodboard_layouts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
