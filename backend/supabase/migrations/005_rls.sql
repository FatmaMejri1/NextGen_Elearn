-- 005_rls.sql: Row Level Security (RLS) policies

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

-- ── public.users Policies ───────────────────────────────────

CREATE POLICY "Allow users to read their own profile or admins all"
ON public.users
FOR SELECT
USING (
  auth.uid() = id OR public.check_user_is_admin(auth.uid())
);

CREATE POLICY "Allow users to update their own profile (e.g. fingerprint) or admins all"
ON public.users
FOR UPDATE
USING (
  auth.uid() = id OR public.check_user_is_admin(auth.uid())
)
WITH CHECK (
  auth.uid() = id OR public.check_user_is_admin(auth.uid())
);

CREATE POLICY "Allow admin to insert users"
ON public.users
FOR INSERT
WITH CHECK (
  public.check_user_is_admin(auth.uid())
);

CREATE POLICY "Allow admin to delete users"
ON public.users
FOR DELETE
USING (
  public.check_user_is_admin(auth.uid())
);

-- ── public.courses Policies ─────────────────────────────────

CREATE POLICY "Allow anyone to read published courses, or admin all"
ON public.courses
FOR SELECT
USING (
  is_published = true OR public.check_user_is_admin(auth.uid())
);

CREATE POLICY "Allow admin to write/update courses"
ON public.courses
FOR ALL
USING (
  public.check_user_is_admin(auth.uid())
)
WITH CHECK (
  public.check_user_is_admin(auth.uid())
);

-- ── public.lessons Policies ─────────────────────────────────

CREATE POLICY "Allow anyone to read lessons of published courses, or admin all"
ON public.lessons
FOR SELECT
USING (
  (SELECT is_published FROM public.courses WHERE id = course_id) = true OR public.check_user_is_admin(auth.uid())
);

CREATE POLICY "Allow admin to write/update lessons"
ON public.lessons
FOR ALL
USING (
  public.check_user_is_admin(auth.uid())
)
WITH CHECK (
  public.check_user_is_admin(auth.uid())
);

-- ── public.progress Policies ────────────────────────────────

CREATE POLICY "Allow users to read their own progress or admins all"
ON public.progress
FOR SELECT
USING (
  auth.uid() = user_id OR public.check_user_is_admin(auth.uid())
);

CREATE POLICY "Allow users to write/update their own progress or admins all"
ON public.progress
FOR ALL
USING (
  auth.uid() = user_id OR public.check_user_is_admin(auth.uid())
)
WITH CHECK (
  auth.uid() = user_id OR public.check_user_is_admin(auth.uid())
);
