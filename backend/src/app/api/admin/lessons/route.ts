import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

interface LessonBody {
  course_id?: string;
  title?: string;
  bunny_video_id?: string;
  order_index?: number;
}

export async function GET(request: NextRequest) {
  const courseId = request.nextUrl.searchParams.get('courseId');
  const supabase = createAdminClient();
  let query = supabase
    .from('lessons')
    .select('id, course_id, title, bunny_video_id, order_index, created_at')
    .order('order_index', { ascending: true });

  if (courseId) {
    query = query.eq('course_id', courseId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ lessons: data ?? [] });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as LessonBody;
  const title = body.title?.trim();

  if (!body.course_id || !title) {
    return NextResponse.json({ error: 'Course ID and lesson title are required.' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('lessons')
    .insert({
      course_id: body.course_id,
      title,
      bunny_video_id: body.bunny_video_id?.trim() || null,
      order_index: Number(body.order_index ?? 0),
    })
    .select('id, course_id, title, bunny_video_id, order_index, created_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ lesson: data }, { status: 201 });
}
