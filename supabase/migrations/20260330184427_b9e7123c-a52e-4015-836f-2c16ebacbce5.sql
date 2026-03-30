
CREATE TABLE public.game_scores (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_type text NOT NULL,
  score_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  played_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read game scores"
  ON public.game_scores FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert game scores"
  ON public.game_scores FOR INSERT
  TO public
  WITH CHECK (true);
