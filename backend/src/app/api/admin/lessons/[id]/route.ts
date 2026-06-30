import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

interface LessonUpdateBody {
  title?: string;
  bunny_video_id?: string;
  order_index?: number;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as LessonUpdateBody;
  const updates: LessonUpdateBody = {};

  if (body.title !== undefined) updates.title = body.title.trim();
  if (body.bunny_video_id !== undefined) updates.bunny_video_id = body.bunny_video_id.trim();
  if (body.order_index !== undefined) updates.order_index = Number(body.order_index);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('lessons')
    .update(updates)
    .eq('id', id)
    .select('id, course_id, title, bunny_video_id, order_index, created_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ lesson: data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { error } = await supabase.from('lessons').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
