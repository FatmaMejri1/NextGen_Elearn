-- 006_site_content.sql: CMS / landing page content (JSON document)

CREATE TABLE public.site_content (
  id TEXT PRIMARY KEY DEFAULT 'default',
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE INDEX site_content_updated_at_idx ON public.site_content (updated_at DESC);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Public read for the marketing site
CREATE POLICY "Anyone can read site content"
  ON public.site_content
  FOR SELECT
  USING (true);

-- Admin write (service role bypasses RLS; policy guards direct client access)
CREATE POLICY "Admins can insert site content"
  ON public.site_content
  FOR INSERT
  WITH CHECK (public.check_user_is_admin(auth.uid()));

CREATE POLICY "Admins can update site content"
  ON public.site_content
  FOR UPDATE
  USING (public.check_user_is_admin(auth.uid()))
  WITH CHECK (public.check_user_is_admin(auth.uid()));

CREATE POLICY "Admins can delete site content"
  ON public.site_content
  FOR DELETE
  USING (public.check_user_is_admin(auth.uid()));

INSERT INTO public.site_content (id, content)
VALUES ('default', '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;
