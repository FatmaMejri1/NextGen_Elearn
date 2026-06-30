import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

interface CourseBody {
  title?: string;
  description?: string;
  is_published?: boolean;
}

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('courses')
    .select('id, title, description, is_published, created_at, lessons(id, title, bunny_video_id, order_index)')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ courses: data ?? [] });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CourseBody;
  const title = body.title?.trim();

  if (!title) {
    return NextResponse.json({ error: 'Course title is required.' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('courses')
    .insert({
      title,
      description: body.description?.trim() || null,
      is_published: Boolean(body.is_published),
    })
    .select('id, title, description, is_published, created_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ course: data }, { status: 201 });
}
