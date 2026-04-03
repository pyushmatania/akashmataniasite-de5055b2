
CREATE TABLE public.roast_leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  visitor_name TEXT NOT NULL DEFAULT 'Anonymous',
  roast_count INTEGER NOT NULL DEFAULT 0,
  zone_stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.roast_leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read leaderboard"
ON public.roast_leaderboard FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert leaderboard"
ON public.roast_leaderboard FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update leaderboard"
ON public.roast_leaderboard FOR UPDATE
USING (true);

CREATE UNIQUE INDEX idx_roast_leaderboard_visitor ON public.roast_leaderboard (visitor_id);

CREATE TRIGGER update_roast_leaderboard_updated_at
BEFORE UPDATE ON public.roast_leaderboard
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
