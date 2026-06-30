-- 003_lessons.sql: Lessons and video reference keys

CREATE TABLE public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  bunny_video_id TEXT, -- Bunny.net video reference ID
  order_index INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for ordering lessons quickly
CREATE INDEX lessons_course_id_order_index_idx ON public.lessons(course_id, order_index);
