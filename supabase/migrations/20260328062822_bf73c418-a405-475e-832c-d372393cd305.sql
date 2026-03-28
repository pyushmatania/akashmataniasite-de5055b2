CREATE TABLE public.moodboard_pins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pin_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.moodboard_pins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read pins" ON public.moodboard_pins FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert pins" ON public.moodboard_pins FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update pins" ON public.moodboard_pins FOR UPDATE TO public USING (true);